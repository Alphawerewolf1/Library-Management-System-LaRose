<?php
declare(strict_types=1);

$dbDir = __DIR__ . '/../database';
if (!is_dir($dbDir)) {
    mkdir($dbDir, 0777, true);
}

$dbPath = $dbDir . '/company_library.sqlite';
$pdo = new PDO('sqlite:' . $dbPath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
$pdo->exec('PRAGMA foreign_keys = ON;');

$pdo->exec("
    CREATE TABLE IF NOT EXISTS organizations (
        org_id INTEGER PRIMARY KEY AUTOINCREMENT,
        org_code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL UNIQUE,
        site_code TEXT NOT NULL,
        visibility TEXT NOT NULL DEFAULT 'public',
        invite_code TEXT NULL,
        lib_admin_id INTEGER NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
");

$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        primary_org_id INTEGER NULL,
        employee_id TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member',
        is_active INTEGER NOT NULL DEFAULT 1,
        last_activity_at TEXT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
");

$userCols = $pdo->query("PRAGMA table_info(users)")->fetchAll(PDO::FETCH_COLUMN, 1);
if (!in_array('primary_org_id', $userCols, true)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN primary_org_id INTEGER NULL;");
}
if (!in_array('email', $userCols, true)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN email TEXT NULL;");
}
if (!in_array('last_activity_at', $userCols, true)) {
    $pdo->exec("ALTER TABLE users ADD COLUMN last_activity_at TEXT NULL;");
}

$pdo->exec("
    CREATE TABLE IF NOT EXISTS organization_memberships (
        membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
        org_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        approved_by_id INTEGER NULL,
        join_method TEXT NOT NULL DEFAULT 'public_apply',
        status TEXT NOT NULL DEFAULT 'pending',
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        joined_at TEXT NULL,
        UNIQUE(org_id, user_id)
    );
");

// Seed Users (Password for all: Password123!)
$defaultHash = password_hash('Password123!', PASSWORD_DEFAULT);
$seedUsers = [
    ['EMP-1001', 'Cruz, Marco', 'marco_itadmin', 'marco.cruz@company.com', 'it_admin'],
    ['EMP-1002', 'Reyes, Sophia', 'sophia_libadmin', 'sophia.reyes@company.com', 'library_admin'],
    ['EMP-1005', 'Tan, Adrian', 'adrian_tcadmin', 'adrian.tan@company.com', 'library_admin'],
    ['EMP-1006', 'Lim, Clarissa', 'clarissa_fdadmin', 'clarissa.lim@company.com', 'library_admin'],
    ['EMP-1003', 'Mendoza, Sofia', 'sofia_member', 'sofia.mendoza@company.com', 'member'],
    ['EMP-1004', 'Gomez, Patricia', 'patricia_member', 'patricia.gomez@company.com', 'member'],
];

$insUser = $pdo->prepare("
    INSERT OR IGNORE INTO users (primary_org_id, employee_id, full_name, username, email, password_hash, role, is_active)
    VALUES (NULL, :emp, :fn, :un, :em, :pw, :role, 1)
");
foreach ($seedUsers as [$emp, $fn, $un, $em, $role]) {
    $insUser->execute([
        ':emp' => $emp,
        ':fn' => $fn,
        ':un' => $un,
        ':em' => $em,
        ':pw' => $defaultHash,
        ':role' => $role,
    ]);
}

$getUid = function (string $username) use ($pdo): int {
    $s = $pdo->prepare("SELECT user_id FROM users WHERE username = :un LIMIT 1");
    $s->execute([':un' => $username]);
    return (int)($s->fetchColumn() ?: 0);
};

$sophiaId   = $getUid('sophia_libadmin');
$adrianId   = $getUid('adrian_tcadmin');
$clarissaId = $getUid('clarissa_fdadmin');
$sofiaMId   = $getUid('sofia_member');
$patriciaId = $getUid('patricia_member');

// Seed All 3 Organizations / Schools (Matches ORG-LRN, ORG-TC, ORG-FD in it_admin.js)
$seedOrgs = [
    ['ORG-LRN', 'LRN Main Building Library', 'LRN-HQ', 'public', null, $sophiaId],
    ['ORG-TC',  'Tech Center Engineering Library', 'TC-BLDG2', 'private', 'PRIV-TC-99', $adrianId],
    ['ORG-FD',  'Finance & Operations Resource Hub', 'FD-NORTH', 'public', null, $clarissaId],
];

$insOrg = $pdo->prepare("
    INSERT OR IGNORE INTO organizations (org_code, name, site_code, visibility, invite_code, lib_admin_id, is_active)
    VALUES (:code, :name, :site, :vis, :inv, :admin_id, 1)
");
foreach ($seedOrgs as [$code, $name, $site, $vis, $inv, $adminId]) {
    $insOrg->execute([
        ':code' => $code,
        ':name' => $name,
        ':site' => $site,
        ':vis' => $vis,
        ':inv' => $inv,
        ':admin_id' => $adminId ?: null,
    ]);
}

$getOid = function (string $code) use ($pdo): int {
    $s = $pdo->prepare("SELECT org_id FROM organizations WHERE org_code = :c LIMIT 1");
    $s->execute([':c' => $code]);
    return (int)($s->fetchColumn() ?: 0);
};

$lrnId = $getOid('ORG-LRN');
$tcId  = $getOid('ORG-TC');
$fdId  = $getOid('ORG-FD');

$linkMember = function (int $oid, int $uid, string $status = 'active', bool $setPrimary = false) use ($pdo): void {
    if (!$oid || !$uid) return;
    if ($setPrimary) {
        $pdo->prepare("UPDATE users SET primary_org_id = :oid WHERE user_id = :uid AND primary_org_id IS NULL")
            ->execute([':oid' => $oid, ':uid' => $uid]);
    }
    $pdo->prepare("
        INSERT OR IGNORE INTO organization_memberships (org_id, user_id, approved_by_id, join_method, status, joined_at)
        VALUES (:oid, :uid, :uid, 'admin_registered', :st, CURRENT_TIMESTAMP)
    ")->execute([':oid' => $oid, ':uid' => $uid, ':st' => $status]);
};

$linkMember($lrnId, $sophiaId, 'active', true);
$linkMember($tcId, $adrianId, 'active', true);
$linkMember($fdId, $clarissaId, 'active', true);
$linkMember($lrnId, $sofiaMId, 'active', true);
$linkMember($fdId, $sofiaMId, 'active', false);
$linkMember($tcId, $patriciaId, 'active', true);
$linkMember($lrnId, $patriciaId, 'pending', false);