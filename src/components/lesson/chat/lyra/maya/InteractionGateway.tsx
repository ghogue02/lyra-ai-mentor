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
        return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'practice':
        return <Lightbulb className="w-5 h-5 text-emerald-600" />;
      case 'comparison':
        return <ChevronRight className="w-5 h-5 text-blue-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-primary" />;
    }
  };

  const getStageColor = () => {
    switch (stage) {
      case 'reflection':
        return 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200/50';
      case 'input':
        return 'bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20';
      case 'practice':
        return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/50';
      case 'comparison':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/50';
      default:
        return 'bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="animate-scale-in"
      >
        <Card className={`${getStageColor()} shadow-lg hover:shadow-xl transition-all duration-300 border-2 rounded-xl`}>
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  {getStageIcon()}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                  {title}
                </CardTitle>
              </div>
              <Badge 
                variant="outline" 
                className="bg-white/90 text-primary border-primary/30 font-medium px-3 py-1 shadow-sm"
              >
                Interactive
              </Badge>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed font-medium">
              {description}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
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
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mt-8"
          >
            <Card className="bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20 shadow-md rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium leading-relaxed">
                      {supportMessage}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSupport(false)}
                      className="mt-3 text-primary hover:text-primary/80 hover:bg-primary/5 font-medium"
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