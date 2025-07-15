// Performance-tracked Supabase client
import { supabase } from './client';
import { createSupabasePerformanceWrapper } from '@/monitoring/middleware';

// Create a performance-tracked version of the Supabase client
export const trackedSupabase = createSupabasePerformanceWrapper(supabase);

// Export the original client as well for compatibility
export { supabase };