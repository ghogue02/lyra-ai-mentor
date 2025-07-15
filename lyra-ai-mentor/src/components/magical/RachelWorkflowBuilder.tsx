import React, { useState, useEffect } from 'react';
import { Users, Bot, ArrowRight, CheckCircle, Clock, Settings, Zap } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  type: 'human' | 'ai' | 'collaborative';
  description: string;
  timeSaved: number;
  status: 'pending' | 'active' | 'completed';
}

interface RachelWorkflowBuilderProps {
  workflowType: 'donor-outreach' | 'program-evaluation' | 'volunteer-coordination';
  autoPlay?: boolean;
}

export const RachelWorkflowBuilder: React.FC<RachelWorkflowBuilderProps> = ({
  workflowType,
  autoPlay = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [stakeholderAlignment, setStakeholderAlignment] = useState(0);

  const getWorkflowSteps = (): WorkflowStep[] => {
    switch (workflowType) {
      case 'donor-outreach':
        return [
          {
            id: 'identify',
            title: 'Identify Prospects',
            type: 'ai',
            description: 'AI analyzes donor database for giving patterns',
            timeSaved: 5,
            status: 'pending'
          },
          {
            id: 'personalize',
            title: 'Personalize Outreach',
            type: 'collaborative',
            description: 'Human expertise + AI personalization',
            timeSaved: 8,
            status: 'pending'
          },
          {
            id: 'schedule',
            title: 'Schedule Follow-ups',
            type: 'ai',
            description: 'AI optimizes timing and frequency',
            timeSaved: 3,
            status: 'pending'
          },
          {
            id: 'relationship',
            title: 'Build Relationships',
            type: 'human',
            description: 'Human connection and stewardship',
            timeSaved: 0,
            status: 'pending'
          }
        ];
      case 'program-evaluation':
        return [
          {
            id: 'collect',
            title: 'Data Collection',
            type: 'ai',
            description: 'AI gathers metrics from multiple sources',
            timeSaved: 6,
            status: 'pending'
          },
          {
            id: 'analyze',
            title: 'Impact Analysis',
            type: 'collaborative',
            description: 'AI patterns + human insight',
            timeSaved: 10,
            status: 'pending'
          },
          {
            id: 'report',
            title: 'Report Generation',
            type: 'ai',
            description: 'AI creates initial reports',
            timeSaved: 4,
            status: 'pending'
          },
          {
            id: 'interpret',
            title: 'Strategic Interpretation',
            type: 'human',
            description: 'Human wisdom guides decisions',
            timeSaved: 0,
            status: 'pending'
          }
        ];
      case 'volunteer-coordination':
        return [
          {
            id: 'match',
            title: 'Skill Matching',
            type: 'ai',
            description: 'AI matches volunteers to opportunities',
            timeSaved: 7,
            status: 'pending'
          },
          {
            id: 'schedule',
            title: 'Schedule Coordination',
            type: 'ai',
            description: 'AI optimizes schedules and availability',
            timeSaved: 5,
            status: 'pending'
          },
          {
            id: 'communicate',
            title: 'Communication',
            type: 'collaborative',
            description: 'AI drafts + human personalizes',
            timeSaved: 6,
            status: 'pending'
          },
          {
            id: 'support',
            title: 'Ongoing Support',
            type: 'human',
            description: 'Human mentorship and guidance',
            timeSaved: 0,
            status: 'pending'
          }
        ];
      default:
        return [];
    }
  };

  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(getWorkflowSteps());

  const getWorkflowTitle = () => {
    switch (workflowType) {
      case 'donor-outreach':
        return 'Donor Outreach Automation';
      case 'program-evaluation':
        return 'Program Evaluation Workflow';
      case 'volunteer-coordination':
        return 'Volunteer Coordination System';
      default:
        return 'Workflow Builder';
    }
  };

  const getStepIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'human':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'ai':
        return <Bot className="w-5 h-5 text-blue-600" />;
      case 'collaborative':
        return <Zap className="w-5 h-5 text-purple-600" />;
      default:
        return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStepColor = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'human':
        return 'border-teal-200 bg-teal-50';
      case 'ai':
        return 'border-blue-200 bg-blue-50';
      case 'collaborative':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const animateWorkflow = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentStep(0);
    setStakeholderAlignment(0);
    
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        
        // Update step status
        setWorkflowSteps(steps => 
          steps.map((step, index) => ({
            ...step,
            status: index < nextStep ? 'completed' : index === nextStep ? 'active' : 'pending'
          }))
        );
        
        // Update stakeholder alignment
        setStakeholderAlignment(Math.min(25 * nextStep, 100));
        
        if (nextStep >= workflowSteps.length) {
          clearInterval(interval);
          setIsAnimating(false);
        }
        
        return nextStep;
      });
    }, 1500);
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setStakeholderAlignment(0);
    setIsAnimating(false);
    setWorkflowSteps(getWorkflowSteps());
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        animateWorkflow();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, workflowType]);

  const totalTimeSaved = workflowSteps.reduce((sum, step) => sum + step.timeSaved, 0);

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-teal-700">
          ⚙️ {getWorkflowTitle()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={animateWorkflow}
            disabled={isAnimating}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isAnimating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isAnimating ? 'Building...' : 'Build Workflow'}
          </button>
          <button
            onClick={resetWorkflow}
            className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-4">
            <div className={`
              w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500
              ${step.status === 'completed' 
                ? 'border-green-500 bg-green-100' 
                : step.status === 'active' 
                  ? 'border-blue-500 bg-blue-100 animate-pulse' 
                  : 'border-gray-300 bg-gray-100'
              }
            `}>
              {step.status === 'completed' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : step.status === 'active' ? (
                <Clock className="w-6 h-6 text-blue-600 animate-spin" />
              ) : (
                getStepIcon(step.type)
              )}
            </div>
            
            <div className={`
              flex-1 p-4 rounded-lg border-2 transition-all duration-500
              ${step.status === 'completed' 
                ? 'border-green-200 bg-green-50' 
                : step.status === 'active' 
                  ? 'border-blue-200 bg-blue-50 shadow-md' 
                  : getStepColor(step.type)
              }
            `}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-800">{step.title}</h4>
                <div className="flex items-center gap-2">
                  {step.timeSaved > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      -{step.timeSaved}h/week
                    </span>
                  )}
                  <span className={`
                    px-2 py-1 text-xs rounded
                    ${step.type === 'human' ? 'bg-teal-100 text-teal-700' :
                      step.type === 'ai' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'}
                  `}>
                    {step.type}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            
            {index < workflowSteps.length - 1 && (
              <div className="ml-6">
                <ArrowRight className={`
                  w-4 h-4 transition-all duration-500
                  ${step.status === 'completed' ? 'text-green-500' : 'text-gray-400'}
                `} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Time Efficiency</span>
          </div>
          <p className="text-teal-800 font-bold text-lg">
            {totalTimeSaved} hours saved per week
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Stakeholder Alignment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-teal-100 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stakeholderAlignment}%` }}
              />
            </div>
            <span className="text-teal-800 font-bold">{stakeholderAlignment}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-teal-600">
        <span>Rachel's Automation Vision Magic ✨</span>
        <span>
          {workflowSteps.filter(s => s.status === 'completed').length} of {workflowSteps.length} steps completed
        </span>
      </div>
    </div>
  );
};