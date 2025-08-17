import React, { createContext, useContext } from 'react';

interface CharacterStory {
  id: string;
  name: string;
  role: string;
  organization: string;
  challenge: string;
  transformation: string;
  impact: string;
  quote: string;
  timeMetrics: {
    before: string;
    after: string;
  };
  skills: string[];
  color: string;
}

const characterStories: Record<string, CharacterStory> = {
  maya: {
    id: 'maya',
    name: 'Maya Rodriguez',
    role: 'Program Director',
    organization: 'Youth Arts Initiative',
    challenge: 'Spending 15 hours per week on volunteer emails and grant proposals',
    transformation: 'Mastered AI-powered email composition and grant writing',
    impact: 'Reduced email time by 87%, secured $450K in new grants',
    quote: 'I used to dread Monday mornings with 47 unread emails. Now I handle them in 2 hours with confidence.',
    timeMetrics: {
      before: '15 hours/week on emails',
      after: '2 hours/week on emails'
    },
    skills: ['Email Composition', 'Grant Writing', 'Professional Communication', 'Board Reporting'],
    color: '#9333EA'
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia Martinez',
    role: 'Director of Community Outreach',
    organization: 'Casa de Esperanza',
    challenge: 'Struggling to articulate organizational impact in funding proposals',
    transformation: 'Found her authentic voice through AI storytelling tools',
    impact: 'Secured $2.5M in new funding, 3x increase in donor engagement',
    quote: 'I knew we had a powerful story, but couldn\'t find the words. AI helped me discover my voice.',
    timeMetrics: {
      before: '0 major grants won',
      after: '$2.5M in funding secured'
    },
    skills: ['Storytelling', 'Voice Discovery', 'Impact Communication', 'Donor Engagement'],
    color: '#7C3AED'
  },
  david: {
    id: 'david',
    name: 'David Chen',
    role: 'Data Manager',
    organization: 'Environmental Action Network',
    challenge: 'Data showed impact but nobody could understand it',
    transformation: 'Became a data storyteller using AI visualization tools',
    impact: 'Increased donor engagement by 156%, board understanding up 200%',
    quote: 'Our data was invisible until AI helped me tell its story. Now everyone sees our impact.',
    timeMetrics: {
      before: '5% report engagement',
      after: '156% increase in engagement'
    },
    skills: ['Data Visualization', 'Impact Reporting', 'Presentation Design', 'Analytics'],
    color: '#10B981'
  },
  rachel: {
    id: 'rachel',
    name: 'Rachel Thompson',
    role: 'Operations Director',
    organization: 'Community Health Partners',
    challenge: 'Team drowning in repetitive manual processes',
    transformation: 'Built AI-powered automation workflows',
    impact: 'Automated 60% of tasks, saved 20 hours/week across team',
    quote: 'We were drowning in busywork. AI automation gave us our mission back.',
    timeMetrics: {
      before: '80% time on admin',
      after: '60% tasks automated'
    },
    skills: ['Workflow Design', 'Process Automation', 'Team Efficiency', 'Systems Thinking'],
    color: '#14B8A6'
  },
  alex: {
    id: 'alex',
    name: 'Alex Rivera',
    role: 'Executive Director',
    organization: 'Youth Empowerment Alliance',
    challenge: 'Leading AI transformation with resistant team',
    transformation: 'Turned skeptics into AI champions through inclusive change management',
    impact: 'Full organizational adoption, 40% efficiency gain, happier team',
    quote: 'Change felt impossible with a tech-resistant team. We turned fear into excitement together.',
    timeMetrics: {
      before: '20% tech adoption',
      after: '100% team buy-in'
    },
    skills: ['Change Leadership', 'Strategic Planning', 'Team Alignment', 'Innovation Management'],
    color: '#8B5CF6'
  },
  carmen: {
    id: 'carmen',
    name: 'Carmen Rodriguez',
    role: 'HR Director',
    organization: 'Community Development Foundation',
    challenge: 'Overwhelming manual HR processes and struggling to retain top talent',
    transformation: 'Revolutionized people management with AI-powered HR tools',
    impact: 'Reduced hiring time by 70%, increased retention by 45%, improved team satisfaction 200%',
    quote: 'AI didn\'t replace the human touch in HR - it amplified it. Now I can focus on what matters: our people.',
    timeMetrics: {
      before: '6 weeks average hiring',
      after: '1.8 weeks average hiring'
    },
    skills: ['Talent Acquisition', 'Performance Management', 'Employee Engagement', 'Retention Strategy'],
    color: '#F59E0B'
  }
};

interface CharacterStoryContextType {
  getStory: (characterId: string) => CharacterStory | undefined;
  getAllStories: () => CharacterStory[];
  getStoryByComponent: (componentName: string) => CharacterStory | undefined;
}

const CharacterStoryContext = createContext<CharacterStoryContextType | undefined>(undefined);

export const CharacterStoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getStory = (characterId: string) => characterStories[characterId.toLowerCase()];
  
  const getAllStories = () => Object.values(characterStories);
  
  const getStoryByComponent = (componentName: string) => {
    const characterMap: Record<string, string> = {
      maya: 'maya',
      sofia: 'sofia',
      david: 'david',
      rachel: 'rachel',
      alex: 'alex',
      carmen: 'carmen'
    };
    
    const componentLower = componentName.toLowerCase();
    for (const [prefix, characterId] of Object.entries(characterMap)) {
      if (componentLower.includes(prefix)) {
        return characterStories[characterId];
      }
    }
    return undefined;
  };
  
  return (
    <CharacterStoryContext.Provider value={{ getStory, getAllStories, getStoryByComponent }}>
      {children}
    </CharacterStoryContext.Provider>
  );
};

export const useCharacterStory = () => {
  const context = useContext(CharacterStoryContext);
  if (!context) {
    throw new Error('useCharacterStory must be used within CharacterStoryProvider');
  }
  return context;
};

export type { CharacterStory };