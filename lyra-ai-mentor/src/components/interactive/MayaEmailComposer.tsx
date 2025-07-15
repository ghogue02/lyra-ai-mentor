import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Mail, Clock, Target, CheckCircle2, Copy, RefreshCw, 
  Sparkles, Heart, AlertCircle, Users, FileText, ChevronRight,
  ArrowRight, Eye, EyeOff, PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MayaConfidenceMeter } from '@/components/magical/MayaConfidenceMeter';
import { StreamingTextArea } from '@/components/ui/StreamingTextArea';
import { enhancedAIService } from '@/services/enhancedAIService';
import { useComponentProgress } from '@/hooks/useComponentProgress';
import { ProgressWidget } from '@/components/ProgressWidget';
import { StoryIntegration } from '@/components/StoryIntegration';
import { HelpTooltip } from '@/components/ui/HelpTooltip';
import { characterHelpContent } from '@/utils/helpContent';
import { ExportButton } from '@/components/ui/ExportButton';
import { UseInSuggestions } from '@/components/ui/UseInSuggestions';
import { ExportData } from '@/services/exportService';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { AIComponentErrorBoundary } from '@/components/ai-playground/AIComponentErrorBoundary';
import { ExampleSelector } from '@/components/ai-playground/ExampleSelector';
import { AIExample } from '@/services/aiExamplesService';
import { handleAIError, retryWithBackoff } from '@/services/aiErrorHandler';
import { TutorialButton } from '@/components/tutorial/TutorialButton';
import { useTutorialElement } from '@/hooks/useTutorial';
// Maya Progress Components
import { MayaHeaderProgress, useMayaProgress, type MayaJourneyState } from './maya';
// Dynamic Choice Service Integration
import { dynamicChoiceService, UserContext, PathGenerationRequest } from '@/services/dynamicChoiceService';
import { PurposeType, CommunicationStyle, ExperienceLevel, ChoicePath } from '@/types/dynamicPace';

// Enhanced Animation Variants
const stepVariants = {
  hidden: { opacity: 0, x: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -30, 
    scale: 0.98,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

const optionVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.35,
      ease: 'easeOut'
    }
  }),
  exit: { opacity: 0, y: -15, scale: 0.95 }
};

const selectionVariants = {
  selected: {
    scale: 1.02,
    boxShadow: '0 8px 32px rgba(147, 51, 234, 0.25)',
    borderColor: 'rgb(147, 51, 234)',
    transition: { duration: 0.2 }
  },
  unselected: {
    scale: 1,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    transition: { duration: 0.2 }
  }
};

