
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
    <div className="mb-8 flex justify-center">
      {/* Neumorphic container for header - centered and smaller */}
      <div className="max-w-md w-full bg-white rounded-3xl p-6 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] border border-gray-100/50">
        <h1 className="text-2xl font-bold text-purple-600 text-center">
          Welcome back Greg
        </h1>
      </div>
    </div>
  );
};
