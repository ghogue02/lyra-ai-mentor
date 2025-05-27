
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, MessageCircle, ArrowDown } from 'lucide-react';

interface ContentBlockerProps {
  chatEngagement: {
    exchangeCount: number;
    hasReachedMinimum: boolean;
  };
  blockedItemsCount: number;
}

export const ContentBlocker: React.FC<ContentBlockerProps> = ({
  chatEngagement,
  blockedItemsCount
}) => {
  const remaining = Math.max(0, 3 - chatEngagement.exchangeCount);

  return (
    <Card className="border border-purple-200 bg-gradient-to-r from-purple-50/50 to-cyan-50/50 my-8">
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <Lock className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-purple-800">
              Content Locked
            </h3>
            <p className="text-purple-700 max-w-md">
              Complete your chat session with Lyra above to unlock the rest of this lesson.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <MessageCircle className="w-3 h-3 mr-1" />
              {chatEngagement.exchangeCount}/3 exchanges
            </Badge>
            {remaining > 0 && (
              <Badge variant="outline" className="border-purple-300 text-purple-600">
                {remaining} more needed
              </Badge>
            )}
          </div>

          <div className="text-sm text-purple-600 flex items-center gap-1">
            <ArrowDown className="w-4 h-4" />
            {blockedItemsCount} section{blockedItemsCount !== 1 ? 's' : ''} waiting to unlock
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
