import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, Check, Sparkles, Mail, Target, Volume2, MessageCircle, Star, FileText, Loader2, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mayaAISkillBuilderService, type MayaSkillBuilderPrompt } from '@/services/mayaAISkillBuilderService';
import { type InteractiveStage, type MayaJourneyState, type LyraNarrativeMessage } from './types';
import { generatePACEEmail } from './helpers';

/**
 * Creates the complete Maya stages array with all interactive components
 */
export function createMayaStages({
  panelBlurLevel,
  mayaJourney,
  setMayaJourney,
  setCurrentStageIndex,
  setLyraExpression,
  user,
  setIsGeneratingAI,
  aiResults,
  setAIResults
}: {
  panelBlurLevel: () => 'full' | 'partial' | 'clear'; // Changed to function to get current value
  mayaJourney: MayaJourneyState;
  setMayaJourney: React.Dispatch<React.SetStateAction<MayaJourneyState>>;
  setCurrentStageIndex: (index: number) => void;
  setLyraExpression: (expression: 'default' | 'thinking' | 'celebrating' | 'helping') => void;
  user: any;
  setIsGeneratingAI: (value: boolean) => void;
  aiResults: any;
  setAIResults: React.Dispatch<React.SetStateAction<any>>;
}): InteractiveStage[] {
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
          <h2 className="text-2xl font-semibold mb-4">Maya's Complete Communication Mastery</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            From email overwhelm to confident clarity<br/>
            <strong>Complete Chapter 2 Journey</strong>
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <Button 
              onClick={() => setCurrentStageIndex(1)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
            >
              Begin Maya's Complete Journey <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'intro-maya-1',
          content: "Meet Maya Rodriguez. Six months ago, she was drowning in emails at Hope Gardens Community Center. Every message felt like a mountain to climb.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'intro-maya-2',
          content: "Today, Maya confidently communicates with 200+ families, manages 15 volunteers, and even teaches her communication system to other nonprofits. This is her complete transformation story.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'intro-maya-3',
          content: "You're about to experience Maya's entire journey: PACE Framework, Tone Mastery, Template Building, Difficult Conversations, and Subject Line Excellence. Everything she learned to become a communication master.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000,
          trigger: 'blur-clear'
        }
      ]
    },

    // Stage 2: PACE Framework - P is for Purpose
    {
      id: 'pace-purpose',
      title: 'P - Purpose Foundation', 
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel() !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">P - Purpose Foundation</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's first breakthrough: Tell AI exactly what you need. Vague requests get vague responses.
            </p>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ Maya's Old Approach:</h4>
              <p className="text-sm text-red-700">"Help me write an email"</p>
            </div>
            
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Maya's PACE Method:</h4>
              <p className="text-sm text-green-700">"Help me write an email to thank a parent for volunteering at our after-school art program"</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 mb-3">What communication do you need Maya's help with?</p>
            {[
              { purpose: 'Thank a volunteer parent', prompt: 'Write a warm thank-you email to a parent who helped with our community garden project' },
              { purpose: 'Request program feedback', prompt: 'Draft a friendly email asking parents for feedback about our new after-school tutoring program' },
              { purpose: 'Invite to fundraising event', prompt: 'Create an engaging invitation email for our annual Hope Gardens fundraising dinner' },
              { purpose: 'Update about program changes', prompt: 'Write an informative email updating families about new safety protocols for pickup times' }
            ].map(({ purpose, prompt }) => (
              <button
                key={purpose}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, purpose, aiPrompt: prompt }));
                  setLyraExpression('celebrating');
                  setTimeout(() => {
                    setCurrentStageIndex(2);
                    setLyraExpression('helping');
                  }, 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-purple-400 hover:bg-purple-50",
                  mayaJourney.purpose === purpose ? 'border-purple-600 bg-purple-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-1">{purpose}</div>
                <div className="text-xs text-gray-500">Prompt: "{prompt}"</div>
              </button>
            ))}
          </div>
          
          {mayaJourney.purpose && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200"
            >
              <p className="text-green-800">
                <Check className="w-4 h-4 inline mr-2" />
                Perfect! "{mayaJourney.purpose}" gives you clarity like Maya learned.
              </p>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'purpose-breakthrough',
          content: "Maya's breakthrough came on a late Tuesday evening. She'd been staring at her computer for 20 minutes, trying to write a simple thank-you email to a volunteer parent.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'purpose-revelation',
          content: "That's when it hit her: she didn't even know what this email was supposed to achieve. Was she informing? Requesting? Just being polite? Without a clear purpose, she was writing in circles.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 7000
        },
        {
          id: 'purpose-guidance',
          content: "Maya discovered that AI needs a destination, not just a direction. Tell it exactly what you want to accomplish, and watch the magic happen.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 13000,
          trigger: 'blur-clear'
        }
      ]
    },

    // Stage 3: PACE Framework - A is for Audience
    {
      id: 'pace-audience',
      title: 'A - Audience Intelligence',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel() !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">A - Audience Intelligence</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's second discovery: AI writes better when it understands the reader.
            </p>
            
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">❌ Generic AI Response:</h4>
              <p className="text-sm text-red-700">"Dear Recipient, Thank you for your participation..."</p>
            </div>
            
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ With Audience Context:</h4>
              <p className="text-sm text-green-700">"Hi Sarah! Your help with the art station made such a difference - the kids are still talking about the clay sculptures..."</p>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who will read this email?
            </label>
            <input
              type="text"
              value={mayaJourney.audience}
              onChange={(e) => setMayaJourney(prev => ({ ...prev, audience: e.target.value }))}
              placeholder="e.g., Parent, Board member, Volunteer, Donor"
              className="w-full p-3 border rounded-lg focus:border-purple-400 focus:outline-none"
            />
          </div>
          
          {mayaJourney.audience && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <p className="text-sm text-gray-600">Select what's important for AI to know about them:</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Knowledge level',
                  'Time constraints', 
                  'Relationship to you',
                  'Communication style'
                ].map((consideration) => {
                  const isSelected = mayaJourney.selectedConsiderations.includes(consideration);
                  return (
                    <button
                      key={consideration}
                      onClick={() => {
                        setMayaJourney(prev => ({
                          ...prev,
                          selectedConsiderations: isSelected 
                            ? prev.selectedConsiderations.filter(c => c !== consideration)
                            : [...prev.selectedConsiderations, consideration]
                        }));
                      }}
                      className={cn(
                        "p-3 rounded-lg text-sm transition-all border-2",
                        isSelected 
                          ? "bg-purple-200 border-purple-400 text-purple-800" 
                          : "bg-purple-50 border-purple-200 hover:border-purple-300"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected && <Check className="w-3 h-3" />}
                        {consideration}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {mayaJourney.selectedConsiderations.length > 0 && (
                <Button 
                  onClick={() => {
                    setLyraExpression('celebrating');
                    setCurrentStageIndex(3);
                  }}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Continue to Context <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'audience-story',
          content: `Perfect! You chose "${mayaJourney.purpose || 'your purpose'}". Now watch how Maya learned to teach AI about her community...`,
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'encouraging',
          delay: 500
        },
        {
          id: 'audience-mistake',
          content: "Maya's first AI-generated email was a disaster. She asked for 'a professional email about reading program results.' AI gave her corporate jargon: 'We are pleased to inform you of the metrics indicating statistical significance...' Parents deleted it immediately.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 4000
        },
        {
          id: 'audience-learning',
          content: "That failure taught Maya the 'A' in PACE: AUDIENCE INTELLIGENCE. Now she tells AI exactly who will read the email: 'This is for busy parents checking email while kids get in the car. They need quick, warm updates, not formal reports.'",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'warm',
          delay: 10000,
          trigger: 'blur-clear'
        }
      ]
    },

    // Stage 4: PACE Framework - C is for Context (Tone)
    {
      id: 'pace-context',
      title: 'C - Context: Choose Your Tone',
      panelBlurState: 'full',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel() !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">C - Context: Choose Your Tone</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's third PACE step: The right tone builds connection. How do you want your email to feel?
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { tone: 'Warm & Friendly', icon: '😊', color: 'purple' },
              { tone: 'Professional', icon: '💼', color: 'blue' },
              { tone: 'Grateful', icon: '🙏', color: 'green' },
              { tone: 'Encouraging', icon: '💪', color: 'orange' },
              { tone: 'Urgent', icon: '⚡', color: 'red' },
              { tone: 'Celebratory', icon: '🎉', color: 'pink' }
            ].map(({ tone, icon, color }) => (
              <button
                key={tone}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, tone }));
                  setLyraExpression('celebrating');
                }}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  `hover:border-${color}-400`,
                  mayaJourney.tone === tone ? `border-${color}-600 bg-${color}-100` : 'border-gray-200'
                )}
              >
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-sm font-medium">{tone}</div>
              </button>
            ))}
          </div>
          
          {mayaJourney.tone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
            >
              <h4 className="font-semibold mb-2">PACE Framework Complete!</h4>
              <div className="text-sm space-y-2">
                <div className="p-2 bg-white rounded border">
                  <strong>Purpose:</strong> {mayaJourney.aiPrompt || mayaJourney.purpose}
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Audience:</strong> {mayaJourney.audience}
                </div>
                <div className="p-2 bg-white rounded border">
                  <strong>Connection:</strong> {mayaJourney.tone} tone
                </div>
              </div>
              
              <Button 
                onClick={() => setCurrentStageIndex(4)}
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                Generate with PACE <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'connection-insight',
          content: `Excellent! ${mayaJourney.audience || 'Your reader'} will appreciate your thoughtfulness. Now for Maya's tone mastery secret...`,
          type: 'lyra-unified',
          emotion: 'excited',
          delay: 500
        },
        {
          id: 'connection-story',
          content: "Maya realized something profound: The same exact message could build bridges or burn them, depending on tone. She tested it: 'We need to discuss Jayden's behavior' (concerning) vs. 'I'd love to share Jayden's wonderful progress!' (inviting). Same topic, different response.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 3000
        },
        {
          id: 'connection-magic',
          content: "Tone isn't about being nice - it's about matching your reader's emotional needs. A busy parent needs efficiency. A worried volunteer needs reassurance. A potential donor needs inspiration.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'warm',
          delay: 10000,
          trigger: 'blur-clear'
        }
      ]
    },

    // Stage 5: PACE Framework - E is for Execute
    {
      id: 'pace-execute',
      title: 'E - Execute with AI',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-semibold">E - Execute with AI</h3>
            </div>
            <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">🚀 Your Complete PACE Prompt:</h4>
              <p className="text-sm text-gray-700 italic">
                "{mayaJourney.aiPrompt || mayaJourney.purpose}. The reader is {mayaJourney.audience?.toLowerCase()} who needs clear information. Please write in a {mayaJourney.tone?.toLowerCase()} tone that feels authentic to a community nonprofit."
              </p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border p-6 mb-6 shadow-lg"
          >
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap text-gray-800">
                {generatePACEEmail(mayaJourney)}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
          >
            <h4 className="font-semibold mb-2">🎯 PACE Framework Mastered!</h4>
            <p className="text-sm text-purple-800 mb-4">
              You've completed Maya's foundation. Now let's explore her advanced techniques...
            </p>
            <Button 
              onClick={() => setCurrentStageIndex(5)}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Continue to Tone Mastery <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'execute-magic',
          content: "Watch this PACE magic happen! Your framework is transforming into a perfectly crafted email, just like Maya creates every single day for Hope Gardens.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'excited',
          delay: 500
        },
        {
          id: 'execute-foundation',
          content: "But Maya didn't stop here. PACE was just her foundation. She discovered that true communication mastery required more tools: tone adaptation, template efficiency, conversation skills, and subject line excellence.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'execute-journey',
          content: "You're about to experience Maya's complete transformation. From basic PACE to advanced mastery - everything she learned to become Hope Gardens' communication expert.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 12000
        }
      ]
    },

    // Stage 6: Tone Mastery Workshop
    {
      id: 'tone-mastery',
      title: 'Maya\'s Tone Mastery Workshop',
      panelBlurState: 'partial',
      component: (
        <div className={cn(
          "p-8 transition-all duration-1000",
          panelBlurLevel() !== 'clear' && "blur-sm"
        )}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6 text-pink-600" />
              <h3 className="text-xl font-semibold">Tone Mastery: Finding Your Authentic Voice</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya learned that one voice fits no one. Discover how to adapt your authentic self for every audience.
            </p>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Who is your current audience?</p>
            {[
              { id: 'parent', label: 'Busy Parent', context: 'Picking up kids, checking phone quickly', needs: 'Quick, warm, clear information' },
              { id: 'volunteer', label: 'Dedicated Volunteer', context: 'Giving time freely, wants to feel valued', needs: 'Appreciation, clear direction, respect' },
              { id: 'board', label: 'Board Member', context: 'Strategic oversight, limited time', needs: 'Professional, data-driven, concise' },
              { id: 'emergency', label: 'Community (Emergency)', context: 'Anxious, needs immediate clarity', needs: 'Clear, calm, actionable information' }
            ].map(({ id, label, context, needs }) => (
              <button
                key={id}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, selectedAudience: id }));
                  setTimeout(() => setCurrentStageIndex(6), 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-pink-400 hover:bg-pink-50",
                  mayaJourney.selectedAudience === id ? 'border-pink-600 bg-pink-100' : 'border-gray-200'
                )}
              >
                <div className="font-medium mb-1">{label}</div>
                <div className="text-xs text-gray-500 mb-1">Context: {context}</div>
                <div className="text-xs text-pink-600">Needs: {needs}</div>
              </button>
            ))}
          </div>
          
          {mayaJourney.selectedAudience && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200"
            >
              <p className="text-pink-800">
                <Check className="w-4 h-4 inline mr-2" />
                Perfect! Maya learned to see audiences like you just did.
              </p>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'tone-discovery',
          content: "Three months after mastering PACE, Maya faced a crisis. A volunteer felt unappreciated by her 'professional' thank-you. A parent complained her emails were too formal. Maya realized she needed more than one voice.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'tone-breakthrough',
          content: "Maya's breakthrough: she didn't need to be different people for different audiences. She needed to be different facets of her authentic self - her warmth for volunteers, her expertise for the board, her empathy for worried parents.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 7000,
          trigger: 'blur-clear'
        },
        {
          id: 'tone-practice',
          content: "Choose your audience, and I'll show you how Maya adapts her authentic voice. It's not about being fake - it's about being thoughtfully genuine.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 13000
        }
      ]
    },

    // Stage 7: Template Library Builder
    {
      id: 'template-library',
      title: 'Maya\'s Template Library System',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold">Template Library: Efficiency Without Losing Heart</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya discovered how to save hours while keeping every message personal and authentic.
            </p>
          </div>
          
          <div className="grid gap-4 mb-6">
            {[
              { category: 'Thank You Templates', description: 'Appreciation that feels personal every time', count: '8 variations' },
              { category: 'Event Invitations', description: 'Engaging invites that drive attendance', count: '5 variations' },
              { category: 'Program Updates', description: 'Clear information parents actually read', count: '6 variations' },
              { category: 'Volunteer Coordination', description: 'Respectful requests that get responses', count: '4 variations' }
            ].map(({ category, description, count }) => (
              <motion.button
                key={category}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, templateCategory: category }));
                  setTimeout(() => setCurrentStageIndex(7), 1500);
                }}
                className={cn(
                  "p-4 rounded-lg border-2 text-left transition-all",
                  "hover:border-blue-400 hover:bg-blue-50",
                  mayaJourney.templateCategory === category ? 'border-blue-600 bg-blue-100' : 'border-gray-200'
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-semibold text-gray-900 mb-2">{category}</div>
                <div className="text-sm text-gray-600 mb-2">{description}</div>
                <div className="text-xs text-blue-600 font-medium">{count}</div>
              </motion.button>
            ))}
          </div>
          
          {mayaJourney.templateCategory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
            >
              <h4 className="font-semibold mb-4">🎯 Template Mastery Unlocked!</h4>
              <p className="text-sm text-blue-800 mb-4">
                Maya saved 15+ hours per week with smart templates. Each one maintains her authentic voice while streamlining her workflow.
              </p>
              <Button 
                onClick={() => setCurrentStageIndex(8)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Continue to Difficult Conversations <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'template-problem',
          content: "Maya was writing the same emails over and over. Thank you to volunteers. Program updates to parents. Board reports. Each took 20-30 minutes, and she was sending 20+ emails daily. The math was unsustainable.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'template-solution',
          content: "Maya's solution: Smart templates that felt personal. Not copy-paste form letters, but intelligent frameworks that adapted to each situation while maintaining her authentic voice.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 6000
        },
        {
          id: 'template-success',
          content: "The result? Maya went from 6+ hours daily on emails to 2 hours, with better responses. Her secret: templates with heart, not templates without soul.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'excited',
          delay: 12000
        }
      ]
    },

    // Stage 8: Difficult Conversations Guide
    {
      id: 'difficult-conversations',
      title: 'Maya\'s Difficult Conversations Guide',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-semibold">Difficult Conversations: Leading with Empathy</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's most challenging skill: turning difficult conversations into deeper connections.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            {[
              { scenario: 'Concerned Parent', challenge: 'Child having difficulties in program', approach: 'Listen first, validate feelings, collaborate on solutions' },
              { scenario: 'Frustrated Volunteer', challenge: 'Feels underappreciated or overwhelmed', approach: 'Acknowledge contribution, address concerns, rebuild trust' },
              { scenario: 'Policy Resistance', challenge: 'Community pushback on new rules', approach: 'Explain reasoning, address fears, find compromise' },
              { scenario: 'Donor Hesitation', challenge: 'Questions about program effectiveness', approach: 'Share stories, provide transparency, rebuild confidence' }
            ].map(({ scenario, challenge, approach }) => (
              <button
                key={scenario}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, conversationScenario: scenario }));
                  setTimeout(() => setCurrentStageIndex(8), 1500);
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-green-400 hover:bg-green-50",
                  mayaJourney.conversationScenario === scenario ? 'border-green-600 bg-green-100' : 'border-gray-200'
                )}
              >
                <div className="font-semibold text-gray-900 mb-2">{scenario}</div>
                <div className="text-sm text-gray-600 mb-2">Challenge: {challenge}</div>
                <div className="text-xs text-green-600">Maya's Approach: {approach}</div>
              </button>
            ))}
          </div>
          
          {mayaJourney.conversationScenario && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
            >
              <h4 className="font-semibold mb-4">💚 Empathy-First Communication Mastered!</h4>
              <p className="text-sm text-green-800 mb-4">
                Maya learned that difficult conversations aren't obstacles - they're opportunities to build stronger relationships through understanding and authentic care.
              </p>
              <Button 
                onClick={() => setCurrentStageIndex(9)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Final Mastery: Subject Lines <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'difficult-challenge',
          content: "Maya's hardest moment came when an angry parent accused her program of 'failing' their child. Her first instinct was to defend. Instead, she took a breath and chose empathy.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'difficult-transformation',
          content: "'I can hear how worried you are about Marcus. Help me understand what you're seeing at home.' That conversation turned a critic into an advocate. Maya learned that empathy doesn't mean agreement - it means understanding.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 7000
        },
        {
          id: 'difficult-mastery',
          content: "Maya's empathy framework: Listen to understand, not to defend. Validate feelings before addressing facts. Collaborate on solutions, don't impose them. Every difficult conversation became a relationship-building opportunity.",
          type: 'lyra-unified',
          context: 'guidance',
          emotion: 'encouraging',
          delay: 14000
        }
      ]
    },

    // Stage 9: Subject Line Excellence - Final Mastery
    {
      id: 'subject-excellence',
      title: 'Maya\'s Subject Line Excellence',
      panelBlurState: 'clear',
      component: (
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-yellow-600" />
              <h3 className="text-xl font-semibold">Subject Line Excellence: The Gateway to Connection</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Maya's final mastery: crafting subject lines that get opened, read, and acted upon.
            </p>
          </div>
          
          <div className="space-y-4 mb-6">
            {[
              { strategy: 'Personal Connection', example: 'Thank you, Sarah - Marcus lit up today!', result: '94% open rate' },
              { strategy: 'Clear Benefit', example: 'New tutoring times that work for working parents', result: '87% open rate' },
              { strategy: 'Gentle Urgency', example: 'Quick reminder: Art supplies needed by Friday', result: '91% open rate' },
              { strategy: 'Celebration Focus', example: '🎉 Your kids achieved something amazing', result: '96% open rate' }
            ].map(({ strategy, example, result }) => (
              <button
                key={strategy}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, subjectStrategy: strategy }));
                }}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all",
                  "hover:border-yellow-400 hover:bg-yellow-50",
                  mayaJourney.subjectStrategy === strategy ? 'border-yellow-600 bg-yellow-100' : 'border-gray-200'
                )}
              >
                <div className="font-semibold text-gray-900 mb-2">{strategy}</div>
                <div className="text-sm text-gray-600 mb-2 italic">"{example}"</div>
                <div className="text-xs text-yellow-600 font-medium">{result}</div>
              </button>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
          >
            <h4 className="font-semibold mb-4">⭐ Communication Mastery Complete!</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm mb-6">
              <div className="space-y-2">
                <div><strong>PACE Framework:</strong> ✅ Purpose, Audience, Context, Execute</div>
                <div><strong>Tone Mastery:</strong> ✅ Authentic adaptation for every reader</div>
                <div><strong>Template Library:</strong> ✅ Efficiency without losing heart</div>
              </div>
              <div className="space-y-2">
                <div><strong>Difficult Conversations:</strong> ✅ Empathy-first communication</div>
                <div><strong>Subject Excellence:</strong> ✅ Headlines that connect and compel</div>
                <div><strong>Result:</strong> ✅ 200+ families, 15 volunteers, zero stress</div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded border-l-4 border-yellow-500 mb-4">
              <p className="text-sm text-gray-700">
                <strong>Maya's Transformation:</strong> From 6+ hours daily email stress to 2 hours of confident, connected communication. From dreading every message to teaching her system to other nonprofits.
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setMayaJourney(prev => ({ 
                  ...prev, 
                  purpose: '', 
                  audience: '', 
                  tone: '', 
                  selectedAudience: '',
                  templateCategory: '',
                  conversationScenario: '',
                  subjectStrategy: ''
                }));
                setCurrentStageIndex(0);
              }}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              🎉 Experience Maya's Journey Again
            </Button>
          </motion.div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'subject-importance',
          content: "Maya realized that perfect emails were worthless if no one opened them. Subject lines became her final frontier - the gateway between great content and actual impact.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'thoughtful',
          delay: 500
        },
        {
          id: 'subject-mastery',
          content: "Maya's subject line secrets: Be personal when possible, clear always, and honest forever. Her parents began forwarding her emails to other parents - the ultimate compliment for nonprofit communication.",
          type: 'lyra-unified',
          context: 'story',
          emotion: 'warm',
          delay: 6000
        },
        {
          id: 'journey-complete',
          content: "🎉 You've experienced Maya's complete transformation! From email overwhelm to communication mastery. Every technique, every breakthrough, every moment that made her Hope Gardens' most effective communicator. This is how real change happens - one skill at a time, with heart and intelligence combined.",
          type: 'lyra-unified',
          context: 'celebration',
          emotion: 'celebrating',
          delay: 12000
        }
      ]
    }
  ];
}