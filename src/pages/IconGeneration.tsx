
import React from 'react';
import { Navbar } from '@/components/Navbar';
import { IconGenerator } from '@/components/IconGenerator';

export const IconGeneration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-cyan-50/30">
      <Navbar showAuthButtons={false} />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-purple-600">
            Icon Generation for Phase 2
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate all the additional icons needed for the enhanced icon system implementation.
          </p>
        </div>
        
        <IconGenerator />
      </div>
    </div>
  );
};

export default IconGeneration;
