import React from 'react';
import { MinimalHeader } from '@/components/MinimalHeader';
import { ProfileTab } from '@/components/dashboard/ProfileTab';

export const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <MinimalHeader />
      
      <div className="container mx-auto px-4 pt-32 pb-8">
        <ProfileTab />
      </div>
    </div>
  );
};

export default Profile;