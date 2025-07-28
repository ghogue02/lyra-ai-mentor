
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { MinimalHeader } from '@/components/MinimalHeader';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { JourneyTab } from '@/components/dashboard/JourneyTab';

import { supabase } from '@/integrations/supabase/client';
import { GraduationCap, Code2, Package, Trophy } from 'lucide-react';
import { MyToolkit } from '@/components/MyToolkit';
import { ProgressDashboard } from '@/components/ProgressDashboard';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { useNavigate } from 'react-router-dom';
import { getAnimationUrl } from '@/utils/supabaseIcons';
import { OptimizedVideoAnimation } from '@/components/performance/OptimizedVideoAnimation';
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

    // Navigate to chapter hubs for all chapters
    const chapterRoutes = {
      1: '/chapter/1',
      2: '/chapter/2',
      3: '/chapter/3',
      4: '/chapter/4',
      5: '/chapter/5',
      6: '/chapter/6'
    };

    const route = chapterRoutes[chapterId as keyof typeof chapterRoutes];
    
    if (route) {
      console.log(`Navigating to Chapter ${chapterId} character journey: ${route}`);
      
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
      
      navigate(route);
    } else {
      console.log(`Chapter ${chapterId} not configured yet`);
      toast({
        title: "Chapter not ready",
        description: `Chapter ${chapterId} content is coming soon! We're working hard to bring you amazing learning experiences.`,
        variant: "default",
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

  return (
    <ProgressProvider>
      <div className="min-h-screen" style={{background: 'var(--nm-bg)'}}>
        <MinimalHeader />
      
      {/* Header Section - Fixed spacing to prevent header overlap */}
      <section className="container mx-auto px-4 pt-40 pb-8">
        {/* Animated Rocket - Larger and more prominent */}
        <div className="mb-12 flex justify-center">
          <OptimizedVideoAnimation
            src={getAnimationUrl('lyra-rocket.mp4')}
            fallbackIcon={
              <img 
                src={getAnimationUrl('lyra-rocket.mp4')} 
                alt="AI Learning Journey Rocket" 
                className="w-80 h-80 sm:w-96 sm:h-96 md:w-112 md:h-112 object-contain" 
              />
            }
            className="w-80 h-80 sm:w-96 sm:h-96 md:w-112 md:h-112"
            context="ui"
            autoPlay={true}
            loop={true}
            muted={true}
          />
        </div>

        <DashboardHeader 
          firstName={profile?.first_name}
          userName={userName || ''}
          onboardingComplete={onboardingComplete}
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

        {/* Neumorphic Tabbed Interface */}
        <div className="w-full">
          <div className="nm-card-inset grid w-full grid-cols-3 mb-8 p-2 gap-2">
            <button 
              className={`nm-tab ${activeTab === 'journey' ? 'nm-tab-active' : ''} px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600`}
              onClick={() => setActiveTab('journey')}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Your Learning Journey</span>
              <span className="sm:hidden">Journey</span>
            </button>
            <button 
              className={`nm-tab ${activeTab === 'progress' ? 'nm-tab-active' : ''} px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-yellow-600`}
              onClick={() => setActiveTab('progress')}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Progress & Badges</span>
              <span className="sm:hidden">Progress</span>
            </button>
            <button 
              className={`nm-tab ${activeTab === 'toolkit' ? 'nm-tab-active' : ''} px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium text-purple-600`}
              onClick={() => setActiveTab('toolkit')}
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">My Toolkit</span>
              <span className="sm:hidden">Toolkit</span>
            </button>
          </div>

          {activeTab === 'journey' && (
            <div className="space-y-8">
              <JourneyTab 
                onboardingComplete={onboardingComplete}
                onChapterClick={handleChapterClick}
              />
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="space-y-8">
              <ProgressDashboard />
            </div>
          )}

          {activeTab === 'toolkit' && (
            <div className="space-y-8">
              <MyToolkit />
            </div>
          )}
        </div>
      </section>
    </div>
    </ProgressProvider>
  );
};

export default Dashboard;
