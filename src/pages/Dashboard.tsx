
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { ChapterCard } from '@/components/ChapterCard';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { Brain, Settings, Heart, Scale, Target, BookOpen, User, LogOut } from 'lucide-react';

interface UserProfile {
  role: string;
  tech_comfort: string;
  ai_experience: string;
  learning_style: string;
}

export const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const chapters = [
    { id: 1, title: "What Is AI Anyway?", icon: Brain, description: "Demystify artificial intelligence with real-world examples", duration: "15 min" },
    { id: 2, title: "How Machines Learn", icon: Settings, description: "ML basics without the technical jargon", duration: "20 min" },
    { id: 3, title: "From Data to Insight", icon: Target, description: "Practical AI tools you can use today", duration: "25 min" },
    { id: 4, title: "AI Ethics & Impact", icon: Scale, description: "Navigate the ethical landscape responsibly", duration: "18 min" },
    { id: 5, title: "Non-Profit Playbook", icon: Heart, description: "Grant writing, donor outreach, and operations", duration: "30 min" },
    { id: 6, title: "Your Action Plan", icon: BookOpen, description: "Create your AI-powered workflow", duration: "20 min" }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, tech_comfort, ai_experience, learning_style')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        } else if (data) {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar />
      
      {/* Header Section */}
      <section className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Welcome back!
            </h1>
            <p className="text-xl text-gray-600">
              Ready to continue your AI learning journey?
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Card className="border-0 shadow-lg bg-white/60 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{user?.email}</p>
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

        {/* Profile Summary */}
        {profile && (
          <Card className="mb-8 border-0 shadow-lg bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Your Personalized Learning Path</CardTitle>
              <CardDescription>Based on your preferences from the onboarding quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <Badge variant="secondary">{profile.role || 'Not set'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tech Comfort:</span>
                  <Badge variant="secondary">{profile.tech_comfort || 'Not set'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Experience:</span>
                  <Badge variant="secondary">{profile.ai_experience || 'Not set'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Learning Style:</span>
                  <Badge variant="secondary">{profile.learning_style || 'Not set'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Learning Journey */}
      <section className="container mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Your Learning Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Six focused chapters designed to take you from AI curious to AI confident
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {chapters.map((chapter) => (
            <ChapterCard 
              key={chapter.id} 
              chapter={chapter}
              isLocked={chapter.id > 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
