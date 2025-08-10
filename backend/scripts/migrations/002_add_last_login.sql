-- Add last_login column to users table for admin user tracking
ALTER TABLE users 
ADD COLUMN last_login TIMESTAMP NULL DEFAULT NULL 
AFTER role;

-- Add index for better performance on admin queries
ALTER TABLE users 
ADD INDEX idx_last_login (last_login);