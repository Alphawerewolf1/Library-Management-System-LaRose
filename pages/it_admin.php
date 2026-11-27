<?php
declare(strict_types=1);

ini_set('display_errors', '1');
error_reporting(E_ALL);

require_once __DIR__ . '/../connection/db.php';
require_once __DIR__ . '/../auth/session_guard.php';

$currentUser = requireLogin($pdo);

$selectedOrgCode = 'ORG-LRN';
$primaryOrgCode = 'ORG-LRN';

if (!empty($currentUser['selected_org_id'])) {
    $sOrg = $pdo->prepare("SELECT org_code FROM organizations WHERE org_id = :oid LIMIT 1");
    $sOrg->execute([':oid' => (int)$currentUser['selected_org_id']]);
    $foundSelected = $sOrg->fetchColumn();
    if ($foundSelected !== false) {
        $selectedOrgCode = (string)$foundSelected;
    }
}

if (!empty($currentUser['primary_org_id'])) {
    $pOrg = $pdo->prepare("SELECT org_code FROM organizations WHERE org_id = :oid LIMIT 1");
    $pOrg->execute([':oid' => (int)$currentUser['primary_org_id']]);
    $foundPrimary = $pOrg->fetchColumn();
    if ($foundPrimary !== false) {
        $primaryOrgCode = (string)$foundPrimary;
    } else {
        $primaryOrgCode = $selectedOrgCode;
    }
}
?>
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Company Library | Multi-Library Portal</title>
  <link rel="stylesheet" href="../styles/admin.css?v=3">
