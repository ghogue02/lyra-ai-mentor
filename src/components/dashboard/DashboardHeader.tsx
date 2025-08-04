
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
    <div className="mb-7 flex justify-center">
      {/* Neumorphic container for header - centered and smaller */}
      <div className="max-w-sm w-full bg-white rounded-3xl p-5 shadow-[7px_7px_14px_#d1d5db,-7px_-7px_14px_#ffffff] border border-gray-100/50">
        <h1 className="text-2xl font-bold text-purple-600 text-center">
          Welcome back Greg
        </h1>
      </div>
    </div>
  );
};
