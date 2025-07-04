-- Add is_active and is_gated columns to interactive_elements table
-- These columns are referenced in the code but don't exist in the database

-- Add is_active column with default true
ALTER TABLE interactive_elements 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add is_gated column with default false  
ALTER TABLE interactive_elements
ADD COLUMN IF NOT EXISTS is_gated boolean DEFAULT false;

-- Update any existing rows to ensure they have values
UPDATE interactive_elements 
SET is_active = true, is_gated = false
WHERE is_active IS NULL OR is_gated IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_interactive_elements_active ON interactive_elements(is_active);
CREATE INDEX IF NOT EXISTS idx_interactive_elements_gated ON interactive_elements(is_gated);

-- Verify the changes
SELECT 
  COUNT(*) as total_elements,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_elements,
  SUM(CASE WHEN is_gated = false THEN 1 ELSE 0 END) as ungated_elements
FROM interactive_elements;