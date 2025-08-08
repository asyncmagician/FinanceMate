-- Add subcategory column to recurring_expenses table
ALTER TABLE recurring_expenses 
ADD COLUMN subcategory VARCHAR(100) DEFAULT NULL 
AFTER category_id;

-- Add index for better query performance
CREATE INDEX idx_recurring_expenses_subcategory ON recurring_expenses(subcategory);