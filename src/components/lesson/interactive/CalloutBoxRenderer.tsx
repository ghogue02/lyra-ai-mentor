
import React from 'react';
import { BrandedButton } from "@/components/ui/BrandedButton";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckSquare } from 'lucide-react';

interface CalloutBoxRendererProps {
  element: {
    title: string;
    content: string;
    configuration: any;
  };
  isElementCompleted: boolean;
  onComplete: () => Promise<void>;
}

export const CalloutBoxRenderer: React.FC<CalloutBoxRendererProps> = ({
  element,
  isElementCompleted,
  onComplete
}) => {
  const config = element.configuration || {};
  const icon = config.icon || '💡';

  return (
    <div className="p-4 border border-yellow-300 bg-yellow-50/50 rounded-md my-6">
      <div className="flex items-start gap-3">
        <span className="text-lg">{icon}</span>
        <div className="flex-1">
          <h4 className="font-medium text-yellow-800 mb-1">{element.title}</h4>
          <p className="text-yellow-700 text-sm leading-relaxed mb-3">{element.content}</p>
          {!isElementCompleted && (
            <BrandedButton
              onClick={onComplete}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Mark as Read
            </BrandedButton>
          )}
          {isElementCompleted && (
            <Badge className="bg-green-100 text-green-700 text-xs">
              <CheckSquare className="w-3 h-3 mr-1" />
              Read
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
