
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import { ChapterCard } from '@/components/ChapterCard';
import { Navbar } from '@/components/Navbar';
import { ProfileForm } from '@/components/ProfileForm';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Settings, Heart, Scale, Target, BookOpen, User, LogOut, GraduationCap, UserCircle } from 'lucide-react';

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
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('journey');

  const chapters = [
    { id: 1, title: "What Is AI Anyway?", icon: Brain, description: "Demystify artificial intelligence with real-world examples", duration: "15 min" },
    { id: 2, title: "How Machines Learn", icon: Settings, description: "ML basics without the technical jargon", duration: "20 min" },
    { id: 3, title: "From Data to Insight", icon: Target, description: "Practical AI tools you can use today", duration: "25 min" },
    { id: 4, title: "AI Ethics & Impact", icon: Scale, description: "Navigate the ethical landscape responsibly", duration: "18 min" },
    { id: 5, title: "Non-Profit Playbook", icon: Heart, description: "Grant writing, donor outreach, and operations", duration: "30 min" },
    { id: 6, title: "Your Action Plan", icon: BookOpen, description: "Create your AI-powered workflow", duration: "20 min" }
  ];

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
        
        // Auto-switch to profile tab if profile isn't completed
        if (!data.profile_completed) {
          setActiveTab('profile');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = async (chapterId: number) => {
    if (!user || !profile) return;
    
    // Only allow Chapter 1 during onboarding, or any chapter if onboarding is complete
    const onboardingComplete = profile.profile_completed && profile.first_chapter_started && profile.first_chapter_completed;
    
    if (!onboardingComplete && chapterId > 1) {
      return; // Chapter is locked
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

  const onboardingComplete = profile?.profile_completed && profile?.first_chapter_started && profile?.first_chapter_completed;
  const userName = profile?.first_name && profile?.last_name 
    ? `${profile.first_name} ${profile.last_name}`
    : user?.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Welcome back{profile?.first_name ? `, ${profile.first_name}` : ''}!
            </h1>
            <p className="text-xl text-gray-600">
              {onboardingComplete 
                ? "Continue your AI learning journey" 
                : "Let's get you started on your AI learning journey"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{userName}</p>
                  <p className="text-xs text-gray-600">Learner</p>
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" onClick={signOut} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Onboarding Progress */}
        {profile && !onboardingComplete && (
          <OnboardingProgress
            profileCompleted={profile.profile_completed}
            firstChapterStarted={profile.first_chapter_started}
            firstChapterCompleted={profile.first_chapter_completed}
            onboardingStep={profile.onboarding_step}
          />
        )}

        {/* Tabbed Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="journey" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Your Learning Journey
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="w-4 h-4" />
              Profile & Personalization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journey" className="space-y-8">
            {/* Learning Journey Content */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Your Learning Journey
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Six focused chapters designed to take you from AI curious to AI confident
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {chapters.map((chapter) => {
                const isLocked = !onboardingComplete && chapter.id > 1;
                return (
                  <div key={chapter.id} onClick={() => handleChapterClick(chapter.id)}>
                    <ChapterCard 
                      chapter={chapter}
                      isLocked={isLocked}
                    />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            {/* Profile Content */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Profile & Personalization
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage your personal information and learning preferences
              </p>
            </div>
            
            <ProfileForm />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default Dashboard;
