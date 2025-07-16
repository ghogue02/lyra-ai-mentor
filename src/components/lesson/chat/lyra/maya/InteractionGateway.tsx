import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, ChevronRight, Lightbulb } from 'lucide-react';

interface InteractionGatewayProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onComplete?: () => void;
  showEmotionalSupport?: boolean;
  supportMessage?: string;
  stage?: 'reflection' | 'input' | 'practice' | 'comparison';
}

const InteractionGateway: React.FC<InteractionGatewayProps> = ({
  title,
  description,
  children,
  onComplete,
  showEmotionalSupport = false,
  supportMessage = "You're doing great! This is exactly what Maya went through.",
  stage = 'input'
}) => {
  const [showSupport, setShowSupport] = useState(showEmotionalSupport);

  const getStageIcon = () => {
    switch (stage) {
      case 'reflection':
        return <Heart className="w-5 h-5 text-pink-600" />;
      case 'input':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'practice':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'comparison':
        return <ChevronRight className="w-5 h-5 text-green-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'reflection':
        return 'from-pink-50 to-rose-50 border-pink-200';
      case 'input':
        return 'from-blue-50 to-cyan-50 border-blue-200';
      case 'practice':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'comparison':
        return 'from-green-50 to-emerald-50 border-green-200';
      default:
        return 'from-purple-50 to-pink-50 border-purple-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`bg-gradient-to-r ${getStageColor()}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStageIcon()}
                <CardTitle className="text-xl">{title}</CardTitle>
              </div>
              <Badge variant="outline" className="bg-white/80">
                Interactive
              </Badge>
            </div>
            <p className="text-gray-600 mt-2">{description}</p>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emotional Support */}
      <AnimatePresence>
        {showSupport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">
                      {supportMessage}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSupport(false)}
                      className="mt-2 text-purple-600 hover:text-purple-700"
                    >
                      Got it, thanks!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractionGateway;