-- Add subcategory column to expenses table
ALTER TABLE expenses 
ADD COLUMN subcategory VARCHAR(100) DEFAULT NULL 
AFTER category_id;

-- Add index for better query performance
CREATE INDEX idx_expenses_subcategory ON expenses(subcategory);