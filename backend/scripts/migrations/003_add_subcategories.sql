-- Add subcategory column to expenses table
ALTER TABLE expenses 
ADD COLUMN subcategory VARCHAR(100) DEFAULT NULL AFTER category_id;

-- Add subcategory column to recurring_expenses table  
ALTER TABLE recurring_expenses
ADD COLUMN subcategory VARCHAR(100) DEFAULT NULL AFTER category_id;

-- Add index for better performance
CREATE INDEX idx_subcategory ON expenses(subcategory);
CREATE INDEX idx_recurring_subcategory ON recurring_expenses(subcategory);