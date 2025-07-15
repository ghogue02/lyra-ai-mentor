
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { JourneyTab } from '@/components/dashboard/JourneyTab';
import { ProfileTab } from '@/components/dashboard/ProfileTab';
import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, UserCircle, Code2, Package, Trophy } from 'lucide-react';
import { MyToolkit } from '@/components/MyToolkit';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { ProgressProvider } from '@/contexts/ProgressContext';
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

    // All chapters are unlocked for testing
    // No locking logic required

    // Check if the chapter has lessons
    try {
      console.log(`Checking lessons for Chapter ${chapterId}...`);
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('chapter_id', chapterId)
        .eq('is_published', true)
        .order('order_index');
      
      console.log(`Found lessons for Chapter ${chapterId}:`, lessons);
      
      if (lessons && lessons.length > 0) {
        console.log(`First lesson for Chapter ${chapterId}:`, lessons[0]);
      }

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

      // Navigate to chapter overview (Chapter 2 has special hub)
      if (chapterId === 2) {
        console.log(`Navigating to Chapter 2 Hub`);
        navigate(`/chapter/2`);
      } else {
        console.log(`Navigating to Chapter ${chapterId}, Lesson ${lessons[0].id}`);
        navigate(`/chapter/${chapterId}/lesson/${lessons[0].id}`);
      }
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
    <ProgressProvider>
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
        <Navbar showAuthButtons={false} onSignOut={signOut} />
      
      {/* Header Section - Fixed spacing to prevent header overlap */}
      <section className="container mx-auto px-4 pt-40 pb-8">
        {/* Animated Rocket - Larger and more prominent */}
        <div className="mb-12 flex justify-center">
          <video 
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-112 md:h-112 object-contain"
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
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-112 md:h-112 object-contain"
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
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger 
              value="journey" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              Your Learning Journey
            </TabsTrigger>
            <TabsTrigger 
              value="progress" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Trophy className="w-4 h-4" />
              Progress & Badges
            </TabsTrigger>
            <TabsTrigger 
              value="toolkit" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Package className="w-4 h-4" />
              My Toolkit
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Profile & Personalization
            </TabsTrigger>
            <TabsTrigger value="developer" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md">
              <Code2 className="w-4 h-4" />
              Developer Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="space-y-8">
            <JourneyTab 
              onboardingComplete={onboardingComplete}
              onChapterClick={handleChapterClick}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-8">
            <ProgressDashboard />
          </TabsContent>

          <TabsContent value="toolkit" className="space-y-8">
            <MyToolkit />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="developer" className="space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-purple-100/50 p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Developer Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/showcase')}
                  className="group relative bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-2">Component Showcase</h3>
                      <p className="text-sm opacity-90">Explore all 35+ interactive components with live previews and code examples</p>
                    </div>
                    <Code2 className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button
                  onClick={() => navigate('/ai-testing')}
                  className="group relative bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-2">AI Testing Ground</h3>
                      <p className="text-sm opacity-90">Test and explore AI-powered components and interactive elements</p>
                    </div>
                    <Code2 className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button
                  onClick={() => navigate('/interactive-elements')}
                  className="group relative bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-2">Interactive Elements</h3>
                      <p className="text-sm opacity-90">Browse and test all interactive learning components</p>
                    </div>
                    <Code2 className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
                <button
                  onClick={() => navigate('/ai-refine')}
                  className="group relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-6 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-lg font-semibold mb-2">AI Refinement Lab</h3>
                      <p className="text-sm opacity-90">Refine and optimize AI-powered features</p>
                    </div>
                    <Code2 className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
    </ProgressProvider>
  );
};

export default Dashboard;
