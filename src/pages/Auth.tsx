import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LyraAvatar } from '@/components/LyraAvatar';
import { usePersonalizationData } from '@/hooks/usePersonalizationData';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFromOnboarding, setIsFromOnboarding] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    savePersonalizationData
  } = usePersonalizationData();

  useEffect(() => {
    // Check if user is coming from personalization flow
    const pendingPersonalization = localStorage.getItem('pendingPersonalization');
    if (pendingPersonalization) {
      setIsFromOnboarding(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const {
          data,
          error
        } = await supabase.auth.signUp({
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

  const getTitle = () => {
    if (isLogin) {
      return 'Welcome Back!';
    }
    if (isFromOnboarding) {
      return "Almost There! Create Your Account";
    }
    return 'Create Your Account';
  };

  const getDescription = () => {
    if (isLogin) {
      return 'Sign in to continue your AI learning journey';
    }
    if (isFromOnboarding) {
      return "Save your personalized AI learning path and start your journey";
    }
    return 'Join thousands learning AI for social good';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <LyraAvatar />
          </div>
          <CardTitle className="text-2xl font-bold">
            {getTitle()}
          </CardTitle>
          <CardDescription className="text-base">
            {getDescription()}
          </CardDescription>
          {isFromOnboarding && !isLogin && (
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg">
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="your@email.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
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
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account & Start Learning'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm text-gray-600"
            >
              {isLogin ? "Need an account? Sign up here" : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