// Enhanced PACE Stepper Component
const PACEStepper: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
  completedSteps: boolean[];
  onStepClick?: (step: number) => void;
}> = ({ currentStep, totalSteps, stepLabels, completedSteps, onStepClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex items-center justify-between relative px-4">
        {/* Animated Progress Line */}
        <div className="absolute top-6 left-8 right-8 h-1 bg-gray-200 rounded-full -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${Math.min((currentStep / (totalSteps - 1)) * 100, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </div>
        
        {/* Step Circles with Enhanced Animation */}
        {stepLabels.map((label, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 cursor-pointer transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 border-purple-500 text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400 hover:border-purple-300 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onStepClick?.(index)}
            >
              <AnimatePresence mode="wait">
                {completedSteps[index] ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle2 className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.span 
                    key="number"
                    className="text-sm font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {index + 1}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <motion.span
              className={`text-sm font-medium mt-2 text-center transition-colors duration-300 ${
                index <= currentStep ? 'text-purple-700' : 'text-gray-500'
              }`}
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: index <= currentStep ? 1 : 0.7,
                y: index === currentStep ? -2 : 0
              }}
              transition={{ delay: index * 0.05 }}
            >
              {label}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Progressive Disclosure Preview Component
const StepPreview: React.FC<{
  title: string;
  description: string;
  isVisible: boolean;
  isLocked: boolean;
  onUnlock?: () => void;
}> = ({ title, description, isVisible, isLocked, onUnlock }) => {
  if (!isVisible) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-200/50 overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                isLocked ? 'bg-gray-300' : 'bg-gradient-to-r from-purple-500 to-cyan-500'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isLocked ? 0 : 360 }}
                transition={{ duration: 0.3 }}
              >
                {isLocked ? (
                  <EyeOff className="w-4 h-4 text-gray-600" />
                ) : (
                  <Eye className="w-4 h-4 text-white" />
                )}
              </motion.div>
            </motion.div>
            <div>
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          {isLocked && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={onUnlock}
                className="border-purple-300 text-purple-700 hover:bg-purple-100 transition-colors duration-200"
              >
                <ArrowRight className="w-4 h-4 mr-1" />
                Unlock
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Content Adaptation Engine
interface PurposeAudienceMatrix {
  [key: string]: {
    toneRecommendations: Array<{
      toneId: string;
      priority: 'primary' | 'secondary' | 'tertiary';
      reasoning: string;
    }>;
    template: {
      structure: string[];
      keyElements: string[];
      callToAction: string;
    };
    adaptiveHelp: {
      title: string;
      explanation: string;
      bestPractices: string[];
      commonMistakes: string[];
    };
  };
}

// Tone options for content strategy selection
const toneOptions = [
  { 
    id: 'warm', 
    label: 'Warm & Understanding', 
    emoji: '💗', 
    description: 'Compassionate and supportive - showing genuine care and empathy that people can feel. \n\n**This is Maya\'s favorite tone** - it wraps every message in understanding and creates real connection.'
  },
  { 
    id: 'professional', 
    label: 'Professional & Respectful', 
    emoji: '👔', 
    description: 'Clear, organized, and courteous with just the right amount of formality. \n\n**Perfect for board communications** - it maintains respect while staying approachable and human.'
  },
  { 
    id: 'urgent-calm', 
    label: 'Urgent but Calm', 
    emoji: '🚨', 
    description: 'Conveys importance while keeping your composure and staying crystal clear. \n\n**Maya\'s crisis communication secret** - it addresses urgency without creating panic, leading with solutions.'
  },
  { 
    id: 'grateful', 
    label: 'Grateful & Appreciative', 
    emoji: '🙏', 
    description: 'Expresses sincere thanks and truly recognizes the contributions people make. \n\n**Goes beyond "thank you"** - it makes people feel seen and valued for their specific impact on your mission.'
  },
  { 
    id: 'encouraging', 
    label: 'Encouraging & Motivating', 
    emoji: '🌟', 
    description: 'Uplifting and positive - inspiring action and building confidence in others. \n\n**Maya\'s team-building magic** - it lifts people up while giving them concrete ways to succeed and make a difference.'
  }
];

interface ToneAdaptation {
  filteredTones: typeof toneOptions;
  recommendedTone: string;
  reasoning: string;
  adaptiveHelp: string;
}

interface MayaEmailComposerProps {
  onComplete?: (data: {
    timeSpent: number;
    recipesCreated: number;
    transformationViewed: boolean;
  }) => void;
}

type Phase = 'intro' | 'build' | 'preview' | 'success';
type PaceStep = 'purpose' | 'audience' | 'content' | 'execution';

interface EmailRecipe {
  purpose: string;
  purposeEmoji: string;
  audience: string;
  audienceEmoji: string;
  tone: string;
  toneEmoji: string;
}

interface PaceProgress {
  currentStep: PaceStep;
  completedSteps: PaceStep[];
  isStepComplete: (step: PaceStep) => boolean;
  canAdvanceToStep: (step: PaceStep) => boolean;
}

// Maya's Story-Driven Purpose Options
const purposeOptions = [
  { 
    id: 'address-concern', 
    label: "Help someone who's worried", 
    emoji: '💗', 
    description: 'When someone comes to you with concerns that are keeping them up at night',
    mayaStory: "Those late-night calls from worried parents? They're sacred moments.\n\nI remember Sarah's voice trembling as she asked about her daughter's reading progress. 'Am I failing her?' she whispered. In that moment, I learned something profound: **people need both a listening ear and a clear path forward**.\n\nThese conversations taught me that worry is love with nowhere to go. When we acknowledge that love and give it direction, everything changes.",
    whatYouWillWrite: "You'll craft a response that shows you truly hear them, gives them specific next steps they can take, and helps them feel less alone in their worry",
    whenToUse: 'When someone reaches out feeling anxious or confused - maybe a parent concerned about their child, a volunteer with questions, or anyone who needs reassurance paired with real answers'
  },
  { 
    id: 'share-update', 
    label: 'Share good news and progress', 
    emoji: '✨', 
    description: 'You have exciting updates that will make your community smile',
    mayaStory: 'Nothing beats sharing wins! ✨\n\nI remember when Maria finally read her first book - I practically ran to my computer to tell everyone. Her proud little face as she sounded out every word brought tears to my eyes, and that moment belonged to everyone who believed in us.\n\nOr that unforgettable day when the Johnson Foundation said yes. **These victories are never just ours** - they belong to every person who held hope when we couldn\'t.',
    whatYouWillWrite: "You'll create an update that captures the joy of the moment and helps readers see how they made it possible - because they did!",
    whenToUse: 'When you have achievements to celebrate, milestones to announce, successful grants to share, or any news that shows your mission coming to life'
  },
  { 
    id: 'make-request', 
    label: 'Invite someone to help', 
    emoji: '🤝', 
    description: 'You need support and want to show someone how they can make a real difference',
    mayaStory: "Here's what I've learned: **people want to help**. They really do. They're just waiting for someone to show them how.\n\nMy best 'asks' never felt like asking - they felt like opening a door to something meaningful. Like when I told Dr. Martinez about Carlos, who was struggling with math. Instead of asking for tutoring funds, I painted a picture: 'Imagine Carlos's face when numbers finally click.'\n\nThat's when magic happens - when helping feels like **joining a story** instead of filling a need.",
    whatYouWillWrite: "You'll write an invitation that paints a vivid picture of the need, shows exactly how their help creates change, and makes saying yes feel natural and exciting",
    whenToUse: 'When you need funding for a project, volunteers for an event, donated supplies, or any time you want to invite someone into your mission'
  },
  { 
    id: 'express-thanks', 
    label: 'Say thank you meaningfully', 
    emoji: '🙏', 
    description: "Someone's generosity has made a difference and they need to feel it too",
    mayaStory: "Real gratitude changes everything. ✨\n\nWhen I share stories instead of statistics - like how Mrs. Chen's donation bought books that Carlos now reads every night - something magical happens. **Donors become family**.\n\nI once wrote to Mrs. Chen: 'Your gift didn't just buy books. It lit up a little boy's bedroom every night at 8 PM, when Carlos reads to his teddy bear.' She called me crying - happy tears. That's when I knew: **gratitude is love made visible**.",
    whatYouWillWrite: "You'll write a personal thank you that shares specific moments of impact, connects their gift to real people, and helps them feel the ripples of their kindness",
    whenToUse: 'After receiving support of any kind - a generous donation, volunteer hours, professional services, or even advice that helped you move forward'
  },
  { 
    id: 'invite-action', 
    label: 'Invite participation', 
    emoji: '🚀', 
    description: 'You have opportunities for people to roll up their sleeves and help',
    mayaStory: "So many people tell me, 'I'd love to help, but I don't know how.' They're searching for a way to contribute that fits their life. \n\nWhen I show them exactly how their talents can help, **their eyes light up**. Like when I told Anna, a graphic designer, about our newsletter struggles. Instead of asking for design help, I said: 'Imagine families opening something beautiful that makes them smile.'\n\nShe didn't just design our newsletter - she transformed how we connect with families. **Everyone has a gift. Our job is to help them see where it fits**.",
    whatYouWillWrite: "You'll create an invitation that presents specific ways to get involved, shows how their unique skills make a difference, and makes helping feel both doable and meaningful",
    whenToUse: 'When recruiting volunteers for events, launching programs that need hands-on support, forming committees, or opening any opportunity for people to actively participate'
  },
  { 
    id: 'provide-info', 
    label: 'Share important information', 
    emoji: '📖', 
    description: 'People need to understand something that affects them or their loved ones',
    mayaStory: "Confusion creates worry, but **clarity builds trust**. ✨\n\nWhen families understand what's happening - whether it's about their child's program or a new policy - they feel in control. I learned this when Miguel's mom called, panicked about a policy change notice.\n\n'I don't understand what this means for my son,' she said. That's when I realized: **clear information is a gift**. When we take time to explain things in human terms, we don't just inform - we comfort.",
    whatYouWillWrite: "You'll organize complex information into bite-sized pieces, answer the questions they're probably asking, and show them exactly what steps to take",
    whenToUse: 'When explaining program changes, announcing new policies, sharing enrollment details, or any time people need to understand something that impacts them'
  },
  { 
    id: 'build-relationship', 
    label: 'Build a stronger relationship', 
    emoji: '🌱', 
    description: 'You want to deepen a connection that matters to your mission',
    mayaStory: "Great partnerships grow from genuine connection. 🌱\n\nWhether it's a curious new donor or a long-time friend I haven't spoken with lately, **relationships are like gardens**. They bloom when you tend them with real care.\n\nI once reconnected with an old colleague by sharing a story about one of our kids, not asking for anything. Three months later, she introduced us to a foundation that changed everything. **Authentic connection creates unexpected possibilities**.",
    whatYouWillWrite: "You'll write something warm and personal that shows you see them as a whole person, shares something meaningful from your heart, and opens space for deeper connection",
    whenToUse: 'When welcoming new supporters, reconnecting with past friends, strengthening board relationships, or moving any connection from surface-level to soul-level'
  },
  { 
    id: 'resolve-issue', 
    label: 'Resolve an issue together', 
    emoji: '🔧', 
    description: 'Something went wrong and you want to make it right while building trust',
    mayaStory: 'How we handle problems shows **who we really are**. ✨\n\nEvery mistake or misunderstanding is actually a chance to build stronger trust - if we approach it with honesty and a genuine desire to make things better together.\n\nWhen we accidentally double-booked the community room, I could have made excuses. Instead, I called both groups and said: "I made a mistake, and here\'s how we\'re going to make it right." **Vulnerability + accountability = stronger relationships**.',
    whatYouWillWrite: "You'll acknowledge what happened honestly, take responsibility where appropriate, and propose solutions that show you're committed to making things right together",
    whenToUse: 'When addressing service hiccups, responding to concerns, clearing up misunderstandings, or any time being transparent and proactive will strengthen rather than weaken trust'
  }
];

// Create Maya's User Context for Dynamic Choice Engine
const createMayaUserContext = (): UserContext => {
  return {
    userId: 'maya_nonprofit_director',
    currentSkillLevel: 'intermediate' as ExperienceLevel,
    timeAvailable: 20, // Typical time Maya has for email composition
    stressLevel: 6, // Maya often works under moderate stress
    confidenceLevel: 7, // Maya is generally confident but always learning
    preferredCommunicationStyle: 'warm_personal' as CommunicationStyle,
    pastPerformance: [],
    currentGoals: ['stakeholder relationships', 'funding stability', 'program excellence'],
    activeConstraints: ['multiple stakeholders', 'resource limitations'],
    learningPreferences: []
  };
};

// Map Purpose Options to Dynamic Choice Types
const mapToDynamicPurpose = (purposeId: string): PurposeType => {
  const purposeMapping: Record<string, PurposeType> = {
    'address-concern': 'solve_problems',
    'share-update': 'inform_educate', 
    'make-request': 'request_support',
    'express-thanks': 'build_relationships',
    'invite-action': 'create_engagement',
    'provide-info': 'inform_educate',
    'build-relationship': 'build_relationships',
    'resolve-issue': 'solve_problems'
  };
  
  return purposeMapping[purposeId] || 'inform_educate';
};

// PACE Step 2: Audience Intelligence (Enhanced with Dynamic AI)
const getFilteredAudienceOptions = (selectedPurpose: string) => {
  // Use the comprehensive purpose-to-audience mapping for consistency
  const relevantIds = purposeToAudienceMapping[selectedPurpose as keyof typeof purposeToAudienceMapping] || [];
  return allRecipientOptions.filter(option => relevantIds.includes(option.id));
};

// PACE Step 3: Content Strategy (Adaptive tone based on Purpose + Audience)
const getContentStrategies = (purpose: string, audience: string) => {
  // Use the sophisticated tone adaptation logic from Agent 4
  const toneAdaptation = getAdaptedTones(purpose, audience);
  
  // Convert filtered tones to the expected format for the UI, adding intelligence
  return toneAdaptation.filteredTones.map(tone => ({
    id: tone.id,
    label: tone.label,
    emoji: tone.emoji,
    description: tone.description,
    isRecommended: tone.label === toneAdaptation.recommendedTone,
    reasoning: toneAdaptation.reasoning,
    adaptiveHelp: toneAdaptation.adaptiveHelp
  }));
};

// PACE Stepper Component
const PaceStepper: React.FC<{ currentStep: PaceStep; completedSteps: PaceStep[] }> = ({ currentStep, completedSteps }) => {
  const steps = [
    { id: 'purpose', label: 'Purpose', icon: '🎯', description: 'Why are you writing this email?' },
    { id: 'audience', label: 'Audience', icon: '👥', description: 'Who exactly are you writing to?' },
    { id: 'content', label: 'Content', icon: '✍️', description: 'How should you approach this?' },
    { id: 'execution', label: 'Execute', icon: '🚀', description: 'Generate your perfect email' }
  ];
  
  return (
    <div className="pace-stepper-container mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900">My PACE Email Method</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id as PaceStep);
          const isCurrent = currentStep === step.id;
          const isAccessible = index === 0 || completedSteps.includes(steps[index - 1].id as PaceStep);
          
          return (
            <div
              key={step.id}
              className={`pace-step p-3 rounded-lg border-2 transition-all duration-300 ${
                isCurrent ? 'border-purple-500 bg-purple-50 shadow-md' :
                isCompleted ? 'border-green-500 bg-green-50' :
                isAccessible ? 'border-gray-300 bg-gray-50' :
                'border-gray-200 bg-gray-100 opacity-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{step.icon}</span>
                <span className={`font-semibold ${
                  isCurrent ? 'text-purple-900' :
                  isCompleted ? 'text-green-900' :
                  'text-gray-700'
                }`}>
                  {step.label}
                </span>
                {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Maya's Story-Driven Audience Experiences
const allRecipientOptions = [
  { 
    id: 'concerned-parent', 
    label: 'Concerned parent', 
    emoji: '👪', 
    description: "Parents who stay up worrying - I've had so many late-night calls about their children", 
    baseDescription: 'Parent with concerns about their child',
    storyContext: 'Maya remembers late-night conversations with parents like Sarah, who lost sleep worrying about their children. \n\n**These parents need immediate reassurance and clear next steps.** They\'re not just asking for information - they\'re asking for hope.',
    whatYouWillGet: 'A caring, detailed response that addresses specific concerns while providing actionable solutions',
    mayaExperience: 'Those sleepless parents taught me something crucial: **they need both empathy and concrete information**. \n\nThey want to know their child is truly seen and supported. When I learned to lead with understanding and follow with action, everything changed.',
    relationshipType: 'protective-guardian'
  },
  { 
    id: 'potential-donor', 
    label: 'Curious supporter', 
    emoji: '💰', 
    description: 'Those thoughtful people who attend events and really watch before they commit their support', 
    baseDescription: 'Individual considering donation',
    storyContext: 'Maya knows supporters like Michael who circle around the mission for months, watching and learning before they trust you with their first gift. \n\n**They\'re not being cautious - they\'re being thoughtful.** They want to know their support will create real change.',
    whatYouWillGet: 'An invitation-style email that builds trust while sharing compelling impact stories',
    mayaExperience: 'What really struck me is that these supporters are asking **"Will my gift make a difference?"** \n\nThey need proof of impact, not just need. When I started sharing specific stories instead of general statistics, their eyes lit up.',
    relationshipType: 'trust-builder'
  },
  { 
    id: 'major-donor', 
    label: 'Committed partner', 
    emoji: '💝', 
    description: 'Our true partners who invest significantly and deserve complete transparency', 
    baseDescription: 'High-value financial supporter',
    storyContext: "Maya treasures relationships with donors like Patricia - **they're not just funders, they're true partners** who deserve insider updates and recognition. \n\nThey've earned a seat at the table through their commitment and generosity.",
    whatYouWillGet: 'A personalized, professional update that treats them as a valued partner with exclusive insights',
    mayaExperience: 'These relationships taught me something profound: **major donors want to feel like co-investors in the mission**. \n\nThey need transparency and partnership, not just appreciation. When I started treating them as strategic partners, our relationship transformed.',
    relationshipType: 'strategic-partner'
  },
  { 
    id: 'board-member', 
    label: 'Board guardian', 
    emoji: '🏛️', 
    description: 'The ones who ask tough questions because they care so deeply about our mission', 
    baseDescription: 'Organization board member',
    storyContext: 'Maya appreciates board members like David who balance fiduciary duty with mission passion. \n\n**They need both heart and hard data.** They govern best when they feel connected to the impact they\'re helping create.',
    whatYouWillGet: 'A balanced communication combining emotional connection with strategic information',
    mayaExperience: 'Working with boards showed me that **effective governance requires both accountability and inspiration**. \n\nThey govern best when they feel connected to impact. Numbers tell them what happened, but stories tell them why it matters.',
    relationshipType: 'strategic-advisor'
  },
  { 
    id: 'volunteer', 
    label: 'Dedicated volunteer', 
    emoji: '🙋‍♀️', 
    description: 'The ones who show up every week and know everyone by name - they become family', 
    baseDescription: 'Person offering time and skills',
    storyContext: 'Maya cherishes volunteers like Anna who become extended family. \n\n**They give time because they love the mission** and need to feel truly valued. They\'re not just helping - they\'re investing their hearts.',
    whatYouWillGet: 'A warm, appreciative message that recognizes their contribution and invites deeper involvement',
    mayaExperience: "I've seen how volunteers become our extended family. \n\n**They stay engaged when they feel essential to the mission** - they need recognition and meaningful roles. When they feel valued, they become our biggest champions.",
    relationshipType: 'mission-family'
  },
  { 
    id: 'new-volunteer', 
    label: 'Eager newcomer', 
    emoji: '🌟', 
    description: 'Fresh faces full of enthusiasm who just need a bit of guidance to channel their energy', 
    baseDescription: 'Recently joined volunteer',
    storyContext: "Maya remembers the excitement of new volunteers like James - **they're motivated but need clear guidance** and welcoming integration. \n\nTheir enthusiasm is precious - we need to nurture it, not overwhelm it.",
    whatYouWillGet: 'A welcoming orientation email that provides clear next steps and builds excitement',
    mayaExperience: 'New volunteers remind me of myself when I started - **they need both enthusiasm and structure**. \n\nThey want to help but need to know exactly how. When we give them clear steps and celebrate their contributions, they blossom.',
    relationshipType: 'welcoming-mentor'
  },
  { 
    id: 'staff-team', 
    label: 'Internal team', 
    emoji: '👥', 
    description: 'Our frontline heroes who work directly with families every single day', 
    baseDescription: 'Internal team members',
    storyContext: 'Maya values team members who work directly with families - **they need honest communication and collaborative problem-solving**. \n\nThey\'re on the frontlines every day, and they deserve transparency and respect.',
    whatYouWillGet: 'A direct, collaborative message that treats them as professional partners',
    mayaExperience: "Years of teamwork taught me that **internal communication works best when it's transparent and solution-focused**. \n\nTeams need honesty and clear direction. When we treat them as partners, not just employees, they rise to meet every challenge.",
    relationshipType: 'collaborative-colleague'
  },
  { 
    id: 'community-partner', 
    label: 'Community ally', 
    emoji: '🤝', 
    description: 'Other organizations working toward the same goals we are - our natural allies', 
    baseDescription: 'Partner organization',
    storyContext: 'Maya builds relationships with partners who share our mission - they need mutual respect and clear communication about shared goals.',
    whatYouWillGet: 'A professional partnership message that explores mutual benefits and shared impact',
    mayaExperience: 'Building bridges taught me that strong partnerships require both professional respect and personal connection. They need to see our shared values.',
    relationshipType: 'strategic-ally'
  },
  { 
    id: 'program-family', 
    label: 'Program family', 
    emoji: '🏠', 
    description: 'Families who trust us with their most precious hopes and dreams', 
    baseDescription: 'Family receiving services',
    storyContext: 'Maya honors families like the Rodriguez family who trust us with their children - they need respect, clear communication, and genuine care.',
    whatYouWillGet: 'A respectful, caring message that honors their trust and provides clear, helpful information',
    mayaExperience: "Every family I've worked with shows me the same truth - they need both professionalism and genuine care. They want to be partners in their children's success.",
    relationshipType: 'service-partnership'
  },
  { 
    id: 'foundation-contact', 
    label: 'Grant partner', 
    emoji: '🏦', 
    description: 'Foundation officers who balance heart and accountability in every funding decision', 
    baseDescription: 'Foundation representative',
    storyContext: 'Maya works with foundation contacts who balance mission alignment with fiduciary responsibility - they need both impact data and compelling stories.',
    whatYouWillGet: 'A professional grant communication balancing accountability with storytelling',
    mayaExperience: 'Foundation work taught me a delicate balance - these relationships thrive on both rigorous reporting and authentic connection to mission impact.',
    relationshipType: 'funding-partner'
  },
  { 
    id: 'crisis-contact', 
    label: 'Crisis responder', 
    emoji: '🆘', 
    description: 'Social workers and others who need information fast when every moment counts', 
    baseDescription: 'Emergency contact person',
    storyContext: 'Maya responds to crisis contacts who need immediate, accurate information during urgent situations - they need clarity and quick action.',
    whatYouWillGet: 'A clear, urgent response that provides necessary information and next steps',
    mayaExperience: 'Crisis moments taught me clarity is everything - responders need facts fast to help effectively. Every second counts.',
    relationshipType: 'crisis-support'
  },
  { 
    id: 'media-contact', 
    label: 'Story amplifier', 
    emoji: '📰', 
    description: 'Journalists who help share our impact stories with the wider world', 
    baseDescription: 'Media professional',
    storyContext: 'Maya works with media contacts who can amplify our mission - they need compelling stories and reliable information for their audiences.',
    whatYouWillGet: 'A media-friendly message with compelling story angles and quotable insights',
    mayaExperience: 'Working with journalists showed me something powerful - media relationships succeed when you provide both human stories and credible data. They need heart and facts.',
    relationshipType: 'story-amplifier'
  },
  { 
    id: 'local-business', 
    label: 'Local business', 
    emoji: '🏪', 
    description: 'Business owners who see giving back as a smart investment in their community', 
    baseDescription: 'Local business owner',
    storyContext: 'Maya partners with local businesses who see supporting nonprofits as community investment - they need to see local impact and connection.',
    whatYouWillGet: 'A community-focused message that shows local impact and partnership opportunities',
    mayaExperience: 'These local partnerships taught me about reciprocity - businesses support causes that strengthen their community. They need to see direct local benefit.',
    relationshipType: 'community-investor'
  },
  { 
    id: 'alumni', 
    label: 'Alumni star', 
    emoji: '🎓', 
    description: 'Former participants who now inspire others and give back to the community', 
    baseDescription: 'Former program participant',
    storyContext: 'Maya celebrates alumni like Maria who prove our impact - they need respect for their journey and opportunities to give back.',
    whatYouWillGet: 'A respectful message that honors their growth and invites continued connection',
    mayaExperience: 'Our alumni remind me why we do this work - these relationships require both celebration of their success and respect for their ongoing journey.',
    relationshipType: 'success-celebration'
  },
  { 
    id: 'vendor-contractor', 
    label: 'Service provider', 
    emoji: '🔧', 
    description: 'Behind-the-scenes professionals who keep everything running smoothly', 
    baseDescription: 'External service provider',
    storyContext: 'Maya works with vendors who support our mission behind the scenes - they need clear expectations and professional respect.',
    whatYouWillGet: 'A professional service message with clear expectations and mutual respect',
    mayaExperience: "I've learned to appreciate those who work behind the scenes - vendor relationships work best with clear communication and recognition of their contribution.",
    relationshipType: 'service-professional'
  },
  { 
    id: 'government-official', 
    label: 'Policy champion', 
    emoji: '🏛️', 
    description: 'Officials who can turn our mission into meaningful policy that creates lasting change', 
    baseDescription: 'Government representative',
    storyContext: 'Maya engages with officials who can influence policy affecting our families - they need both policy data and human impact stories.',
    whatYouWillGet: 'A policy-focused message combining data with compelling human stories',
    mayaExperience: 'Policy work taught me patience and precision - government relationships require both advocacy and evidence. Officials need facts to support positions.',
    relationshipType: 'policy-advocate'
  },
  { 
    id: 'school-partner', 
    label: 'School partner', 
    emoji: '🏫', 
    description: "Educators who share our deep commitment to every child's success", 
    baseDescription: 'School representative',
    storyContext: 'Maya partners with schools who share our commitment to student success - they need collaborative communication and shared strategies.',
    whatYouWillGet: 'A collaborative education message focusing on shared student success strategies',
    mayaExperience: 'School partnerships showed me the power of aligned missions - they thrive on shared commitment to student success and collaborative problem-solving.',
    relationshipType: 'educational-partner'
  },
  { 
    id: 'health-provider', 
    label: 'Healthcare partner', 
    emoji: '🏥', 
    description: "Medical professionals who understand the whole family's needs", 
    baseDescription: 'Healthcare professional',
    storyContext: 'Maya works with healthcare providers who see the whole family - they need both professional communication and shared care coordination.',
    whatYouWillGet: 'A professional healthcare message focusing on coordinated family support',
    mayaExperience: 'Healthcare partnerships taught me about holistic care - they require both professional respect and shared commitment to family wellbeing.',
    relationshipType: 'wellness-partner'
  },
  { 
    id: 'legal-advisor', 
    label: 'Legal guide', 
    emoji: '⚖️', 
    description: 'Attorneys who help families navigate complex situations', 
    baseDescription: 'Legal professional',
    storyContext: 'Maya works with legal advisors who protect our mission and families - they need precise communication and clear documentation.',
    whatYouWillGet: 'A precise, professional legal communication with clear documentation',
    mayaExperience: 'Legal partnerships demand something special - they require both precision and trust. Advisors need clear facts and transparent communication.',
    relationshipType: 'legal-advisor'
  },
  { 
    id: 'consultant', 
    label: 'Expert advisor', 
    emoji: '💼', 
    description: 'Specialists who bring fresh perspectives to strengthen our work', 
    baseDescription: 'External consultant',
    storyContext: 'Maya partners with consultants who bring expertise to strengthen our mission - they need both professional respect and mission alignment.',
    whatYouWillGet: 'A professional consulting message that balances expertise with mission connection',
    mayaExperience: 'Consultants taught me about bridging worlds - these relationships work best when professional expertise meets genuine mission understanding.',
    relationshipType: 'expert-advisor'
  }
];

// Purpose-to-audience mapping logic - Comprehensive mapping for all purposes
const purposeToAudienceMapping = {
  'address-concern': ['concerned-parent', 'crisis-contact', 'board-member', 'staff-team', 'program-family', 'vendor-contractor', 'legal-advisor', 'consultant'],
  'share-update': ['board-member', 'major-donor', 'community-partner', 'foundation-contact', 'media-contact', 'volunteer', 'government-official', 'potential-donor'],
  'make-request': ['major-donor', 'foundation-contact', 'board-member', 'community-partner', 'volunteer', 'potential-donor', 'local-business', 'government-official'],
  'express-thanks': ['major-donor', 'volunteer', 'foundation-contact', 'community-partner', 'staff-team', 'new-volunteer', 'local-business', 'alumni'],
  'invite-action': ['potential-donor', 'community-partner', 'volunteer', 'media-contact', 'program-family', 'local-business', 'alumni', 'new-volunteer'],
  'provide-info': ['board-member', 'staff-team', 'program-family', 'media-contact', 'community-partner', 'school-partner', 'health-provider', 'concerned-parent'],
  'build-relationship': ['potential-donor', 'community-partner', 'new-volunteer', 'alumni', 'local-business', 'school-partner', 'media-contact', 'health-provider'],
  'resolve-issue': ['concerned-parent', 'crisis-contact', 'staff-team', 'board-member', 'vendor-contractor', 'legal-advisor', 'consultant', 'program-family']
};

// Maya's Story-Driven Context Descriptions
const getContextualDescription = (recipientId: string, purposeId: string): string => {
  const recipient = allRecipientOptions.find(r => r.id === recipientId);
  if (!recipient) return '';
  
  // Story-based contextual descriptions that feel like discovering Maya's experiences
  const contextualDescriptions: Record<string, Record<string, string>> = {
    'concerned-parent': {
      "address-concern": "Maya remembers Sarah calling at 11 PM, unable to sleep. Parents like this need immediate comfort and clear next steps.",
      "provide-info": "Maya knows parents like Tom who ask detailed questions because they want to make the right choice for their child.",
      "resolve-issue": "Maya has walked alongside parents like Lisa who experienced misunderstandings and needed things made right."
    },
    'major-donor': {
      "share-update": "Maya treasures partners like Patricia who invest deeply and deserve insider updates about the difference they're making.",
      "make-request": "Maya approaches committed supporters like Robert who want to see detailed plans before considering major gifts.",
      "express-thanks": "Maya celebrates generous hearts like Margaret whose annual gifts transform entire programs."
    },
    'potential-donor': {
      "invite-action": "Maya recognizes prospects like Michael who have been watching from the sidelines, ready to get involved.",
      "build-relationship": "Maya nurtures new connections like Jennifer who need time to understand the mission before committing.",
      "make-request": "Maya approaches curious supporters like David who have shown interest and may be ready to give their first gift."
    },
    'volunteer': {
      "invite-action": "Maya knows dedicated volunteers like Anna are always looking for new ways to contribute their talents.",
      "express-thanks": "Maya deeply appreciates volunteers like Carlos who give their Saturday mornings because they love the mission.",
      "share-update": "Maya keeps committed volunteers like Susan informed because they're invested in seeing the mission succeed."
    },
    'foundation-contact': {
      "make-request": "Maya prepares detailed proposals for program officers like Dr. Williams who balance mission alignment with accountability.",
      "share-update": "Maya provides thorough reports to funders like the Community Foundation who expect transparency and results.",
      "express-thanks": "Maya acknowledges foundation partners like the Smith Foundation whose grants make breakthrough programs possible."
    },
    'media-contact': {
      "share-update": "Maya shares compelling stories with journalists like Rebecca who want to highlight community impact.",
      "invite-action": "Maya invites reporters like Jake to events where they can see the mission in action and meet the families.",
      "provide-info": "Maya provides accurate information to journalists like Maria who need facts for stories that matter."
    },
    'board-member': {
      "address-concern": "Maya communicates openly with board members like David who ask tough questions because they care about governance.",
      "share-update": "Maya briefs board members like Linda who need both emotional connection and strategic information.",
      "provide-info": "Maya provides detailed information to board members like Frank who need specifics to make informed decisions."
    },
    'crisis-contact': {
      "address-concern": "Maya responds quickly to crisis contacts like Officer Martinez who need immediate, accurate information.",
      "resolve-issue": "Maya works directly with emergency responders like Dr. Peterson who need clear action plans during urgent situations."
    },
    'community-partner': {
      "build-relationship": "Maya cultivates partnerships with organizations like the Youth Center whose director shares our commitment to families.",
      "invite-action": "Maya proposes collaborations with partners like the Food Bank who can amplify our collective impact.",
      "share-update": "Maya keeps partners like the Library informed about shared outcomes and mutual successes."
    },
    'staff-team': {
      "address-concern": "Maya communicates honestly with team members like Elena who need transparent leadership during challenges.",
      "provide-info": "Maya keeps staff like Marcus informed with the details they need to serve families effectively.",
      "resolve-issue": "Maya problem-solves collaboratively with team members like Jordan who bring solutions to workplace challenges."
    }
  };
  
  return contextualDescriptions[recipientId]?.[purposeId] || recipient.storyContext || recipient.baseDescription;
};

// Dynamic filtering function
const getFilteredRecipients = (selectedPurpose: string | undefined) => {
  if (!selectedPurpose) {
    return allRecipientOptions;
  }
  
  const purposeKey = purposeOptions.find(p => p.label === selectedPurpose)?.id;
  if (!purposeKey || !purposeToAudienceMapping[purposeKey as keyof typeof purposeToAudienceMapping]) {
    return allRecipientOptions;
  }
  
  const relevantRecipientIds = purposeToAudienceMapping[purposeKey as keyof typeof purposeToAudienceMapping];
  return allRecipientOptions.filter(recipient => 
    relevantRecipientIds.includes(recipient.id)
  );
};

// Agent 4: Dynamic Tone Adaptation - Audience-to-tone mapping
const audienceToToneMapping = {
  'concerned-parent': ['warm', 'professional', 'urgent-calm'],
  'potential-donor': ['professional', 'warm', 'encouraging'],
  'major-donor': ['professional', 'grateful', 'encouraging'],
  'board-member': ['professional', 'urgent-calm'],
  'volunteer': ['warm', 'grateful', 'encouraging'],
  'new-volunteer': ['warm', 'encouraging', 'professional'],
  'staff-team': ['professional', 'urgent-calm', 'encouraging'],
  'community-partner': ['professional', 'warm', 'encouraging'],
  'program-family': ['warm', 'encouraging', 'professional'],
  'foundation-contact': ['professional', 'grateful'],
  'crisis-contact': ['urgent-calm', 'professional'],
  'media-contact': ['professional', 'warm'],
  'local-business': ['professional', 'grateful', 'encouraging'],
  'alumni': ['warm', 'grateful', 'encouraging'],
  'vendor-contractor': ['professional', 'urgent-calm'],
  'government-official': ['professional', 'urgent-calm'],
  'school-partner': ['professional', 'warm', 'encouraging'],
  'health-provider': ['professional', 'warm'],
  'legal-advisor': ['professional', 'urgent-calm'],
  'consultant': ['professional', 'encouraging']
};

// Dynamic tone filtering based on purpose and audience
const getAdaptedTones = (purpose: string | undefined, audience: string | undefined): ToneAdaptation => {
  const allTones = toneOptions;
  
  if (!purpose || !audience) {
    return {
      filteredTones: allTones,
      recommendedTone: '',
      reasoning: "Once you choose your purpose and audience, I'll share which approaches work best.",
      adaptiveHelp: "I've learned which tones work for different situations - let me guide you."
    };
  }

  const audienceKey = allRecipientOptions.find(r => r.label === audience)?.id;
  if (!audienceKey || !audienceToToneMapping[audienceKey as keyof typeof audienceToToneMapping]) {
    return {
      filteredTones: allTones,
      recommendedTone: '',
      reasoning: "I'm showing you all the approaches that could work for this person.",
      adaptiveHelp: 'Consider your relationship and the formality level needed.'
    };
  }

  const relevantToneIds = audienceToToneMapping[audienceKey as keyof typeof audienceToToneMapping];
  const filteredTones = allTones.filter(tone => relevantToneIds.includes(tone.id));
  
  // Intelligent tone recommendation based on purpose + audience combination
  const purposeKey = purposeOptions.find(p => p.label === purpose)?.id;
  let recommendedTone = '';
  let reasoning = '';
  let adaptiveHelp = '';

  // Smart recommendation logic
  if (purposeKey === 'address-concern' && audienceKey === 'concerned-parent') {
    recommendedTone = 'Warm & Understanding';
    reasoning = "I've learned that worried parents need to feel heard before anything else.";
    adaptiveHelp = 'Start with acknowledgment of their feelings, then provide clear next steps.';
  } else if (purposeKey === 'express-thanks' && audienceKey === 'major-donor') {
    recommendedTone = 'Grateful & Appreciative';
    reasoning = "These partners have given so much - they deserve to feel the impact they've made.";
    adaptiveHelp = 'Be specific about impact and connect their gift to real outcomes.';
  } else if (purposeKey === 'make-request' && audienceKey === 'board-member') {
    recommendedTone = 'Professional & Respectful';
    reasoning = 'Board members appreciate when I present clear requests with solid reasoning.';
    adaptiveHelp = 'Include background, specific ask, expected outcomes, and timeline.';
  } else if (audienceKey === 'crisis-contact') {
    recommendedTone = 'Urgent but Calm';
    reasoning = "In urgent moments, I've learned to stay calm while showing I understand the urgency.";
    adaptiveHelp = 'Lead with the situation, provide clear facts, and outline immediate next steps.';
  } else if (filteredTones.length > 0) {
    recommendedTone = filteredTones[0].label;
    reasoning = `I\'ve found that ${filteredTones[0].label.toLowerCase()} tone really resonates in this situation.`;
    adaptiveHelp = `Consider their expectations and your relationship when finalizing tone choice.`;
  }

  return {
    filteredTones,
    recommendedTone,
    reasoning,
    adaptiveHelp
  };
};

// Removed duplicate purposeOptions declaration - using the one defined earlier

// Content Adaptation Matrix - Purpose + Audience Intelligence
const purposeAudienceMatrix: PurposeAudienceMatrix = {
  // Address Concern combinations
  'address-concern_concerned-parent': {
    toneRecommendations: [
      { toneId: 'warm', priority: 'primary', reasoning: 'Parents need empathy and understanding when worried about their children' },
      { toneId: 'professional', priority: 'secondary', reasoning: 'Professional tone maintains credibility while addressing concerns' },
      { toneId: 'urgent-calm', priority: 'tertiary', reasoning: 'Shows urgency without causing panic' }
    ],
    template: {
      structure: ['Acknowledgment', 'Empathy', 'Explanation', 'Action Steps', 'Follow-up Commitment'],
      keyElements: ['Thank them for bringing this up', 'Validate their concerns', 'Provide clear explanation', 'Outline specific actions', 'Commit to follow-up'],
      callToAction: 'Schedule a meeting or phone call to discuss further'
    },
    adaptiveHelp: {
      title: 'Addressing Parent Concerns',
      explanation: "Parents are naturally protective and need to feel heard and reassured about their child's wellbeing.",
      bestPractices: ['Start with gratitude for their communication', 'Acknowledge their feelings are valid', 'Be specific about next steps', 'Offer multiple ways to stay in touch'],
      commonMistakes: ['Being defensive', 'Minimizing their concerns', 'Using technical jargon', 'Delaying response']
    }
  },
  'address-concern_major-donor': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Major donors expect professional, respectful communication' },
      { toneId: 'grateful', priority: 'secondary', reasoning: 'Acknowledge their investment and partnership' },
      { toneId: 'warm', priority: 'tertiary', reasoning: 'Personal warmth builds stronger relationships' }
    ],
    template: {
      structure: ['Relationship Acknowledgment', 'Concern Validation', 'Transparent Explanation', 'Solution Presentation', 'Partnership Reinforcement'],
      keyElements: ['Reference their partnership', 'Take concerns seriously', 'Provide transparent details', 'Present solutions', 'Strengthen relationship'],
      callToAction: 'Invite them to a private meeting to discuss in detail'
    },
    adaptiveHelp: {
      title: 'Addressing Donor Concerns',
      explanation: 'Major donors are investors in your mission and deserve transparent, strategic communication.',
      bestPractices: ['Reference their history of support', 'Be completely transparent', 'Focus on solutions', 'Reinforce shared values'],
      commonMistakes: ['Being vague about issues', 'Not acknowledging their investment', 'Appearing defensive', 'Failing to show accountability']
    }
  },
  'address-concern_board-member': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Board members need governance-level communication' },
      { toneId: 'urgent-calm', priority: 'secondary', reasoning: 'Shows appropriate urgency for governance issues' },
      { toneId: 'grateful', priority: 'tertiary', reasoning: 'Acknowledge their oversight role' }
    ],
    template: {
      structure: ['Governance Context', 'Issue Analysis', 'Risk Assessment', 'Mitigation Strategy', 'Governance Next Steps'],
      keyElements: ['Frame in governance terms', 'Analyze the issue systematically', 'Assess risks', 'Present mitigation plan', 'Define board role'],
      callToAction: 'Schedule board discussion or committee review'
    },
    adaptiveHelp: {
      title: 'Board Member Governance Communication',
      explanation: 'Board members need strategic, governance-focused communication that helps them fulfill their oversight responsibilities.',
      bestPractices: ['Frame issues in governance context', 'Include risk analysis', 'Present clear options', 'Define decision points'],
      commonMistakes: ['Too much operational detail', 'Not framing governance implications', 'Failing to present options', 'Overwhelming with information']
    }
  },
  'address-concern_volunteer': {
    toneRecommendations: [
      { toneId: 'warm', priority: 'primary', reasoning: 'Volunteers give their time freely and deserve appreciation' },
      { toneId: 'encouraging', priority: 'secondary', reasoning: 'Maintain their enthusiasm and commitment' },
      { toneId: 'grateful', priority: 'tertiary', reasoning: 'Acknowledge their valuable contribution' }
    ],
    template: {
      structure: ['Appreciation', 'Concern Validation', 'Explanation', 'Solution', 'Continued Partnership'],
      keyElements: ['Thank them for their service', 'Validate their concerns', 'Explain the situation', 'Share solutions', 'Invite continued involvement'],
      callToAction: 'Invite them to share more feedback or join solution planning'
    },
    adaptiveHelp: {
      title: 'Volunteer Concern Resolution',
      explanation: 'Volunteers are passionate about your mission and their concerns often come from a place of caring.',
      bestPractices: ['Lead with appreciation', 'Validate their passion', 'Include them in solutions', 'Keep them engaged'],
      commonMistakes: ['Dismissing their concerns', 'Being too formal', 'Not acknowledging their contribution', 'Excluding them from solutions']
    }
  },
  // Make Request combinations
  'make-request_major-donor': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Major gift requests require professional, strategic presentation' },
      { toneId: 'grateful', priority: 'secondary', reasoning: 'Acknowledge their previous support and partnership' },
      { toneId: 'warm', priority: 'tertiary', reasoning: 'Personal connection enhances the relationship' }
    ],
    template: {
      structure: ['Relationship Context', 'Impact Story', 'Specific Need', 'Investment Opportunity', 'Next Steps'],
      keyElements: ['Reference their support history', 'Share compelling impact story', 'Present specific need', 'Frame as investment', 'Provide clear next steps'],
      callToAction: 'Schedule a meeting to discuss their potential involvement'
    },
    adaptiveHelp: {
      title: 'Major Gift Request Strategy',
      explanation: 'Major gift requests should position the donor as a strategic partner in creating impact.',
      bestPractices: ['Reference their giving history', 'Lead with impact story', 'Be specific about the ask', 'Show return on investment'],
      commonMistakes: ['Generic ask without personalization', 'Focusing on organizational need vs impact', 'Vague request amounts', 'No clear next steps']
    }
  },
  'make-request_board-member': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Board requests require governance-appropriate communication' },
      { toneId: 'urgent-calm', priority: 'secondary', reasoning: 'Shows appropriate priority for board attention' },
      { toneId: 'grateful', priority: 'tertiary', reasoning: 'Acknowledge their leadership role' }
    ],
    template: {
      structure: ['Board Context', 'Strategic Rationale', 'Resource Request', 'Expected Outcomes', 'Board Action Needed'],
      keyElements: ['Frame in board oversight context', 'Provide strategic justification', 'Specify resource needs', 'Define success metrics', 'Clarify board role'],
      callToAction: 'Request board discussion or formal approval'
    },
    adaptiveHelp: {
      title: 'Board Resource Requests',
      explanation: 'Board members need strategic context and governance implications when considering resource requests.',
      bestPractices: ['Provide strategic rationale', 'Include budget implications', 'Define success metrics', 'Clarify approval process'],
      commonMistakes: ['Operational details without strategy', 'No cost-benefit analysis', 'Unclear approval pathway', 'Missing risk assessment']
    }
  },
  'make-request_volunteer': {
    toneRecommendations: [
      { toneId: 'warm', priority: 'primary', reasoning: 'Volunteers respond to personal, warm requests' },
      { toneId: 'encouraging', priority: 'secondary', reasoning: 'Inspire them about the opportunity' },
      { toneId: 'grateful', priority: 'tertiary', reasoning: 'Acknowledge their existing contribution' }
    ],
    template: {
      structure: ['Appreciation', 'Opportunity Presentation', 'Impact Connection', 'Specific Ask', 'Flexible Participation'],
      keyElements: ['Thank them for current service', 'Present exciting opportunity', 'Connect to mission impact', 'Make specific ask', 'Offer flexible options'],
      callToAction: 'Invite them to learn more or commit to specific role'
    },
    adaptiveHelp: {
      title: 'Volunteer Opportunity Requests',
      explanation: 'Volunteers are motivated by mission connection and personal fulfillment.',
      bestPractices: ['Connect to mission impact', 'Offer flexible options', 'Highlight personal growth', 'Make it easy to say yes'],
      commonMistakes: ['Demanding without appreciation', 'Rigid requirements', 'No mission connection', 'Overwhelming commitment']
    }
  },
  // Express Thanks combinations
  'express-thanks_volunteer': {
    toneRecommendations: [
      { toneId: 'warm', priority: 'primary', reasoning: 'Volunteers deserve heartfelt, personal appreciation' },
      { toneId: 'grateful', priority: 'secondary', reasoning: 'Deep gratitude for their service' },
      { toneId: 'encouraging', priority: 'tertiary', reasoning: 'Celebrate their contribution and impact' }
    ],
    template: {
      structure: ['Personal Recognition', 'Specific Impact', 'Gratitude Expression', 'Community Value', 'Future Invitation'],
      keyElements: ['Name their specific contribution', 'Quantify their impact', 'Express genuine gratitude', 'Show their value to community', 'Invite continued involvement'],
      callToAction: 'Invite them to celebration event or continued partnership'
    },
    adaptiveHelp: {
      title: 'Volunteer Appreciation',
      explanation: 'Volunteers give freely of their time and deserve specific, heartfelt recognition.',
      bestPractices: ['Be specific about their contribution', 'Quantify impact when possible', 'Make it personal', 'Share community benefit'],
      commonMistakes: ['Generic thank you', 'No specific examples', 'Focusing on organization vs impact', 'Forgetting personal touch']
    }
  },
  'express-thanks_major-donor': {
    toneRecommendations: [
      { toneId: 'grateful', priority: 'primary', reasoning: 'Major donors deserve profound gratitude for their investment' },
      { toneId: 'professional', priority: 'secondary', reasoning: 'Maintain professional relationship standards' },
      { toneId: 'warm', priority: 'tertiary', reasoning: 'Personal warmth strengthens partnership' }
    ],
    template: {
      structure: ['Partnership Acknowledgment', 'Impact Documentation', 'Gratitude Expression', 'Community Benefit', 'Relationship Strengthening'],
      keyElements: ['Acknowledge their partnership', 'Document specific impact', 'Express deep gratitude', 'Show community transformation', 'Strengthen relationship'],
      callToAction: 'Invite them to see impact firsthand or continue partnership'
    },
    adaptiveHelp: {
      title: 'Major Donor Stewardship',
      explanation: 'Major donors are partners in your mission and deserve detailed impact reporting and genuine gratitude.',
      bestPractices: ['Include impact metrics', 'Show long-term community benefit', 'Make it personal', 'Invite deeper engagement'],
      commonMistakes: ['Generic acknowledgment', 'No impact measurement', 'Transactional tone', 'Missing personal connection']
    }
  },
  // Build Relationship combinations
  'build-relationship_program-participant': {
    toneRecommendations: [
      { toneId: 'warm', priority: 'primary', reasoning: 'Families need to feel welcomed and supported' },
      { toneId: 'encouraging', priority: 'secondary', reasoning: 'Build confidence in their participation' },
      { toneId: 'professional', priority: 'tertiary', reasoning: 'Maintain professional boundaries while being warm' }
    ],
    template: {
      structure: ['Welcome', 'Program Value', 'Support Availability', 'Community Connection', 'Open Communication'],
      keyElements: ['Welcome them warmly', 'Explain program benefits', 'Offer support resources', 'Connect to community', 'Encourage communication'],
      callToAction: 'Invite them to upcoming event or program activity'
    },
    adaptiveHelp: {
      title: 'Program Family Relationship Building',
      explanation: 'Program families need to feel welcomed, supported, and valued as community members.',
      bestPractices: ['Use welcoming language', 'Explain available support', 'Connect to other families', 'Encourage questions'],
      commonMistakes: ['Too formal tone', 'Overwhelming with information', 'Not offering support', 'Creating barriers to communication']
    }
  },
  'build-relationship_community-partner': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Partners expect professional, collaborative communication' },
      { toneId: 'warm', priority: 'secondary', reasoning: 'Build genuine partnership connection' },
      { toneId: 'encouraging', priority: 'tertiary', reasoning: 'Inspire collaborative opportunities' }
    ],
    template: {
      structure: ['Partnership Vision', 'Mutual Benefits', 'Collaboration Opportunities', 'Resource Sharing', 'Next Steps'],
      keyElements: ['Paint partnership vision', 'Identify mutual benefits', 'Explore collaboration', 'Discuss resource sharing', 'Define next steps'],
      callToAction: 'Schedule partnership planning meeting'
    },
    adaptiveHelp: {
      title: 'Community Partnership Development',
      explanation: 'Community partners want to understand mutual benefits and collaboration opportunities.',
      bestPractices: ['Focus on mutual benefits', 'Explore win-win opportunities', 'Be specific about collaboration', 'Respect their expertise'],
      commonMistakes: ['One-sided benefits', 'Vague collaboration ideas', 'Not respecting their priorities', 'Rushing the relationship']
    }
  },
  // Resolve Issue combinations
  'resolve-issue_staff-team': {
    toneRecommendations: [
      { toneId: 'professional', priority: 'primary', reasoning: 'Staff need clear, professional problem-solving communication' },
      { toneId: 'urgent-calm', priority: 'secondary', reasoning: 'Shows appropriate urgency without panic' },
      { toneId: 'encouraging', priority: 'tertiary', reasoning: 'Maintain team morale during problem resolution' }
    ],
    template: {
      structure: ['Issue Identification', 'Impact Assessment', 'Solution Strategy', 'Implementation Plan', 'Support Resources'],
      keyElements: ['Clearly identify issue', 'Assess impact', 'Present solution strategy', 'Outline implementation', 'Provide support resources'],
      callToAction: 'Schedule team meeting to discuss implementation'
    },
    adaptiveHelp: {
      title: 'Staff Issue Resolution',
      explanation: 'Staff need clear, actionable communication that helps them understand and address problems effectively.',
      bestPractices: ['Be clear about the issue', 'Provide solution path', 'Offer support resources', 'Maintain team unity'],
      commonMistakes: ['Vague problem description', 'No clear solution path', 'Blame culture', 'Insufficient support']
    }
  },
  'resolve-issue_crisis-contact': {
    toneRecommendations: [
      { toneId: 'urgent-calm', priority: 'primary', reasoning: 'Crisis situations require calm urgency' },
      { toneId: 'professional', priority: 'secondary', reasoning: 'Maintain professional standards in crisis' },
      { toneId: 'warm', priority: 'tertiary', reasoning: 'Provide human connection during crisis' }
    ],
    template: {
      structure: ['Crisis Acknowledgment', 'Immediate Actions', 'Support Resources', 'Communication Plan', 'Follow-up Commitment'],
      keyElements: ['Acknowledge crisis seriously', 'Outline immediate actions', 'Provide support resources', 'Establish communication plan', 'Commit to follow-up'],
      callToAction: 'Provide emergency contact information and next steps'
    },
    adaptiveHelp: {
      title: 'Crisis Communication',
      explanation: 'Crisis situations require calm, professional response that provides clarity and support.',
      bestPractices: ['Stay calm and professional', 'Provide clear next steps', 'Offer immediate support', 'Maintain regular communication'],
      commonMistakes: ['Panic or emotional response', 'Vague next steps', 'Insufficient support', 'Poor communication rhythm']
    }
  }
};

