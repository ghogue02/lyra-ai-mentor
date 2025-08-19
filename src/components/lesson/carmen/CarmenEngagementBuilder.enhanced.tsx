/**
 * EXAMPLE: Enhanced CarmenEngagementBuilder with Error Boundary Integration
 * 
 * This file demonstrates how to integrate error boundaries into Carmen components.
 * This would replace the existing CarmenEngagementBuilder.tsx with enhanced error handling.
 */

import React, { useState, useEffect } from 'react';
import { CarmenComponentWrapper } from '@/components/wrappers/CarmenComponentWrapper';
import { ErrorBoundaryProvider, useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';
import { InteractionPatternWrapper } from '@/components/wrappers/InteractionPatternWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import all the original components and types
// (These would be the same as in the original file)
type Phase = 'intro' | 'narrative' | 'workshop';

const CarmenEngagementBuilderInternal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { handleCarmenComponentError, handleNetworkError } = useErrorHandler();
  
  const [currentPhase, setCurrentPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedStrategy, setGeneratedStrategy] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Enhanced error handling for the generation function
  const generateEngagementStrategy = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'carmen',
          contentType: 'personalized-engagement-strategy',
          // ... other parameters
        }
      });

      if (error) throw error;

      setGeneratedStrategy(data.content);
      
      toast({
        title: "Engagement Strategy Created!",
        description: "Carmen crafted your personalized team engagement plan.",
      });
    } catch (error) {
      console.error('Error generating strategy:', error);
      
      // Use our enhanced error handling
      const networkError = error instanceof Error && 
        (error.message.includes('fetch') || error.message.includes('network'));
      
      if (networkError) {
        await handleNetworkError(error as Error);
      } else {
        await handleCarmenComponentError(
          error as Error,
          'engagement-builder',
          7, // Chapter number
          true // Enable recovery
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    try {
      toast({
        title: "Engagement Builder Mastery Complete!",
        description: "You've mastered Carmen's personalized engagement framework!",
      });
      navigate('/chapter/7');
    } catch (error) {
      handleCarmenComponentError(
        error as Error,
        'engagement-builder',
        7
      );
    }
  };

  // Phase rendering methods would be the same as original, but with error handling
  const renderIntroPhase = () => {
    try {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-6"
        >
          {/* Original intro content with error-safe operations */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Carmen's Engagement Builder
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              Create personalized engagement strategies using AI insights and human empathy
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button 
                onClick={() => navigate('/chapter/7')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Chapter 7
              </button>
              
              <button 
                onClick={() => setCurrentPhase('narrative')}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Begin Engagement Journey
              </button>
            </div>
          </div>
        </motion.div>
      );
    } catch (error) {
      // If rendering fails, this will be caught by the error boundary
      throw error;
    }
  };

  const renderWorkshopPhase = () => {
    try {
      return (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6"
        >
          {/* Workshop content with interaction pattern wrapper */}
          <InteractionPatternWrapper
            patternType="engagement-tree"
            enableFallbackMode={true}
            maxRetries={3}
          >
            <div className="max-w-6xl mx-auto pt-20">
              {/* Original workshop content */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Engagement Workshop</h2>
                <button 
                  onClick={generateEngagementStrategy}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? 'Creating Strategy...' : 'Generate Strategy'}
                </button>
              </div>
              
              {generatedStrategy && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-4">Your Engagement Strategy</h3>
                  <div className="prose max-w-none">
                    {generatedStrategy}
                  </div>
                </div>
              )}
              
              {generatedStrategy && (
                <div className="text-center mt-8">
                  <button 
                    onClick={handleComplete}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Complete Engagement Builder Workshop
                  </button>
                </div>
              )}
            </div>
          </InteractionPatternWrapper>
        </motion.div>
      );
    } catch (error) {
      throw error;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {currentPhase === 'intro' && renderIntroPhase()}
      {currentPhase === 'narrative' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 p-6"
        >
          <div className="max-w-4xl mx-auto pt-20">
            {/* Narrative content */}
            <h2 className="text-2xl font-bold mb-4">Carmen's Story</h2>
            <button 
              onClick={() => setCurrentPhase('workshop')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Continue to Workshop
            </button>
          </div>
        </motion.div>
      )}
      {currentPhase === 'workshop' && renderWorkshopPhase()}
    </AnimatePresence>
  );
};

// Enhanced CarmenEngagementBuilder with comprehensive error handling
export const EnhancedCarmenEngagementBuilder: React.FC = () => {
  return (
    <ErrorBoundaryProvider
      maxAutoRecoveryAttempts={3}
      enableProgressiveRecovery={true}
      notifyUser={true}
    >
      <CarmenComponentWrapper
        componentType="engagement-builder"
        chapterNumber={7}
        enableChapterRecovery={true}
        maxRetries={3}
      >
        <CarmenEngagementBuilderInternal />
      </CarmenComponentWrapper>
    </ErrorBoundaryProvider>
  );
};

export default EnhancedCarmenEngagementBuilder;