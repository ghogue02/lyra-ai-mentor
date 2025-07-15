import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MayaFramework } from '@/types/dynamicPace';

interface SimplifiedFrameworkDisplayProps {
  framework: MayaFramework;
  className?: string;
}

export const SimplifiedFrameworkDisplay: React.FC<SimplifiedFrameworkDisplayProps> = ({
  framework,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Framework Header */}
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {framework.name}
        </h3>
        <p className="text-sm text-gray-600">
          {framework.description}
        </p>
      </div>

      {/* Simplified Steps */}
      <div className="space-y-3">
        {framework.elements.map((element, index) => (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            {/* Step Number */}
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-gray-800">{element.name}</h4>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600">{element.description}</span>
              </div>
              
              {/* Example */}
              <div className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded italic">
                {element.npoExample}
              </div>
            </div>

            {/* Arrow for non-last items */}
            {index < framework.elements.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Usage Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
      >
        <div className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-purple-800">
            <strong>How to use:</strong> Follow these {framework.elements.length} steps in order. Each step builds on the previous one to create a clear, compelling message.
          </p>
        </div>
      </motion.div>
    </div>
  );
};