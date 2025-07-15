
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import { getAchievementIconUrl, getRoleMessaging } from '@/utils/supabaseIcons';

interface AchievementBadgeProps {
  type: 'firstChapter' | 'courseComplete' | 'profileComplete';
  title: string;
  description: string;
  earned?: boolean;
  earnedDate?: Date;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  userRole?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  title,
  description,
  earned = false,
  earnedDate,
  className,
  size = 'md',
  userRole
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24'
  };

  const iconSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  // Get role-specific description if available
  const roleMessaging = userRole ? getRoleMessaging(userRole) : null;
  const roleSpecificDescription = roleMessaging && type === 'courseComplete' 
    ? `${description} - ${roleMessaging.successMetric}` 
    : description;

  return (
    <Card className={cn(
      "border-0 shadow-lg bg-white/60 backdrop-blur-sm transition-all duration-300",
      earned 
        ? "shadow-xl transform hover:scale-105 bg-gradient-to-br from-yellow-50 to-orange-50" 
        : "opacity-60",
      className
    )}>
      <CardContent className="p-4 text-center">
        <div className={cn(
          "mx-auto mb-3 rounded-full flex items-center justify-center p-2",
          sizeClasses[size],
          earned 
            ? "bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg" 
            : "bg-gray-200"
        )}>
          <img 
            src={getAchievementIconUrl(type)} 
            alt={`${title} achievement`}
            className={cn(
              "object-contain",
              iconSizeClasses[size],
              !earned && "grayscale opacity-50"
            )}
          />
        </div>
        
        <h3 className={cn(
          "font-semibold mb-1",
          size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
        )}>
          {title}
        </h3>
        
        <p className={cn(
          "text-gray-600 mb-2",
          size === 'sm' ? 'text-xs' : 'text-sm'
        )}>
          {roleSpecificDescription}
        </p>
        
        {earned ? (
          <Badge className="bg-green-100 text-green-700 text-xs">
            {earnedDate ? `Earned ${earnedDate.toLocaleDateString()}` : 'Earned'}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Not Yet Earned
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
