
import React from 'react';
import { ProfileForm } from '@/components/ProfileForm';

export const ProfileTab: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 text-purple-600">
          Profile & Personalization
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Manage your personal information and learning preferences
        </p>
      </div>
      
      <ProfileForm />
    </div>
  );
};
