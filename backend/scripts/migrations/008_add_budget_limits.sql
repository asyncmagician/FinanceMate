-- Add budget limit field to months table
ALTER TABLE months 
ADD COLUMN IF NOT EXISTS budget_limit DECIMAL(10, 2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS alert_threshold_percent INT DEFAULT 80;