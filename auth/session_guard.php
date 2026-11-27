<?php
declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function requireLogin(PDO $pdo): array
{
    if (!isset($_SESSION['user'])) {
        header('Location: ../index.php');
        exit;
    }

    if (!is_array($_SESSION['user'])) {
        header('Location: ../index.php');
        exit;
    }

    $user = $_SESSION['user'];

    if (!empty($user['user_id'])) {
        try {
            $pdo->prepare("UPDATE users SET last_activity_at = CURRENT_TIMESTAMP WHERE user_id = :uid")
                ->execute([':uid' => (int)$user['user_id']]);
        } catch (Throwable $e) {
            // Ignore if DB is read-only
        }
    }

    return [
        'user_id'         => (int)($user['user_id'] ?? 1),
        'primary_org_id'  => $user['primary_org_id'] ?? null,
        'selected_org_id' => $user['selected_org_id'] ?? null,
        'employee_id'     => $user['employee_id'] ?? 'EMP-1001',
        'full_name'       => $user['full_name'] ?? 'Cruz, Marco',
        'username'        => $user['username'] ?? 'marco_itadmin',
        'role'            => $user['role'] ?? 'it_admin',
        'department'      => $user['department'] ?? 'LRN Main Building Library',
    ];
}