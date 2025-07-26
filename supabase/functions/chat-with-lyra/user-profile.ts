import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function fetchUserProfile(userId: string) {
  if (!userId) return null;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select(`
        profile_completed,
        first_name,
        last_name,
        role,
        tech_comfort,
        ai_experience,
        learning_style,
        organization_name,
        organization_type,
        organization_size,
        job_title,
        years_experience,
        location
      `)
      .eq('user_id', userId)
      .single();

    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}