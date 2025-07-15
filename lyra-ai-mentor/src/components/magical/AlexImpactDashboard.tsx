import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Award, ArrowUp, ArrowDown, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StakeholderGroup {
  name: string;
  resistance: number;
  buyIn: number;
  influence: 'high' | 'medium' | 'low';
  status: 'resistant' | 'neutral' | 'supportive' | 'champion';
}

interface AlexImpactDashboardProps {
  changeInitiative: 'ai-adoption' | 'process-transformation' | 'culture-shift';
  autoAnimate?: boolean;
}

export const AlexImpactDashboard: React.FC<AlexImpactDashboardProps> = ({
  changeInitiative,
  autoAnimate = false
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [organizationalAlignment, setOrganizationalAlignment] = useState(0);
  const [stakeholderGroups, setStakeholderGroups] = useState<StakeholderGroup[]>([]);

  const getInitialStakeholders = (): StakeholderGroup[] => {
    switch (changeInitiative) {
      case 'ai-adoption':
        return [
          { name: 'Executive Team', resistance: 80, buyIn: 20, influence: 'high', status: 'resistant' },
          { name: 'Program Directors', resistance: 60, buyIn: 40, influence: 'high', status: 'resistant' },
          { name: 'Frontline Staff', resistance: 90, buyIn: 10, influence: 'medium', status: 'resistant' },
          { name: 'IT Department', resistance: 30, buyIn: 70, influence: 'medium', status: 'supportive' },
          { name: 'Board Members', resistance: 70, buyIn: 30, influence: 'high', status: 'resistant' }
        ];
      case 'process-transformation':
        return [
          { name: 'Operations Team', resistance: 75, buyIn: 25, influence: 'high', status: 'resistant' },
          { name: 'Finance Department', resistance: 85, buyIn: 15, influence: 'high', status: 'resistant' },
          { name: 'Program Staff', resistance: 65, buyIn: 35, influence: 'medium', status: 'neutral' },
          { name: 'Volunteers', resistance: 50, buyIn: 50, influence: 'low', status: 'neutral' },
          { name: 'Leadership', resistance: 40, buyIn: 60, influence: 'high', status: 'supportive' }
        ];
      case 'culture-shift':
        return [
          { name: 'Long-term Staff', resistance: 95, buyIn: 5, influence: 'high', status: 'resistant' },
          { name: 'New Hires', resistance: 20, buyIn: 80, influence: 'low', status: 'champion' },
          { name: 'Middle Management', resistance: 70, buyIn: 30, influence: 'high', status: 'resistant' },
          { name: 'Community Partners', resistance: 60, buyIn: 40, influence: 'medium', status: 'neutral' },
          { name: 'Donors', resistance: 55, buyIn: 45, influence: 'high', status: 'neutral' }
        ];
      default:
        return [];
    }
  };

  const getInitiativeTitle = () => {
    switch (changeInitiative) {
      case 'ai-adoption':
        return 'AI Adoption Strategy';
      case 'process-transformation':
        return 'Process Transformation';
      case 'culture-shift':
        return 'Culture Shift Initiative';
      default:
        return 'Change Initiative';
    }
  };

  const getStatusColor = (status: StakeholderGroup['status']) => {
    switch (status) {
      case 'resistant':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'supportive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'champion':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: StakeholderGroup['status']) => {
    switch (status) {
      case 'resistant':
        return <AlertCircle className="w-4 h-4" />;
      case 'neutral':
        return <Target className="w-4 h-4" />;
      case 'supportive':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'champion':
        return <Award className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const animateTransformation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationPhase(0);
    setStakeholderGroups(getInitialStakeholders());
    setOrganizationalAlignment(0);
    
    const phases = [
      // Phase 1: Initial resistance
      () => {
        setAnimationPhase(1);
        setOrganizationalAlignment(15);
      },
      // Phase 2: Early adopters emerge
      () => {
        setAnimationPhase(2);
        setStakeholderGroups(prev => prev.map(group => ({
          ...group,
          resistance: Math.max(group.resistance - 20, 10),
          buyIn: Math.min(group.buyIn + 20, 90),
          status: group.name === 'IT Department' || group.name === 'New Hires' ? 'champion' : 
                 group.buyIn > 50 ? 'supportive' : 'neutral'
        })));
        setOrganizationalAlignment(35);
      },
      // Phase 3: Momentum building
      () => {
        setAnimationPhase(3);
        setStakeholderGroups(prev => prev.map(group => ({
          ...group,
          resistance: Math.max(group.resistance - 30, 5),
          buyIn: Math.min(group.buyIn + 30, 95),
          status: group.buyIn > 70 ? 'champion' : 
                 group.buyIn > 50 ? 'supportive' : 'neutral'
        })));
        setOrganizationalAlignment(65);
      },
      // Phase 4: Widespread adoption
      () => {
        setAnimationPhase(4);
        setStakeholderGroups(prev => prev.map(group => ({
          ...group,
          resistance: Math.max(group.resistance - 40, 0),
          buyIn: Math.min(group.buyIn + 40, 100),
          status: group.buyIn > 85 ? 'champion' : 
                 group.buyIn > 60 ? 'supportive' : 'neutral'
        })));
        setOrganizationalAlignment(90);
      }
    ];

    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < phases.length) {
        phases[currentPhase]();
        currentPhase++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 2000);
  };

  const resetDashboard = () => {
    setAnimationPhase(0);
    setIsAnimating(false);
    setOrganizationalAlignment(0);
    setStakeholderGroups(getInitialStakeholders());
  };

  useEffect(() => {
    setStakeholderGroups(getInitialStakeholders());
    setOrganizationalAlignment(0);
    setAnimationPhase(0);
  }, [changeInitiative]);

  useEffect(() => {
    if (autoAnimate) {
      const timer = setTimeout(() => {
        animateTransformation();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoAnimate, changeInitiative]);

  const getPhaseDescription = () => {
    switch (animationPhase) {
      case 0:
        return 'Initial state - High resistance to change';
      case 1:
        return 'Phase 1 - Identifying champions and early adopters';
      case 2:
        return 'Phase 2 - Building momentum with success stories';
      case 3:
        return 'Phase 3 - Scaling adoption across organization';
      case 4:
        return 'Phase 4 - Achieving organizational alignment';
      default:
        return 'Ready to begin transformation';
    }
  };

  const supportiveCount = stakeholderGroups.filter(g => g.status === 'supportive' || g.status === 'champion').length;
  const resistantCount = stakeholderGroups.filter(g => g.status === 'resistant').length;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-purple-700">
          🎯 {getInitiativeTitle()}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={animateTransformation}
            disabled={isAnimating}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isAnimating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isAnimating ? 'Transforming...' : 'Start Transformation'}
          </button>
          <button
            onClick={resetDashboard}
            className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Organizational Alignment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-purple-100 rounded-full h-3">
              <div 
                className="bg-purple-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${organizationalAlignment}%` }}
              />
            </div>
            <span className="text-purple-800 font-bold">{organizationalAlignment}%</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Supportive Stakeholders</span>
          </div>
          <p className="text-green-800 font-bold text-lg">
            {supportiveCount} of {stakeholderGroups.length}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Resistant Groups</span>
          </div>
          <p className="text-red-800 font-bold text-lg">
            {resistantCount} remaining
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-purple-700 mb-3">Stakeholder Journey</h4>
        <div className="space-y-3">
          {stakeholderGroups.map((group, index) => (
            <div key={group.name} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">
                {group.name}
              </div>
              
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${group.buyIn}%` }}
                />
              </div>
              
              <div className={`
                px-2 py-1 rounded text-xs font-medium border transition-all duration-500
                ${getStatusColor(group.status)}
              `}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(group.status)}
                  <span>{group.status}</span>
                </div>
              </div>
              
              <div className="w-12 text-xs text-gray-500">
                {group.buyIn}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-purple-700">Transformation Phase</span>
        </div>
        <p className="text-purple-800 font-medium">
          {getPhaseDescription()}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-purple-600">
        <span>Alex's Change Strategy Magic ✨</span>
        <span>Phase {animationPhase} of 4</span>
      </div>
    </div>
  );
};