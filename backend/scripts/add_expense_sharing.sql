-- Add expense sharing columns to recurring_expenses table
ALTER TABLE recurring_expenses 
ADD COLUMN share_type ENUM('none', 'percentage', 'amount', 'equal') DEFAULT 'none' AFTER amount,
ADD COLUMN share_value DECIMAL(10, 2) DEFAULT NULL AFTER share_type,
ADD COLUMN share_with VARCHAR(255) DEFAULT NULL AFTER share_value;

-- Add index for better performance
ALTER TABLE recurring_expenses ADD INDEX idx_share_type (share_type);