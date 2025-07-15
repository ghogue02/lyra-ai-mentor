
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';
import { getUIStateIconUrl } from '@/utils/supabaseIcons';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Oops! Something went wrong",
  message = "Don't worry, it happens to the best of us. Let's try again!",
  onRetry,
  size = 'md',
  className
}) => {
  const containerSizes = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24'
  };

  const iconSizes = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
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
      <div className={cn("mb-6", iconSizes[size])}>
        <img 
          src={getUIStateIconUrl('errorFriendly')} 
          alt="Error state"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="space-y-4 max-w-md mx-auto">
        <h3 className={cn(
          "font-semibold text-gray-800",
          titleSizes[size]
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-gray-600",
          textSizes[size]
        )}>
          {message}
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
