-- Add columns for email verification and password reset
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER role,
ADD COLUMN email_verification_token VARCHAR(255) DEFAULT NULL AFTER email_verified,
ADD COLUMN email_verification_expires DATETIME DEFAULT NULL AFTER email_verification_token,
ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL AFTER email_verification_expires,
ADD COLUMN reset_token_expires DATETIME DEFAULT NULL AFTER reset_token,
ADD COLUMN budget_alert_threshold DECIMAL(10, 2) DEFAULT NULL AFTER reset_token_expires,
ADD COLUMN budget_alert_enabled BOOLEAN DEFAULT FALSE AFTER budget_alert_threshold,
ADD INDEX idx_email_verification_token (email_verification_token),
ADD INDEX idx_reset_token (reset_token);