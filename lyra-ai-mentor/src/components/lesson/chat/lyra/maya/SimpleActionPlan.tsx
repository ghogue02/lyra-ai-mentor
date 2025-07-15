import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Edit3, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SimpleActionPlanProps {
  frameworkType: string;
  onStartWriting: () => void;
  className?: string;
}

export const SimpleActionPlan: React.FC<SimpleActionPlanProps> = ({
  frameworkType,
  onStartWriting,
  className
}) => {
  const getStepsForFramework = (type: string) => {
    switch (type) {
      case 'teaching_moment':
        return [
          {
            icon: <Edit3 className="w-5 h-5" />,
            title: "Share your example",
            description: "Start with a specific story or situation your reader can relate to",
            time: "2-3 minutes"
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Explain why it matters",
            description: "Connect the dots and show the bigger picture or lesson",
            time: "3-4 minutes"
          },
          {
            icon: <Send className="w-5 h-5" />,
            title: "Give clear next steps",
            description: "Tell them exactly what to do with this information",
            time: "2-3 minutes"
          }
        ];
      case 'story_arc':
        return [
          {
            icon: <Edit3 className="w-5 h-5" />,
            title: "Set up the situation",
            description: "Describe the starting point or current state",
            time: "2-3 minutes"
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Show the solution",
            description: "Explain how the challenge was addressed",
            time: "3-4 minutes"
          },
          {
            icon: <Send className="w-5 h-5" />,
            title: "Share the success",
            description: "Highlight the positive outcome and next steps",
            time: "2-3 minutes"
          }
        ];
      default:
        return [
          {
            icon: <Edit3 className="w-5 h-5" />,
            title: "Open with connection",
            description: "Start with something your reader cares about",
            time: "2-3 minutes"
          },
          {
            icon: <CheckCircle className="w-5 h-5" />,
            title: "Share your message",
            description: "Deliver your main point clearly and directly",
            time: "3-4 minutes"
          },
          {
            icon: <Send className="w-5 h-5" />,
            title: "Close with action",
            description: "End with one specific thing for them to do",
            time: "2-3 minutes"
          }
        ];
    }
  };

  const steps = getStepsForFramework(frameworkType);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ready to Write Your Email?
        </h3>
        <p className="text-gray-600 text-sm">
          Follow these 3 simple steps. Total time: about 10 minutes.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            {/* Step Number & Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-sm mb-2">
                {index + 1}
              </div>
              <div className="text-purple-600">
                {step.icon}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {step.time}
                </div>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-4"
      >
        <Button
          onClick={onStartWriting}
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
        >
          Start Writing Now
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          You've got this! The structure will guide you.
        </p>
      </motion.div>
    </div>
  );
};