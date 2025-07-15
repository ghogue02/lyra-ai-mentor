import React from 'react';
import ScalableInteractiveBuilder from '../ScalableInteractiveBuilder';

// Generated component for Alex Chen - Chapter X
const AlexChapter3InteractiveBuilder: React.FC = () => {
  const character = {
  "id": "alex",
  "name": "Alex Chen",
  "profession": "Executive Director",
  "primarySkill": "strategy",
  "challengePattern": "overwhelm-to-clarity",
  "transformationArc": {
    "before": "Scattered priorities and unclear strategic direction",
    "after": "Clear strategic focus with actionable plans",
    "timeMetrics": {
      "before": "3 hours planning sessions",
      "after": "45 minutes focused planning",
      "savings": "2 hours 15 minutes per session"
    }
  },
  "personalityTraits": [
    "visionary",
    "decisive",
    "collaborative",
    "results-oriented"
  ],
  "preferredLearningStyle": "frameworks with real-world application",
  "contextualScenarios": [
    "strategic planning sessions",
    "board presentations",
    "funding proposals",
    "team alignment meetings"
  ]
};
  
  const handleComplete = (result: any) => {
    console.log('AlexChapter3InteractiveBuilder completed:', result);
    // Add your completion logic here
  };

  return (
    <ScalableInteractiveBuilder
      characterId="alex"
      skillName="Strategic Planning"
      builderStages={[
  {
    "id": "intro",
    "title": "Getting Started",
    "description": "Let's help Alex Chen with Strategic Planning",
    "type": "selection",
    "options": [
      {
        "id": "begin",
        "title": "Begin Journey",
        "description": "Start your transformation journey",
        "value": "begin",
        "recommended": true
      }
    ]
  },
  {
    "id": "build",
    "title": "Build Your Solution",
    "description": "Create your personalized approach",
    "type": "input"
  },
  {
    "id": "preview",
    "title": "Preview & Refine",
    "description": "Review and improve your work",
    "type": "preview"
  },
  {
    "id": "success",
    "title": "Celebrate Success",
    "description": "See your transformation results",
    "type": "success"
  }
]}
      timeMetrics={{
  "before": "3 hours planning sessions",
  "after": "45 minutes focused planning",
  "savings": "2 hours 15 minutes per session",
  "impactDescription": "More time for execution and team development"
}}
      practicalScenario="Creating a 3-year organizational strategy for community impact"
      character={character}
      onComplete={handleComplete}
    />
  );
};

export default AlexChapter3InteractiveBuilder;
