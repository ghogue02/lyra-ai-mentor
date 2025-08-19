/**
 * EXAMPLE: Enhanced ConversationalFlow with Error Boundary Integration
 * 
 * This file demonstrates how to integrate error boundaries into interaction patterns.
 * Copy this pattern to enhance existing interaction pattern components.
 */

import React, { useState, useCallback } from 'react';
import { InteractionPatternWrapper } from '@/components/wrappers/InteractionPatternWrapper';
import { useErrorHandler } from '@/components/error-boundaries/ErrorBoundaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Original types (would be imported from the actual ConversationalFlow)
interface ConversationQuestion {
  id: string;
  text: string;
  options: ConversationOption[];
}

interface ConversationOption {
  id: string;
  text: string;
  nextQuestionId?: string;
}

interface ConversationalFlowProps {
  questions: ConversationQuestion[];
  onComplete: (responses: Record<string, string>) => void;
  onError?: (error: Error) => void;
}

// Internal component that can throw errors
const ConversationalFlowInternal: React.FC<ConversationalFlowProps> = ({
  questions,
  onComplete,
  onError
}) => {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(questions[0]?.id);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { handleInteractionPatternError } = useErrorHandler();

  const handleOptionSelect = useCallback(async (questionId: string, optionId: string, option: ConversationOption) => {
    try {
      // Simulate potential error scenarios
      if (Math.random() < 0.1) { // 10% chance of error for demo
        throw new Error('Simulated conversation flow error');
      }

      const newResponses = {
        ...responses,
        [questionId]: optionId
      };
      setResponses(newResponses);

      if (option.nextQuestionId) {
        setCurrentQuestionId(option.nextQuestionId);
      } else {
        onComplete(newResponses);
      }
    } catch (error) {
      // Handle error with our error handling system
      const handled = await handleInteractionPatternError(
        error as Error,
        'conversational',
        true // enable recovery
      );

      if (!handled && onError) {
        onError(error as Error);
      }
    }
  }, [responses, onComplete, onError, handleInteractionPatternError]);

  const currentQuestion = questions.find(q => q.id === currentQuestionId);

  if (!currentQuestion) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-orange-900 mb-2">Question Not Found</h3>
          <p className="text-orange-800">The conversation flow encountered an issue finding the next question.</p>
          <Button 
            onClick={() => setCurrentQuestionId(questions[0]?.id)}
            className="mt-4"
          >
            Restart Conversation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currentQuestion.options.map((option) => (
          <Button
            key={option.id}
            onClick={() => handleOptionSelect(currentQuestion.id, option.id, option)}
            variant="outline"
            className="w-full justify-start h-auto py-3 px-4 text-left"
          >
            {option.text}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

// Enhanced ConversationalFlow with error boundary wrapper
export const EnhancedConversationalFlow: React.FC<ConversationalFlowProps> = (props) => {
  return (
    <InteractionPatternWrapper
      patternType="conversational"
      enableFallbackMode={true}
      maxRetries={3}
    >
      <ConversationalFlowInternal {...props} />
    </InteractionPatternWrapper>
  );
};

export default EnhancedConversationalFlow;