// Dynamic Functions for Content Adaptation Engine
const getSmartRecommendations = (purposeId: string, audienceId: string) => {
  if (!purposeId || !audienceId) {
    return {
      primary: "Once you tell me your purpose and audience, I can share what I've learned works best",
      secondary: [],
      contextualTips: []
    };
  }

  const key = `${purposeId}_${audienceId}`;
  const matrix = purposeAudienceMatrix[key];
  
  if (!matrix) {
    return {
      primary: 'Think about your relationship and what you want to achieve',
      secondary: ["Keep your message simple and clear", "Match how you speak to who you're speaking to"],
      contextualTips: ["Look at emails that worked before", "Think about timing - is this the right moment?"]
    };
  }

  return {
    primary: matrix.adaptiveHelp.explanation,
    secondary: matrix.adaptiveHelp.bestPractices,
    contextualTips: matrix.adaptiveHelp.commonMistakes.map(mistake => `Avoid: ${mistake}`)
  };
};

const getContextualTemplate = (purposeId: string, audienceId: string) => {
  if (!purposeId || !audienceId) {
    return {
      structure: ["Warm Opening", "Your Main Message", "Clear Closing"],
      keyElements: ["Subject that grabs attention", "Right greeting for the relationship", "What you want them to do next"],
      callToAction: 'Always end with what happens next'
    };
  }

  const key = `${purposeId}_${audienceId}`;
  const matrix = purposeAudienceMatrix[key];
  
  if (!matrix) {
    return {
      structure: ["Personal Opening", "Your Core Message", "What You Need", "Warm Closing"],
      keyElements: ["Personal greeting that fits", "Crystal clear main point", "Exactly what you need or want to share", "Right way to sign off"],
      callToAction: "Tell them exactly what you'd like them to do"
    };
  }

  return matrix.template;
};

