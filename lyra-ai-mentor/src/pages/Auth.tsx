import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LyraAvatar } from '@/components/LyraAvatar';
import { usePersonalizationData } from '@/hooks/usePersonalizationData';

export const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState('signup');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { savePersonalizationData } = usePersonalizationData();

  useEffect(() => {
    // Check if user is coming from personalization flow
    const pendingPersonalization = localStorage.getItem('pendingPersonalization');
    if (pendingPersonalization) {
      setIsFromOnboarding(true);
      // Keep signup as default for onboarding users
      setActiveTab('signup');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });
        if (error) throw error;

        // Handle pending personalization data after successful signup
        const pendingPersonalization = localStorage.getItem('pendingPersonalization');
        if (pendingPersonalization && data.user) {
          try {
            const personalizationData = JSON.parse(pendingPersonalization);
            await savePersonalizationData(personalizationData, data.user.id);
            localStorage.removeItem('pendingPersonalization');
          } catch (err) {
            console.error('Error saving personalization data:', err);
          }
        }
        
        toast({
          title: "Account created!",
          description: "You've been signed up and logged in successfully."
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LyraAvatar />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isFromOnboarding ? "Almost There!" : "Welcome to Your AI Journey"}
          </CardTitle>
          <CardDescription className="text-base">
            {isFromOnboarding 
              ? "Save your personalized AI learning path and start your journey"
              : "Join thousands learning AI for social good"
            }
          </CardDescription>
          {isFromOnboarding && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Create your account to save your personalized learning preferences
              </p>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signup">Create Account</TabsTrigger>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="your@email.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••" 
                    minLength={6} 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-lg font-semibold py-3" 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account & Start Learning'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="your@email.com" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input 
                    id="signin-password" 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    placeholder="••••••••" 
                    minLength={6} 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-lg font-semibold py-3" 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
