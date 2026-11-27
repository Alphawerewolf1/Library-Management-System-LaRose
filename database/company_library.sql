CREATE DATABASE IF NOT EXISTS company_library
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE company_library;

-- 1. USERS (Public Sign-Up Defaults to 'member')
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  primary_org_id INT NULL,
  employee_id VARCHAR(30) NOT NULL UNIQUE,
  full_name VARCHAR(120) NOT NULL,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('it_admin', 'library_admin', 'member') NOT NULL DEFAULT 'member',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  last_activity_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. ORGANIZATIONS (Registered Building / Company Libraries)
CREATE TABLE organizations (
  org_id INT AUTO_INCREMENT PRIMARY KEY,
  org_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL UNIQUE,
  site_code VARCHAR(30) NOT NULL,
  visibility ENUM('public', 'private') NOT NULL DEFAULT 'public',
  invite_code VARCHAR(60) NULL,
  lib_admin_id INT NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_org_lib_admin FOREIGN KEY (lib_admin_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

ALTER TABLE users
  ADD CONSTRAINT fk_users_primary_org FOREIGN KEY (primary_org_id) REFERENCES organizations(org_id) ON DELETE SET NULL;

-- 3. ORGANIZATION_MEMBERSHIPS (Multi-Library Enrollment & Applications)
CREATE TABLE organization_memberships (
  membership_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  user_id INT NOT NULL,
  approved_by_id INT NULL,
  join_method ENUM('public_apply', 'invite_code', 'admin_registered') NOT NULL DEFAULT 'public_apply',
  status ENUM('pending', 'active', 'declined', 'removed') NOT NULL DEFAULT 'pending',
  applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  joined_at DATETIME NULL,
  UNIQUE KEY uq_org_user_membership (org_id, user_id),
  CONSTRAINT fk_mem_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  CONSTRAINT fk_mem_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_mem_approver FOREIGN KEY (approved_by_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. CATEGORIES
CREATE TABLE categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL
) ENGINE=InnoDB;

-- 5. BOOKS (Scoped per Organization / Library)
CREATE TABLE books (
  book_id INT AUTO_INCREMENT PRIMARY KEY,
  org_id INT NOT NULL,
  category_id INT NOT NULL,
  book_code VARCHAR(30) NOT NULL UNIQUE,
  isbn VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  author VARCHAR(150) NOT NULL,
  publisher VARCHAR(120) NULL,
  publication_year INT NULL,
  shelf_location VARCHAR(100) NOT NULL,
  summary TEXT NULL,
  is_archived TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_org_book_title (org_id, title),
  CONSTRAINT fk_books_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE CASCADE,
  CONSTRAINT fk_books_cat FOREIGN KEY (category_id) REFERENCES categories(category_id)
) ENGINE=InnoDB;

-- 6. BOOK_COPIES
CREATE TABLE book_copies (
  copy_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  asset_code VARCHAR(60) NOT NULL UNIQUE,
  status ENUM('available', 'borrowed', 'maintenance', 'lost', 'destroyed') NOT NULL DEFAULT 'available',
  `condition` ENUM('new', 'good', 'fair', 'damaged', 'destroyed') NOT NULL DEFAULT 'good',
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_copies_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 7. BORROW_TRANSACTIONS
CREATE TABLE borrow_transactions (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  reference_code VARCHAR(40) NOT NULL UNIQUE,
  borrower_id INT NOT NULL,
  issued_by_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  borrowed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  due_date DATETIME NOT NULL,
  remarks TEXT NULL,
  CONSTRAINT fk_txn_borrower FOREIGN KEY (borrower_id) REFERENCES users(user_id),
  CONSTRAINT fk_txn_issuer FOREIGN KEY (issued_by_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 8. BORROW_RECORDS
CREATE TABLE borrow_records (
  borrow_id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  copy_id INT NOT NULL,
  returned_by_id INT NULL,
  returned_at DATETIME NULL,
  renewal_count INT NOT NULL DEFAULT 0,
  return_condition ENUM('good', 'fair', 'damaged', 'lost', 'destroyed') NULL,
  status ENUM('active', 'returned', 'overdue', 'lost', 'destroyed') NOT NULL DEFAULT 'active',
  CONSTRAINT fk_rec_txn FOREIGN KEY (transaction_id) REFERENCES borrow_transactions(transaction_id) ON DELETE CASCADE,
  CONSTRAINT fk_rec_copy FOREIGN KEY (copy_id) REFERENCES book_copies(copy_id),
  CONSTRAINT fk_rec_returner FOREIGN KEY (returned_by_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 9. RESERVATIONS
CREATE TABLE reservations (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reserved_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pickup_date DATE NOT NULL,
  expires_at DATETIME NULL,
  status ENUM('pending', 'approved', 'declined', 'fulfilled', 'cancelled', 'expired') NOT NULL DEFAULT 'pending',
  decline_reason TEXT NULL,
  CONSTRAINT fk_res_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  CONSTRAINT fk_res_user FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 10. LOAN_EXTENSIONS
CREATE TABLE loan_extensions (
  extension_id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_id INT NOT NULL,
  reviewed_by_id INT NULL,
  requested_due_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'denied') NOT NULL DEFAULT 'pending',
  deny_reason TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  CONSTRAINT fk_ext_txn FOREIGN KEY (transaction_id) REFERENCES borrow_transactions(transaction_id) ON DELETE CASCADE,
  CONSTRAINT fk_ext_reviewer FOREIGN KEY (reviewed_by_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 11. BOOK_INCIDENTS
CREATE TABLE book_incidents (
  incident_id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  transaction_id INT NULL,
  reported_by_user_id INT NOT NULL,
  reviewed_by_user_id INT NULL,
  incident_type ENUM('missing', 'destroyed') NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'restored') NOT NULL DEFAULT 'pending',
  deny_reason TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  CONSTRAINT fk_inc_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
  CONSTRAINT fk_inc_txn FOREIGN KEY (transaction_id) REFERENCES borrow_transactions(transaction_id) ON DELETE SET NULL,
  CONSTRAINT fk_inc_reporter FOREIGN KEY (reported_by_user_id) REFERENCES users(user_id),
  CONSTRAINT fk_inc_reviewer FOREIGN KEY (reviewed_by_user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;

-- 12. AUDIT_LOGS
CREATE TABLE audit_logs (
  log_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  org_id INT NULL,
  action VARCHAR(60) NOT NULL,
  target_table VARCHAR(60) NOT NULL,
  target_id INT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
  CONSTRAINT fk_audit_org FOREIGN KEY (org_id) REFERENCES organizations(org_id) ON DELETE SET NULL
) ENGINE=InnoDB;

USE company_library;

-- Password for all seed accounts below is: Password123!
INSERT INTO users (primary_org_id, employee_id, full_name, username, email, password_hash, role, is_active)
VALUES
  (NULL, 'EMP-1001', 'Cruz, Marco', 'marco_itadmin', 'marco.cruz@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_admin', 1),
  (NULL, 'EMP-1002', 'Reyes, Sophia', 'sophia_libadmin', 'sophia.reyes@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'library_admin', 1),
  (NULL, 'EMP-1005', 'Tan, Adrian', 'adrian_tcadmin', 'adrian.tan@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'library_admin', 1),
  (NULL, 'EMP-1003', 'Mendoza, Sofia', 'sofia_member', 'sofia.mendoza@company.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'member', 1);

-- Note: The hash above is Laravel's default hash for "password". 
-- If you want the exact hash for "Password123!", use PHP or register via index.php.