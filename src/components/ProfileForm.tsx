import React, { useState, useEffect } from 'react';
import { BrandedButton } from "@/components/ui/BrandedButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useBrandedToast } from '@/hooks/use-branded-toast';
import { CheckCircle2, User, Building, Briefcase, MapPin } from 'lucide-react';
import { ReflectionsSection } from './ReflectionsSection';

interface ProfileData {
  first_name: string;
  last_name: string;
  phone_number: string;
  job_title: string;
  organization_name: string;
  organization_type: string;
  organization_size: string;
  years_experience: string;
  location: string;
  how_did_you_hear: string;
  role: string;
  tech_comfort: string;
  ai_experience: string;
  learning_style: string;
  profile_completed: boolean;
}

export const ProfileForm = () => {
  const { user } = useAuth();
  const { showToast } = useBrandedToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    phone_number: '',
    job_title: '',
    organization_name: '',
    organization_type: '',
    organization_size: '',
    years_experience: '',
    location: '',
    how_did_you_hear: '',
    role: '',
    tech_comfort: '',
    ai_experience: '',
    learning_style: '',
    profile_completed: false
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
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
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone_number: data.phone_number || '',
          job_title: data.job_title || '',
          organization_name: data.organization_name || '',
          organization_type: data.organization_type || '',
          organization_size: data.organization_size || '',
          years_experience: data.years_experience || '',
          location: data.location || '',
          how_did_you_hear: data.how_did_you_hear || '',
          role: data.role || '',
          tech_comfort: data.tech_comfort || '',
          ai_experience: data.ai_experience || '',
          learning_style: data.learning_style || '',
          profile_completed: data.profile_completed || false
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Check if all required fields are filled
      const requiredFields = [
        'first_name', 'last_name', 'organization_name', 'organization_type', 
        'job_title', 'location'
      ];
      
      const isProfileComplete = requiredFields.every(field => 
        profile[field as keyof ProfileData] && profile[field as keyof ProfileData].toString().trim() !== ''
      );

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profile,
          profile_completed: isProfileComplete,
          onboarding_step: isProfileComplete ? 2 : 1
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({ 
        ...prev, 
        profile_completed: isProfileComplete 
      }));

      showToast({
        type: "success",
        title: "Profile saved!",
        description: isProfileComplete 
          ? "Your profile is now complete. You can start your first chapter!"
          : "Profile saved. Complete all required fields to proceed."
      });

      // Refresh the parent component
      window.location.reload();
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Error",
        description: error.message
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div className="text-center p-8">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <CardTitle>Personal Information</CardTitle>
            {profile.first_name && profile.last_name && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
          <CardDescription>Your basic contact information</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={profile.first_name}
              onChange={(e) => updateProfile('first_name', e.target.value)}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={profile.last_name}
              onChange={(e) => updateProfile('last_name', e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={profile.phone_number}
              onChange={(e) => updateProfile('phone_number', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => updateProfile('location', e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </CardContent>
      </Card>

      {/* Organization Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-600" />
            <CardTitle>Organization Details</CardTitle>
            {profile.organization_name && profile.organization_type && (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            )}
          </div>
          <CardDescription>Information about your organization</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organization_name">Organization Name *</Label>
            <Input
              id="organization_name"
              value={profile.organization_name}
              onChange={(e) => updateProfile('organization_name', e.target.value)}
              placeholder="Helping Hands Foundation"
            />
          </div>
          <div>
            <Label htmlFor="organization_type">Organization Type *</Label>
            <Select value={profile.organization_type} onValueChange={(value) => updateProfile('organization_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nonprofit">Non-profit</SelectItem>
                <SelectItem value="social-enterprise">Social Enterprise</SelectItem>
                <SelectItem value="government">Government Agency</SelectItem>
                <SelectItem value="foundation">Foundation</SelectItem>
                <SelectItem value="community-org">Community Organization</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="organization_size">Organization Size</Label>
            <Select value={profile.organization_size} onValueChange={(value) => updateProfile('organization_size', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-500">201-500 employees</SelectItem>
                <SelectItem value="500+">500+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="job_title">Your Job Title *</Label>
            <Input
              id="job_title"
              value={profile.job_title}
              onChange={(e) => updateProfile('job_title', e.target.value)}
              placeholder="Program Director"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Background */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <CardTitle>Professional Background</CardTitle>
          </div>
          <CardDescription>Your experience and background</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="years_experience">Years of Experience</Label>
            <Select value={profile.years_experience} onValueChange={(value) => updateProfile('years_experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="2-5">2-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="11-15">11-15 years</SelectItem>
                <SelectItem value="16+">16+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="how_did_you_hear">How did you hear about us?</Label>
            <Select value={profile.how_did_you_hear} onValueChange={(value) => updateProfile('how_did_you_hear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google Search</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="colleague">Colleague/Friend</SelectItem>
                <SelectItem value="conference">Conference/Event</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Learning Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Preferences</CardTitle>
          <CardDescription>From your personalization quiz</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>

      {/* Learning Reflections */}
      <ReflectionsSection />

      <div className="flex justify-end">
        <BrandedButton 
          onClick={handleSave} 
          disabled={saving}
          variant="gradient"
          loading={saving}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </BrandedButton>
      </div>
    </div>
  );
};
