import React from 'react';
import { Lightbulb, Target, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MayaJourneyState {
  purpose: string;
  audience: string;
  tone: string;
  generated: string;
  aiPrompt: string;
  audienceContext: string;
  situationDetails: string;
  finalPrompt: string;
  selectedConsiderations: string[];
  selectedAudience: string;
  adaptedTone: string;
  toneConfidence: number;
  templateCategory: string;
  customTemplate: string;
  savedTemplates: string[];
  conversationScenario: string;
  empathyResponse: string;
  resolutionStrategy: string;
  subjectStrategy: string;
  testedSubjects: string[];
  finalSubject: string;
}

interface Stage {
  id: string;
  title: string;
  component: React.ReactNode;
  narrativeMessages?: {
    content: string;
    delay?: number;
  }[];
}

interface StageParams {
  mayaJourney: MayaJourneyState;
  setMayaJourney: React.Dispatch<React.SetStateAction<MayaJourneyState>>;
  onStageAdvance?: (stageIndex: number) => void;
}

// Define a simple component for demonstration purposes
const PlaceholderComponent: React.FC<{ text: string }> = ({ text }) => (
  <div>{text}</div>
);

// Purpose Selection Component
const PurposeSelectionComponent: React.FC<{
  selectedPurpose: string;
  onPurposeSelect: (purpose: string) => void;
}> = ({ selectedPurpose, onPurposeSelect }) => {
  const purposes = [
    {
      id: 'share-news',
      title: 'Share important news',
      icon: Lightbulb,
    },
    {
      id: 'invite-support',
      title: 'Invite someone to support',
      icon: Target,
    }
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select the primary purpose of your communication:
      </p>
      
      <div className="flex gap-3">
        {purposes.map((purpose) => {
          const IconComponent = purpose.icon;
          const isSelected = selectedPurpose === purpose.id;
          
          return (
            <button
              key={purpose.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 hover:shadow-sm ${
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-background hover:bg-muted/50 border-border'
              }`}
              onClick={() => onPurposeSelect(purpose.id)}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm font-medium">{purpose.title}</span>
              {isSelected && (
                <CheckCircle2 className="h-4 w-4 ml-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const createDynamicMayaStages = (params: StageParams): Stage[] => {
  const { mayaJourney, setMayaJourney, onStageAdvance } = params;

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMayaJourney({ ...mayaJourney, purpose: e.target.value });
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMayaJourney({ ...mayaJourney, audience: e.target.value });
  };

  const handlePurposeSelect = (purpose: string) => {
    setMayaJourney({ ...mayaJourney, purpose });
  };

  // Example stages
  const stages: Stage[] = [
    {
      id: 'stage-1',
      title: 'Understanding Your Purpose',
      narrativeMessages: [{ content: 'First, let\'s define your email\'s purpose. What do you want to achieve?' }],
      component: (
        <div>
          <p>What is the primary goal of your email?</p>
          <input
            type="text"
            value={mayaJourney.purpose}
            onChange={handlePurposeChange}
            className="border rounded p-2 w-full"
          />
        </div>
      ),
    },
    {
      id: 'stage-2',
      title: 'Identifying Your Audience',
      narrativeMessages: [{ content: 'Now, who are you writing to? Understanding your audience is key.' }],
      component: (
        <div>
          <p>Who is your target audience?</p>
          <input
            type="text"
            value={mayaJourney.audience}
            onChange={handleAudienceChange}
            className="border rounded p-2 w-full"
          />
        </div>
      ),
    },
    {
      id: 'stage-3',
      title: 'Choosing the Right Purpose',
      narrativeMessages: [{ content: 'Let\'s identify the main purpose of your communication. This will help us craft the right message.' }],
      component: (
        <PurposeSelectionComponent 
          selectedPurpose={mayaJourney.purpose}
          onPurposeSelect={handlePurposeSelect}
        />
      ),
    },
    {
      id: 'stage-4',
      title: 'Crafting Your Message',
      narrativeMessages: [{ content: 'Now, let\'s put it all together and craft your message.' }],
      component: (
        <PlaceholderComponent text="Compose your email based on the previous steps." />
      ),
    },
    {
      id: 'stage-5',
      title: 'Finalizing and Sending',
      narrativeMessages: [{ content: 'Finally, review and send your polished email!' }],
      component: (
        <PlaceholderComponent text="Review and send your email." />
      ),
    },
  ];

  return stages;
};
