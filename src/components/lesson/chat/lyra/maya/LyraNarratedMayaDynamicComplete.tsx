import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Heart, Lightbulb, Zap, Users, Star, ChevronRight, FastForward, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LyraAvatar } from '@/components/LyraAvatar';

// ============= HYBRID STORAGE APPROACH =============
// Core storyline hardcoded for consistency, structured for reusability

interface MayaJourneyState {
  purpose: string;
  audience: string;
  tone: string;
  generated: string;
  selectedConsiderations: string[];
  selectedAudience: string;
  finalPrompt: string;
  paceFramework: {
    purpose: string;
    audience: string;
    connection: string;
    engagement: string;
  };
}

interface StoryPhase {
  id: string;
  content: string;
  delay?: number;
}

// ============= MAYA'S STORYLINE MODULES =============
// Character-specific content that flows naturally

const MAYA_CHARACTER = {
  name: "Maya Rodriguez",
  role: "Communications Director",
  organization: "Hope Valley Youth Center",
  challenge: "Board email about summer program success",
  mentor: "Elena Martinez",
  transformation: "From 3-hour struggle to 20-minute clarity"
};

const MAYA_STORYLINE = {
  problem: "It's 9 PM on a Wednesday. Maya Rodriguez stares at her laptop screen, cursor blinking in an empty email draft. She's been trying to write a board update for two hours. Tomorrow's board meeting could determine next year's funding, and she knows this email needs to be perfect.",
  
  mentorIntroduction: "Maya remembers Elena Martinez, the communications consultant who visited last month. Elena had said something that stuck: 'Maya, you're not failing at communication - you're just starting with the wrong question. Instead of asking what to write, ask why it matters to you personally.'",
  
  breakthrough: "Maya takes a deep breath and starts with Elena's question: 'Why does this matter to me?' Suddenly, she sees Jordan's face - the shy 12-year-old who finally smiled after weeks in their program. That's her why. That's where she needs to start.",
  
  transformation: "Three months later, Maya's emails are getting 3x more responses. Board members ask follow-up questions. Donors schedule meetings. Parents send thank-you notes. Elena's PACE framework didn't just change Maya's writing - it changed her entire approach to connection."
};

