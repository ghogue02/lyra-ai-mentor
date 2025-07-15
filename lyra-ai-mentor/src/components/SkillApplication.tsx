import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Target, Trophy } from 'lucide-react';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';

interface SkillApplicationProps {
  characterId: string;
  skillName: string;
  practiceScenario: string;
  expectedOutcome: string;
  realWorldExample?: string;
  className?: string;
}

export const SkillApplication: React.FC<SkillApplicationProps> = ({
  characterId,
  skillName,
  practiceScenario,
  expectedOutcome,
  realWorldExample,
  className = ''
}) => {
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  return (
    <Card className={`p-6 bg-gradient-to-br from-white to-purple-50 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: story.color }}
          >
            {story.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{skillName}</h3>
            <p className="text-sm text-gray-600">Apply {story.name.split(' ')[0]}'s Method</p>
          </div>
        </div>
        
        {/* Practice Scenario */}
        <div className="bg-white p-4 rounded-lg border border-purple-200">
          <div className="flex items-start gap-2">
            <Target className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-purple-900 mb-1">Your Practice Scenario</h4>
              <p className="text-sm text-gray-700">{practiceScenario}</p>
            </div>
          </div>
        </div>
        
        {/* Expected Outcome */}
        <div className="flex items-center gap-3">
          <ArrowRight className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-700">Expected Result:</p>
            <p className="text-sm text-gray-600">{expectedOutcome}</p>
          </div>
        </div>
        
        {/* Real World Example */}
        {realWorldExample && (
          <div className="bg-purple-100 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              <Trophy className="w-4 h-4 inline mr-1" />
              <span className="font-medium">{story.name.split(' ')[0]}'s Success:</span> {realWorldExample}
            </p>
          </div>
        )}
        
        {/* Skills Checklist */}
        <div className="border-t pt-3">
          <p className="text-xs font-medium text-gray-600 mb-2">Skills You're Building:</p>
          <div className="flex flex-wrap gap-2">
            {story.skills.filter(skill => skill.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(skill.toLowerCase())).map((skill, index) => (
              <div key={index} className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Progress tracking for skill application
export const SkillProgress: React.FC<{
  characterId: string;
  completedSteps: number;
  totalSteps: number;
  currentSkill: string;
}> = ({ characterId, completedSteps, totalSteps, currentSkill }) => {
  const { getStory } = useCharacterStory();
  const story = getStory(characterId);
  
  if (!story) return null;
  
  const progress = (completedSteps / totalSteps) * 100;
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: story.color }}
          >
            {story.name.charAt(0)}
          </div>
          <span className="text-sm font-medium">Learning {currentSkill}</span>
        </div>
        <span className="text-sm text-gray-600">{completedSteps}/{totalSteps} steps</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="h-full rounded-full transition-all duration-500"
          style={{ 
            width: `${progress}%`,
            backgroundColor: story.color 
          }}
        />
      </div>
      
      {progress === 100 && (
        <p className="text-xs text-green-600 mt-2 text-center">
          🎉 You've mastered {story.name.split(' ')[0]}'s {currentSkill} technique!
        </p>
      )}
    </div>
  );
};