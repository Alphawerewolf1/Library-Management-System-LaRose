<?php
declare(strict_types=1);

ob_start();
ini_set('display_errors', '1');
error_reporting(E_ALL);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

require_once __DIR__ . '/../connection/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    header('Location: ../index.php');
    exit;
}

$username = trim((string) ($_POST['username'] ?? ''));
$password = (string) ($_POST['password'] ?? '');

if ($username === '' || $password === '') {
    ob_end_clean();
    header('Location: ../index.php?error=invalid');
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username LIMIT 1');
$stmt->execute([':username' => $username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, (string) $user['password_hash'])) {
    writeAuditLog($pdo, null, 'LOGIN_FAILED', 'users', "Failed login attempt for biometric/username: {$username}");
    ob_end_clean();
    header('Location: ../index.php?error=invalid');
    exit;
}

if ((int) $user['is_active'] !== 1) {
    writeAuditLog($pdo, (int) $user['user_id'], 'LOGIN_BLOCKED', 'users', "Inactive account login attempt: {$username}");
    ob_end_clean();
    header('Location: ../index.php?error=inactive');
    exit;
}

session_regenerate_id(true);
$now = time();

$_SESSION['user_id']       = (int) $user['user_id'];
$_SESSION['employee_id']   = (string) $user['employee_id'];
$_SESSION['full_name']     = (string) $user['full_name'];
$_SESSION['username']      = (string) $user['username'];
$_SESSION['department']    = (string) $user['department'];
$_SESSION['role']          = (string) $user['role'];
$_SESSION['last_activity'] = $now;

$pdo->prepare('UPDATE users SET last_activity_at = :ts WHERE user_id = :id')
    ->execute([
        ':ts' => date('Y-m-d H:i:s', $now),
        ':id' => (int) $user['user_id'],
    ]);

writeAuditLog($pdo, (int) $user['user_id'], 'LOGIN', 'users', "User {$user['username']} ({$user['role']}) signed in");

ob_end_clean();
header('Location: ../pages/it_admin.php');
exit;