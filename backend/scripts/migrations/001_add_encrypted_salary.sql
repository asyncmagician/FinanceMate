-- Add encrypted_salary column to users table
ALTER TABLE users 
ADD COLUMN encrypted_salary TEXT DEFAULT NULL 
AFTER role;

-- Add index for better query performance
CREATE INDEX idx_users_encrypted_salary ON users(encrypted_salary(50));