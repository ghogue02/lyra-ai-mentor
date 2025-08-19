// Centralized character type definitions
export type CharacterType = 'lyra' | 'maya' | 'sofia' | 'david' | 'rachel' | 'alex' | 'carmen';

export interface CharacterConfig {
  id: CharacterType;
  name: string;
  title: string;
  specialty: string;
  color: string;
  avatar?: string;
}

export const CHARACTERS: Record<CharacterType, CharacterConfig> = {
  lyra: {
    id: 'lyra',
    name: 'Lyra',
    title: 'AI Foundations Expert',
    specialty: 'AI Ethics & Implementation',
    color: 'purple'
  },
  maya: {
    id: 'maya',
    name: 'Maya',
    title: 'Communication Specialist',
    specialty: 'Professional Communication',
    color: 'blue'
  },
  sofia: {
    id: 'sofia',
    name: 'Sofia',
    title: 'Storytelling Master',
    specialty: 'Brand Narrative & Content',
    color: 'green'
  },
  david: {
    id: 'david',
    name: 'David',
    title: 'Data Storytelling Expert',
    specialty: 'Analytics & Visualization',
    color: 'orange'
  },
  rachel: {
    id: 'rachel',
    name: 'Rachel',
    title: 'Workflow Automation Expert',
    specialty: 'Process Optimization',
    color: 'teal'
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    title: 'AI Leadership Strategist',
    specialty: 'Leadership & Strategy',
    color: 'red'
  },
  carmen: {
    id: 'carmen',
    name: 'Carmen',
    title: 'People Management Expert',
    specialty: 'HR & Team Dynamics',
    color: 'pink'
  }
};