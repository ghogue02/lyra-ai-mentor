
import { MessageCircle, CheckSquare, PenTool, Eye } from 'lucide-react';

export const getElementIcon = (type: string) => {
  switch (type) {
    case 'lyra_chat':
      return MessageCircle;
    case 'knowledge_check':
      return CheckSquare;
    case 'reflection':
      return PenTool;
    case 'callout_box':
      return Eye;
    default:
      return MessageCircle;
  }
};

export const getElementStyle = (type: string) => {
  switch (type) {
    case 'lyra_chat':
      return 'border border-purple-200 bg-gradient-to-r from-purple-50/50 to-cyan-50/50';
    case 'knowledge_check':
      return 'border border-blue-200 bg-blue-50/30';
    case 'reflection':
      return 'border border-orange-200 bg-orange-50/30';
    case 'callout_box':
      return 'border border-yellow-200 bg-yellow-50/30';
    default:
      return 'border border-gray-200 bg-gray-50/30';
  }
};
