
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  firstName?: string;
  userName: string;
  onboardingComplete: boolean;
  onSignOut: () => Promise<void>;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  firstName,
  userName,
  onboardingComplete,
  onSignOut
}) => {
  return (
    <div className="flex justify-between items-start mb-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 text-purple-600">
          Welcome back{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-xl text-gray-600">
          {onboardingComplete ? "Continue your AI learning journey" : "Let's get you started on your AI learning journey"}
        </p>
      </div>
      
      {/* Sign Out Button */}
      <Button
        variant="outline"
        onClick={onSignOut}
        className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </div>
  );
};