</head>
<body>

  <!-- Top Navigation Ribbon -->
  <header class="topbar">
    <div class="brand" id="brandTitle">Company Library</div>

    <div class="top-actions" id="topActions">
      <button type="button" class="nav-action active" data-nav="library">
        <svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        <span>Library</span>
      </button>
      <button type="button" class="nav-action" data-nav="myloans">
        <svg viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
        <span>My Loans &amp; Reserve</span>
      </button>
      <button type="button" class="nav-action" data-nav="applylib">
        <svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
        <span>Apply to Library</span>
      </button>
      <button type="button" class="nav-action" data-nav="dashboard">
        <svg viewBox="0 0 24 24"><path d="M12 3v9h9a9 9 0 1 1-9-9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15V3.5z"/></svg>
        <span>Dashboard</span>
      </button>
      <button type="button" class="nav-action" data-nav="audit">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>
        <span>Audit Log</span>
      </button>
      <button type="button" class="nav-action" data-nav="users" id="navUsersBtn">
        <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c2.5 0 4.5 2 4.5 4.5"/></svg>
        <span>Users</span>
      </button>
      <button type="button" class="nav-action" id="toggleSidebarBtn" aria-pressed="false" title="Hide Profile & Quick Actions">
        <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="15" y1="4" x2="15" y2="20"/></svg>
        <span id="toggleSidebarLabel">Hide Panel</span>
      </button>
    </div>
  </header>

  <!-- Main Workspace -->
  <div class="workspace">
    <main class="main-card">

      <!-- 1. Library Catalog Home View -->
      <div id="libraryView">
        <div class="overview-header">
          <h1>Library Catalog</h1>
          <span class="info-dot" title="Switch between joined libraries, manage books, view active borrowers, and issue or reserve copies">i</span>
        </div>

        <!-- 5 KPI Summary Cards -->
        <div class="kpi-row">
          <div class="kpi-card kpi-total" data-kpi="ALL">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="kpiTotalTitles">0</div>
              <div class="kpi-lbl">Total Titles</div>
            </div>
          </div>

          <div class="kpi-card kpi-available" data-kpi="AVAILABLE">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.2 14.2L6.8 12.2l1.4-1.4 2.6 2.6 5-5 1.4 1.4z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="kpiAvailableCopies">0</div>
              <div class="kpi-lbl">Available Copies</div>
            </div>
          </div>

          <div class="kpi-card kpi-borrowed" data-kpi="BORROWED">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="10" cy="8" r="4"/><path d="M3 20c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5z"/><circle cx="18.5" cy="11.5" r="2.5"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="kpiBorrowedCopies">0</div>
              <div class="kpi-lbl">Borrowed</div>
            </div>
          </div>

          <div class="kpi-card kpi-out" data-kpi="OUT OF STOCK">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 4 6 6.8 6 11a6 6 0 0 1-12 0c0-2.5 1.2-4.6 3-6.5 0 1.8 1.2 3 3 3 0-2.5-.6-4.8 0-7.5z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="kpiOutOfStock">0</div>
              <div class="kpi-lbl">Out of Stock</div>
            </div>
          </div>

          <div class="kpi-card kpi-overdue" data-kpi="OVERDUE">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4V7z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="kpiOverdueCount">0</div>
              <div class="kpi-lbl">Overdue Loans</div>
            </div>
          </div>
        </div>

        <!-- Filter & Action Toolbar -->
        <div class="filter-bar">
          <button type="button" class="btn-primary" id="openNewBookBtn">+ Add Book</button>
          <input type="text" id="searchInput" class="ctrl ctrl-search" placeholder="Search ISBN, title, author, borrower...">

          <div class="field-group">
            <label for="libraryFilter">Library / Org</label>
            <select id="libraryFilter" class="ctrl ctrl-select"></select>
          </div>

          <div class="field-group">
            <label for="categoryFilter">Category</label>
            <select id="categoryFilter" class="ctrl ctrl-select">
              <option value="">All Categories</option>
            </select>
          </div>

          <div class="field-group">
            <label for="statusFilter">Availability</label>
            <select id="statusFilter" class="ctrl ctrl-select">
              <option value="">Active Catalog (All)</option>
              <option value="AVAILABLE">Available</option>
              <option value="LOW STOCK">Low Stock</option>
              <option value="OUT OF STOCK">Out of Stock</option>
              <option value="DESTROYED_MISSING">Destroyed / Missing Only</option>
            </select>
          </div>

          <button type="button" id="resetBtn" class="btn-reset">&#8634; Reset Filter</button>
        </div>

        <!-- Books Catalog Table -->
        <div class="table-wrap" id="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Book ID / ISBN</th>
                <th>Status</th>
                <th>Title &amp; Library</th>
                <th>Author</th>
                <th>Category</th>
                <th>Shelf</th>
                <th>Copies</th>
                <th>Active Borrowers / Incidents</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="bookBody"></tbody>
          </table>
        </div>

        <div class="table-footer">
          <div class="pagination" id="paginationBar"></div>
          <div class="copyright">
            &copy; 2026 Company Library System &bull; Multi-Organization Portal &bull; Auto-logout after 15 mins idle
          </div>
        </div>
      </div>

      <!-- 2. Self Borrow & Reserve Area -->
      <div id="myloansView" style="display:none;">
        <div class="overview-header">
          <h1>My Loans &amp; Reservations</h1>
          <span class="info-dot" title="Filter your loans and reservations by joined library, appeal extensions, or report incidents">i</span>
        </div>

        <!-- KPI Summary Cards -->
        <div class="kpi-row" style="grid-template-columns: repeat(4, 1fr);">
          <div class="kpi-card kpi-total" data-my-kpi="ALL">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="myKpiTotal">0</div>
              <div class="kpi-lbl">All My Records</div>
            </div>
          </div>

          <div class="kpi-card kpi-available" data-my-kpi="BORROWED">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.2 14.2L6.8 12.2l1.4-1.4 2.6 2.6 5-5 1.4 1.4z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="myKpiBorrowed">0</div>
              <div class="kpi-lbl">Active Loans</div>
            </div>
          </div>

          <div class="kpi-card kpi-borrowed" data-my-kpi="RESERVED">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14" stroke="#fff" stroke-width="2" fill="none"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="myKpiReserved">0</div>
              <div class="kpi-lbl">Reservations</div>
            </div>
          </div>

          <div class="kpi-card kpi-out" data-my-kpi="OVERDUE">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3 4 6 6.8 6 11a6 6 0 0 1-12 0c0-2.5 1.2-4.6 3-6.5 0 1.8 1.2 3 3 3 0-2.5-.6-4.8 0-7.5z"/></svg>
            </div>
            <div>
              <div class="kpi-num" id="myKpiOverdue">0</div>
              <div class="kpi-lbl">Overdue</div>
            </div>
          </div>
        </div>

        <!-- Filter & Sort Toolbar -->
        <div class="filter-bar">
          <button type="button" class="btn-primary" id="openSelfBorrowBtn">+ Borrow / Reserve Book</button>
          <input type="text" id="mySearchInput" class="ctrl ctrl-search" placeholder="Search title, record ID, library...">

          <div class="field-group">
            <label for="myLibraryFilter">Library / Org</label>
            <select id="myLibraryFilter" class="ctrl ctrl-select"></select>
          </div>

          <div class="field-group">
            <label for="myStatusFilter">Status</label>
            <select id="myStatusFilter" class="ctrl ctrl-select">
              <option value="">All Statuses</option>
              <option value="ACTIVE LOAN">Active Loan</option>
              <option value="OVERDUE">Overdue</option>
              <option value="PENDING">Pending Reservation</option>
              <option value="APPROVED">Approved Reservation</option>
              <option value="DECLINED">Declined Reservation</option>
            </select>
          </div>

          <div class="field-group">
            <label for="mySortSelect">Sort By</label>
            <select id="mySortSelect" class="ctrl ctrl-select">
              <option value="DUE_SOONEST" selected>Due / Pickup: Soonest First</option>
              <option value="DUE_LATEST">Due / Pickup: Latest First</option>
              <option value="TITLE_ASC">Book Title (A–Z)</option>
              <option value="TITLE_DESC">Book Title (Z–A)</option>
              <option value="NEWEST">Date Requested (Newest)</option>
            </select>
          </div>

          <button type="button" id="myResetBtn" class="btn-reset">&#8634; Reset</button>
        </div>

        <!-- My Loans & Reservations Table -->
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Record / Asset</th>
                <th>Type &amp; Qty</th>
                <th>Status</th>
                <th>Book Title &amp; Library</th>
                <th>Date Requested</th>
                <th>Due / Pickup Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="myLoansTableBody"></tbody>
          </table>
        </div>

        <div class="table-footer">
          <div class="copyright" id="myLoansFooterUser">
            Signed in as <strong><?= htmlspecialchars($currentUser['full_name'], ENT_QUOTES, 'UTF-8') ?></strong> (<?= htmlspecialchars($currentUser['employee_id'], ENT_QUOTES, 'UTF-8') ?>)
          </div>
        </div>
      </div>

      <!-- 3. Apply to Library Directory View (Schoology-style Org/Building Enrollment) -->
      <div id="applylibView" style="display:none;">
        <div class="overview-header">
          <h1>Apply to a Library / Building</h1>
          <span class="info-dot" title="Browse Public libraries to join as a Member, or enter an invite code for a Private library">i</span>
        </div>

        <div class="filter-bar">
          <button type="button" class="btn-primary" id="openRegisterOrgFromDirBtn">+ Register Organization / Library</button>
          <input type="text" id="dirSearchInput" class="ctrl ctrl-search" placeholder="Search building, company, site code...">

          <div class="field-group">
            <label for="dirVisibilityFilter">Listing Type</label>
            <select id="dirVisibilityFilter" class="ctrl ctrl-select">
              <option value="">All Public Listings</option>
              <option value="public">Public Libraries</option>
              <option value="JOINED">My Joined Libraries</option>
            </select>
          </div>

          <div class="field-group" style="flex:1; min-width:220px;">
            <label for="privateCodeInput">Have a Private Library Access Code?</label>
            <div style="display:flex; gap:6px;">
              <input type="text" id="privateCodeInput" class="ctrl" style="height:40px;" placeholder="e.g. PRIV-TC-99">
              <button type="button" class="btn-issue" style="height:40px; padding:0 14px;" id="joinPrivateCodeBtn">Join Private</button>
            </div>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Library / Org ID</th>
                <th>Visibility</th>
                <th>Organization / Building Name</th>
                <th>Site Code</th>
                <th>Library Admin</th>
                <th>Catalog Size</th>
                <th>Membership Status</th>
              </tr>
            </thead>
            <tbody id="libraryDirTableBody"></tbody>
          </table>
        </div>
      </div>

      <!-- 4. Dashboard View -->
      <div id="dashboardView" style="display:none;">
        <div class="overview-header"><h1>Library Dashboard</h1></div>
        <p style="color:#686270; font-size:0.9rem;">Dashboard view — circulation metrics and category charts scoped to your active library.</p>
      </div>

      <!-- 5. Audit Log View -->
      <div id="auditView" style="display:none;">
        <div class="overview-header"><h1>Audit Log</h1></div>
        <p style="color:#686270; font-size:0.9rem;">Audit Log view — tracks sign-ups, organization registrations, book edits, loans, and idle logouts.</p>
      </div>

      <!-- 6. User Management View (Scoped: All Orgs for IT Admin, Own Org Only for Library Admin) -->
      <div id="usersView" style="display:none;">
        <div class="overview-header">
          <h1 id="usersViewHeading">User Management</h1>
          <span class="info-dot" title="IT Admins manage all organizations; Library Admins manage members and applicants in their own organization">i</span>
        </div>

        <div class="filter-bar" id="userMgmtToolbar">
          <button type="button" class="btn-primary" id="openRegisterMemberBtn">+ Register Member to Library</button>
          <input type="text" id="userSearchInput" class="ctrl ctrl-search" placeholder="Search member name, ID, email...">

          <div class="field-group">
            <label for="userOrgFilter">Organization / Library</label>
            <select id="userOrgFilter" class="ctrl ctrl-select"></select>
          </div>

          <div class="field-group">
            <label for="userStatusFilter">Membership Status</label>
            <select id="userStatusFilter" class="ctrl ctrl-select">
              <option value="">All Statuses</option>
              <option value="Active">Active Member</option>
              <option value="Pending">Pending Application</option>
            </select>
          </div>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User / Employee ID</th>
                <th>Role</th>
                <th>Full Name &amp; Email</th>
                <th>Organization / Library</th>
                <th>Library Visibility</th>
                <th>Membership Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="usersMgmtTableBody"></tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Right Sidebar -->
    <aside class="sidebar">
      <div class="side-card profile-card">
        <div class="avatar-circle">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z"/></svg>
        </div>
        <div class="user-name" id="sidebarUserName"><?= htmlspecialchars($currentUser['full_name'], ENT_QUOTES, 'UTF-8') ?></div>
        <div class="user-role-badge" id="sidebarUserRole"><?= htmlspecialchars(strtoupper($currentUser['role']), ENT_QUOTES, 'UTF-8') ?></div>
        <div class="user-dept" id="sidebarUserDept"><?= htmlspecialchars($currentUser['department'], ENT_QUOTES, 'UTF-8') ?></div>
      </div>

      <div class="side-card">
        <div class="quick-title">Quick Actions</div>
        <div class="quick-list" id="quickList"></div>
        <div class="side-divider"></div>
        <button type="button" class="btn-primary btn-logout" id="openAuthPortalBtn" style="width:100%; justify-content:center; margin-bottom:8px; background:#4f46e5;">&#8644; Public Sign In / Sign Up</button>
        <a href="../auth/logout.php" class="btn-primary btn-logout" style="text-decoration:none;">&#10162; Logout</a>
      </div>

      <div class="it-watermark">
        <strong>MULTI-LIBRARY</strong>
        <span>PORTAL</span>
      </div>
    </aside>
  </div>

  <!-- Public Entry / Sign In / Create Member Account / Register Organization & Library Admin Modal -->
  <div class="modal-backdrop" id="authPortalOverlay" aria-hidden="true">
    <div class="book-modal" style="max-width:540px;" role="dialog" aria-modal="true" aria-labelledby="authPortalTitle">
      <button type="button" class="modal-close" id="closeAuthPortalBtn" aria-label="Close modal">&times;</button>
      <h2 class="modal-title" id="authPortalTitle">Company Library Portal</h2>

      <div class="manage-tabs" style="margin-bottom:14px;">
        <button type="button" class="manage-tab-btn active" data-auth-tab="LOGIN">Sign In</button>
        <button type="button" class="manage-tab-btn" data-auth-tab="SIGNUP">Create Account</button>
        <button type="button" class="manage-tab-btn" data-auth-tab="REGISTER_ORG">Register Company / Library</button>
      </div>

      <!-- Tab 1: Sign In (IT Admin picks org; Library Admin & Member auto-load their orgs) -->
      <form id="portalLoginForm">
        <div class="form-field">
          <label for="loginAccountSelect">Select Account (Demo / Credentials)</label>
          <select id="loginAccountSelect" class="modal-select" required></select>
        </div>

        <div class="form-field" id="itAdminOrgPickerGroup" style="display:none;">
          <label for="loginItAdminOrgSelect">Select Organization / Building Portal to Enter (IT Admin)</label>
          <select id="loginItAdminOrgSelect" class="modal-select"></select>
        </div>

        <button type="submit" class="btn-submit-modal">ENTER LIBRARY PORTAL</button>
      </form>

      <!-- Tab 2: Public Sign Up (New Accounts Are Members by Default) -->
      <form id="portalSignupForm" style="display:none;">
        <div class="form-row-2">
          <div class="form-field">
            <label for="signupFullName">Full Name</label>
            <input type="text" id="signupFullName" class="modal-input" placeholder="e.g. Dela Cruz, Juan" required>
          </div>
          <div class="form-field">
            <label for="signupEmail">Email Address</label>
            <input type="email" id="signupEmail" class="modal-input" placeholder="juan@email.com" required>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="signupUsername">Username</label>
            <input type="text" id="signupUsername" class="modal-input" placeholder="juandelacruz" required>
          </div>
          <div class="form-field">
            <label for="signupPassword">Password</label>
            <input type="password" id="signupPassword" class="modal-input" placeholder="Create password" required>
          </div>
        </div>
        <div style="font-size:0.78rem; color:#686270; margin-bottom:12px;">
          New accounts are created with the <strong>Member</strong> role by default. After signing in, open <strong>Apply to Library</strong> to join any Public library or enter a Private library code.
        </div>
        <button type="submit" class="btn-submit-modal">CREATE MEMBER ACCOUNT</button>
      </form>

      <!-- Tab 3: Company / Building Library Application + Default Library Admin Account -->
      <form id="portalRegisterOrgForm" style="display:none;">
        <div class="form-row-2">
          <div class="form-field">
            <label for="orgNameInput">Company / Building Name</label>
            <input type="text" id="orgNameInput" class="modal-input" placeholder="e.g. Apex Tower - Makati" required>
          </div>
          <div class="form-field">
            <label for="orgSiteCodeInput">Site / Building Code</label>
            <input type="text" id="orgSiteCodeInput" class="modal-input" placeholder="e.g. APX-MKT" required>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label for="orgVisibilitySelect">Library Listing Visibility</label>
            <select id="orgVisibilitySelect" class="modal-select" required>
              <option value="public">Public (Listed in Directory — Users Can Apply)</option>
              <option value="private">Private (Hidden — Library Admin Registers Members)</option>
            </select>
          </div>
          <div class="form-field">
            <label for="orgInviteCodeInput">Private Access Code (If Private)</label>
            <input type="text" id="orgInviteCodeInput" class="modal-input" placeholder="e.g. PRIV-APX-2026">
          </div>
        </div>

        <div class="section-heading" style="margin:10px 0 8px;">DEFAULT LIBRARY ADMIN ACCOUNT CREDENTIALS</div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="libAdminNameInput">Library Admin Full Name</label>
            <input type="text" id="libAdminNameInput" class="modal-input" placeholder="e.g. Santos, Elena" required>
          </div>
          <div class="form-field">
            <label for="libAdminEmailInput">Library Admin Email</label>
            <input type="email" id="libAdminEmailInput" class="modal-input" placeholder="elena.lib@company.com" required>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="libAdminUsernameInput">Library Admin Username</label>
            <input type="text" id="libAdminUsernameInput" class="modal-input" placeholder="elena_libadmin" required>
          </div>
          <div class="form-field">
            <label for="libAdminPasswordInput">Library Admin Password</label>
            <input type="password" id="libAdminPasswordInput" class="modal-input" placeholder="Set admin password" required>
          </div>
        </div>

        <button type="submit" class="btn-submit-modal">REGISTER LIBRARY &amp; ADMIN ACCOUNT</button>
      </form>
    </div>
  </div>

  <!-- Library Admin: Register Member Directly Modal (For Private / Org Members) -->
  <div class="modal-backdrop" id="registerMemberOverlay" aria-hidden="true">
    <div class="book-modal" role="dialog" aria-modal="true" aria-labelledby="registerMemberTitle">
      <button type="button" class="modal-close" id="closeRegisterMemberBtn" aria-label="Close modal">&times;</button>
      <h2 class="modal-title" id="registerMemberTitle">Register Member to Library</h2>

      <form id="registerMemberForm">
        <div class="form-field">
          <label for="regMemberOrgSelect">Target Organization / Library</label>
          <select id="regMemberOrgSelect" class="modal-select" required></select>
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="regMemberNameInput">Member Full Name</label>
            <input type="text" id="regMemberNameInput" class="modal-input" placeholder="e.g. Rivera, Carlo" required>
          </div>
          <div class="form-field">
            <label for="regMemberEmailInput">Member Email</label>
            <input type="email" id="regMemberEmailInput" class="modal-input" placeholder="carlo@company.com" required>
          </div>
        </div>
        <div class="form-row-2">
          <div class="form-field">
            <label for="regMemberUsernameInput">Username</label>
            <input type="text" id="regMemberUsernameInput" class="modal-input" placeholder="carlo_r" required>
          </div>
          <div class="form-field">
            <label for="regMemberTempPassInput">Temporary Password</label>
            <input type="text" id="regMemberTempPassInput" class="modal-input" value="Welcome@2026" required>
          </div>
        </div>
        <button type="submit" class="btn-submit-modal">REGISTER &amp; ENROLL MEMBER</button>
      </form>
    </div>
  </div>

  <!-- Add New Book Modal -->
  <div class="modal-backdrop" id="newBookOverlay" aria-hidden="true">
    <div class="book-modal" role="dialog" aria-modal="true" aria-labelledby="newBookTitle">
      <button type="button" class="modal-close" id="closeNewBookBtn" aria-label="Close modal">&times;</button>
      <h2 class="modal-title" id="newBookTitle">Add New Book</h2>

      <form id="newBookForm">
        <div class="form-field">
          <label for="bookTargetOrgSelect">Organization / Library</label>
          <select id="bookTargetOrgSelect" class="modal-select" required></select>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label for="bookIsbn">ISBN / Asset Code</label>
            <input type="text" id="bookIsbn" class="modal-input" placeholder="e.g. 978-0132350884" required>
          </div>
          <div class="form-field">
            <label for="bookCategory">Category</label>
            <select id="bookCategory" class="modal-select" required>
              <option value="" disabled selected>Select Category</option>
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="bookTitle">Book Title</label>
          <input type="text" id="bookTitle" class="modal-input" placeholder="e.g. Clean Code" autocomplete="off" required>
          <div id="bookDuplicateWarning" style="display:none; margin-top:6px; padding:8px 10px; border-radius:7px; background:#fff1f2; border:1px solid #f43f5e; color:#be123c; font-size:0.78rem; font-weight:600;"></div>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label for="bookAuthor">Author</label>
            <input type="text" id="bookAuthor" class="modal-input" placeholder="e.g. Robert C. Martin" required>
          </div>
          <div class="form-field">
            <label for="bookShelf">Shelf Location</label>
            <input type="text" id="bookShelf" class="modal-input" placeholder="e.g. Rack A - Shelf 2" required>
          </div>
        </div>

        <div class="form-field">
          <label for="bookCopies">Total Physical Copies</label>
          <input type="number" id="bookCopies" class="modal-input" min="1" max="100" value="1" required>
        </div>

        <button type="submit" class="btn-submit-modal" id="saveBookBtn">SAVE BOOK</button>
      </form>
    </div>
  </div>

  <!-- Manage Book Circulation, Issue / Reserve / Return & Borrower Details Modal -->
  <div class="modal-backdrop" id="bookDetailsOverlay" aria-hidden="true">
    <div class="details-modal" role="dialog" aria-modal="true" aria-labelledby="detailsModalTitle">
      <div class="details-header">
        <h2 class="details-title" id="detailsModalTitle">Manage Book &amp; Circulation</h2>
        <button type="button" class="modal-close" id="closeDetailsBtn" aria-label="Close modal" style="position:static;">&times;</button>
      </div>
      <div id="bookDetailsBody"></div>
    </div>
  </div>

  <!-- Dedicated Borrow / Reserve Popup -->
  <div class="modal-backdrop" id="selfBorrowOverlay" aria-hidden="true">
    <div class="book-modal" role="dialog" aria-modal="true" aria-labelledby="selfBorrowTitle">
      <button type="button" class="modal-close" id="closeSelfBorrowBtn" aria-label="Close modal">&times;</button>
      <h2 class="modal-title" id="selfBorrowTitle">Borrow or Reserve a Book</h2>

      <form id="selfBorrowForm">
        <div class="form-field">
          <label for="selfActionType">Request Type</label>
          <select id="selfActionType" class="modal-select" required>
            <option value="BORROW">Borrow Now (Available Copies Only)</option>
            <option value="RESERVE">Reserve Title (Set Pickup Date for Approval)</option>
          </select>
        </div>

        <div class="form-field">
          <label for="selfBookInput">Book Title (From Your Joined Libraries)</label>
          <input
            type="text"
            id="selfBookInput"
            list="selfBookDatalist"
            class="modal-input"
            placeholder="Type or select a book title..."
            autocomplete="off"
            required
          >
          <datalist id="selfBookDatalist"></datalist>
        </div>

        <div class="form-row-2">
          <div class="form-field">
            <label for="selfQuantityInput">Number of Copies</label>
            <input type="number" id="selfQuantityInput" class="modal-input" min="1" max="1" value="1" required>
          </div>
          <div class="form-field">
            <label for="selfDueDate">Due / Pickup Date</label>
            <input type="date" id="selfDueDate" class="modal-input" required>
          </div>
        </div>

        <button type="submit" class="btn-submit-modal" id="confirmSelfBorrowBtn">CONFIRM REQUEST</button>
      </form>
    </div>
  </div>

  <!-- Dedicated Loan Appeal & Incident Report Popup -->
  <div class="modal-backdrop" id="extensionModalOverlay" aria-hidden="true">
    <div class="book-modal" role="dialog" aria-modal="true" aria-labelledby="extensionModalTitle">
      <button type="button" class="modal-close" id="closeExtensionBtn" aria-label="Close modal">&times;</button>
      <h2 class="modal-title" id="extensionModalTitle">Loan Appeal &amp; Incident Report</h2>
      <div id="extensionModalBody"></div>
    </div>
  </div>

  <div class="toast-banner" id="toastBanner" role="status"></div>

 <script>
    window.CURRENT_USER = {
      employee_id: <?= json_encode($currentUser['employee_id']) ?>,
      full_name: <?= json_encode($currentUser['full_name']) ?>,
      role: <?= json_encode($currentUser['role']) ?>,
      primary_org_code: <?= json_encode($primaryOrgCode) ?>,
      selected_org_code: <?= json_encode($selectedOrgCode) ?>
    };
  </script>
  <script src="../scripts/it_admin.js?v=4"></script>
  <script>
    (function () {
      const IDLE_LIMIT_MS = 900000; // 15 minutes
      let idleTimerId = null;

      function triggerIdleLogout() {
        window.location.href = '../auth/logout.php';
      }

      function resetIdleTimer() {
        clearTimeout(idleTimerId);
        idleTimerId = setTimeout(triggerIdleLogout, IDLE_LIMIT_MS);
      }

      ['mousemove', 'keydown', 'click', 'scroll'].forEach((evt) => {
        window.addEventListener(evt, resetIdleTimer, { passive: true });
      });

      resetIdleTimer();
    })();
  </script>
</body>
</html>