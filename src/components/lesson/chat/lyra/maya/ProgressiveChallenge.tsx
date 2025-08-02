import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, User, Clock, AlertTriangle } from 'lucide-react';

interface Challenge {
  description: string;
  context: string;
  emotions: string[];
  urgency: 'low' | 'medium' | 'high';
}

interface ProgressiveChallengeProps {
  onChallengeSubmit: (challenge: Challenge) => void;
  mayaChallenge?: Challenge;
  showComparison?: boolean;
}

const ProgressiveChallenge: React.FC<ProgressiveChallengeProps> = ({
  onChallengeSubmit,
  mayaChallenge,
  showComparison = false
}) => {
  const [challenge, setChallenge] = useState<Challenge>({
    description: '',
    context: '',
    emotions: [],
    urgency: 'medium'
  });
  const [step, setStep] = useState(1);

  const emotionOptions = [
    { id: 'frustrated', label: 'Frustrated', color: 'bg-red-100 text-red-800' },
    { id: 'anxious', label: 'Anxious', color: 'bg-orange-100 text-orange-800' },
    { id: 'worried', label: 'Worried', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'hopeful', label: 'Hopeful', color: 'bg-green-100 text-green-800' },
    { id: 'determined', label: 'Determined', color: 'bg-blue-100 text-blue-800' },
    { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-purple-100 text-purple-800' }
  ];

  const toggleEmotion = (emotionId: string) => {
    setChallenge(prev => ({
      ...prev,
      emotions: prev.emotions.includes(emotionId)
        ? prev.emotions.filter(e => e !== emotionId)
        : [...prev.emotions, emotionId]
    }));
  };

  const handleSubmit = () => {
    if (challenge.description.trim() && challenge.context.trim()) {
      onChallengeSubmit(challenge);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">Describe Your Challenge</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Just like Maya struggled with her important email, what communication challenge are you facing?
            </p>
            <Textarea
              placeholder="Describe your communication challenge... (e.g., 'I need to write a difficult email to my team about project delays')"
              value={challenge.description}
              onChange={(e) => setChallenge(prev => ({ ...prev, description: e.target.value }))}
              className="min-h-24"
            />
            <Button
              onClick={() => setStep(2)}
              disabled={!challenge.description.trim()}
              className="w-full"
            >
              Next: Add Context
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="font-semibold">What's the Context?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Help us understand the situation better. What makes this challenging for you?
            </p>
            <Textarea
              placeholder="Provide context... (e.g., 'This is for my manager and the whole team will see it. I'm worried about coming across as unprofessional or making excuses.')"
              value={challenge.context}
              onChange={(e) => setChallenge(prev => ({ ...prev, context: e.target.value }))}
              className="min-h-24"
            />
            <Button
              onClick={() => setStep(3)}
              disabled={!challenge.context.trim()}
              className="w-full"
            >
              Next: How Do You Feel?
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-600" />
              <h3 className="font-semibold">How Does This Make You Feel?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Maya felt frustrated and overwhelmed. What emotions are you experiencing?
            </p>
            <div className="grid grid-cols-2 gap-2">
              {emotionOptions.map((emotion) => (
                <Button
                  key={emotion.id}
                  variant={challenge.emotions.includes(emotion.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleEmotion(emotion.id)}
                  className={`${
                    challenge.emotions.includes(emotion.id)
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {emotion.label}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => setStep(4)}
              disabled={challenge.emotions.length === 0}
              className="w-full"
            >
              Next: Set Urgency
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold">How Urgent Is This?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Maya had a tight deadline. What's your timeline?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'low', label: 'Low Priority', desc: 'Can wait a few days' },
                { value: 'medium', label: 'Medium Priority', desc: 'Need to handle soon' },
                { value: 'high', label: 'High Priority', desc: 'Urgent - need to act now' }
              ].map((option) => (
                <Button
                  key={option.value}
                  variant={challenge.urgency === option.value ? "default" : "outline"}
                  onClick={() => setChallenge(prev => ({ ...prev, urgency: option.value as any }))}
                  className={`flex-col h-auto p-4 ${
                    challenge.urgency === option.value
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs opacity-75">{option.desc}</span>
                </Button>
              ))}
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              That's My Challenge!
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-purple-600" />
              Your Challenge Connection
            </CardTitle>
            <p className="text-gray-600">
              Step {step} of 4: Let's understand your unique situation
            </p>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>
      </motion.div>

      {/* Maya's Challenge Comparison */}
      {showComparison && mayaChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">Maya's Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Challenge:</h4>
                  <p className="text-sm">{mayaChallenge.description}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Context:</h4>
                  <p className="text-sm">{mayaChallenge.context}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Emotions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {mayaChallenge.emotions.map((emotion) => (
                      <Badge
                        key={emotion}
                        variant="secondary"
                        className={emotionOptions.find(e => e.id === emotion)?.color}
                      >
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700">Urgency:</h4>
                  <Badge className={getUrgencyColor(mayaChallenge.urgency)}>
                    {mayaChallenge.urgency} priority
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressiveChallenge;