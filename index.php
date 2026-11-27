<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/connection/db.php';

// If already logged in and not in the middle of IT Admin org selection, redirect to portal
if (isset($_SESSION['user']) && empty($_SESSION['pending_it_admin'])) {
    header('Location: pages/it_admin.php');
    exit;
}

$activeTab = $_POST['form_tab'] ?? 'login';
$errorMsg = '';
$successMsg = '';
$itAdminOrgStep = !empty($_SESSION['pending_it_admin']);
$availableOrgs = [];

// Fetch active organizations for IT Admin portal picker
try {
    $orgStmt = $pdo->query("SELECT org_id, org_code, name, site_code, visibility FROM organizations WHERE is_active = 1 ORDER BY name ASC");
    $availableOrgs = $orgStmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    $availableOrgs = [];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // 1A. SIGN IN STEP 1: Verify Credentials
    if ($action === 'login') {
        $activeTab = 'login';
        $identifier = trim($_POST['identifier'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($identifier === '' || $password === '') {
            $errorMsg = 'Please enter your username/email and password.';
        } else {
            $stmt = $pdo->prepare("
                SELECT user_id, primary_org_id, employee_id, full_name, username, email, password_hash, role, is_active
                FROM users
                WHERE (username = :id OR email = :id)
                LIMIT 1
            ");
            $stmt->execute([':id' => $identifier]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($password, $user['password_hash'])) {
                $errorMsg = 'Invalid username/email or password.';
            } elseif ((int)$user['is_active'] !== 1) {
                $errorMsg = 'This account is inactive. Contact your Library Admin or IT Admin.';
            } else {
                session_regenerate_id(true);
                $pdo->prepare("UPDATE users SET last_activity_at = CURRENT_TIMESTAMP WHERE user_id = :uid")
                    ->execute([':uid' => $user['user_id']]);

                if ($user['role'] === 'it_admin') {
                    // IT Admin enters credentials first, then selects which Org/Building portal to enter
                    $_SESSION['pending_it_admin'] = [
                        'user_id' => (int)$user['user_id'],
                        'employee_id' => $user['employee_id'],
                        'full_name' => $user['full_name'],
                        'username' => $user['username'],
                        'email' => $user['email'],
                        'role' => 'it_admin',
                    ];
                    $itAdminOrgStep = true;
                } else {
                    // Library Admin or Member enters directly
                    $deptLabel = 'Public Member';
                    if (!empty($user['primary_org_id'])) {
                        $oStmt = $pdo->prepare("SELECT name FROM organizations WHERE org_id = :oid LIMIT 1");
                        $oStmt->execute([':oid' => $user['primary_org_id']]);
                        $orgRow = $oStmt->fetch(PDO::FETCH_ASSOC);
                        if ($orgRow) {
                            $deptLabel = $orgRow['name'];
                        }
                    }

                    $_SESSION['user'] = [
                        'user_id' => (int)$user['user_id'],
                        'primary_org_id' => $user['primary_org_id'] ? (int)$user['primary_org_id'] : null,
                        'selected_org_id' => $user['primary_org_id'] ? (int)$user['primary_org_id'] : null,
                        'employee_id' => $user['employee_id'],
                        'full_name' => $user['full_name'],
                        'username' => $user['username'],
                        'role' => $user['role'],
                        'department' => $deptLabel,
                    ];
                    header('Location: pages/it_admin.php');
                    exit;
                }
            }
        }
    }

    // 1B. SIGN IN STEP 2: IT Admin Selects Target Organization / Building Portal
    if ($action === 'select_it_admin_org' && !empty($_SESSION['pending_it_admin'])) {
        $activeTab = 'login';
        $selectedOrgId = (int)($_POST['selected_org_id'] ?? 0);
        $pending = $_SESSION['pending_it_admin'];

        $oStmt = $pdo->prepare("SELECT org_id, name FROM organizations WHERE org_id = :oid AND is_active = 1 LIMIT 1");
        $oStmt->execute([':oid' => $selectedOrgId]);
        $targetOrg = $oStmt->fetch(PDO::FETCH_ASSOC);

        if (!$targetOrg) {
            $errorMsg = 'Please select a valid organization/building library portal.';
            $itAdminOrgStep = true;
        } else {
            $_SESSION['user'] = [
                'user_id' => $pending['user_id'],
                'primary_org_id' => (int)$targetOrg['org_id'],
                'selected_org_id' => (int)$targetOrg['org_id'],
                'employee_id' => $pending['employee_id'],
                'full_name' => $pending['full_name'],
                'username' => $pending['username'],
                'role' => 'it_admin',
                'department' => $targetOrg['name'],
            ];
            unset($_SESSION['pending_it_admin']);
            header('Location: pages/it_admin.php');
            exit;
        }
    }

    // Cancel IT Admin Org Selection
    if ($action === 'cancel_it_admin_org') {
        unset($_SESSION['pending_it_admin']);
        $itAdminOrgStep = false;
        $activeTab = 'login';
    }

    // 2. PUBLIC SIGN UP (Creates a 'member' account by default)
    if ($action === 'signup') {
        $activeTab = 'signup';
        $fullName = trim($_POST['full_name'] ?? '');
        $username = trim($_POST['username'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if ($fullName === '' || $username === '' || $email === '' || $password === '') {
            $errorMsg = 'All fields are required to create a Member account.';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errorMsg = 'Please enter a valid email address.';
        } elseif (strlen($password) < 6) {
            $errorMsg = 'Password must be at least 6 characters long.';
        } else {
            $chk = $pdo->prepare("SELECT user_id FROM users WHERE username = :u OR email = :e LIMIT 1");
            $chk->execute([':u' => $username, ':e' => $email]);
            if ($chk->fetch()) {
                $errorMsg = 'That username or email is already registered.';
            } else {
                $empCode = 'MBR-' . random_int(10000, 99999);
                $hash = password_hash($password, PASSWORD_DEFAULT);

                $ins = $pdo->prepare("
                    INSERT INTO users (primary_org_id, employee_id, full_name, username, email, password_hash, role, is_active, last_activity_at)
                    VALUES (NULL, :emp, :fn, :un, :em, :pw, 'member', 1, CURRENT_TIMESTAMP)
                ");
                $ins->execute([
                    ':emp' => $empCode,
                    ':fn' => $fullName,
                    ':un' => $username,
                    ':em' => $email,
                    ':pw' => $hash,
                ]);
                $newUserId = (int)$pdo->lastInsertId();

                session_regenerate_id(true);
                $_SESSION['user'] = [
                    'user_id' => $newUserId,
                    'primary_org_id' => null,
                    'selected_org_id' => null,
                    'employee_id' => $empCode,
                    'full_name' => $fullName,
                    'username' => $username,
                    'role' => 'member',
                    'department' => 'Public Member (Apply to a Library)',
                ];
                header('Location: pages/it_admin.php');
                exit;
            }
        }
    }

    // 3. REGISTER COMPANY / BUILDING LIBRARY + DEFAULT LIBRARY ADMIN ACCOUNT
    if ($action === 'register_org') {
        $activeTab = 'register_org';
        $orgName = trim($_POST['org_name'] ?? '');
        $siteCode = strtoupper(trim($_POST['site_code'] ?? ''));
        $visibility = ($_POST['visibility'] ?? 'public') === 'private' ? 'private' : 'public';
        $inviteCode = trim($_POST['invite_code'] ?? '');

        $adminName = trim($_POST['admin_full_name'] ?? '');
        $adminUsername = trim($_POST['admin_username'] ?? '');
        $adminEmail = trim($_POST['admin_email'] ?? '');
        $adminPassword = $_POST['admin_password'] ?? '';

        if ($orgName === '' || $siteCode === '' || $adminName === '' || $adminUsername === '' || $adminEmail === '' || $adminPassword === '') {
            $errorMsg = 'Please complete both the Organization/Library details and the Library Admin credentials.';
        } elseif (!filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
            $errorMsg = 'Please enter a valid Library Admin email address.';
        } elseif (strlen($adminPassword) < 6) {
            $errorMsg = 'Library Admin password must be at least 6 characters.';
        } else {
            if ($visibility === 'private' && $inviteCode === '') {
                $inviteCode = 'PRIV-' . preg_replace('/[^A-Z0-9]/', '', $siteCode) . '-' . random_int(100, 999);
            }

            try {
                $pdo->beginTransaction();

                $chkUser = $pdo->prepare("SELECT user_id FROM users WHERE username = :u OR email = :e LIMIT 1");
                $chkUser->execute([':u' => $adminUsername, ':e' => $adminEmail]);
                if ($chkUser->fetch()) {
                    throw new RuntimeException('Library Admin username or email is already in use.');
                }

                $chkOrg = $pdo->prepare("SELECT org_id FROM organizations WHERE name = :n LIMIT 1");
                $chkOrg->execute([':n' => $orgName]);
                if ($chkOrg->fetch()) {
                    throw new RuntimeException('An organization/library with that name is already registered.');
                }

                $adminEmpId = 'LADM-' . random_int(10000, 99999);
                $orgCode = 'ORG-' . substr(preg_replace('/[^A-Z0-9]/', '', $siteCode), 0, 6) . '-' . random_int(10, 99);
                $hash = password_hash($adminPassword, PASSWORD_DEFAULT);

                // Create Default Library Admin Account
                $uStmt = $pdo->prepare("
                    INSERT INTO users (primary_org_id, employee_id, full_name, username, email, password_hash, role, is_active, last_activity_at)
                    VALUES (NULL, :emp, :fn, :un, :em, :pw, 'library_admin', 1, CURRENT_TIMESTAMP)
                ");
                $uStmt->execute([
                    ':emp' => $adminEmpId,
                    ':fn' => $adminName,
                    ':un' => $adminUsername,
                    ':em' => $adminEmail,
                    ':pw' => $hash,
                ]);
                $newAdminId = (int)$pdo->lastInsertId();

                // Create Organization / Building Library
                $oStmt = $pdo->prepare("
                    INSERT INTO organizations (org_code, name, site_code, visibility, invite_code, lib_admin_id, is_active)
                    VALUES (:ocode, :oname, :scode, :vis, :icode, :aid, 1)
                ");
                $oStmt->execute([
                    ':ocode' => $orgCode,
                    ':oname' => $orgName,
                    ':scode' => $siteCode,
                    ':vis' => $visibility,
                    ':icode' => $visibility === 'private' ? $inviteCode : null,
                    ':aid' => $newAdminId,
                ]);
                $newOrgId = (int)$pdo->lastInsertId();

                // Link Library Admin to their new Organization & create Active membership
                $pdo->prepare("UPDATE users SET primary_org_id = :oid WHERE user_id = :uid")
                    ->execute([':oid' => $newOrgId, ':uid' => $newAdminId]);

                $pdo->prepare("
                    INSERT INTO organization_memberships (org_id, user_id, approved_by_id, join_method, status, joined_at)
                    VALUES (:oid, :uid, :uid, 'admin_registered', 'active', CURRENT_TIMESTAMP)
                ")->execute([':oid' => $newOrgId, ':uid' => $newAdminId]);

                $pdo->commit();

                session_regenerate_id(true);
                $_SESSION['user'] = [
                    'user_id' => $newAdminId,
                    'primary_org_id' => $newOrgId,
                    'selected_org_id' => $newOrgId,
                    'employee_id' => $adminEmpId,
                    'full_name' => $adminName,
                    'username' => $adminUsername,
                    'role' => 'library_admin',
                    'department' => $orgName,
                ];
                header('Location: pages/it_admin.php');
                exit;
            } catch (Throwable $e) {
                if ($pdo->inTransaction()) {
                    $pdo->rollBack();
                }
                $errorMsg = $e->getMessage();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Library | Public Portal Entry</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body {
      min-height: 100vh;
      background: linear-gradient(135deg, #f3eef5 0%, #e7dff0 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: #2b2730;
    }
    .auth-shell {
      width: 100%;
      max-width: 960px;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 18px 45px rgba(43, 39, 48, 0.12);
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      overflow: hidden;
    }
    .auth-hero {
      background: linear-gradient(160deg, #5b21b6 0%, #3b0764 100%);
      color: #ffffff;
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hero-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.16);
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .auth-hero h1 { font-size: 1.75rem; line-height: 1.25; margin-bottom: 12px; }
    .auth-hero p { font-size: 0.9rem; line-height: 1.55; color: #e9d5ff; }
    .hero-list { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; font-size: 0.84rem; color: #f3e8ff; }
    .hero-list div { display: flex; gap: 10px; align-items: flex-start; }
    .hero-dot {
      width: 20px; height: 20px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: inline-flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.72rem; flex-shrink: 0; margin-top: 1px;
    }
    .hero-foot { font-size: 0.76rem; color: #c4b5fd; margin-top: 28px; }

    .auth-main { padding: 34px 36px; }
    .tab-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      background: #f4eff7;
      padding: 5px;
      border-radius: 10px;
      margin-bottom: 22px;
    }
    .tab-btn {
      border: none;
      background: transparent;
      padding: 9px 10px;
      border-radius: 7px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #686270;
      cursor: pointer;
      transition: 0.15s;
    }
    .tab-btn.active {
      background: #ffffff;
      color: #5b21b6;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .alert-box {
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.83rem;
      font-weight: 600;
      margin-bottom: 16px;
    }
    .alert-error { background: #fff1f2; border: 1px solid #f43f5e; color: #be123c; }
    .alert-info { background: #f5f3ff; border: 1px solid #c4b5fd; color: #5b21b6; }

    .form-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 4px; color: #2b2730; }
    .form-sub { font-size: 0.82rem; color: #686270; margin-bottom: 18px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field { margin-bottom: 13px; }
    .field label {
      display: block;
      font-size: 0.76rem;
      font-weight: 700;
      color: #4a4453;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .ctrl {
      width: 100%;
      height: 40px;
      padding: 0 12px;
      border: 1px solid #d5c9d0;
      border-radius: 8px;
      font-size: 0.88rem;
      color: #2b2730;
      background: #ffffff;
    }
    .ctrl:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.14);
    }
    .section-cap {
      font-size: 0.74rem;
      font-weight: 800;
      color: #6d28d9;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin: 14px 0 10px;
      padding-top: 10px;
      border-top: 1px dashed #e5dce8;
    }
    .btn-submit {
      width: 100%;
      height: 42px;
      border: none;
      border-radius: 8px;
      background: #6d28d9;
      color: #ffffff;
      font-size: 0.86rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      cursor: pointer;
      margin-top: 6px;
      transition: background 0.15s;
    }
    .btn-submit:hover { background: #5b21b6; }
    .btn-secondary {
      width: 100%;
      height: 38px;
      border: 1px solid #d5c9d0;
      border-radius: 8px;
      background: #ffffff;
      color: #4a4453;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      margin-top: 8px;
    }
    @media (max-width: 820px) {
      .auth-shell { grid-template-columns: 1fr; }
      .grid-2 { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <div class="auth-shell">
    <!-- Left Info Panel -->
    <aside class="auth-hero">
      <div>
        <span class="hero-badge">Multi-Organization Library Hub</span>
        <h1>Company &amp; Building Library Portal</h1>
        <p>Join public building libraries, manage private company collections, and track loans &amp; reservations across every registered site.</p>

        <div class="hero-list">
          <div><span class="hero-dot">1</span><span><strong>Public Member Sign-Up:</strong> Create an account anytime and apply to Public libraries or enter a Private invite code.</span></div>
          <div><span class="hero-dot">2</span><span><strong>Register Your Building / Company:</strong> Launch a Public or Private library with its own Library Admin account.</span></div>
          <div><span class="hero-dot">3</span><span><strong>Global IT Admin Access:</strong> Sign in with IT Admin credentials and pick which organization portal to enter.</span></div>
        </div>
      </div>

      <div class="hero-foot">
        &copy; 2026 Company Library System &bull; Role-Scoped Multi-Tenant Portal
      </div>
    </aside>

    <!-- Right Forms Area -->
    <main class="auth-main">
      <div class="tab-bar" role="tablist">
        <button type="button" class="tab-btn <?= $activeTab === 'login' ? 'active' : '' ?>" data-tab="login">Sign In</button>
        <button type="button" class="tab-btn <?= $activeTab === 'signup' ? 'active' : '' ?>" data-tab="signup">Create Account</button>
        <button type="button" class="tab-btn <?= $activeTab === 'register_org' ? 'active' : '' ?>" data-tab="register_org">Register Library</button>
      </div>

      <?php if ($errorMsg !== ''): ?>
        <div class="alert-box alert-error"><?= htmlspecialchars($errorMsg, ENT_QUOTES, 'UTF-8') ?></div>
      <?php endif; ?>

      <!-- TAB 1: SIGN IN -->
      <section id="panel-login" style="display: <?= $activeTab === 'login' ? 'block' : 'none' ?>;">
        <?php if ($itAdminOrgStep): ?>
          <h2 class="form-title">Select Organization / Building Portal</h2>
          <p class="form-sub">
            Authenticated as <strong><?= htmlspecialchars($_SESSION['pending_it_admin']['full_name'], ENT_QUOTES, 'UTF-8') ?></strong> (IT Admin). Choose which library portal to enter:
          </p>

          <form method="POST" action="index.php">
            <input type="hidden" name="form_tab" value="login">
            <input type="hidden" name="action" value="select_it_admin_org">

            <div class="field">
              <label for="selected_org_id">Organization / Building Library</label>
              <select id="selected_org_id" name="selected_org_id" class="ctrl" required>
                <?php if (empty($availableOrgs)): ?>
                  <option value="1">LRN Main Building Library (LRN-HQ)</option>
                <?php else: ?>
                  <?php foreach ($availableOrgs as $org): ?>
                    <option value="<?= (int)$org['org_id'] ?>">
                      <?= htmlspecialchars($org['name'], ENT_QUOTES, 'UTF-8') ?> (<?= htmlspecialchars($org['site_code'], ENT_QUOTES, 'UTF-8') ?> &bull; <?= strtoupper($org['visibility']) ?>)
                    </option>
                  <?php endforeach; ?>
                <?php endif; ?>
              </select>
            </div>

            <button type="submit" class="btn-submit">ENTER SELECTED LIBRARY PORTAL</button>
          </form>

          <form method="POST" action="index.php">
            <input type="hidden" name="form_tab" value="login">
            <input type="hidden" name="action" value="cancel_it_admin_org">
            <button type="submit" class="btn-secondary">&larr; Use Another Account</button>
          </form>

        <?php else: ?>
          <h2 class="form-title">Sign In to Portal</h2>
          <p class="form-sub">Enter your Member, Library Admin, or IT Admin credentials.</p>

          <form method="POST" action="index.php">
            <input type="hidden" name="form_tab" value="login">
            <input type="hidden" name="action" value="login">

            <div class="field">
              <label for="identifier">Username or Email</label>
              <input type="text" id="identifier" name="identifier" class="ctrl" placeholder="e.g. marco_itadmin or user@company.com" required>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" class="ctrl" placeholder="Enter your password" required>
            </div>

            <button type="submit" class="btn-submit">SIGN IN</button>
          </form>
        <?php endif; ?>
      </section>

      <!-- TAB 2: PUBLIC CREATE ACCOUNT (DEFAULT ROLE = MEMBER) -->
      <section id="panel-signup" style="display: <?= $activeTab === 'signup' ? 'block' : 'none' ?>;">
        <h2 class="form-title">Create Member Account</h2>
        <p class="form-sub">New accounts start as <strong>Members</strong>. Once signed in, open <strong>Apply to Library</strong> to join Public libraries or enter a Private code.</p>

        <form method="POST" action="index.php">
          <input type="hidden" name="form_tab" value="signup">
          <input type="hidden" name="action" value="signup">

          <div class="grid-2">
            <div class="field">
              <label for="signup_full_name">Full Name</label>
              <input type="text" id="signup_full_name" name="full_name" class="ctrl" placeholder="e.g. Dela Cruz, Juan" required>
            </div>
            <div class="field">
              <label for="signup_email">Email Address</label>
              <input type="email" id="signup_email" name="email" class="ctrl" placeholder="juan@email.com" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label for="signup_username">Username</label>
              <input type="text" id="signup_username" name="username" class="ctrl" placeholder="juandelacruz" required>
            </div>
            <div class="field">
              <label for="signup_password">Password (Min 6 chars)</label>
              <input type="password" id="signup_password" name="password" class="ctrl" minlength="6" placeholder="Create password" required>
            </div>
          </div>

          <button type="submit" class="btn-submit">CREATE MEMBER ACCOUNT</button>
        </form>
      </section>

      <!-- TAB 3: COMPANY / BUILDING LIBRARY REGISTRATION + DEFAULT LIBRARY ADMIN -->
      <section id="panel-register_org" style="display: <?= $activeTab === 'register_org' ? 'block' : 'none' ?>;">
        <h2 class="form-title">Register Company / Building Library</h2>
        <p class="form-sub">Register your organization library as Public or Private and create its default <strong>Library Admin</strong> account.</p>

        <form method="POST" action="index.php">
          <input type="hidden" name="form_tab" value="register_org">
          <input type="hidden" name="action" value="register_org">

          <div class="grid-2">
            <div class="field">
              <label for="org_name">Company / Building Name</label>
              <input type="text" id="org_name" name="org_name" class="ctrl" placeholder="e.g. Apex Tower - Makati" required>
            </div>
            <div class="field">
              <label for="site_code">Site / Building Code</label>
              <input type="text" id="site_code" name="site_code" class="ctrl" placeholder="e.g. APX-MKT" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label for="visibility">Library Visibility</label>
              <select id="visibility" name="visibility" class="ctrl" required>
                <option value="public">Public (Listed — Users Can Apply)</option>
                <option value="private">Private (Hidden — Library Admin Registers Members)</option>
              </select>
            </div>
            <div class="field">
              <label for="invite_code">Private Access Code (If Private)</label>
              <input type="text" id="invite_code" name="invite_code" class="ctrl" placeholder="Auto-generated if blank">
            </div>
          </div>

          <div class="section-cap">Default Library Admin Credentials</div>

          <div class="grid-2">
            <div class="field">
              <label for="admin_full_name">Library Admin Full Name</label>
              <input type="text" id="admin_full_name" name="admin_full_name" class="ctrl" placeholder="e.g. Santos, Elena" required>
            </div>
            <div class="field">
              <label for="admin_email">Library Admin Email</label>
              <input type="email" id="admin_email" name="admin_email" class="ctrl" placeholder="elena.lib@company.com" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="field">
              <label for="admin_username">Library Admin Username</label>
              <input type="text" id="admin_username" name="admin_username" class="ctrl" placeholder="elena_libadmin" required>
            </div>
            <div class="field">
              <label for="admin_password">Library Admin Password</label>
              <input type="password" id="admin_password" name="admin_password" class="ctrl" minlength="6" placeholder="Set admin password" required>
            </div>
          </div>

          <button type="submit" class="btn-submit">REGISTER LIBRARY &amp; ADMIN ACCOUNT</button>
        </form>
      </section>
    </main>
  </div>

  <script>
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        ['login', 'signup', 'register_org'].forEach(panel => {
          const el = document.getElementById('panel-' + panel);
          if (el) el.style.display = panel === target ? 'block' : 'none';
        });
      });
    });
  </script>
</body>
</html>