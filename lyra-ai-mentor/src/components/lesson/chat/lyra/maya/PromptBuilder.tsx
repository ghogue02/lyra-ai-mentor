import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Copy, Check, Sparkles, HelpCircle, ChevronRight, Target, Users, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type MayaJourneyState } from './types';
import { type ChoicePath, type DynamicAudience } from '@/types/dynamicPace';

interface PromptBuilderProps {
  mayaJourney: MayaJourneyState;
  dynamicPath: ChoicePath | null;
  currentStageIndex: number;
  className?: string;
}

interface PromptSection {
  id: string;
  label: string;
  content: string;
  helpText: string;
  icon: React.ReactNode;
  isActive: boolean;
  stageIndex: number;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  mayaJourney,
  dynamicPath,
  currentStageIndex,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Helper function to add proper articles (a/an)
  const addArticle = (text: string): string => {
    if (!text) return text;
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const firstLetter = text.charAt(0).toLowerCase();
    const article = vowels.includes(firstLetter) ? 'an' : 'a';
    return `${article} ${text}`;
  };

  // Build PACE sections based on user progress
  const paceData = useMemo(() => {
    const pace = {
      purpose: '',
      audience: '',
      content: '',
      execute: ''
    };

    // P - Purpose
    if (mayaJourney.purpose || dynamicPath?.purpose) {
      const purposeMap: Record<string, string> = {
        'inform_educate': 'share important news',
        'persuade_convince': 'invite someone to support',
        'build_relationships': 'build a stronger connection',
        'solve_problems': 'help someone who\'s worried',
        'request_support': 'ask for help you need',
        'inspire_motivate': 'share exciting progress',
        'establish_authority': 'establish expertise',
        'create_engagement': 'create engagement'
      };
      pace.purpose = `I need to write an email to ${purposeMap[dynamicPath?.purpose || mayaJourney.purpose] || mayaJourney.purpose}.`;
    }

    // A - Audience (combine audience + motivations)
    if (mayaJourney.selectedAudience || dynamicPath?.audience) {
      const audience = dynamicPath?.audience || mayaJourney.selectedAudience;
      const audienceLabel = typeof audience === 'string' ? audience : audience.label;
      const audienceDescription = typeof audience === 'object' ? audience.description : '';
      
      // Convert Maya-specific labels to generic role descriptions
      const getGenericRole = (label: string): string => {
        if (label.includes('Thoughtful Strategist')) return 'thoughtful strategist';
        if (label.includes('Under Pressure')) return 'person under time pressure';
        if (label.includes('Visionary')) return 'creative visionary';
        if (label.includes('Inspirational Leader')) return 'inspirational leader';
        if (label.includes('Change Maker')) return 'change maker';
        if (label.includes('Building Bridges')) return 'relationship builder';
        if (label.includes('Honoring Others')) return 'person who values recognition';
        if (label.includes('Crisis Mode')) return 'person in crisis';
        if (label.includes('Reaching Higher')) return 'ambitious achiever';
        return label.toLowerCase();
      };

      const genericRole = getGenericRole(audienceLabel || '');
      let audienceText = `My audience is ${addArticle(genericRole)}`;
      
      if (audienceDescription) {
        // Clean up description to remove Maya-specific references
        const cleanDescription = audienceDescription
          .replace(/Like Maya/g, 'Someone who is')
          .replace(/Maya/g, 'they')
          .toLowerCase();
        audienceText += ` - ${cleanDescription}`;
      }

      // Add motivations if available
      if (dynamicPath?.audience && typeof dynamicPath.audience === 'object') {
        const { psychographics } = dynamicPath.audience;
        if (psychographics?.motivations?.length > 0) {
          audienceText += `. They care most about ${psychographics.motivations.join(', ')}.`;
        }
      }

      pace.audience = audienceText;
    }

    // C - Content
    if (dynamicPath?.content?.framework?.mayaFramework) {
      const framework = dynamicPath.content.framework.mayaFramework;
      pace.content = `Use the ${framework.name} (${framework.elements.map(e => e.name).join(' → ')}) to structure your email.`;
    }

    // E - Execute
    if (currentStageIndex >= 4) {
      pace.execute = 'Please keep it concise, personal, and action-oriented with a clear next step.';
    }

    return pace;
  }, [mayaJourney, dynamicPath, currentStageIndex, addArticle]);

