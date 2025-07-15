// Helper functions for Maya AI integration
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, Mail, Heart, Sparkles, Loader2, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mayaAIEmailService, type MayaEmailPrompt } from '@/services/mayaAIEmailService';

// Live AI email generation
export const generateAIEmail = React.useCallback(async (
  draft: any, 
  setIsGenerating: any, 
  setLyraExpression: any, 
  setAiResponse: any, 
  setEmailDraft: any, 
  setComparisonData: any, 
  generateEmail: any
) => {
  if (!draft.purpose || !draft.audience || !draft.tone) return;
  
  setIsGenerating(true);
  setLyraExpression('thinking');
  
  try {
    const prompt: MayaEmailPrompt = {
      purpose: draft.purpose,
      audience: draft.audience,
      audienceContext: draft.selectedConsiderations.join(', '),
      situationDetails: `This email is for ${draft.audience.toLowerCase()} who values ${draft.selectedConsiderations.join(' and ')}.`,
      tone: draft.tone,
      aiPrompt: draft.aiPrompt || draft.purpose
    };
    
    const response = await mayaAIEmailService.generateEmailWithPACE(prompt);
    
    setAiResponse(response);
    setEmailDraft((prev: any) => ({ ...prev, generated: response.email }));
    setLyraExpression('celebrating');
    
    // Generate comparison if available
    if (draft.purpose) {
      const comparison = await mayaAIEmailService.demonstratePromptComparison(
        `Help me write an email about ${draft.purpose.toLowerCase()}`,
        prompt
      );
      setComparisonData(comparison);
    }
    
  } catch (error) {
    console.error('AI generation failed:', error);
    setEmailDraft((prev: any) => ({ ...prev, generated: generateEmail(draft) }));
    setLyraExpression('helping');
  } finally {
    setIsGenerating(false);
  }
}, []);

// Summary panel component
export const PACESummaryPanel = ({ 
  showSummaryPanel, 
  setShowSummaryPanel, 
  emailDraft, 
  isGenerating, 
  generateAIEmail 
}: any) => {
  if (!showSummaryPanel) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-4 left-4 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg border-2 border-purple-200 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-purple-800">Your PACE Framework</h3>
          <button 
            onClick={() => setShowSummaryPanel(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className={cn(
            "p-2 rounded", 
            emailDraft.purpose ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Target className="w-3 h-3" />
              <span className="font-medium">PURPOSE:</span>
            </div>
            <div className="ml-5">{emailDraft.purpose || 'Pending...'}</div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            emailDraft.audience ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3" />
              <span className="font-medium">AUDIENCE:</span>
            </div>
            <div className="ml-5">{emailDraft.audience || 'Pending...'}</div>
            {emailDraft.selectedConsiderations?.length > 0 && (
              <div className="ml-5 text-xs opacity-75">
                Considers: {emailDraft.selectedConsiderations.join(', ')}
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-2 rounded",
            emailDraft.tone ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Heart className="w-3 h-3" />
              <span className="font-medium">CONNECTION:</span>
            </div>
            <div className="ml-5">{emailDraft.tone || 'Pending...'}</div>
          </div>
          
          <div className={cn(
            "p-2 rounded",
            emailDraft.generated ? "bg-green-50 text-green-800" : "bg-gray-50 text-gray-500"
          )}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              <span className="font-medium">EXECUTE:</span>
            </div>
            <div className="ml-5">
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating...
                </div>
              ) : emailDraft.generated ? (
                "Complete! ✨"
              ) : (
                "Pending..."
              )}
            </div>
          </div>
        </div>
        
        {emailDraft.purpose && emailDraft.audience && emailDraft.tone && !emailDraft.generated && (
          <Button
            size="sm"
            onClick={() => generateAIEmail(emailDraft)}
            disabled={isGenerating}
            className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <><Loader2 className="w-3 h-3 animate-spin mr-2" />Generating...</>
            ) : (
              <>Generate Email <Zap className="w-3 h-3 ml-2" /></>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
};