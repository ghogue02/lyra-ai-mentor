import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Check, Sparkles, Target, Volume2, MessageCircle, Star, FileText, Loader2, Zap, Eye, RefreshCw, Users, Lightbulb, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mayaAISkillBuilderService, type MayaSkillBuilderPrompt } from '@/services/mayaAISkillBuilderService';
import { type InteractiveStage, type MayaJourneyState, type LyraNarrativeMessage } from './types';
import { type ChoicePath, type PurposeType } from '@/types/dynamicPace';
import { SimplifiedFrameworkDisplay } from './SimplifiedFrameworkDisplay';
import { SimpleActionPlan } from './SimpleActionPlan';
import { PromptBuilder } from './PromptBuilder';
import { SaveToToolkit } from './SaveToToolkit';

/**
 * Helper function to format purpose types for display
 */
function formatPurposeForDisplay(purpose: string): string {
  const purposeMap: Record<string, string> = {
    'inform_educate': 'Share important news',
    'persuade_convince': 'Invite someone to support',
    'build_relationships': 'Build a stronger connection',
    'solve_problems': 'Help someone who\'s worried',
    'request_support': 'Ask for help you need',
    'inspire_motivate': 'Share exciting progress',
    'establish_authority': 'Establish expertise',
    'create_engagement': 'Create engagement'
  };
  
  return purposeMap[purpose] || purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Helper function to build prompt data for SaveToToolkit
 */
function buildPromptData(dynamicPath: ChoicePath | null, mayaJourney: MayaJourneyState) {
  const promptData = {
    purpose: '',
    audience: '',
    content: '',
    execute: ''
  };

  if (!dynamicPath) return promptData;

  // Purpose
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
  promptData.purpose = `I need to write an email to ${purposeMap[dynamicPath.purpose] || dynamicPath.purpose}.`;

  // Audience
  if (dynamicPath.audience) {
    const audienceLabel = dynamicPath.audience.label;
    const audienceDescription = dynamicPath.audience.description;
    
    // Add article helper
    const addArticle = (text: string): string => {
      if (!text) return text;
      const vowels = ['a', 'e', 'i', 'o', 'u'];
      const firstLetter = text.charAt(0).toLowerCase();
      const article = vowels.includes(firstLetter) ? 'an' : 'a';
      return `${article} ${text}`;
    };
    
    // Clean up audience label
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

    const genericRole = getGenericRole(audienceLabel);
    let audienceText = `My audience is ${addArticle(genericRole)}`;
    
    if (audienceDescription) {
      const cleanDescription = audienceDescription
        .replace(/Like Maya/g, 'Someone who is')
        .replace(/Maya/g, 'they')
        .toLowerCase();
      audienceText += ` - ${cleanDescription}`;
    }

    if (dynamicPath.audience.psychographics?.motivations?.length > 0) {
      audienceText += `. They care most about ${dynamicPath.audience.psychographics.motivations.join(', ')}.`;
    }

    promptData.audience = audienceText;
  }

  // Content
  if (dynamicPath.content?.framework?.mayaFramework) {
    const framework = dynamicPath.content.framework.mayaFramework;
    promptData.content = `Use the ${framework.name} (${framework.elements.map(e => e.name).join(' → ')}) to structure your email.`;
  }

  // Execute
  promptData.execute = 'Please keep it concise, personal, and action-oriented with a clear next step.';

  return promptData;
}

/**
 * Creates dynamic Maya stages with integrated dynamic choice service
 */
export function createDynamicMayaStages({
  panelBlurLevel,
  mayaJourney,
  setMayaJourney,
  setCurrentStageIndex,
  setLyraExpression,
  user,
  setIsGeneratingAI,
  isGeneratingAI,
  aiResults,
  setAIResults,
  generateDynamicPath,
  dynamicPath,
  isLoadingDynamic,
  userProfile
}: {
  panelBlurLevel: () => 'full' | 'partial' | 'clear';
  mayaJourney: MayaJourneyState;
  setMayaJourney: React.Dispatch<React.SetStateAction<MayaJourneyState>>;
  setCurrentStageIndex: (index: number) => void;
  setLyraExpression: (expression: 'default' | 'thinking' | 'celebrating' | 'helping') => void;
  user: any;
  setIsGeneratingAI: (value: boolean) => void;
  isGeneratingAI: boolean;
  aiResults: any;
  setAIResults: React.Dispatch<React.SetStateAction<any>>;
  generateDynamicPath: (purpose: PurposeType) => Promise<ChoicePath | undefined>;
  dynamicPath: ChoicePath | null;
  isLoadingDynamic: boolean;
  userProfile: any;
}): InteractiveStage[] {
  
  // Maya's Story-Driven Purpose Options (Natural Language)
  const dynamicPurposes: Array<{
    id: PurposeType;
    label: string;
    description: string;
    icon: React.ReactNode;
    contextHint: string;
    mayaStory: string;
  }> = [
    {
      id: 'inform_educate',
      label: 'Share important news',
      description: 'You have updates that will help people understand what\'s happening',
      icon: <Lightbulb className="w-5 h-5" />,
      contextHint: 'Perfect for program updates, policy changes, or helpful information',
      mayaStory: 'When families understand what\'s happening, they feel more connected and confident. I\'ve learned that clear communication builds trust.'
    },
    {
      id: 'persuade_convince',
      label: 'Invite someone to support',
      description: 'You want to show someone how they can make a meaningful difference',
      icon: <Target className="w-5 h-5" />,
      contextHint: 'Ideal for funding requests, volunteer recruitment, or advocacy',
      mayaStory: 'The best invitations don\'t feel like asking - they feel like opening a door to something meaningful that people want to join.'
    },
    {
      id: 'build_relationships',
      label: 'Build a stronger connection',
      description: 'You want to deepen a relationship that matters to your mission',
      icon: <Heart className="w-5 h-5" />,
      contextHint: 'Great for welcoming new supporters or strengthening existing partnerships',
      mayaStory: 'Great relationships grow from genuine care. When you tend them like a garden, beautiful things bloom unexpectedly.'
    },
    {
      id: 'solve_problems',
      label: 'Help someone who\'s worried',
      description: 'Someone has concerns that are keeping them up at night',
      icon: <Zap className="w-5 h-5" />,
      contextHint: 'Best for addressing concerns, resolving conflicts, or providing reassurance',
      mayaStory: 'Those late-night calls from worried parents taught me that people need both a listening ear and a clear path forward.'
    },
    {
      id: 'request_support',
      label: 'Ask for help you need',
      description: 'You need support and want to show exactly how someone can help',
      icon: <Users className="w-5 h-5" />,
      contextHint: 'Effective for volunteer recruitment, resource requests, or collaboration',
      mayaStory: 'People really do want to help - they\'re just waiting for someone to show them how their contribution will make a difference.'
    },
    {
      id: 'inspire_motivate',
      label: 'Share exciting progress',
      description: 'You have wins and achievements that will make people smile',
      icon: <Star className="w-5 h-5" />,
      contextHint: 'Powerful for celebrating milestones, sharing success stories, or motivating teams',
      mayaStory: 'Nothing beats sharing wins! These victories belong to everyone who believed in us - they made it possible.'
    }
  ];

  return [
    // Stage 1: Introduction to Maya's Journey
    {
      id: 'intro',
      title: 'Meeting Maya Rodriguez',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "flex flex-col items-center justify-center h-full text-center p-8 transition-all duration-1000",
          panelBlurLevel() === 'full' && "blur-xl",
          panelBlurLevel() === 'partial' && "blur-sm"
        )}>
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mb-6 shadow-lg"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4">Maya's Story Becomes Your Journey</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            From overwhelmed nonprofit communicator to confident storyteller<br/>
            <span className="text-purple-600 font-semibold">The PACE Approach that changes everything</span>
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 italic mb-4"
          >
            "47 unread emails • 3 hours on one draft • Sound familiar?"
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button 
              onClick={() => setCurrentStageIndex(1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Begin Your Journey <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'intro-maya-1',
          content: "It's 7 PM on a Thursday. Maya Rodriguez stares at her laptop screen, cursor blinking in an empty email draft. She's been trying to write a simple board update for three hours. The youth summer program just launched successfully, but somehow she can't find the words to capture the magic of what happened.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'intro-maya-2',
          content: "'Why is this so hard?' Maya thinks. 'I know what happened. I was there. The kids were amazing. The parents were grateful. But these words feel so... flat.' Sound familiar? That overwhelm you're feeling? It's not because you're failing. It's because you care so much.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 7000,
          fourthWallBreak: true
        },
        {
          id: 'intro-maya-3',
          content: "Every great communicator started with a blinking cursor and doubt. What Maya doesn't realize yet - and what you're about to discover - is that the problem isn't her writing ability. It's that she's been starting in the wrong place. Let me show you the PACE approach that changed everything for her.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 14000
        }
      ]
    },

    // Stage 2: Dynamic Purpose Selection
    {
      id: 'purpose-dynamic',
      title: 'Choose Your Purpose',
      panelBlurState: 'clear',
      component: (
        <div className="flex flex-col h-full p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              What do you want to accomplish?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-3">
              Elena's question changed Maya's life: "Why does this matter to YOU personally?"
            </p>
            <p className="text-sm text-purple-600 font-medium italic">
              Your purpose isn't hidden. It's just buried under 'supposed to' and 'should'.
            </p>
          </motion.div>

          {isLoadingDynamic ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-w-3xl mx-auto w-full">
              {dynamicPurposes.map((purpose, index) => (
                <motion.button
                  key={purpose.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={async () => {
                    setLyraExpression('thinking');
                    const path = await generateDynamicPath(purpose.id);
                    if (path) {
                      setCurrentStageIndex(2);
                      setLyraExpression('helping');
                    }
                  }}
                  className={cn(
                    "p-6 rounded-xl border-2 text-left transition-all duration-300",
                    "hover:border-purple-400 hover:shadow-lg hover:scale-105",
                    "bg-white border-gray-200",
                    mayaJourney.purpose === purpose.id && "border-purple-600 bg-purple-50"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                      {purpose.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{purpose.label}</h3>
                      <p className="text-gray-600 text-sm mb-2">{purpose.description}</p>
                      <p className="text-xs text-purple-600 italic mb-2">{purpose.contextHint}</p>
                      <p className="text-xs text-purple-700 font-medium italic">Maya: "{purpose.mayaStory}"</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Context-aware hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-2xl mx-auto"
          >
            <p className="text-sm text-blue-800">
              <strong>💡 Maya's Tip:</strong> Your choice here shapes everything that follows. Each purpose 
              opens different audience options and content approaches - just like Maya learned!
            </p>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'purpose-dynamic-1',
          content: "During a particularly frustrating grant application process, Maya's mentor Elena asked her a simple question: 'Maya, why does this grant matter to you personally?' That question changed everything. Maya realized she'd been starting with WHAT - the grant details - instead of WHY - the impact on families.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'purpose-dynamic-2',
          content: "Before understanding purpose, Maya wrote: 'Hope Gardens Community Center requests $50,000 for youth programming initiatives...' But after? 'Last week, 12-year-old Carlos told me he finally understands why his mom works two jobs - not because they're poor, but because she's building their future. Our after-school program gave him that perspective...'",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'purpose-dynamic-3',
          content: "The moment Maya received her first response still gives me chills: 'Your grant proposal moved us to tears. Approved.' I want to pause here and ask you directly - when's the last time you started a message with your real 'why'? Not your organization's mission statement, but YOUR why. Your choice here shapes everything that follows.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          fourthWallBreak: true
        }
      ]
    },

    // Stage 3: Dynamic Audience Selection
    {
      id: 'audience-dynamic',
      title: 'Identify Your Audience',
      panelBlurState: 'clear',
      component: (
        <div className="flex flex-col h-full p-8">
          {dynamicPath ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Who exactly are you writing to?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-3">
                  Maya discovered something profound: "They're not difficult, they just need different things!"
                </p>
                <p className="text-sm text-purple-600 font-medium italic mb-4">
                  Every 'difficult' person is just someone whose language you haven't learned yet.
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Personalized for You</span>
                </motion.div>
              </motion.div>

              <div className="space-y-6 max-w-5xl mx-auto w-full">
                {/* Show multiple audience options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(dynamicPath.audiences || [dynamicPath.audience]).map((audience, index) => (
                    <motion.div
                      key={audience.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-5 rounded-xl border-2 ${
                        index === 0 
                          ? 'border-purple-600 bg-purple-50' 
                          : 'border-gray-300 bg-gray-50 hover:border-purple-400 hover:bg-purple-50'
                      } transition-all duration-200`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${
                          index === 0 ? 'bg-purple-600' : 'bg-gray-600'
                        } text-white`}>
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base mb-1">{audience.label}</h3>
                          {index === 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              <Sparkles className="w-3 h-3" />
                              Best Match
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-3">
                        {audience.contextualDescription}
                      </p>
                      
                      {/* Key characteristics */}
                      <div className="space-y-2 mb-3">
                        <div className="text-xs">
                          <span className="font-medium text-gray-700">Style: </span>
                          <span className="text-gray-600">
                            {audience.psychographics.preferredCommunicationStyle
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-gray-700">Needs: </span>
                          <span className="text-gray-600">
                            {audience.psychographics.motivations[0]
                              .replace(/_/g, ' ')
                              .replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>

                      {/* Demographics tags - Hidden for cleaner UI
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                          {audience.demographics.experienceLevel}
                        </span>
                        <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                          {audience.demographics.timeConstraints}
                        </span>
                      </div>
                      */}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setMayaJourney(prev => ({
                            ...prev,
                            selectedAudience: audience.label
                          }));
                          setCurrentStageIndex(3);
                        }}
                        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                          index === 0
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'bg-white text-purple-600 border border-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        Choose This Audience
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Refresh option */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <button
                    onClick={() => generateDynamicPath(dynamicPath.purpose as PurposeType)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Show Me Another Audience
                  </button>
                </motion.div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Please select a purpose first</p>
            </div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'audience-dynamic-1',
          content: "Maya's biggest revelation came when she realized she'd been writing the same message to everyone. Board members, parents, volunteers, and donors all got similar emails. No wonder responses were lukewarm! A critical moment arrived when a major donor threatened to withdraw support because they felt 'out of touch' with the organization's work.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'audience-dynamic-2',
          content: "Maya created 'communication personas' for each key audience. Board Members needed efficiency and impact metrics. Parents wanted safety, growth, and practical details. Volunteers sought meaning and clear direction. Donors desired connection and visible results. 'Oh!' Maya realized. 'They're not difficult, they just need different things!'",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'audience-dynamic-3',
          content: "Let me share something with you that Maya's still figuring out - your most challenging audience member is often your greatest teacher. Who comes to mind for you? Every 'difficult' person is just someone whose language you haven't learned yet. The profile I've created for you considers their deepest needs and preferred communication style.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          fourthWallBreak: true
        }
      ]
    },

    // Stage 4: Dynamic Content Strategy
    {
      id: 'content-dynamic',
      title: 'Content Strategy',
      panelBlurState: 'clear',
      component: (
        <div className="flex flex-col h-full p-8">
          {dynamicPath && dynamicPath.content ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Perfect Content Strategy
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-3">
                  Maya's transformation: From "We are pleased to announce..." to "Something beautiful happened yesterday..."
                </p>
                <p className="text-sm text-purple-600 font-medium italic">
                  Your authentic voice is your superpower, not your weakness.
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto w-full space-y-6">
                {/* Maya's Framework */}
                {dynamicPath.content.framework.mayaFramework && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  >
                    <SimplifiedFrameworkDisplay 
                      framework={dynamicPath.content.framework.mayaFramework} 
                    />
                  </motion.div>
                )}

                {/* Fallback to original if no Maya framework */}
                {!dynamicPath.content.framework.mayaFramework && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200"
                  >
                    <h3 className="font-semibold text-xl mb-3">{dynamicPath.content.name}</h3>
                    <p className="text-gray-700 mb-4">{dynamicPath.content.adaptiveDescription}</p>
                    
                    {/* Framework Structure */}
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-medium">Opening Approach</h4>
                          <p className="text-sm text-gray-600">{dynamicPath.content.framework.structure.openingApproach}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-medium">Body Framework</h4>
                          <p className="text-sm text-gray-600">{dynamicPath.content.framework.structure.bodyFramework}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-medium">Closing Strategy</h4>
                          <p className="text-sm text-gray-600">{dynamicPath.content.framework.structure.closingStrategy}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}


                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentStageIndex(4)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Apply This Strategy
                </motion.button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading content strategy...</p>
            </div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'content-dynamic-1',
          content: "Maya's biggest transformation? She stopped trying to sound 'professional' and started sounding like herself - warm, passionate, and real. 'We are pleased to announce the implementation of our strategic initiative...' became 'Something beautiful happened yesterday. Let me paint you a picture...'",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'excited',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'content-dynamic-2',
          content: "Maya mastered three frameworks. The Story Arc: Setup, Struggle, Solution, Success. The Teaching Moment: Observation, Insight, Application. The Invitation: Vision, Gap, Bridge. I've selected the perfect framework for your specific purpose and audience. Notice how each element builds naturally on the previous one - that's the secret to emails that feel effortless to read and impossible to ignore.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 6000
        },
        {
          id: 'content-dynamic-3',
          content: "Can I tell you a secret? The message you're most nervous to send - the one that feels 'too much like you' - that's usually the one that changes everything. Maya's best messages sound like coffee conversations. Your authentic voice is your superpower, not your weakness. The structure I'm showing you gives your authenticity wings.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          fourthWallBreak: true
        }
      ]
    },

    // Stage 5: Dynamic Execution
    {
      id: 'execution-dynamic',
      title: 'Personalized Execution',
      panelBlurState: 'clear',
      component: (
        <div className="flex flex-col h-full p-8">
          {dynamicPath && dynamicPath.execution ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Personal Action Plan
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto mb-3">
                  Follow these simple steps to write effective emails quickly and confidently.
                </p>
                <p className="text-sm text-purple-600 font-medium italic">
                  Clear structure helps you focus on what matters most.
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto w-full space-y-6">
                {/* Prompt Builder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-white rounded-xl border-2 border-purple-200"
                >
                  <PromptBuilder
                    mayaJourney={mayaJourney}
                    dynamicPath={dynamicPath}
                    currentStageIndex={4} // Execution stage
                    className="mb-6"
                  />
                  
                  {/* Create My Perfect Email Button */}
                  <div className="text-center pt-4 border-t border-gray-200">
                    <Button
                      onClick={async () => {
                        setIsGeneratingAI(true);
                        setLyraExpression('thinking');
                        
                        try {
                          const prompt: MayaSkillBuilderPrompt = {
                            purpose: dynamicPath.purpose,
                            audience: dynamicPath.audience.label,
                            audienceContext: dynamicPath.audience.contextualDescription,
                            tone: dynamicPath.content.framework.toneGuidelines[0]?.tone || 'professional',
                            situationDetails: `Using ${dynamicPath.content.name} strategy`,
                            stage: 'pace-execute' as const,
                            user: userProfile
                          };
                          
                          const result = await mayaAISkillBuilderService.generatePACEEmail(prompt);
                          
                          setAIResults(prev => ({
                            ...prev,
                            dynamicEmail: result.content
                          }));
                          
                          setMayaJourney(prev => ({
                            ...prev,
                            generated: result.content
                          }));
                          
                          setLyraExpression('celebrating');
                          setCurrentStageIndex(5);
                        } catch (error) {
                          console.error('Error generating dynamic email:', error);
                          setLyraExpression('default');
                        } finally {
                          setIsGeneratingAI(false);
                        }
                      }}
                      size="lg"
                      disabled={isGeneratingAI}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 text-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50"
                    >
                      {isGeneratingAI ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Creating Your Perfect Email...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Create My Perfect Email
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Your prompt will be used to generate a personalized email just for you.
                    </p>
                  </div>
                </motion.div>


              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Loading execution plan...</p>
            </div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'execution-dynamic-1',
          content: "Here's a simple approach that works: Start with connection, support with purpose, close with action. Consistent timing builds anticipation. Clear format respects busy schedules. The goal is writing emails that get results.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'encouraging',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'execution-dynamic-2',
          content: "Simple time-saving strategies make all the difference. Keep a story bank: Collect examples throughout the week. Voice recordings: Capture authentic moments to use later. Photo journal: Images that tell stories quickly. Response templates: Use consistent structure with personal touches. These small changes can reduce your email writing time dramatically.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 6000
        },
        {
          id: 'execution-dynamic-3',
          content: "Here's what's important about systems - they're not about being robotic. They're about saving your energy for what matters. Good structure creates more authentic communication, not less. These techniques can save you significant time each week. Let's create an email that proves this works!",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'excited',
          delay: 12000,
          fourthWallBreak: true
        }
      ]
    },

    // Stage 6: Dynamic Results
    {
      id: 'results-dynamic',
      title: 'Your Perfect Email',
      panelBlurState: 'clear',
      component: (
        <div className="flex flex-col h-full p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Perfect Email
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-3">
              Maya's results: 40% volunteer retention increase • 65% more donor engagement • 70% grant success rate
            </p>
            <p className="text-sm text-purple-600 font-medium italic">
              "Good communication means making others feel smart, valued, and inspired to act." - Maya
            </p>
          </motion.div>

          {aiResults.dynamicEmail ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto w-full"
            >
              <div className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Your Email
                  </h3>
                </div>
                <div className="p-6">
                  <div className="prose prose-purple max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: aiResults.dynamicEmail.replace(/\n/g, '<br/>') }} />
                  </div>
                </div>
              </div>

              {/* Dynamic Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900">Why This Email Works</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-100 rounded-full">
                      <Target className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Clear Purpose: </span>
                      <span className="text-gray-700">{dynamicPath ? formatPurposeForDisplay(dynamicPath.purpose) : ''}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-100 rounded-full">
                      <Users className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Right Audience: </span>
                      <span className="text-gray-700">{dynamicPath?.audience.label || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-100 rounded-full">
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Smart Framework: </span>
                      <span className="text-gray-700">{dynamicPath?.content.framework?.mayaFramework?.name || dynamicPath?.content.name || ''}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-purple-100 rounded-full">
                      <Zap className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">Personal Touch: </span>
                      <span className="text-gray-700">Tailored to your unique voice and relationship</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <SaveToToolkit
                  dynamicPath={dynamicPath}
                  emailContent={aiResults.dynamicEmail}
                  promptBuilder={buildPromptData(dynamicPath, mayaJourney)}
                />
                <Button
                  onClick={() => setCurrentStageIndex(0)}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Try Another Communication
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Generating your dynamic email...</p>
            </div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'results-dynamic-1',
          content: "Look at what you've created! Maya's results after mastering PACE: Volunteer retention up 40%. Donor engagement increased 65%. Parent participation from 12% to 78%. Grant success rate from 1 in 10 to 7 in 10. But the best part? Email drafting time from 3 hours to 30 minutes. Work-life balance restored!",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'celebrating',
          delay: 500,
          // Animation removed - pure storytelling focus
        },
        {
          id: 'results-dynamic-2',
          content: "'I used to think good communication meant sounding smart,' Maya reflects. 'Now I know it means making others feel smart, valued, and inspired to act. The PACE approach didn't just improve my writing - it transformed how I connect with humans.' She was promoted to Director of Development and now mentors others.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'results-dynamic-3',
          content: "I want you to imagine yourself 15 months from now. What would change if your communication connected every time? If your messages moved people to action? If you spent less time writing and more time impacting? Maya's living that reality. Your transformation starts with the next message you write. Want to explore another scenario?",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          // Animation removed - pure storytelling focus
          fourthWallBreak: true
        }
      ]
    }
  ];
}