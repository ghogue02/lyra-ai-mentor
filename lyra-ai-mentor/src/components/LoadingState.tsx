
import React from 'react';
import { LyraAvatar } from '@/components/LyraAvatar';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading your learning experience...",
  size = 'md',
  className
}) => {
  const containerSizes = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      containerSizes[size],
      className
    )}>
      <LyraAvatar 
        size={size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'}
        expression="loading"
        withWave={false}
        className="mb-6"
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        </div>
        
        <p className={cn(
          "text-gray-600 max-w-md mx-auto",
          textSizes[size]
        )}>
          {message}
        </p>
      </div>
    </div>
  );
};
