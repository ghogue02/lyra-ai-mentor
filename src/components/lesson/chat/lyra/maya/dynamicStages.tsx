import React from 'react';

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

export const createDynamicMayaStages = (params: StageParams): Stage[] => {
  const { mayaJourney, setMayaJourney, onStageAdvance } = params;

  const handlePurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMayaJourney({ ...mayaJourney, purpose: e.target.value });
  };

  const handleAudienceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMayaJourney({ ...mayaJourney, audience: e.target.value });
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
      title: 'Choosing the Right Tone',
      narrativeMessages: [{ content: 'Let\'s consider the tone. Should it be formal, informal, or somewhere in between?' }],
      component: (
        <PlaceholderComponent text="Select the appropriate tone for your email." />
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
