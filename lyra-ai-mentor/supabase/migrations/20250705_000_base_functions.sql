-- Create base functions needed for AI Playground migrations
-- This must be run first before any table creation

-- Create handle_updated_at function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.handle_updated_at IS 'Updates the updated_at timestamp whenever a row is modified';