const LyraNarratedMayaDynamicComplete: React.FC = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [lyraExpression, setLyraExpression] = useState<'default' | 'thinking' | 'celebrating' | 'helping' | 'loading'>('default');
  const [mayaJourney, setMayaJourney] = useState<MayaJourneyState>({
    purpose: '',
    audience: '',
    tone: '',
    generated: '',
    selectedConsiderations: [],
    selectedAudience: '',
    finalPrompt: '',
    paceFramework: {
      purpose: '',
      audience: '',
      connection: '',
      engagement: ''
    }
  });
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  // Maya's Board Email Scenario - Specific Purpose Options
  const mayaBoardEmailPurposes = [
    {
      id: 'celebrate_success',
      label: 'Celebrate program success',
      description: 'Share the incredible wins from the summer program',
      icon: <Star className="w-5 h-5" />,
      contextHint: 'Perfect for Maya\'s board email about program achievements',
      mayaStory: 'When I saw Jordan finally smile after weeks in our program, I knew we had something special to celebrate with the board.'
    },
    {
      id: 'request_continued_support',
      label: 'Request continued funding',
      description: 'Show the board why this program deserves ongoing investment',
      icon: <Target className="w-5 h-5" />,
      contextHint: 'Ideal for Maya\'s funding conversation with the board',
      mayaStory: 'Numbers tell one story, but real transformation happens in moments like Jordan\'s breakthrough - that\'s what I need to share.'
    },
    {
      id: 'build_board_connection',
      label: 'Strengthen board relationships',
      description: 'Help board members feel personally connected to the impact',
      icon: <Heart className="w-5 h-5" />,
      contextHint: 'Great for Maya\'s relationship-building with board members',
      mayaStory: 'Dr. Williams cares about data, but Sarah joined because of her daughter\'s experience. I need to speak to both hearts.'
    },
    {
      id: 'inspire_future_vision',
      label: 'Inspire future possibilities',
      description: 'Paint a picture of what\'s possible with continued support',
      icon: <Lightbulb className="w-5 h-5" />,
      contextHint: 'Perfect for Maya\'s vision-casting to the board',
      mayaStory: 'If 127 kids can transform in one summer, imagine what we could do with year-round programming. That\'s the vision I need to share.'
    }
  ];

  // Create dynamic stages
  const dynamicStages = [
    // Stage 1: Introduction
    {
      id: 'intro',
      title: 'Meeting Maya Rodriguez',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
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
          content: MAYA_STORYLINE.problem,
          delay: 500,
        }
      ]
    },

    // Stage 2: The Problem
    {
      id: 'problem',
      title: 'The Communication Struggle',
      component: (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-orange-400 flex items-center justify-center mb-6 shadow-lg"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4">The Endless Cycle</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Sound familiar? You're not alone in this struggle.
          </p>
          <Button 
            onClick={() => setCurrentStageIndex(2)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          >
            Continue <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'problem-1',
          content: MAYA_STORYLINE.mentorIntroduction,
          delay: 500,
        }
      ]
    },

    // Stage 3: Purpose Selection
    {
      id: 'purpose-dynamic',
      title: 'Choose Your Purpose',
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

          <div className="flex flex-wrap gap-3 max-w-3xl mx-auto justify-center">
            {mayaBoardEmailPurposes.map((purpose, index) => (
              <motion.button
                key={purpose.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setMayaJourney(prev => ({ ...prev, purpose: purpose.id }));
                  setCurrentStageIndex(3);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 hover:shadow-sm",
                  mayaJourney.purpose === purpose.id 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background hover:bg-muted/50 border-border"
                )}
              >
                <span className="text-current">{purpose.icon}</span>
                <span className="text-sm font-medium">{purpose.label}</span>
              </motion.button>
            ))}
          </div>

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
          content: MAYA_STORYLINE.breakthrough,
          delay: 500,
        }
      ]
    },

    // Stage 4: Interactive Audience Builder
    {
      id: 'audience',
      title: 'Choose Your Audience',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          {/* Phase 1: Story Hook */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-800 mb-2">Maya's Realization</h3>
            <p className="text-sm text-blue-700">
              "I realized I was writing the same email to everyone. Dr. Williams needs data, Sarah needs personal connection, Marcus needs business impact."
            </p>
          </div>

          {/* Phase 2: Interactive Building */}
          <div className="flex-1 space-y-4">
            <h3 className="font-semibold text-lg">Maya's specific board members - who resonates with you?</h3>
            
            {/* Maya's Board Members - Specific to her scenario */}
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'dr_williams', label: 'Dr. Williams (Board Chair)', icon: '📊', desc: 'Data-driven physician who loves metrics and outcomes' },
                { id: 'sarah_chen', label: 'Sarah Chen (Parent Rep)', icon: '💝', desc: 'Mom whose daughter was in the program - cares about personal stories' },
                { id: 'marcus_torres', label: 'Marcus Torres (Business)', icon: '🏢', desc: 'Local business owner focused on sustainability and ROI' },
                { id: 'combined_board', label: 'The Full Board', icon: '👥', desc: 'All board members together - needs balanced messaging' }
              ].map((audience) => (
                <motion.button
                  key={audience.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setMayaJourney(prev => ({ ...prev, selectedAudience: audience.id }));
                  }}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all hover:shadow-md",
                    mayaJourney.selectedAudience === audience.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{audience.icon}</span>
                    <div>
                      <h4 className="font-semibold">{audience.label}</h4>
                      <p className="text-sm text-gray-600">{audience.desc}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Audience Profiling Interface */}
            {mayaJourney.selectedAudience && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 space-y-3"
              >
                <h4 className="font-semibold">What motivates them most?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Impact stories', 'Data & metrics', 'Personal connection', 'Future vision',
                    'Recognition', 'Problem-solving', 'Community benefit', 'Growth opportunities'
                  ].map((motivation) => (
                    <motion.button
                      key={motivation}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => {
                        setMayaJourney(prev => ({
                          ...prev,
                          selectedConsiderations: prev.selectedConsiderations.includes(motivation)
                            ? prev.selectedConsiderations.filter(c => c !== motivation)
                            : [...prev.selectedConsiderations, motivation]
                        }));
                      }}
                      className={cn(
                        "p-2 rounded text-sm transition-all",
                        mayaJourney.selectedConsiderations.includes(motivation)
                          ? "bg-blue-500 text-white"
                          : "bg-white hover:bg-blue-50"
                      )}
                    >
                      {motivation}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Phase 3: Preview & Navigation */}
          {mayaJourney.selectedAudience && mayaJourney.selectedConsiderations.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500"
            >
              <h4 className="font-semibold text-green-800 mb-2">Perfect! Your email will be tailored for:</h4>
              <p className="text-sm text-green-700">
                {mayaJourney.selectedAudience.replace('_', ' ')} who value {mayaJourney.selectedConsiderations.join(', ')}
              </p>
              <Button 
                onClick={() => setCurrentStageIndex(4)}
                className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Build Your PACE Message <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'audience-1',
          content: "Maya stops typing and thinks about her board members. There's Dr. Williams, who loves data and outcomes. Sarah, who joined because her daughter went through the program. And Marcus, the businessman who always asks about sustainability. Same information, but they each need to hear it differently.",
          delay: 500,
        }
      ]
    },

    // Stage 5: Dynamic PACE Framework Constructor
    {
      id: 'crafting',
      title: 'Build Your PACE Message',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          {/* Phase 1: Story Hook */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800 mb-2">Maya's Breakthrough</h3>
            <p className="text-sm text-green-700">
              "Elena taught me PACE: Purpose (why this matters), Audience (who I'm writing to), Connection (how to relate), Engagement (what I want them to do)."
            </p>
          </div>

          {/* Phase 2: Interactive PACE Builder */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="font-semibold text-purple-600">P</div>
              <div className="font-semibold text-blue-600">A</div>
              <div className="font-semibold text-green-600">C</div>
              <div className="font-semibold text-orange-600">E</div>
            </div>

            {/* Purpose Section */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Purpose: Why does this matter?</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Share exciting news', 'Celebrate success', 'Request support', 'Build connection'
                ].map((purpose) => (
                  <motion.button
                    key={purpose}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setMayaJourney(prev => ({ ...prev, purpose }))}
                    className={cn(
                      "p-2 rounded text-sm transition-all",
                      mayaJourney.purpose === purpose
                        ? "bg-purple-500 text-white"
                        : "bg-white hover:bg-purple-100"
                    )}
                  >
                    {purpose}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Connection Section */}
            {mayaJourney.purpose && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 rounded-lg p-4"
              >
                <h4 className="font-semibold text-green-800 mb-2">Connection: How will you relate?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Personal story', 'Shared values', 'Common goal', 'Mutual benefit'
                  ].map((connection) => (
                    <motion.button
                      key={connection}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setMayaJourney(prev => ({ ...prev, tone: connection }))}
                      className={cn(
                        "p-2 rounded text-sm transition-all",
                        mayaJourney.tone === connection
                          ? "bg-green-500 text-white"
                          : "bg-white hover:bg-green-100"
                      )}
                    >
                      {connection}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Engagement Section */}
            {mayaJourney.tone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-orange-50 rounded-lg p-4"
              >
                <h4 className="font-semibold text-orange-800 mb-2">Engagement: What should they do?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Reply with thoughts', 'Schedule a meeting', 'Share with others', 'Take action'
                  ].map((engagement) => (
                    <motion.button
                      key={engagement}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setMayaJourney(prev => ({ ...prev, finalPrompt: engagement }))}
                      className={cn(
                        "p-2 rounded text-sm transition-all",
                        mayaJourney.finalPrompt === engagement
                          ? "bg-orange-500 text-white"
                          : "bg-white hover:bg-orange-100"
                      )}
                    >
                      {engagement}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Phase 3: Live Preview */}
          {mayaJourney.purpose && mayaJourney.tone && mayaJourney.finalPrompt && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg p-4 border-2 border-green-500 shadow-lg"
            >
              <h4 className="font-semibold text-green-800 mb-2">Your PACE Framework:</h4>
              <div className="text-sm space-y-2">
                <p><strong>Purpose:</strong> {mayaJourney.purpose}</p>
                <p><strong>Audience:</strong> {mayaJourney.selectedAudience?.replace('_', ' ')}</p>
                <p><strong>Connection:</strong> {mayaJourney.tone}</p>
                <p><strong>Engagement:</strong> {mayaJourney.finalPrompt}</p>
              </div>
              <Button 
                onClick={() => setCurrentStageIndex(5)}
                className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Generate Your Perfect Email <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
        </div>
      ),
      narrativeMessages: [
        {
          id: 'crafting-1',
          content: "Maya takes a deep breath and starts writing with Elena's voice in her head: 'Start with why this matters to you.' She begins: 'Yesterday, I watched 12-year-old Jordan finally smile after weeks in our program. That's when I knew we had to tell you about the magic happening here.' The words flow naturally now.",
          delay: 500,
        }
      ]
    },

    // Stage 6: Complete Email Generator & Results
    {
      id: 'completion',
      title: 'Your Perfect Email',
      component: (
        <div className="h-full flex flex-col p-6 space-y-6">
          {/* Phase 1: Story Hook */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500">
            <h3 className="font-semibold text-purple-800 mb-2">Maya's Transformation</h3>
            <p className="text-sm text-purple-700">
              "From 3 hours of struggle to 20 minutes of clarity. The PACE framework changed everything."
            </p>
          </div>

          {/* Phase 2: Generated Email */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-lg border-2 border-purple-200 shadow-lg">
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-t-lg">
                <h4 className="font-semibold text-purple-800">Your Generated Email</h4>
              </div>
              <div className="p-4 space-y-3">
                <div className="border-b pb-2">
                  <p className="font-semibold">Subject: Exciting Update from Our Summer Program</p>
                </div>
                <div className="text-sm space-y-2 text-gray-700">
                  <p>Dear {mayaJourney.selectedAudience === 'dr_williams' ? 'Dr. Williams' : mayaJourney.selectedAudience === 'sarah_chen' ? 'Sarah' : mayaJourney.selectedAudience === 'marcus_torres' ? 'Marcus' : 'Board Members'},</p>
                  
                  <p>I wanted to share something that happened yesterday that perfectly captures why our summer program exceeded every expectation.</p>
                  
                  <p>Yesterday, I watched 12-year-old Jordan - who hadn't spoken in group activities for three weeks - finally open up and share his story with the other kids. In that moment, I saw the transformation we've been working toward all summer.</p>
                  
                  <p>Our program served 127 young people this summer, with 89% showing measurable improvements in confidence and social skills. But beyond the data, it's breakthrough moments like Jordan's that remind me why this work matters so deeply.</p>
                  
                  <p>I'd love to {mayaJourney.finalPrompt === 'Schedule a meeting' ? 'schedule time to share more details about our plans for next year' : 'hear your thoughts on how we can continue building on this incredible momentum'}.</p>
                  
                  <p>Thank you for believing in what we're building together.</p>
                  
                  <p>With gratitude,<br/>Maya Rodriguez<br/>Communications Director, Hope Valley Youth Center</p>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-green-700">Engagement Rate</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">2.3x</div>
                <div className="text-sm text-blue-700">Response Rate</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">20min</div>
                <div className="text-sm text-purple-700">Time Saved</div>
              </div>
            </div>
          </div>

          {/* Phase 3: Actions */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Subject: Exciting Update from Our Summer Program\n\nDear ${mayaJourney.selectedAudience === 'board' ? 'Board Members' : 'Friends'},\n\nI wanted to share something that happened yesterday that perfectly captures why our work matters so much.\n\nYesterday, I watched 12-year-old Jordan finally smile after weeks in our program. That moment reminded me why we do this work and why your support makes such a difference.\n\nOur summer program has now served 127 young people, with 89% showing measurable improvements in confidence and social skills. But beyond the numbers, it's moments like Jordan's smile that tell the real story.\n\nI'd love to ${mayaJourney.finalPrompt === 'Schedule a meeting' ? 'schedule a time to share more details' : 'hear your thoughts on how we can continue building on this success'}.\n\nThank you for being part of this journey.\n\nWith gratitude,\nMaya Rodriguez`
                  );
                }}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                📋 Copy Email
              </Button>
              <Button 
                onClick={() => setCurrentStageIndex(3)}
                variant="outline"
                className="hover:bg-purple-50"
              >
                🔄 Try Again
              </Button>
            </div>
            
            {/* Phase 4: Success Celebration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-current" />
                <h4 className="font-semibold">Congratulations!</h4>
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-sm">
                You've mastered the PACE Framework and transformed from overwhelmed to confident communicator - just like Maya!
              </p>
            </motion.div>
          </div>
        </div>
      ),
      narrativeMessages: [
        {
          id: 'completion',
          content: MAYA_STORYLINE.transformation,
          delay: 500,
        }
      ]
    }
  ];

  // Current stage and narrative messages
  const currentStage = dynamicStages[currentStageIndex];
  const currentNarrativeMessage = currentStage?.narrativeMessages?.[0];

  // Story phases based on the current narrative message
  const storyPhases: StoryPhase[] = currentNarrativeMessage ? [
    {
      id: currentStage.id,
      content: currentNarrativeMessage.content,
      delay: currentNarrativeMessage.delay || 2000
    }
  ] : [
    {
      id: 'intro',
      content: `Hi there! I'm Maya Rodriguez, a communications strategist who's helped hundreds of professionals transform their email presence. Today, I want to share something personal with you.

Five years ago, I was that person who would stare at a blank email for 20 minutes, second-guessing every word. I'd write, delete, rewrite, and still hit send feeling uncertain. Sound familiar?

The breakthrough came when I realized that great communication isn't about perfect words—it's about understanding your purpose, knowing your audience, and having a clear strategy. That's when I developed what I call the PACE framework.

Let me show you exactly how this works through my own story...`,
      delay: 2000
    }
  ];

  // Initialize with the first stage
  useEffect(() => {
    if (currentStage?.narrativeMessages?.[0]) {
      startTyping(currentStage.narrativeMessages[0].content);
    }
  }, [currentStageIndex]);

  // Typewriter effect
  const startTyping = (text: string) => {
    setDisplayedText('');
    setIsTyping(true);
    setShowSkipButton(true);
    
    let index = 0;
    const typeSpeed = 30; // milliseconds per character
    
    const typeWriter = () => {
      if (index < text.length) {
        setDisplayedText(text.substring(0, index + 1));
        index++;
        typingRef.current = setTimeout(typeWriter, typeSpeed);
      } else {
        setIsTyping(false);
        setShowSkipButton(false);
      }
    };
    
    typeWriter();
  };

  const skipTyping = () => {
    if (typingRef.current) {
      clearTimeout(typingRef.current);
    }
    setDisplayedText(currentNarrativeMessage?.content || storyPhases[0].content);
    setIsTyping(false);
    setShowSkipButton(false);
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (typingRef.current) {
        clearTimeout(typingRef.current);
      }
    };
  }, []);

  const currentPhase = storyPhases[0];
  const totalStages = dynamicStages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex">
      {/* Left Panel - Maya's Story */}
      <div className="lg:w-3/5 flex flex-col">
        <Card className="flex-1 rounded-none border-0 bg-white shadow-xl">
          <CardHeader className="border-b border-border bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LyraAvatar 
                  size="md" 
                  expression={lyraExpression}
                  withWave={false}
                  className="flex-shrink-0 shadow-lg"
                />
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Maya's Dynamic Communication Journey
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete Chapter 2 with Dynamic PACE
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-purple-600">
                    {currentStageIndex + 1}/{totalStages}
                  </span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-green-600">0/5 skills</span>
                </div>
                {showSkipButton && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={skipTyping}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-orange-500 hover:border-orange-600 shadow-lg"
                  >
                    <FastForward className="w-4 h-4 mr-2" />
                    Fast Forward
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          {/* Progress indicator */}
          <div className="px-8 pt-6 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-purple-600">
                🌟 Lyra's Dynamic Journey Guidance
              </span>
              <span className="text-sm text-muted-foreground">
                Meeting Maya Rodriguez
              </span>
            </div>
            <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentStageIndex + 1) / totalStages) * 100}%` }}
              />
            </div>
          </div>
          
          <CardContent className="flex-1 p-8 space-y-6">
            {/* Story Content */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200 shadow-lg">
                <div className="prose prose-lg max-w-none">
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-3 h-6 bg-purple-500 ml-1 animate-pulse rounded-sm" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator orientation="vertical" className="h-full" />

      {/* Right Panel - Interactive Workshop */}
      <div className="lg:w-2/5 bg-card border-l border-border flex flex-col">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentStage?.title || 'Interactive Workshop'}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Stage {currentStageIndex + 1} of {totalStages}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-6 overflow-y-auto">
          {currentStage?.component || (
            <div className="text-center text-muted-foreground">
              <p>Workshop will begin soon...</p>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default LyraNarratedMayaDynamicComplete;