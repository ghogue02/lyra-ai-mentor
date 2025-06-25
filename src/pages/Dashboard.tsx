import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { JourneyTab } from '@/components/dashboard/JourneyTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardRocketUrls } from '@/utils/supabaseIcons';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  role: string;
  tech_comfort: string;
  ai_experience: string;
  learning_style: string;
  profile_completed: boolean;
  first_chapter_started: boolean;
  first_chapter_completed: boolean;
  onboarding_step: number;
  first_name: string;
  last_name: string;
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journey');

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setProfile({
          role: data.role || '',
          tech_comfort: data.tech_comfort || '',
          ai_experience: data.ai_experience || '',
          learning_style: data.learning_style || '',
          profile_completed: data.profile_completed || false,
          first_chapter_started: data.first_chapter_started || false,
          first_chapter_completed: data.first_chapter_completed || false,
          onboarding_step: data.onboarding_step || 1,
          first_name: data.first_name || '',
          last_name: data.last_name || ''
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapterId: number) => {
    if (!user || !profile) return;

    // Updated logic: Only require chapter progress, not profile completion for testing
    const onboardingComplete = profile.first_chapter_started && profile.first_chapter_completed;
    if (!onboardingComplete && chapterId > 1) {
      return; // Chapter is locked
    }

    // Check if the chapter has lessons
    try {
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id')
        .eq('chapter_id', chapterId)
        .eq('is_published', true)
        .order('order_index')
        .limit(1);

      if (error) {
        console.error('Error checking lessons:', error);
        toast({
          title: "Error",
          description: "Failed to load chapter content.",
          variant: "destructive"
        });
        return;
      }

      if (!lessons || lessons.length === 0) {
        toast({
          title: "Chapter Not Ready",
          description: "This chapter is still being prepared. Check back soon!",
          variant: "default"
        });
        return;
      }

      // Mark first chapter as started if clicking on Chapter 1
      if (chapterId === 1 && !profile.first_chapter_started) {
        try {
          await supabase
            .from('profiles')
            .update({
              first_chapter_started: true,
              onboarding_step: 3
            })
            .eq('user_id', user.id);
          
          setProfile(prev => prev ? {
            ...prev,
            first_chapter_started: true,
            onboarding_step: 3
          } : null);
        } catch (error) {
          console.error('Error updating chapter progress:', error);
        }
      }

      // Navigate to the first lesson of the chapter
      navigate(`/chapter/${chapterId}/lesson/${lessons[0].id}`);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Updated logic: Only require chapter progress, not profile completion for testing
  const onboardingComplete = profile?.first_chapter_started && profile?.first_chapter_completed;
  const userName = profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : user?.email;

  const rocketUrls = getDashboardRocketUrls();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} onSignOut={signOut} />
      
      {/* Header Section - Fixed spacing to prevent header overlap */}
      <section className="container mx-auto px-4 pt-40 pb-8">
        {/* Animated Rocket - Larger and more prominent */}
        <div className="mb-12 flex justify-center">
          <video 
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={(e) => {
              console.error('Video failed to load, showing fallback image');
              const target = e.currentTarget;
              target.style.display = 'none';
              const fallbackImg = target.nextElementSibling as HTMLImageElement;
              if (fallbackImg) fallbackImg.style.display = 'block';
            }}
          >
            <source src={rocketUrls.mp4} type="video/mp4" />
            <source src={rocketUrls.gif} type="image/gif" />
            Your browser does not support the video tag.
          </video>
          <img 
            src={rocketUrls.fallback}
            alt="AI Learning Journey Rocket"
            className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 object-contain"
            style={{ display: 'none' }}
          />
        </div>

        <DashboardHeader 
          firstName={profile?.first_name}
          userName={userName || ''}
          onboardingComplete={onboardingComplete}
          onSignOut={handleSignOut}
        />

        {/* Onboarding Progress */}
        {profile && !onboardingComplete && (
          <OnboardingProgress 
            profileCompleted={profile.profile_completed} 
            firstChapterStarted={profile.first_chapter_started} 
            firstChapterCompleted={profile.first_chapter_completed} 
            onboardingStep={profile.onboarding_step}
            userRole={profile.role}
          />
        )}

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="journey" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              Your Learning Journey
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Profile & Personalization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="space-y-8">
            <JourneyTab 
              onboardingComplete={onboardingComplete}
              onChapterClick={handleChapterClick}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <ProfileTab />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
