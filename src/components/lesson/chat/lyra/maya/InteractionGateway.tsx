import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
        return 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200/30 hover:border-pink-300/40';
      case 'input':
        return 'bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20 hover:border-primary/30';
      case 'practice':
        return 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200/30 hover:border-emerald-300/40';
      case 'comparison':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/30 hover:border-blue-300/40';
      default:
        return 'bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20 hover:border-primary/30';
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
        <Card className={`${getStageColor()} shadow-lg hover:shadow-xl transition-all duration-300 border-2 rounded-2xl overflow-hidden`}>
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/30 rounded-xl backdrop-blur-sm shadow-sm">
                {getStageIcon()}
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold text-foreground tracking-tight mb-2">
                  {title}
                </CardTitle>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
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
            <Card className="bg-gradient-to-br from-brand-purple-light to-brand-cyan-light border-primary/20 shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground/90 font-medium leading-relaxed">
                      {supportMessage}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSupport(false)}
                      className="mt-4 text-primary hover:text-primary/80 hover:bg-primary/10 font-medium rounded-xl transition-all duration-200"
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