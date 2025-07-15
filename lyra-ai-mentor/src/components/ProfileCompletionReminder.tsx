
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowRight, Star, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionReminderProps {
  userProfile: {
    profile_completed: boolean;
    first_name?: string;
    role?: string;
    tech_comfort?: string;
    ai_experience?: string;
    learning_style?: string;
    organization_name?: string;
    organization_type?: string;
  } | null;
  compact?: boolean;
}

export const ProfileCompletionReminder: React.FC<ProfileCompletionReminderProps> = ({ 
  userProfile, 
  compact = false 
}) => {
  const navigate = useNavigate();

  // Don't show if profile is completed or if no profile data
  if (!userProfile || userProfile.profile_completed) {
    return null;
  }

  const hasBasicInfo = userProfile.role || userProfile.tech_comfort || userProfile.ai_experience || userProfile.learning_style;
  const hasOrgInfo = userProfile.organization_name || userProfile.organization_type;

  const handleCompleteProfile = () => {
    navigate('/dashboard?tab=profile');
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-200 text-xs">
        {!hasOrgInfo ? (
          <Building2 className="w-3 h-3 text-purple-600" />
        ) : (
          <Star className="w-3 h-3 text-purple-600" />
        )}
        <span className="text-purple-800">
          {!hasOrgInfo 
            ? "Add your organization details for personalized AI guidance"
            : "Complete your profile for even more personalized insights"
          }
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCompleteProfile}
          className="h-6 px-2 text-xs text-purple-600 hover:text-purple-800"
        >
          Complete <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-cyan-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            {!hasOrgInfo ? (
              <Building2 className="w-4 h-4 text-purple-600" />
            ) : (
              <User className="w-4 h-4 text-purple-600" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-purple-900 mb-1">
              {!hasOrgInfo 
                ? "Help Lyra Know Your Organization" 
                : hasBasicInfo 
                  ? "Unlock Advanced Personalization" 
                  : "Get Personalized AI Guidance"
              }
            </h4>
            <p className="text-sm text-purple-700 mb-3">
              {!hasOrgInfo 
                ? "Tell Lyra about your organization so she can provide AI examples and guidance specifically tailored to your nonprofit's mission and size."
                : hasBasicInfo 
                  ? "Complete your profile to get even more tailored AI responses based on your organization and goals."
                  : "Complete your profile so Lyra can provide guidance specifically tailored to your role, experience level, and learning style."
              }
            </p>
            <Button 
              onClick={handleCompleteProfile}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              {!hasOrgInfo ? "Add Organization Info" : "Complete Profile"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
