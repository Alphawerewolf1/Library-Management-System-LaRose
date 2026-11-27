<?php
declare(strict_types=1);

session_start();
require_once __DIR__ . '/../connection/db.php';

if (!empty($_SESSION['user_id'])) {
    $uid = (int) $_SESSION['user_id'];
    $uname = (string) ($_SESSION['username'] ?? 'unknown');
    writeAuditLog($pdo, $uid, 'LOGOUT', 'users', "User {$uname} signed out");
}

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();

header('Location: ../index.php');
exit;