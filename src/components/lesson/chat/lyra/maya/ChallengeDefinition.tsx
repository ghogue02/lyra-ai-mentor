import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Mail, Presentation, MessageSquare, FileText, ChevronRight, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChallengeDefinitionProps {
  onChallengeSubmit: (challenge: UserChallenge) => void;
}

interface UserChallenge {
  description: string;
  type: string;
  audience: string;
  stakes: string;
  timeframe: string;
  context: string;
}

const communicationTypes = [
  { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" />, description: 'Professional or personal email communication' },
  { id: 'presentation', label: 'Presentation', icon: <Presentation className="w-4 h-4" />, description: 'Slides, pitches, or speaking content' },
  { id: 'social', label: 'Social Media', icon: <MessageSquare className="w-4 h-4" />, description: 'Posts, campaigns, or social content' },
  { id: 'report', label: 'Report/Document', icon: <FileText className="w-4 h-4" />, description: 'Written reports, proposals, or documents' },
  { id: 'other', label: 'Other', icon: <Target className="w-4 h-4" />, description: 'Any other communication challenge' }
];

const audienceTypes = [
  { id: 'colleagues', label: 'Colleagues/Team', description: 'People you work with regularly' },
  { id: 'leadership', label: 'Leadership/Board', description: 'Senior executives or decision makers' },
  { id: 'clients', label: 'Clients/Customers', description: 'External clients or customers' },
  { id: 'community', label: 'Community/Public', description: 'General public or community members' },
  { id: 'mixed', label: 'Mixed Audience', description: 'Multiple stakeholder groups' }
];

const ChallengeDefinition: React.FC<ChallengeDefinitionProps> = ({ onChallengeSubmit }) => {
  const [challenge, setChallenge] = useState<UserChallenge>({
    description: '',
    type: '',
    audience: '',
    stakes: '',
    timeframe: '',
    context: ''
  });

  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = () => {
    if (challenge.description && challenge.type && challenge.audience) {
      onChallengeSubmit(challenge);
    }
  };

  const steps = [
    {
      title: "What's Your Challenge?",
      subtitle: "Tell me about the communication challenge you're facing",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="challenge-description">Describe your communication challenge</Label>
            <Textarea
              id="challenge-description"
              placeholder="e.g., I need to write an email to my team about a project delay, or I'm creating a presentation for potential investors..."
              value={challenge.description}
              onChange={(e) => setChallenge(prev => ({ ...prev, description: e.target.value }))}
              className="mt-2 min-h-24"
            />
          </div>
          
          <div>
            <Label htmlFor="context">Additional context (optional)</Label>
            <Textarea
              id="context"
              placeholder="Any background information that might help personalize the experience..."
              value={challenge.context}
              onChange={(e) => setChallenge(prev => ({ ...prev, context: e.target.value }))}
              className="mt-2"
            />
          </div>
        </div>
      )
    },
    {
      title: "What Type of Communication?",
      subtitle: "This helps me tailor Maya's story and Elena's coaching to your specific format",
      content: (
        <div className="grid gap-3">
          {communicationTypes.map((type) => (
            <motion.div
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${
                  challenge.type === type.id 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setChallenge(prev => ({ ...prev, type: type.id }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-purple-600">{type.icon}</div>
                    <div>
                      <h3 className="font-medium">{type.label}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      title: "Who's Your Audience?",
      subtitle: "Understanding your audience is crucial for effective prompting",
      content: (
        <div className="space-y-4">
          <RadioGroup 
            value={challenge.audience} 
            onValueChange={(value) => setChallenge(prev => ({ ...prev, audience: value }))}
          >
            {audienceTypes.map((audience) => (
              <div key={audience.id} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={audience.id} id={audience.id} />
                <Label htmlFor={audience.id} className="cursor-pointer flex-1">
                  <div>
                    <div className="font-medium">{audience.label}</div>
                    <div className="text-sm text-gray-600">{audience.description}</div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    },
    {
      title: "What's at Stake?",
      subtitle: "This helps Elena understand the importance and urgency of your challenge",
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="stakes">What happens if this communication goes well? What if it doesn't?</Label>
            <Textarea
              id="stakes"
              placeholder="e.g., Success could mean project approval and team buy-in. Failure might mean confusion and missed deadlines..."
              value={challenge.stakes}
              onChange={(e) => setChallenge(prev => ({ ...prev, stakes: e.target.value }))}
              className="mt-2 min-h-20"
            />
          </div>
          
          <div>
            <Label htmlFor="timeframe">When do you need this? (optional)</Label>
            <Input
              id="timeframe"
              placeholder="e.g., By tomorrow morning, Next week, As soon as possible..."
              value={challenge.timeframe}
              onChange={(e) => setChallenge(prev => ({ ...prev, timeframe: e.target.value }))}
              className="mt-2"
            />
          </div>
        </div>
      )
    }
  ];

  const canContinue = () => {
    switch (currentStep) {
      case 0:
        return challenge.description.trim().length > 10;
      case 1:
        return challenge.type !== '';
      case 2:
        return challenge.audience !== '';
      case 3:
        return true; // Stakes are optional but good to have
      default:
        return false;
    }
  };

  const isComplete = challenge.description && challenge.type && challenge.audience;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Define Your Challenge</h2>
        <p className="text-gray-600">
          Maya's story will adapt to match your specific communication challenge, and Elena will provide personalized coaching.
        </p>
      </motion.div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep
                  ? 'bg-purple-500'
                  : index < currentStep
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-sm text-gray-600">{steps[currentStep].subtitle}</p>
        </CardHeader>
        <CardContent>
          {steps[currentStep].content}
          
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep < steps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canContinue()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Start Maya's Journey <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary when complete */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Your Challenge Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Badge variant="secondary" className="mb-2">Challenge</Badge>
                  <p className="text-sm">{challenge.description}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Badge variant="outline">Type</Badge>
                    <p className="text-sm mt-1">{communicationTypes.find(t => t.id === challenge.type)?.label}</p>
                  </div>
                  <div>
                    <Badge variant="outline">Audience</Badge>
                    <p className="text-sm mt-1">{audienceTypes.find(a => a.id === challenge.audience)?.label}</p>
                  </div>
                </div>
                {challenge.stakes && (
                  <div>
                    <Badge variant="outline">Stakes</Badge>
                    <p className="text-sm mt-1">{challenge.stakes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ChallengeDefinition;