const getContentAdaptation = (purposeId: string, audienceId: string): ToneAdaptation => {
  if (!purposeId || !audienceId) {
    return {
      filteredTones: toneOptions,
      recommendedTone: '',
      reasoning: "Once you choose your purpose and audience, I'll share which approaches work best.",
      adaptiveHelp: "I've learned which tones work for different situations - let me guide you."
    };
  }

  const key = `${purposeId}_${audienceId}`;
  const matrix = purposeAudienceMatrix[key];
  
  if (!matrix) {
    // Fallback to existing getAdaptedTones logic
    const purposeLabel = purposeOptions.find(p => p.id === purposeId)?.label;
    const audienceLabel = allRecipientOptions.find(a => a.id === audienceId)?.label;
    return getAdaptedTones(purposeLabel, audienceLabel);
  }

  // Use matrix data for sophisticated adaptation
  const primaryTone = matrix.toneRecommendations.find(t => t.priority === 'primary');
  const recommendedToneId = primaryTone?.toneId || '';
  const recommendedTone = toneOptions.find(t => t.id === recommendedToneId)?.label || '';
  
  // Filter tones based on all recommendations in the matrix
  const recommendedToneIds = matrix.toneRecommendations.map(t => t.toneId);
  const filteredTones = toneOptions.filter(tone => recommendedToneIds.includes(tone.id));
  
  return {
    filteredTones: filteredTones.length > 0 ? filteredTones : toneOptions,
    recommendedTone,
    reasoning: primaryTone?.reasoning || matrix.adaptiveHelp.explanation,
    adaptiveHelp: matrix.adaptiveHelp.title
  };
};

export const MayaEmailComposer: React.FC<MayaEmailComposerProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('intro');
  const [recipe, setRecipe] = useState<Partial<EmailRecipe>>({});
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime] = useState(Date.now());
  const [recipesCreated, setRecipesCreated] = useState(0);
  const [currentLayer, setCurrentLayer] = useState(1);
  const [additionalContext, setAdditionalContext] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [usageCount, setUsageCount] = useState(() => {
    const stored = localStorage.getItem('maya-email-composer-usage');
    return stored ? parseInt(stored, 10) : 0;
  });
  
  // Voice and transcript state for enhanced interaction
  const [userResponse, setUserResponse] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Enhanced Animation & UX State
  const [showPreview, setShowPreview] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  
  // PACE Step Management
  const [currentPaceStep, setCurrentPaceStep] = useState<PaceStep>('purpose');
  const [completedPaceSteps, setCompletedPaceSteps] = useState<PaceStep[]>([]);
  const [filteredAudiences, setFilteredAudiences] = useState<typeof allRecipientOptions>([]);
  const [availableContentStrategies, setAvailableContentStrategies] = useState<ReturnType<typeof getContentStrategies>>([]);
  
  // Dynamic Choice Service State
  const [currentChoicePath, setCurrentChoicePath] = useState<ChoicePath | null>(null);
  const [dynamicAudiences, setDynamicAudiences] = useState<any[]>([]);
  const [isGeneratingDynamicChoices, setIsGeneratingDynamicChoices] = useState(false);
  const [dynamicError, setDynamicError] = useState<string | null>(null);
  
  // Dynamic Execution Options State
  const [executionOptions, setExecutionOptions] = useState<any[]>([]);
  const [selectedExecutionOption, setSelectedExecutionOption] = useState<string | null>(null);
  const [isGeneratingExecutionOptions, setIsGeneratingExecutionOptions] = useState(false);
  
  // PACE Steps Configuration for Stepper
  const paceStepLabels = ['Purpose', 'Audience', 'Content', 'Execute'];
  const stepCompletionStatus = [
    completedPaceSteps.includes('purpose'),
    completedPaceSteps.includes('audience'), 
    completedPaceSteps.includes('content'),
    completedPaceSteps.includes('execution')
  ];
  
  // Get current step index for stepper
  const getCurrentStepIndex = () => {
    const stepOrder: PaceStep[] = ['purpose', 'audience', 'content', 'execution'];
    return stepOrder.indexOf(currentPaceStep);
  };
  
  // Enhanced layer transition with animation
  const transitionToStep = (newStep: PaceStep, delay = 0) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPaceStep(newStep);
      setCurrentLayer(getCurrentStepIndex() + 1);
      setIsTransitioning(false);
      setAnimationKey(prev => prev + 1);
      setShowPreview(true);
    }, delay);
  };
  
  // Content Adaptation Engine State
  const [contentAdaptation, setContentAdaptation] = useState<ToneAdaptation | null>(null);
  const [smartRecommendations, setSmartRecommendations] = useState(getSmartRecommendations('', ''));
  const [contextualTemplate, setContextualTemplate] = useState(getContextualTemplate('', ''));
  
  // PACE Progress Helper Functions
  const paceProgress: PaceProgress = {
    currentStep: currentPaceStep,
    completedSteps: completedPaceSteps,
    isStepComplete: (step: PaceStep) => completedPaceSteps.includes(step),
    canAdvanceToStep: (step: PaceStep) => {
      const stepOrder: PaceStep[] = ['purpose', 'audience', 'content', 'execution'];
      const currentIndex = stepOrder.indexOf(step);
      if (currentIndex === 0) return true;
      return completedPaceSteps.includes(stepOrder[currentIndex - 1]);
    }
  };
  
  // Gamification integration
  const { isCompleted, timeSpent, trackInteraction, markAsComplete } = useComponentProgress({
    componentId: 'MayaEmailComposer',
    autoStart: true,
    completionThreshold: 80
  });

  // PACE Step Handlers
  // Generate Dynamic Audiences using AI
  const generateDynamicAudiences = async (purposeId: string) => {
    try {
      setIsGeneratingDynamicChoices(true);
      setDynamicError(null);
      
      const mayaContext = createMayaUserContext();
      const dynamicPurpose = mapToDynamicPurpose(purposeId);
      
      const request: PathGenerationRequest = {
        purpose: dynamicPurpose,
        context: mayaContext
      };
      
      const choicePath = await dynamicChoiceService.generateDynamicPath(request);
      setCurrentChoicePath(choicePath);
      
      // Convert dynamic audience to display format compatible with existing UI
      const dynamicAudience = choicePath.audience;
      const enhancedAudiences = allRecipientOptions.map(staticAudience => ({
        ...staticAudience,
        // Add AI-powered enhancement to existing options
        aiEnhancement: {
          relevanceScore: Math.random() * 0.3 + 0.7, // 0.7-1.0 score
          personalizedDescription: `AI suggests: ${dynamicAudience.description || staticAudience.description}`,
          contextualReasoning: `For ${dynamicPurpose}, this audience type aligns with Maya's communication goals.`
        }
      }));
      
      // Combine static filtering with AI prioritization
      const staticFiltered = getFilteredAudienceOptions(purposeId);
      const aiEnhanced = staticFiltered.map(audience => {
        const enhanced = enhancedAudiences.find(e => e.id === audience.id);
        return enhanced || audience;
      });
      
      setDynamicAudiences(aiEnhanced);
      setFilteredAudiences(aiEnhanced);
      
      toast.success("✨ Your audience options just got smarter! I've added some personalized suggestions based on your nonprofit's unique community.", { duration: 3000 });
      
    } catch (error) {
      console.error('Dynamic audience generation failed:', error);
      setDynamicError('AI enhancement unavailable, using Maya\'s experience instead');
      
      // Fallback to static filtering
      const filtered = getFilteredAudienceOptions(purposeId);
      setFilteredAudiences(filtered);
      
      toast.error("💝 Don't worry - I'll use my tried-and-true experience to guide you through this. Sometimes the human touch is exactly what we need!");
    } finally {
      setIsGeneratingDynamicChoices(false);
    }
  };

  const handlePurposeSelect = async (purpose: typeof purposeOptions[0]) => {
    if (phase !== 'build') return;
    
    setRecipe({ ...recipe, purpose: purpose.label, purposeEmoji: purpose.emoji });
    
    // Mark purpose step as complete and advance to audience
    if (!completedPaceSteps.includes('purpose')) {
      setCompletedPaceSteps([...completedPaceSteps, 'purpose']);
    }
    setCurrentPaceStep('audience');
    
    // Generate AI-enhanced audiences
    await generateDynamicAudiences(purpose.id);
    
    trackInteraction(25); // 25% progress for purpose selection
  };
  
  // Generate Personalized Content using Dynamic Choice Path
  const generatePersonalizedContent = async (audienceId: string) => {
    if (!currentChoicePath) return;
    
    try {
      const personalizedTemplate = currentChoicePath.content.framework.structure;
      const mayaContext = createMayaUserContext();
      
      // Create personalized content suggestion based on chosen path
      const contentSuggestion = {
        opening: personalizedTemplate.openingApproach,
        structure: personalizedTemplate.bodyFramework,
        closing: personalizedTemplate.closingStrategy,
        tone: currentChoicePath.content.toneGuidelines?.[0] || 'warm_personal',
        personalizedHints: currentChoicePath.content.personalizedGuidance?.steps?.map(step => step.instruction) || []
      };
      
      return contentSuggestion;
    } catch (error) {
      console.error('Personalized content generation failed:', error);
      return null;
    }
  };

  const handleAudienceSelect = async (audience: typeof allRecipientOptions[0]) => {
    if (phase !== 'build' || !paceProgress.canAdvanceToStep('audience')) return;
    
    setRecipe({ ...recipe, audience: audience.label, audienceEmoji: audience.emoji });
    
    // Mark audience step as complete and advance to content
    if (!completedPaceSteps.includes('audience')) {
      setCompletedPaceSteps([...completedPaceSteps, 'audience']);
    }
    setCurrentPaceStep('content');
    
    // Generate personalized content if we have a dynamic choice path
    if (currentChoicePath) {
      const personalizedContent = await generatePersonalizedContent(audience.id);
      if (personalizedContent) {
        toast.success("🎯 I've crafted a personalized content strategy just for you! This approach has helped hundreds of nonprofits connect more deeply with their communities.", { duration: 3500 });
      }
    }
    
    // Update available content strategies based on purpose + audience using Content Adaptation Engine
    const purposeId = purposeOptions.find(p => p.label === recipe.purpose)?.id;
    if (purposeId) {
      const adaptation = getContentAdaptation(purposeId, audience.id);
      setContentAdaptation(adaptation);
      setSmartRecommendations(getSmartRecommendations(purposeId, audience.id));
      setContextualTemplate(getContextualTemplate(purposeId, audience.id));
      
      // Use adaptive tone filtering for content strategies
      setAvailableContentStrategies(adaptation.filteredTones);
    } else {
      // Fallback to existing system
      const strategies = getContentStrategies(recipe.purpose!, audience.id);
      setAvailableContentStrategies(strategies);
    }
    
    trackInteraction(25); // 25% progress for audience selection
  };
  
  const handleContentStrategySelect = (strategy: ReturnType<typeof getContentStrategies>[0]) => {
    if (phase !== 'build' || !paceProgress.canAdvanceToStep('content')) return;
    
    setRecipe({ ...recipe, tone: strategy.label, toneEmoji: strategy.emoji });
    
    // Mark content step as complete and advance to execution
    if (!completedPaceSteps.includes('content')) {
      setCompletedPaceSteps([...completedPaceSteps, 'content']);
    }
    setCurrentPaceStep('execution');
    
    // Generate execution options when moving to execution step
    generateExecutionOptions();
    
    trackInteraction(25); // 25% progress for content strategy selection
  };

  // Generate Dynamic Execution Options
  const generateExecutionOptions = async () => {
    if (!recipe.purpose || !recipe.audience || !recipe.tone) {
      console.warn('Cannot generate execution options without complete recipe');
      return;
    }
    
    setIsGeneratingExecutionOptions(true);
    
    try {
      // Create user context for dynamic choice generation
      const userContext: UserContext = {
        userId: 'maya-user',
        currentSkillLevel: 'intermediate' as ExperienceLevel,
        timeAvailable: 15,
        stressLevel: 3,
        confidenceLevel: 7,
        preferredCommunicationStyle: 'warm_personal' as CommunicationStyle,
        pastPerformance: [],
        currentGoals: ['effective_communication'],
        activeConstraints: [],
        learningPreferences: []
      };
      
      // Generate path with execution variants
      const pathRequest: PathGenerationRequest = {
        purpose: recipe.purpose as PurposeType,
        context: userContext
      };
      
      const choicePath = await dynamicChoiceService.generatePath(pathRequest);
      
      // Create 3 execution options with natural language descriptions
      const options = [
        {
          id: 'quick_draft',
          name: 'Quick Draft',
          description: 'Let me help you create a clear, effective email in just a few minutes',
          naturalDescription: 'Perfect when you need to send something thoughtful but don\'t have a lot of time',
          icon: '⚡',
          timeEstimate: '2-3 minutes',
          approach: 'streamlined',
          benefits: ['Fast and efficient', 'Gets to the point', 'Still warm and personal'],
          executionType: 'quick'
        },
        {
          id: 'thoughtful_approach',
          name: 'Thoughtful Approach',
          description: 'We\'ll take our time to craft something really meaningful and well-structured',
          naturalDescription: 'When you want to make sure every word counts and truly connects',
          icon: '🎯',
          timeEstimate: '5-7 minutes',
          approach: 'thorough',
          benefits: ['Well-structured content', 'Thoughtful word choice', 'Professional yet personal'],
          executionType: 'thorough'
        },
        {
          id: 'mayas_special_touch',
          name: 'Maya\'s Special Touch',
          description: 'Let me add my storytelling magic to make this email truly unforgettable',
          naturalDescription: 'For those times when you want to create something that really stands out',
          icon: '✨',
          timeEstimate: '7-10 minutes',
          approach: 'creative',
          benefits: ['Engaging storytelling', 'Memorable content', 'Deeply personal connection'],
          executionType: 'creative'
        }
      ];
      
      setExecutionOptions(options);
    } catch (error) {
      console.error('Error generating execution options:', error);
      // Fallback to default options
      setExecutionOptions([
        {
          id: 'quick_draft',
          name: 'Quick Draft',
          description: 'Let me help you create a clear, effective email in just a few minutes',
          naturalDescription: 'Perfect when you need to send something thoughtful but don\'t have a lot of time',
          icon: '⚡',
          timeEstimate: '2-3 minutes',
          approach: 'streamlined',
          benefits: ['Fast and efficient', 'Gets to the point', 'Still warm and personal'],
          executionType: 'quick'
        },
        {
          id: 'thoughtful_approach',
          name: 'Thoughtful Approach',
          description: 'We\'ll take our time to craft something really meaningful and well-structured',
          naturalDescription: 'When you want to make sure every word counts and truly connects',
          icon: '🎯',
          timeEstimate: '5-7 minutes',
          approach: 'thorough',
          benefits: ['Well-structured content', 'Thoughtful word choice', 'Professional yet personal'],
          executionType: 'thorough'
        },
        {
          id: 'mayas_special_touch',
          name: 'Maya\'s Special Touch',
          description: 'Let me add my storytelling magic to make this email truly unforgettable',
          naturalDescription: 'For those times when you want to create something that really stands out',
          icon: '✨',
          timeEstimate: '7-10 minutes',
          approach: 'creative',
          benefits: ['Engaging storytelling', 'Memorable content', 'Deeply personal connection'],
          executionType: 'creative'
        }
      ]);
    } finally {
      setIsGeneratingExecutionOptions(false);
    }
  };
  
  // Enhanced Legacy handlers with animations
  const handleToneSelect = (tone: typeof availableContentStrategies[0]) => {
    // Validate we're in the correct phase
    if (phase !== 'build') {
      console.warn('Cannot select tone outside of build phase');
      return;
    }
    
    setRecipe({ ...recipe, tone: tone.label, toneEmoji: tone.emoji });
    
    // Mark content step as completed
    const newCompletedSteps = [...completedPaceSteps];
    if (!newCompletedSteps.includes('content')) {
      newCompletedSteps.push('content');
      setCompletedPaceSteps(newCompletedSteps);
    }
    
    setCurrentLayer(4); // Move to execution
    trackInteraction(25);
    
    // Enhanced success feedback with animation
    toast.success('✨ Perfect choice! That approach has helped so many nonprofits create meaningful connections. You\'re on the right track! 🎯', {
      className: 'animate-bounce',
      duration: 2000
    });
  };

  const handleRecipientSelect = (recipient: typeof allRecipientOptions[0]) => {
    // Validate we're in the correct phase
    if (phase !== 'build') {
      console.warn('Cannot select recipient outside of build phase');
      return;
    }
    if (!recipe.purpose) {
      toast.error("🌟 Let's start with your purpose - the heart of every great email! What do you want this message to accomplish?");
      return;
    }
    
    setRecipe({ ...recipe, audience: recipient.label, audienceEmoji: recipient.emoji });
    
    // Mark audience step as completed
    const newCompletedSteps = [...completedPaceSteps];
    if (!newCompletedSteps.includes('audience')) {
      newCompletedSteps.push('audience');
      setCompletedPaceSteps(newCompletedSteps);
    }
    
    // Update available content strategies
    setAvailableContentStrategies(getContentStrategies(recipe.purpose!, recipient.label));
    setCurrentLayer(3); // Move to content selection
    
    trackInteraction(25);
    
    // Enhanced success feedback
    toast.success("🎯 Perfect! Now I can see exactly who you're writing to. This connection is going to be so much more meaningful! ✨", {
      className: 'animate-bounce',
      duration: 2000
    });
  };

  // Removed duplicate handlePurposeSelect - using PACE version above

  const handleExampleSelect = (example: AIExample) => {
    const data = example.data;
    
    // Map example data to recipe
    if (data.tone) {
      const toneOption = toneOptions.find(t => t.id === data.tone || t.label.toLowerCase().includes(data.tone.toLowerCase()));
      if (toneOption) {
        setRecipe(prev => ({ ...prev, tone: toneOption.label, toneEmoji: toneOption.emoji }));
        setCurrentLayer(2);
      }
    }
    
    if (data.recipient) {
      const recipientOption = allRecipientOptions.find(r => 
        r.id === data.recipient || 
        r.label.toLowerCase().includes(data.recipient.toLowerCase()) ||
        r.description.toLowerCase().includes(data.recipient.toLowerCase())
      );
      if (recipientOption) {
        setRecipe(prev => ({ ...prev, recipient: recipientOption.label, recipientEmoji: recipientOption.emoji }));
        setCurrentLayer(3);
      }
    }
    
    if (data.purpose) {
      const purposeOption = purposeOptions.find(p => 
        p.id === data.purpose || 
        p.label.toLowerCase().includes(data.purpose.toLowerCase())
      );
      if (purposeOption) {
        setRecipe(prev => ({ ...prev, purpose: purposeOption.label, purposeEmoji: purposeOption.emoji }));
      }
    }
    
    // Set additional context and key points if provided
    if (data.context) {
      setAdditionalContext(data.context);
    }
    
    if (data.keyPoints) {
      setKeyPoints(data.keyPoints);
    }
    
    // Start in build phase if not already there
    if (phase === 'intro') {
      setPhase('build');
    }
    
    toast.success("✨ I've loaded that example for you! This is one of my favorites - feel free to make it your own. Every great email starts with inspiration!");
    trackInteraction(40); // Bonus progress for using examples
  };

  // PACE-based progress calculation
  const paceRecipeProgress = completedPaceSteps.length / 4;
  const isRecipeComplete = recipe.purpose && recipe.audience && recipe.tone;
  const recipeProgress = paceRecipeProgress; // For backward compatibility
  
  // Clear transcript and voice responses
  const clearTranscript = () => {
    setUserResponse('');
    setCurrentTranscript('');
  };

  const generateEmail = async (executionType: string = 'balanced') => {
    if (!isRecipeComplete) {
      toast.error('🌟 Let me help you finish building your email recipe first! We\'re so close to creating something amazing together.');
      return;
    }
    
    // Ensure we're in the build phase
    if (phase !== 'build') {
      console.warn('Cannot generate email outside of build phase');
      return;
    }
    
    setIsGenerating(true);
    
    // Track usage
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('maya-email-composer-usage', newCount.toString());
    localStorage.setItem('maya-last-used', new Date().toISOString());
    
    try {
      // Use retry logic for AI service calls
      const email = await retryWithBackoff(async () => {
        // Use contextual template from Content Adaptation Engine
        const template = contextualTemplate;
        
        // Customize context based on execution type
        let executionContext = '';
        const selectedOption = executionOptions.find(opt => opt.executionType === executionType);
        
        switch (executionType) {
          case 'quick':
            executionContext = 'Focus on clarity and efficiency. Keep the email concise while maintaining warmth.';
            break;
          case 'thorough':
            executionContext = 'Take time to craft thoughtful, well-structured content with careful word choice.';
            break;
          case 'creative':
            executionContext = 'Add storytelling elements and creative touches to make the email memorable and engaging.';
            break;
          default:
            executionContext = 'Create a well-balanced email that is both professional and personal.';
        }
        
        const enhancedContext = `${additionalContext || "after-school program communication"}\n\nExecution Style: ${executionContext}\nEmail Structure: ${template.structure.join(" → ")}\nKey Elements: ${template.keyElements.join(", ")}\nCall to Action: ${template.callToAction}`;
        
        return await enhancedAIService.generateEmail({
          tone: recipe.tone!,
          recipient: recipe.audience || recipe.recipient!,
          purpose: recipe.purpose!,
          context: enhancedContext,
          keyPoints: keyPoints.length > 0 ? keyPoints : undefined
        });
      });
      
      setGeneratedEmail(email);
      setRecipesCreated(prev => prev + 1);
      setPhase('preview');
      trackInteraction(20); // Final 20% for generating email
    } catch (error) {
      const aiError = handleAIError(error);
      console.error('Email generation failed:', aiError);
      toast.error(aiError.userMessage);
      
      // Fallback to mock content
      const fallbackEmail = `Dear ${recipe.recipient},

I hope this message finds you well. Thank you for reaching out about your concerns regarding our programs.

I completely understand your situation and want to address your needs effectively. Here's what we're doing to help:

• Implementing immediate improvements to address your concerns
• Scheduling follow-up meetings to ensure continued communication
• Creating clear processes for future interactions
• Providing ongoing support and resources

Please don't hesitate to reach out if you have any other questions or concerns. We truly value your involvement and feedback.

Best regards,
Maya Rodriguez
Program Director`;
      
      setGeneratedEmail(fallbackEmail);
      setRecipesCreated(prev => prev + 1);
      setPhase('preview');
      trackInteraction(20); // Final 20% for generating email
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast.success("✨ I've copied that beautiful email for you! Time to share your message with the world. You should be proud of what you've created!");
  };

  const handleTryAgain = () => {
    // Reset PACE state
    setCurrentPaceStep('purpose');
    setCompletedPaceSteps([]);
    setFilteredAudiences([]);
    setAvailableContentStrategies([]);
    
    // Reset Dynamic Choice Service state
    setCurrentChoicePath(null);
    setDynamicAudiences([]);
    setIsGeneratingDynamicChoices(false);
    setDynamicError(null);
    
    // Reset Content Adaptation Engine state
    setContentAdaptation(null);
    setSmartRecommendations(getSmartRecommendations('', ''));
    setContextualTemplate(getContextualTemplate('', ''));
    
    // Reset all state to ensure clean restart
    setRecipe({});
    setCurrentLayer(1);
    setPhase('build');
    setGeneratedEmail('');
    setAdditionalContext('');
    setKeyPoints([]);
    // Clear any interim transcripts or other temporary state
    clearTranscript?.();
  };

  const handleViewTransformation = () => {
    // Validate we're in preview phase before transitioning to success
    if (phase !== 'preview') {
      console.warn('Cannot view transformation from current phase:', phase);
      return;
    }
    
    setPhase('success');
    // Mark component as complete when viewing transformation
    if (!isCompleted) {
      markAsComplete(100);
    }
    onComplete?.({
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      recipesCreated,
      transformationViewed: true
    });
  };

  return (
    <AIComponentErrorBoundary componentName="MayaEmailComposer">
      <div role="region" aria-label="Email composition tool" className="maya-component-wrapper">
        {/* Progress Header - Sticky and responsive */}
        <div className="maya-progress-header">
          <ProgressWidget
            componentId="MayaEmailComposer"
            isCompleted={isCompleted}
            timeSpent={timeSpent}
            characterName="Maya"
            characterColor="purple"
            className="maya-progress-widget"
          />
          
          {/* Skills Counter - Only show on desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="maya-skills-counter">
              Progress: {completedPaceSteps.length}/4 steps
            </span>
            <div className="maya-progress-dots">
              {[1, 2, 3, 4].map((dot) => (
                <div
                  key={dot}
                  className={`maya-progress-dot ${
                    completedPaceSteps.length >= dot ? 'active' : 'inactive'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced PACE Stepper - Show during build phase */}
        {phase === 'build' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <PACEStepper
              currentStep={getCurrentStepIndex()}
              totalSteps={4}
              stepLabels={paceStepLabels}
              completedSteps={stepCompletionStatus}
              onStepClick={(step) => {
                // Allow navigation to completed steps or current step
                const stepOrder: PaceStep[] = ['purpose', 'audience', 'content', 'execution'];
                const targetStep = stepOrder[step];
                if (step <= getCurrentStepIndex() || stepCompletionStatus[step]) {
                  setCurrentPaceStep(targetStep);
                  setCurrentLayer(step + 1);
                }
              }}
            />
          </motion.div>
        )}
        
        <div className="maya-component-content">
      
      {/* Story Context - Only show initially */}
      {phase === 'intro' && (
        <StoryIntegration 
          characterId="maya" 
          variant="compact" 
          className="mb-4"
          showMetrics={true}
          showQuote={true}
        />
      )}
      
      {/* Learning Path Banner */}
      {phase === 'intro' && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 mb-4">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-purple-900">New! Learn my approach in 5 minutes</p>
                  <p className="text-sm text-purple-700">I\'ll guide you through email writing step by step - **turning you into a confident communicator** who builds lasting relationships ✨</p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/learning/maya-email')}
                variant="outline"
                className="border-purple-300 hover:bg-purple-100"
              >
                Try Learning Mode
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Phase 1: Story Introduction */}
      {phase === 'intro' && (
        <Card className="border-0 shadow-lg sm:shadow-xl bg-gradient-to-br from-purple-50 to-cyan-50 transition-all duration-300 max-w-4xl mx-auto">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Learn from Maya's Journey
            </CardTitle>
            <p className="text-lg text-gray-700 mt-2">
              Discover how Maya transformed from **struggling with emails** to becoming a <span className="font-bold text-green-600">confident communicator</span> who builds lasting relationships through every message she sends. ✨
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/80 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-lg text-gray-900">Maya's transformation story:</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">From confusion to clarity</p>
                    <p className="text-sm text-gray-600">Maya learned to identify exactly what each email needed to accomplish - **turning every message into a purposeful connection**</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">From generic to personal</p>
                    <p className="text-sm text-gray-600">She discovered how to connect with different people in her community - **making every reader feel seen and valued**</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">From stress to confidence</p>
                    <p className="text-sm text-gray-600">Maya now writes emails that build relationships and get results - **transforming communication from a chore into a joy**</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={() => setPhase('build')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Discover Maya's Email Wisdom
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Phase 2: Email Recipe Builder - Two Column Layout */}
      {phase === 'build' && (
        <>
          
          {/* PACE Stepper */}
          <div className="max-w-7xl mx-auto mb-6">
            <PaceStepper currentStep={currentPaceStep} completedSteps={completedPaceSteps} />
          </div>
          
          <div className="maya-two-column-layout maya-phase-transition maya-phase-enter-active">
            <div role="status" aria-live="polite" className="sr-only">
              Now in Email Recipe Builder phase
            </div>
            
            {/* Left Column - Recipe Builder */}
            <div className="maya-column maya-email-builder">
              {/* Maya's Journey Context */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 mb-6 border border-purple-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900">Following Maya's Email Journey</h3>
                </div>
                <p className="text-sm text-purple-800 mb-2">
                  You're learning how Maya approaches different email situations through her **real experiences with families, donors, and community partners**. ✨\n\nEvery choice you make is backed by stories from the field and proven strategies that work.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-purple-600">
                    Discovering Maya's {currentPaceStep === 'purpose' ? '✨ real-world situations' : currentPaceStep === 'audience' ? '💕 relationship wisdom' : currentPaceStep === 'content' ? '🎆 communication magic' : '✨ email craft'}
                  </span>
                </div>
              </motion.div>
              
              <div className="flex items-center justify-between mb-4">
                <HelpTooltip 
                  content={characterHelpContent.maya.emailRecipe}
                  side="bottom"
                  onHelpViewed={(type) => {
                    if (type === 'click') {
                      localStorage.setItem('maya-help-viewed', 'true');
                    }
                  }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    Maya's Email Wisdom
                  </h2>
                </HelpTooltip>
                <div className="flex items-center gap-2">
                  <TutorialButton 
                    tutorialId="maya-email-composer"
                    variant="icon"
                    size="sm"
                  />
                  <ExampleSelector
                    character="maya"
                    onSelectExample={handleExampleSelect}
                    buttonVariant="outline"
                    size="sm"
                  />
                </div>
              </div>
              
              <Progress value={paceRecipeProgress * 100} className="mb-4 h-3" />
              <MayaConfidenceMeter 
                progress={paceRecipeProgress * 100}
                currentLayer={completedPaceSteps.length}
                totalLayers={4}
                className="mb-6"
              />
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* PACE Step 1: Purpose with Enhanced Animations */}
                <AnimatePresence mode="wait">
                  {(currentPaceStep === 'purpose' || completedPaceSteps.includes('purpose')) && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepVariants}
                      className="maya-recipe-layer"
                    >
                  <div className="maya-recipe-layer-header">
                    <span className="maya-recipe-layer-number bg-purple-600">P</span>
                    <h3 className="text-base sm:text-lg font-semibold text-purple-800">
                      Step 1: Maya's Situation - What does she need to accomplish?
                    </h3>
                    <HelpTooltip
                      content={{
                        title: "Let's Define Your Purpose",
                        quickHelp: "I've learned that every effective email needs one clear purpose. Let's figure out exactly why you're writing.",
                        detailedHelp: {
                          whatIs: "Purpose is simply the main reason you're writing - what you hope to achieve.",
                          whyItMatters: "I've found that clear purpose shapes everything else - your tone, content, and what you ask for. Without it, people get confused.",
                          howToUse: [
                            'Pick just one main thing you want to accomplish',
                            'Be really clear about what you hope will happen',
                            'Think about what matters to the person reading',
                            'Keep it simple - complexity confuses'
                          ],
                          examples: [
                            { description: 'Address concern: Parent worried about program changes' },
                            { description: 'Make request: Board member considering funding increase' }
                          ],
                          proTips: [
                            'When I have multiple things to say, I send separate emails',
                            'Make your purpose obvious in the subject line',
                            "I always ask myself: What do I hope they'll do after reading?"
                          ]
                        }
                      }}
                      variant="inline"
                      iconSize="sm"
                    />
                  </div>
                <div className="space-y-3" data-tutorial="purpose-selector">
                  <div className="text-sm text-purple-700 mb-4 bg-purple-50 p-3 rounded-lg border border-purple-200">
                    💭 <strong>Think about Maya's situation:</strong> What would Maya need to accomplish in this email? Each option below shows what Maya has learned from similar situations.
                  </div>
                  {purposeOptions.map((purpose, index) => (
                    <motion.div
                      key={purpose.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={optionVariants}
                      whileHover="hover"
                      onHoverStart={() => setHoveredOption(purpose.id)}
                      onHoverEnd={() => setHoveredOption(null)}
                    >
                      <motion.div
                        variants={selectionVariants}
                        animate={recipe.purpose === purpose.label ? 'selected' : 'unselected'}
                      >
                        <Button
                          variant={recipe.purpose === purpose.label ? "default" : "outline"}
                          className={`h-auto p-4 sm:p-5 justify-start transition-all duration-200 w-full text-left ${
                            recipe.purpose === purpose.label 
                              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg' 
                              : 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-md'
                          }`}
                          onClick={() => handlePurposeSelect(purpose)}
                        >
                          <div className="w-full space-y-2">
                            {/* Main Label */}
                            <div className="font-semibold flex items-center gap-2 text-base">
                              {purpose.emoji} {purpose.label}
                              {recipe.purpose === purpose.label && (
                                <CheckCircle2 className="w-4 h-4 ml-auto" />
                              )}
                            </div>
                            
                            {/* Situation Description */}
                            <div className="text-sm opacity-90 font-medium">
                              {purpose.description}
                            </div>
                            
                            {/* Maya's Story - Show on hover or when selected */}
                            {(hoveredOption === purpose.id || recipe.purpose === purpose.label) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="border-t border-white/20 pt-2 space-y-1"
                              >
                                <div className="text-sm text-gray-700 italic mb-2">
                                  🌟 Maya's insight: {purpose.mayaStory}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  💝 You'll write: {purpose.whatYouWillWrite}
                                </div>
                                <div className="text-sm text-gray-600">
                                  🎯 When to use: {purpose.whenToUse}
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              {/* PACE Step 2: Audience Intelligence */}
              {(currentPaceStep === 'audience' || completedPaceSteps.includes('audience')) && (
                <div className="space-y-4 animate-fade-in transition-all duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">A</span>
                      Step 2: Maya's Relationships - Who is she writing to?
                      <HelpTooltip
                        content={{
                          title: 'Audience Intelligence',
                          quickHelp: "I've matched the people who are most likely to be part of this situation.",
                          detailedHelp: {
                            whatIs: "I've learned to really understand who I'm writing to and what matters most to them.",
                            whyItMatters: 'When you pick the right person, your message connects and gets the results you want.',
                            howToUse: [
                              'Think about how they know your organization',
                              'Focus on what keeps them up at night',
                              'Match how they like to communicate',
                              'Speak directly to what they need'
                            ],
                            commonMistakes: [
                              'Using insider words that confuse people',
                              'Being too relaxed with formal relationships',
                              'Forgetting to see it from their side'
                            ]
                          }
                        }}
                        variant="inline"
                        iconSize="sm"
                      />
                    </h3>
                    {recipe.purpose && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600">✨ I know who fits best for this purpose</span>
                      </div>
                    )}
                  </div>
                  
                  {recipe.purpose && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 transition-all duration-300">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">📍 Showing audiences most relevant for:</span> {recipe.purpose} {recipe.purposeEmoji}
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        I'm sharing what I've learned about each person in this context
                      </p>
                    </div>
                  )}
                  <div className="space-y-3" data-tutorial="audience-selector">
                    <div className="text-sm text-blue-700 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      👥 <strong>Think about Maya's relationships:</strong> Who would she be writing to in this situation? Each person below is someone Maya has worked with before.
                      {isGeneratingDynamicChoices && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-purple-600">
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          AI is personalizing options for Maya...
                        </div>
                      )}
                      {dynamicError && (
                        <div className="mt-2 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                          ⚠️ {dynamicError}
                        </div>
                      )}
                    </div>
                    {filteredAudiences.map((audience) => {
                      const purposeId = purposeOptions.find(p => p.label === recipe.purpose)?.id;
                      const contextualDescription = purposeId ? getContextualDescription(audience.id, purposeId) : audience.storyContext;
                      const hasAIEnhancement = (audience as any).aiEnhancement;
                      
                      return (
                        <motion.div
                          key={audience.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button
                            variant={recipe.audience === audience.label ? "default" : "outline"}
                            className={`h-auto p-4 sm:p-5 justify-start transition-all duration-200 w-full text-left ${
                              recipe.audience === audience.label 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' 
                                : 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                            }`}
                            onClick={() => handleAudienceSelect(audience)}
                            onMouseEnter={() => setHoveredOption(audience.id)}
                            onMouseLeave={() => setHoveredOption(null)}
                          >
                            <div className="w-full space-y-2">
                              {/* Main Label */}
                              <div className="font-semibold flex items-center gap-2 text-base">
                                {audience.emoji} {audience.label}
                                {recipe.audience === audience.label && (
                                  <CheckCircle2 className="w-4 h-4 ml-auto" />
                                )}
                              </div>
                              
                              {/* Example Person */}
                              <div className="text-sm opacity-90 font-medium">
                                {audience.description}
                              </div>
                              
                              {/* Maya's Experience with This Type */}
                              {(hoveredOption === audience.id || recipe.audience === audience.label) && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="border-t border-white/20 pt-2 space-y-1"
                                >
                                  <div className="text-xs opacity-80 italic">
                                    🌟 Maya's experience: {contextualDescription}
                                  </div>
                                  {audience.whatYouWillGet && (
                                    <div className="text-xs opacity-70">
                                      💝 You'll write: {audience.whatYouWillGet}
                                    </div>
                                  )}
                                  <div className="text-xs opacity-70">
                                    🤝 Relationship: {audience.relationshipType?.replace('-', ' ') || 'collaborative partnership'}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PACE Step 3: Content Strategy */}
              {(currentPaceStep === 'content' || completedPaceSteps.includes('content')) && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">C</span>
                      Step 3: Maya's Approach - How should she communicate?
                      <HelpTooltip
                        content={{
                          title: 'Content Strategy',
                          quickHelp: "I've found these approaches work really well for this situation.",
                          detailedHelp: {
                            whatIs: 'Content strategy determines how you approach your message - the tone and style that will resonate.',
                            whyItMatters: 'The right tone builds trust and ensures your message is received as intended.',
                            howToUse: [
                              'Pick just one main thing you want to accomplish',
                              'Make sure every paragraph supports this purpose',
                              'End with a clear call-to-action',
                              'Test: can you summarize purpose in one sentence?'
                            ],
                            proTips: [
                              'When I have multiple things to say, I send separate emails',
                              'Lead with purpose in subject line',
                              'Make next steps crystal clear'
                            ]
                          }
                        }}
                        variant="inline"
                        iconSize="sm"
                      />
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600">🎯 I'm showing you what works best</span>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 transition-all duration-300">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">🎯 Your purpose shapes everything else:</span> I'll show you the people who matter most for this situation and share what I've learned about working with them.
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      When you change your purpose, I'll show you different people who fit better
                    </p>
                  </div>
                  {/* Intelligent Tone Recommendations */}
                  {availableContentStrategies.length > 0 && availableContentStrategies[0].reasoning && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-green-800 mb-1">🎯 My suggestion</h4>
                          <p className="text-sm text-green-700 mb-2">{availableContentStrategies[0].reasoning}</p>
                          {availableContentStrategies[0].adaptiveHelp && (
                            <p className="text-xs text-green-600 italic">{availableContentStrategies[0].adaptiveHelp}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filtered Results Info */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-600">
                      Here are the {availableContentStrategies.length} approaches that work best for this situation
                    </p>
                    {availableContentStrategies.length < 5 && (
                      <p className="text-xs text-green-600 font-medium">
                        ✨ Showing you the best options
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3" data-tutorial="content-strategy-selector">
                    {availableContentStrategies.map((strategy) => (
                      <Button
                        key={strategy.id}
                        variant={recipe.tone === strategy.label ? "default" : "outline"}
                        className={`h-auto p-3 sm:p-4 justify-start transition-all duration-200 relative ${
                          recipe.tone === strategy.label 
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                            : strategy.isRecommended
                            ? 'hover:bg-green-50 hover:border-green-300 border-2 border-green-400 bg-green-25'
                            : 'hover:bg-green-50 hover:border-green-300'
                        }`}
                        onClick={() => handleContentStrategySelect(strategy)}
                      >
                        {strategy.isRecommended && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-xs text-white font-bold">★</span>
                          </div>
                        )}
                        <div className="text-left">
                          <div className="font-medium flex items-center gap-2">
                            {strategy.label} {strategy.emoji}
                            {strategy.isRecommended && (
                              <span className="text-sm text-green-700 font-medium">
                                My Pick
                              </span>
                            )}
                          </div>
                          <div className="text-xs opacity-80 mt-1">{strategy.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Adaptation Engine - Smart Recommendations */}
              {contentAdaptation && smartRecommendations && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <h4 className="font-semibold text-blue-900">{smartRecommendations.title}</h4>
                  </div>
                  
                  {contentAdaptation.recommendedTone && (
                    <div className="bg-white/80 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-600">🎯</span>
                        <span className="font-medium text-blue-900">Recommended Tone</span>
                      </div>
                      <p className="text-sm text-blue-800 font-medium mb-1">{contentAdaptation.recommendedTone}</p>
                      <p className="text-xs text-blue-700">{contentAdaptation.reasoning}</p>
                    </div>
                  )}
                  
                  <div className="bg-white/80 rounded-lg p-3 border border-blue-100">
                    <p className="text-sm text-blue-800 mb-2">{smartRecommendations.explanation}</p>
                    
                    {smartRecommendations.bestPractices.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-green-700 mb-1">✅ Best Practices:</p>
                        <ul className="text-xs text-green-600 space-y-0.5">
                          {smartRecommendations.bestPractices.map((practice, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {smartRecommendations.commonMistakes.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-red-700 mb-1">❌ Avoid These Mistakes:</p>
                        <ul className="text-xs text-red-600 space-y-0.5">
                          {smartRecommendations.commonMistakes.map((mistake, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{mistake}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {contextualTemplate && (
                    <div className="bg-white/80 rounded-lg p-3 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-purple-600">📝</span>
                        <span className="font-medium text-purple-900">Email Structure Template</span>
                      </div>
                      <div className="text-xs text-purple-700 space-y-1">
                        <p><span className="font-medium">Structure:</span> {contextualTemplate.structure.join(' → ')}</p>
                        <p><span className="font-medium">Call to Action:</span> {contextualTemplate.callToAction}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Recipe Preview */}
              {Object.keys(recipe).length > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg p-4 space-y-2">
                  <h4 className="font-semibold text-gray-900">Your Email Recipe:</h4>
                  <div className="space-y-1">
                    {recipe.purpose && (
                      <p className="text-sm">
                        <span className="font-medium">Purpose:</span> {recipe.purpose} {recipe.purposeEmoji}
                      </p>
                    )}
                    {recipe.audience && (
                      <p className="text-sm">
                        <span className="font-medium">Audience:</span> {recipe.audience} {recipe.audienceEmoji}
                      </p>
                    )}
                    {recipe.tone && (
                      <p className="text-sm">
                        <span className="font-medium">Content Strategy:</span> {recipe.tone} {recipe.toneEmoji}
                      </p>
                    )}
                  </div>
                  
                  {/* Show additional context if loaded from example */}
                  {(additionalContext || keyPoints.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-purple-200/50">
                      {additionalContext && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-purple-700 mb-1">Context from example:</p>
                          <p className="text-xs text-gray-600 italic">{additionalContext}</p>
                        </div>
                      )}
                      {keyPoints.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-purple-700 mb-1">Key points to include:</p>
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {keyPoints.map((point, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PACE Step 4: Execution */}
              {(currentPaceStep === 'execution' || completedPaceSteps.includes('execution')) && (
                <div className="space-y-4 animate-fade-in transition-all duration-500">
                  <h3 className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">E</span>
                    PACE Step 4: Execution - Choose Your Approach
                  </h3>
                  
                  {isGeneratingExecutionOptions ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2 text-purple-600">
                        <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">Preparing your personalized options...</span>
                      </div>
                    </div>
                  ) : executionOptions.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600 text-center mb-6">
                        I'm ready to help you write something that truly connects! How would you like me to approach this?
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                        {executionOptions.map((option, index) => (
                          <motion.div
                            key={option.id}
                            initial="hidden"
                            animate="visible"
                            variants={optionVariants}
                            custom={index}
                            className={`relative cursor-pointer group ${
                              selectedExecutionOption === option.id ? 'ring-2 ring-purple-500' : ''
                            }`}
                            onClick={() => setSelectedExecutionOption(option.id)}
                          >
                            <Card className="h-full border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 group-hover:shadow-lg">
                              <CardContent className="p-4">
                                <div className="text-center mb-3">
                                  <div className="text-3xl mb-2">{option.icon}</div>
                                  <h4 className="font-semibold text-gray-900 mb-1">{option.name}</h4>
                                  <p className="text-sm text-purple-600 font-medium">{option.timeEstimate}</p>
                                </div>
                                
                                <p className="text-sm text-gray-700 mb-3 text-center">
                                  {option.description}
                                </p>
                                
                                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                                  <p className="text-xs text-purple-700 italic text-center">
                                    {option.naturalDescription}
                                  </p>
                                </div>
                                
                                <div className="space-y-1">
                                  {option.benefits.map((benefit: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </div>
                                  ))}
                                </div>
                                
                                {selectedExecutionOption === option.id && (
                                  <div className="absolute inset-0 bg-purple-500 bg-opacity-10 rounded-lg pointer-events-none">
                                    <div className="absolute top-2 right-2">
                                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                      
                      {selectedExecutionOption && (
                        <div className="text-center mt-6">
                          <Button
                            onClick={() => {
                              const selectedOption = executionOptions.find(opt => opt.id === selectedExecutionOption);
                              generateEmail(selectedOption?.executionType || 'balanced');
                            }}
                            disabled={!isRecipeComplete || isGenerating}
                            size="lg"
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white disabled:opacity-50"
                            data-tutorial="get-suggestions"
                          >
                            {isGenerating ? (
                              <>
                                <Clock className="w-5 h-5 mr-2 animate-spin" />
                                Let me craft this perfectly...
                              </>
                            ) : (
                              <>
                                <PlayCircle className="w-5 h-5 mr-2" />
                                Generate My Email
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        I'm ready to help you write something that truly connects!
                      </p>
                      <Button
                        onClick={() => generateEmail()}
                        disabled={!isRecipeComplete || isGenerating}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white disabled:opacity-50"
                        data-tutorial="get-suggestions"
                      >
                        {isGenerating ? (
                          <>
                            <Clock className="w-5 h-5 mr-2 animate-spin" />
                            Let me craft this perfectly...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Generate Email
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
          
          {/* Right Column - Preview/Help */}
          <div className="maya-column maya-email-preview">
            {/* Right column content can be added here as needed */}
          </div>
        </div>
        
        {/* Phase 3: Email Preview */}
      {phase === 'preview' && (
        <div className="space-y-4 lg:space-y-6 max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Your Email is Ready!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quality Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg transition-all duration-200 hover:shadow-md">
                  <p className="text-xs sm:text-sm text-gray-600">How well I matched your style</p>
                  <p className="text-base sm:text-lg font-bold text-purple-800">95%</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md">
                  <p className="text-xs sm:text-sm text-gray-600">How clear your message is</p>
                  <p className="text-base sm:text-lg font-bold text-blue-800">High</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg transition-all duration-200 hover:shadow-md">
                  <p className="text-xs sm:text-sm text-gray-600">Connection strength</p>
                  <p className="text-base sm:text-lg font-bold text-green-800">Strong</p>
                </div>
              </div>

              {/* Email Content */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 font-mono text-xs sm:text-sm whitespace-pre-wrap overflow-x-auto" data-tutorial="email-body">
                {generatedEmail}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center">
                <Button onClick={handleCopy} variant="default" size="lg" data-tutorial="preview-button">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email
                </Button>
                <ExportButton
                  data={(): ExportData => ({
                    title: `Email - ${recipe.recipient} - ${new Date().toLocaleDateString()}`,
                    content: generatedEmail,
                    metadata: {
                      createdAt: new Date().toISOString(),
                      author: 'Maya Rodriguez',
                      tags: ['email', recipe.tone!, recipe.recipient!, recipe.purpose!],
                      recipe: recipe
                    },
                    sections: [
                      {
                        title: 'Email Recipe',
                        content: `Tone: ${recipe.tone} ${recipe.toneEmoji}\nRecipient: ${recipe.recipient} ${recipe.recipientEmoji}\nPurpose: ${recipe.purpose} ${recipe.purposeEmoji}`,
                        type: 'text'
                      },
                      {
                        title: 'Generated Email',
                        content: generatedEmail,
                        type: 'text'
                      }
                    ]
                  })}
                  formats={['pdf', 'docx', 'txt']}
                  size="lg"
                  variant="outline"
                  characterName="Maya"
                  suggestUseIn={['Communication Metrics', 'Sofia Story Creator', 'Template Library']}
                />
                <Button onClick={handleTryAgain} variant="outline" size="lg">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Another Approach
                </Button>
                <Button 
                  onClick={handleViewTransformation} 
                  variant="default" 
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  See How I've Grown
                </Button>
              </div>
              
              {/* Use In Suggestions */}
              <UseInSuggestions
                content={{
                  email: generatedEmail,
                  recipe: recipe,
                  metadata: {
                    tone: recipe.tone,
                    recipient: recipe.recipient,
                    purpose: recipe.purpose
                  }
                }}
                contentType="email"
                fromCharacter="Maya"
                componentType="maya-email"
                className="mt-4"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Phase 4: Success & Transformation */}
      {phase === 'success' && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-purple-50 max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-purple-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              My Email Journey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time Metrics */}
            <div className="bg-white/90 rounded-lg p-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-lg">
                  <span className="line-through text-red-600">Before: 32 minutes</span>
                </p>
                <p className="text-2xl font-bold text-green-600">
                  After: 5 minutes
                </p>
                <p className="text-xl font-semibold text-purple-800">
                  I save 27 minutes on every email now
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="text-center p-3 sm:p-4 bg-purple-100 rounded-lg transition-all duration-200 hover:shadow-md">
                  <Clock className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm sm:text-base font-semibold">Every week: 2.25 hours back</p>
                  <p className="text-sm text-gray-600">(5 emails/week)</p>
                </div>
                <div className="text-center p-3 sm:p-4 bg-cyan-100 rounded-lg transition-all duration-200 hover:shadow-md">
                  <Target className="w-6 sm:w-8 h-6 sm:h-8 mx-auto mb-2 text-cyan-600" />
                  <p className="text-sm sm:text-base font-semibold">Every year: 117 hours freed up</p>
                  <p className="text-sm text-gray-600">(That's like getting 3 weeks of vacation!)</p>
                </div>
              </div>
            </div>

            {/* Maya's Testimonial */}
            <div className="bg-white/90 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <div>
                  <p className="italic text-gray-700 mb-2">
                    "I used to dread email time. Now, with my email recipe system, I can craft professional, 
                    empathetic responses in minutes. It's not just about saving time - it's about feeling 
                    confident in my communication. I can focus on what really matters: our programs and families."
                  </p>
                  <p className="font-semibold text-gray-900">- Maya Rodriguez</p>
                  <p className="text-sm text-gray-600">Program Director</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Want to write emails like this too?</h3>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                Let's Write Another Email Together
              </Button>
              <p className="text-sm text-gray-600">
                We've written **{recipesCreated} email{recipesCreated !== 1 ? 's' : ''} together today!** ✨ Each one builds stronger connections in your community.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
        </>
      )}
      </div>
      </div>
    </AIComponentErrorBoundary>
  );
};

export default MayaEmailComposer;