-- Add email preferences to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE COMMENT 'User consent for marketing/promotional emails',
ADD COLUMN IF NOT EXISTS email_budget_alerts BOOLEAN DEFAULT TRUE COMMENT 'Receive budget threshold alerts',
ADD COLUMN IF NOT EXISTS email_weekly_summary BOOLEAN DEFAULT FALSE COMMENT 'Receive weekly budget summary',
ADD COLUMN IF NOT EXISTS email_consent_date TIMESTAMP NULL COMMENT 'When user gave/updated email consent',
ADD COLUMN IF NOT EXISTS email_unsubscribe_token VARCHAR(64) NULL COMMENT 'Token for one-click unsubscribe';

-- Create index for unsubscribe token lookups
CREATE INDEX IF NOT EXISTS idx_email_unsubscribe_token ON users(email_unsubscribe_token);

-- Update existing users to set consent date if they have notifications enabled
UPDATE users 
SET email_consent_date = CURRENT_TIMESTAMP 
WHERE email_notifications = TRUE AND email_consent_date IS NULL;

-- Generate unsubscribe tokens for existing users
UPDATE users 
SET email_unsubscribe_token = SHA2(CONCAT(id, email, UNIX_TIMESTAMP()), 256)
WHERE email_unsubscribe_token IS NULL;