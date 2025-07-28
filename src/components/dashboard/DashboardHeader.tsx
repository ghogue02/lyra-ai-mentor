
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  firstName?: string;
  userName: string;
  onboardingComplete: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  firstName,
  userName,
  onboardingComplete
}) => {
  return (
    <div className="mb-8">
      {/* Neumorphic container for header */}
      <div className="bg-white rounded-3xl p-8 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-100/50">
        <h1 className="text-4xl font-bold mb-4 text-purple-600">
          Welcome back{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-xl text-gray-600">
          {onboardingComplete ? "Continue your AI learning journey" : "Let's get you started on your AI learning journey"}
        </p>
      </div>
    </div>
  );
};
