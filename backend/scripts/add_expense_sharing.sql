-- Add expense sharing columns to expenses table
ALTER TABLE expenses 
ADD COLUMN share_type ENUM('none', 'equal', 'percentage', 'amount') DEFAULT 'none' AFTER is_received,
ADD COLUMN share_value DECIMAL(10,2) DEFAULT NULL AFTER share_type,
ADD COLUMN share_with VARCHAR(100) DEFAULT NULL AFTER share_value;

-- Add expense sharing columns to recurring_expenses table  
ALTER TABLE recurring_expenses
ADD COLUMN share_type ENUM('none', 'equal', 'percentage', 'amount') DEFAULT 'none' AFTER is_active,
ADD COLUMN share_value DECIMAL(10,2) DEFAULT NULL AFTER share_type,
ADD COLUMN share_with VARCHAR(100) DEFAULT NULL AFTER share_value;

-- Add indexes for better query performance
CREATE INDEX idx_expenses_share_type ON expenses(share_type);
CREATE INDEX idx_recurring_share_type ON recurring_expenses(share_type);