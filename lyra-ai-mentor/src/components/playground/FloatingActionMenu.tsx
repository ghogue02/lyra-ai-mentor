import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  X, 
  MessageCircle, 
  Mic, 
  Camera, 
  FileText,
  Sparkles,
  Brain
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useResponsive } from '@/hooks/useResponsive';

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

interface FloatingActionMenuProps {
  actions?: ActionItem[];
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}

const defaultActions: ActionItem[] = [
  {
    id: 'chat',
    label: 'Chat with Lyra',
    icon: <MessageCircle className="w-5 h-5" />,
    color: 'from-purple-600 to-cyan-500',
    onClick: () => console.log('Open chat')
  },
  {
    id: 'voice',
    label: 'Voice Input',
    icon: <Mic className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500',
    onClick: () => console.log('Start voice input')
  },
  {
    id: 'create',
    label: 'Create Content',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-500',
    onClick: () => console.log('Create content')
  },
  {
    id: 'toolkit',
    label: 'My Toolkit',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    onClick: () => console.log('Open toolkit')
  }
];

export const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({
  actions = defaultActions,
  position = 'bottom-right',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useResponsive();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2'
  };

  const menuDirection = position === 'bottom-left' ? 'right' : 'left';

  return (
    <div className={cn(
      "fixed z-50",
      positionClasses[position],
      className
    )}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Action buttons */}
            <div className="absolute bottom-16 mb-3">
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5,
                    y: 20 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: 0 
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.5,
                    y: 20 
                  }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                  className={cn(
                    "flex items-center gap-3 mb-3",
                    menuDirection === 'left' ? 'flex-row-reverse' : ''
                  )}
                >
                  <motion.span
                    initial={{ opacity: 0, x: menuDirection === 'left' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    className={cn(
                      "px-3 py-1.5 bg-background/95 backdrop-blur-md rounded-full shadow-lg text-sm font-medium whitespace-nowrap",
                      isMobile ? "max-w-[150px] truncate" : ""
                    )}
                  >
                    {action.label}
                  </motion.span>
                  
                  <Button
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-12 h-12 rounded-full shadow-lg hover:shadow-xl transition-all",
                      `bg-gradient-to-r ${action.color}`
                    )}
                    size="icon"
                  >
                    {action.icon}
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.div
        animate={{ rotate: isOpen ? 45 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all",
            isOpen 
              ? "bg-gray-600 hover:bg-gray-700" 
              : "bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
          )}
          size="icon"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};