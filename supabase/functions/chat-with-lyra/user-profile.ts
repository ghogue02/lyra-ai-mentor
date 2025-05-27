
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import type { UserProfile } from './types.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.log('Profile fetch error:', profileError.message);
      return null;
    }

    console.log('Fetched user profile:', {
      hasProfile: !!profile,
      profileCompleted: profile?.profile_completed,
      role: profile?.role,
      techComfort: profile?.tech_comfort
    });

    return profile;
  } catch (error) {
    console.log('Error fetching profile:', error);
    return null;
  }
}