  // Define PACE sections with proper structure
  const paceSections = useMemo<PromptSection[]>(() => {
    const sections: PromptSection[] = [];

    if (paceData.purpose) {
      sections.push({
        id: 'pace-purpose',
        label: 'P - Purpose',
        content: paceData.purpose,
        helpText: 'Purpose: What specific outcome do you want to achieve with this email?',
        icon: <Target className="w-4 h-4" />,
        isActive: currentStageIndex >= 1,
        stageIndex: 1
      });
    }

    if (paceData.audience) {
      sections.push({
        id: 'pace-audience',
        label: 'A - Audience',
        content: paceData.audience,
        helpText: 'Audience: Who are you writing to and what motivates them?',
        icon: <Users className="w-4 h-4" />,
        isActive: currentStageIndex >= 2,
        stageIndex: 2
      });
    }

    if (paceData.content) {
      sections.push({
        id: 'pace-content',
        label: 'C - Content',
        content: paceData.content,
        helpText: 'Content: How will you structure your message for maximum impact?',
        icon: <FileText className="w-4 h-4" />,
        isActive: currentStageIndex >= 4,
        stageIndex: 4
      });
    }

    if (paceData.execute) {
      sections.push({
        id: 'pace-execute',
        label: 'E - Execute',
        content: paceData.execute,
        helpText: 'Execute: How will you deliver your message effectively?',
        icon: <Zap className="w-4 h-4" />,
        isActive: currentStageIndex >= 4,
        stageIndex: 4
      });
    }

    return sections;
  }, [paceData, currentStageIndex]);

  // Build complete prompt
  const completePrompt = useMemo(() => {
    return paceSections
      .filter(section => section.isActive)
      .map(section => section.content)
      .join(' ');
  }, [paceSections]);

  const handleCopy = async (text: string, sectionId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId || 'complete');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (paceSections.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn("w-full", className)}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 shadow-lg">
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Your AI Prompt Builder
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p className="text-sm">
                        Watch how your PACE framework builds a powerful AI prompt: 
                        <strong>P</strong>urpose → <strong>A</strong>udience → <strong>C</strong>ontent → <strong>E</strong>xecute. 
                        Each step adds precise instructions for personalized emails.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600"
              >
                {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isExpanded ? 'Hide' : 'Show'}
              </Button>
            </div>

            {/* Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  {/* PACE sections */}
                  <div className="space-y-2">
                    {paceSections.map((section) => (
                      <motion.div
                        key={section.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: section.isActive ? 1 : 0.4,
                          x: 0
                        }}
                        transition={{ delay: section.stageIndex * 0.1 }}
                        onMouseEnter={() => setHoveredSection(section.id)}
                        onMouseLeave={() => setHoveredSection(null)}
                        className={cn(
                          "relative p-3 rounded-lg transition-all",
                          section.isActive 
                            ? "bg-white/80 shadow-sm" 
                            : "bg-white/40",
                          hoveredSection === section.id && "bg-white/90 shadow-md"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "mt-0.5",
                            section.isActive ? "text-purple-600" : "text-gray-400"
                          )}>
                            {section.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                "text-sm font-medium",
                                section.isActive ? "text-purple-700" : "text-gray-500"
                              )}>
                                {section.label}
                              </span>
                              {section.isActive && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <HelpCircle className="w-3 h-3 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs">
                                      <p className="text-sm">{section.helpText}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            <p className={cn(
                              "text-sm",
                              section.isActive ? "text-gray-700" : "text-gray-500"
                            )}>
                              {section.content}
                            </p>
                          </div>
                          {section.isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopy(section.content, section.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {copiedSection === section.id ? (
                                <Check className="w-3 h-3 text-green-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-gray-500" />
                              )}
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Complete prompt */}
                  {paceSections.filter(s => s.isActive).length > 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 bg-purple-100 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-purple-800">
                          Complete Prompt
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(completePrompt)}
                          className="text-purple-700 border-purple-300 hover:bg-purple-50"
                        >
                          {copiedSection === 'complete' ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy All
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-purple-700 leading-relaxed">
                        {completePrompt}
                      </p>
                    </motion.div>
                  )}

                  {/* Learning tip */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
                  >
                    <p className="text-xs text-purple-700">
                      <strong>PACE Framework in Action:</strong> Notice how each P-A-C-E step builds 
                      on the previous one. The more specific you are at each stage, 
                      the more your AI-generated email will sound like you and connect with your reader.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};