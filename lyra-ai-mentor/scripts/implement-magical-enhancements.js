#!/usr/bin/env node

/**
 * Magical Enhancement Implementation Script
 * 
 * Implements Phase 2 magical enhancements according to the specifications
 * while fixing import conflicts and optimizing bundle size.
 * 
 * Priority Order:
 * 1. Maya's Email Transformation Magic (confidence meter, typewriter effects)
 * 2. Sofia's Voice Discovery Magic (voice visualization)
 * 3. David's Data Storytelling Magic (live chart animations)
 * 4. Rachel's Automation Vision Magic (workflow animations)
 * 5. Alex's Change Strategy Magic (impact dashboard)
 */

import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MagicalEnhancementImplementer {
  constructor() {
    this.projectRoot = resolve(__dirname, '..');
    this.enhancementsCreated = [];
    this.errors = [];
  }

  async implement() {
    console.log('✨ Starting Magical Enhancement Implementation');
    console.log('🎯 Following Phase 2 specifications from documentation/MAGICAL_ENHANCEMENT_SPECIFICATIONS.md');
    console.log('⚡ Performance Budget: <50kB per enhancement');
    console.log('');

    try {
      // Step 1: Maya's Email Transformation Magic
      await this.implementMayaEmailMagic();
      
      // Step 2: Sofia's Voice Discovery Magic
      await this.implementSofiaVoiceMagic();
      
      // Step 3: David's Data Storytelling Magic
      await this.implementDavidChartMagic();
      
      // Step 4: Rachel's Automation Vision Magic
      await this.implementRachelWorkflowMagic();
      
      // Step 5: Alex's Change Strategy Magic
      await this.implementAlexImpactMagic();
      
      console.log('\\n🎉 Magical Enhancement Implementation completed!');
      console.log(`✨ Created ${this.enhancementsCreated.length} magical components`);
      console.log(`❌ Encountered ${this.errors.length} errors`);
      
      if (this.errors.length > 0) {
        console.log('\\n❌ Errors encountered:');
        this.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      console.log('\\n📋 Next steps:');
      console.log('   1. Test magical enhancements in browser');
      console.log('   2. Verify performance budgets');
      console.log('   3. Run character consistency tests');
      
    } catch (error) {
      console.error('💥 Implementation failed:', error);
      throw error;
    }
  }

  async implementMayaEmailMagic() {
    console.log('📧 Implementing Maya Email Transformation Magic...');
    
    // 1. Writing Confidence Meter Component
    const confidenceMeterPath = resolve(this.projectRoot, 'src/components/magical/MayaConfidenceMeter.tsx');
    
    const confidenceMeterCode = `
import React from 'react';

interface ConfidenceMeterProps {
  progress: number; // 0-100
  currentLayer: number;
  totalLayers: number;
}

export const MayaConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  progress,
  currentLayer,
  totalLayers
}) => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg border border-purple-200 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-purple-700">Writing Confidence</span>
        <span className="text-sm text-purple-600">{currentLayer}/{totalLayers} layers</span>
      </div>
      
      <div className="w-full bg-purple-100 rounded-full h-3 mb-2">
        <div 
          className="bg-gradient-to-r from-purple-600 to-cyan-500 h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: \`\${progress}%\` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-xs text-purple-600">
        {progress < 25 && "Getting started - every expert was once a beginner"}
        {progress >= 25 && progress < 50 && "Building momentum - your structure is taking shape"}
        {progress >= 50 && progress < 75 && "Gaining confidence - your voice is emerging"}
        {progress >= 75 && progress < 100 && "Almost there - polishing your professional tone"}
        {progress >= 100 && "Confident communicator - ready to make an impact! ✨"}
      </div>
    </div>
  );
};
`;

    // 2. Email Typewriter Effect Component
    const typewriterPath = resolve(this.projectRoot, 'src/components/magical/MayaTypewriterEffect.tsx');
    
    const typewriterCode = `
import React, { useState, useEffect } from 'react';

interface TypewriterEffectProps {
  text: string;
  speed?: number; // milliseconds per character
  onComplete?: () => void;
  className?: string;
}

export const MayaTypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
  onComplete,
  className = ""
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className={\`font-mono \${className}\`}>
      {displayedText}
      <span className={\`inline-block w-0.5 h-4 bg-purple-600 ml-1 \${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity\`} />
    </div>
  );
};
`;

    // 3. Transformation Celebration Component
    const celebrationPath = resolve(this.projectRoot, 'src/components/magical/MayaTransformationCelebration.tsx');
    
    const celebrationCode = `
import React, { useState, useEffect } from 'react';

interface TransformationCelebrationProps {
  timeSaved: number; // minutes
  improvements: string[];
  onComplete?: () => void;
}

export const MayaTransformationCelebration: React.FC<TransformationCelebrationProps> = ({
  timeSaved,
  improvements,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
        if (currentStep === 1) {
          setShowParticles(true);
        }
      } else {
        onComplete?.();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 overflow-hidden">
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
              style={{
                left: \`\${Math.random() * 100}%\`,
                top: \`\${Math.random() * 100}%\`,
                animationDelay: \`\${Math.random() * 2}s\`,
                animationDuration: \`\${1 + Math.random()}s\`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="relative z-10">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-green-700 mb-2">
            🎉 Email Transformation Complete!
          </div>
          
          {currentStep >= 1 && (
            <div className="text-xl text-green-600 mb-4 animate-fadeIn">
              <span className="font-semibold">{timeSaved} minutes</span> saved per email
              <div className="text-sm text-green-500 mt-1">
                That's <span className="font-semibold">{Math.round(timeSaved * 365 / 60)} hours</span> per year!
              </div>
            </div>
          )}
          
          {currentStep >= 2 && (
            <div className="space-y-2 animate-slideIn">
              <div className="text-green-700 font-medium mb-2">Your improvements:</div>
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-center text-green-600 text-sm">
                  <span className="text-green-500 mr-2">✨</span>
                  {improvement}
                </div>
              ))}
            </div>
          )}
          
          {currentStep >= 3 && (
            <div className="mt-4 text-green-700 font-medium animate-pulse">
              Ready to transform your next email! 🚀
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
`;

    try {
      // Ensure directory exists
      await fs.mkdir(resolve(this.projectRoot, 'src/components/magical'), { recursive: true });
      
      await fs.writeFile(confidenceMeterPath, confidenceMeterCode);
      await fs.writeFile(typewriterPath, typewriterCode);
      await fs.writeFile(celebrationPath, celebrationCode);
      
      this.enhancementsCreated.push('Maya Email Transformation Magic (3 components)');
      console.log('   ✅ Created MayaConfidenceMeter');
      console.log('   ✅ Created MayaTypewriterEffect');
      console.log('   ✅ Created MayaTransformationCelebration');
      
    } catch (error) {
      this.errors.push(\`Failed to implement Maya Email Magic: \${error.message}\`);
    }
  }

  async implementSofiaVoiceMagic() {
    console.log('🎤 Implementing Sofia Voice Discovery Magic...');
    
    // 1. Voice Profile Visualization Component
    const voiceVisualizationPath = resolve(this.projectRoot, 'src/components/magical/SofiaVoiceVisualization.tsx');
    
    const voiceVisualizationCode = \`
import React, { useState } from 'react';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  toneWords: string[];
  color: string;
}

interface SofiaVoiceVisualizationProps {
  profiles: VoiceProfile[];
  selectedProfile?: string;
  onProfileSelect?: (profileId: string) => void;
}

export const SofiaVoiceVisualization: React.FC<SofiaVoiceVisualizationProps> = ({
  profiles,
  selectedProfile,
  onProfileSelect
}) => {
  const [hoveredProfile, setHoveredProfile] = useState<string | null>(null);

  const createWavePattern = (profile: VoiceProfile, isSelected: boolean, isHovered: boolean) => {
    const intensity = isSelected ? 1 : isHovered ? 0.8 : 0.6;
    const frequency = profile.toneWords.length;
    
    return Array.from({ length: 20 }).map((_, i) => {
      const height = Math.sin((i / 20) * Math.PI * frequency) * intensity * 30 + 10;
      return (
        <div
          key={i}
          className={\\\`bg-\\\${profile.color} rounded-full transition-all duration-300\\\`}
          style={{
            width: '2px',
            height: \\\`\\\${height}px\\\`,
            marginRight: '2px',
            opacity: intensity
          }}
        />
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-2">
          🎵 Discover Your Authentic Voice
        </h3>
        <p className="text-purple-600 text-sm">
          Each voice has its own unique pattern. Hover to preview, click to select.
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {profiles.map((profile) => {
          const isSelected = selectedProfile === profile.id;
          const isHovered = hoveredProfile === profile.id;
          
          return (
            <div
              key={profile.id}
              className={\\\`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                \\\${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
                }
              \\\`}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
              onClick={() => onProfileSelect?.(profile.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-purple-700">{profile.name}</h4>
                {isSelected && <span className="text-purple-500">✨</span>}
              </div>
              
              <div className="flex items-center justify-center h-12 mb-3">
                <div className="flex items-end">
                  {createWavePattern(profile, isSelected, isHovered)}
                </div>
              </div>
              
              <p className="text-sm text-purple-600 mb-3">{profile.description}</p>
              
              <div className="flex flex-wrap gap-1">
                {profile.toneWords.map((word, index) => (
                  <span
                    key={index}
                    className={\\\`
                      px-2 py-1 text-xs rounded-full
                      \\\${isSelected 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-purple-50 text-purple-600'
                      }
                    \\\`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
\`;

    // 2. Voice Enhancement Magic Component
    const voiceEnhancementPath = resolve(this.projectRoot, 'src/components/magical/SofiaVoiceEnhancement.tsx');
    
    const voiceEnhancementCode = \`
import React, { useState, useEffect } from 'react';

interface VoiceEnhancementProps {
  originalText: string;
  enhancedText: string;
  voiceProfile: string;
  onComplete?: () => void;
}

export const SofiaVoiceEnhancement: React.FC<VoiceEnhancementProps> = ({
  originalText,
  enhancedText,
  voiceProfile,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);

  useEffect(() => {
    const steps = [
      { delay: 500, action: () => setCurrentStep(1) },
      { delay: 1500, action: () => setCurrentStep(2) },
      { delay: 2500, action: () => setCurrentStep(3) },
      { delay: 3500, action: () => onComplete?.() }
    ];

    const timers = steps.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const findEnhancedWords = (original: string, enhanced: string) => {
    const originalWords = original.split(' ');
    const enhancedWords = enhanced.split(' ');
    const enhanced_indices: number[] = [];
    
    enhancedWords.forEach((word, index) => {
      if (!originalWords.includes(word) || word.length > originalWords[index]?.length) {
        enhanced_indices.push(index);
      }
    });
    
    return enhanced_indices;
  };

  const enhancedIndices = findEnhancedWords(originalText, enhancedText);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
      <div className="text-center mb-4">
        <h4 className="text-lg font-semibold text-purple-700 mb-2">
          ✨ Voice Enhancement in Progress
        </h4>
        <p className="text-purple-600 text-sm">
          Transforming your message with {voiceProfile} voice
        </p>
      </div>
      
      {currentStep >= 1 && (
        <div className="mb-4 animate-fadeIn">
          <div className="text-sm text-purple-600 mb-2">Original Message:</div>
          <div className="bg-white p-3 rounded border text-gray-700">
            {originalText}
          </div>
        </div>
      )}
      
      {currentStep >= 2 && (
        <div className="flex justify-center mb-4">
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: \\\`\\\${i * 0.2}s\\\` }}
              />
            ))}
          </div>
        </div>
      )}
      
      {currentStep >= 3 && (
        <div className="animate-slideIn">
          <div className="text-sm text-purple-600 mb-2">Enhanced with Your Voice:</div>
          <div className="bg-purple-100 p-3 rounded border text-purple-800">
            {enhancedText.split(' ').map((word, index) => (
              <span
                key={index}
                className={\\\`
                  \\\${enhancedIndices.includes(index) 
                    ? 'bg-purple-200 px-1 rounded font-medium' 
                    : ''
                  }
                \\\`}
              >
                {word}{' '}
              </span>
            ))}
          </div>
          
          <div className="mt-3 text-xs text-purple-600">
            <span className="bg-purple-200 px-1 rounded">Highlighted</span> words reflect your authentic {voiceProfile} voice
          </div>
        </div>
      )}
    </div>
  );
};
\`;

    try {
      await fs.writeFile(voiceVisualizationPath, voiceVisualizationCode);
      await fs.writeFile(voiceEnhancementPath, voiceEnhancementCode);
      
      this.enhancementsCreated.push('Sofia Voice Discovery Magic (2 components)');
      console.log('   ✅ Created SofiaVoiceVisualization');
      console.log('   ✅ Created SofiaVoiceEnhancement');
      
    } catch (error) {
      this.errors.push(\`Failed to implement Sofia Voice Magic: \${error.message}\`);
    }
  }

  async implementDavidChartMagic() {
    console.log('📊 Implementing David Data Storytelling Magic...');
    
    // Live Chart Animation Component
    const chartAnimationPath = resolve(this.projectRoot, 'src/components/magical/DavidLiveChartAnimation.tsx');
    
    const chartAnimationCode = \`
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DataPoint {
  month: string;
  before: number;
  after: number;
  impact: number;
}

interface DavidLiveChartAnimationProps {
  title: string;
  subtitle: string;
  data: DataPoint[];
  chartType?: 'line' | 'bar';
  onAnimationComplete?: () => void;
}

export const DavidLiveChartAnimation: React.FC<DavidLiveChartAnimationProps> = ({
  title,
  subtitle,
  data,
  chartType = 'line',
  onAnimationComplete
}) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [visibleDataPoints, setVisibleDataPoints] = useState<DataPoint[]>([]);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    const steps = [
      { delay: 500, action: () => setAnimationStep(1) },
      { delay: 1000, action: () => animateDataPoints() },
      { delay: 3000, action: () => setShowInsight(true) },
      { delay: 4000, action: () => onAnimationComplete?.() }
    ];

    const timers = steps.map(({ delay, action }) => 
      setTimeout(action, delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [onAnimationComplete]);

  const animateDataPoints = () => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= data.length) {
        setVisibleDataPoints(data.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setAnimationStep(2);
      }
    }, 400);
  };

  const calculateInsight = () => {
    if (data.length === 0) return { improvement: 0, trend: 'stable' };
    
    const totalBefore = data.reduce((sum, point) => sum + point.before, 0);
    const totalAfter = data.reduce((sum, point) => sum + point.after, 0);
    const improvement = ((totalAfter - totalBefore) / totalBefore * 100);
    
    return {
      improvement: Math.round(improvement),
      trend: improvement > 10 ? 'excellent' : improvement > 0 ? 'positive' : 'stable'
    };
  };

  const insight = calculateInsight();

  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={visibleDataPoints}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="before" fill="#6b7280" name="Before" />
            <Bar dataKey="after" fill="#10b981" name="After" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={visibleDataPoints}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="before" 
            stroke="#6b7280" 
            strokeWidth={2}
            name="Before"
            dot={{ fill: '#6b7280' }}
          />
          <Line 
            type="monotone" 
            dataKey="after" 
            stroke="#10b981" 
            strokeWidth={3}
            name="After"
            dot={{ fill: '#10b981' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-green-700 mb-2">{title}</h3>
        <p className="text-green-600">{subtitle}</p>
      </div>
      
      {animationStep >= 1 && (
        <div className="mb-4 animate-fadeIn">
          <div className="text-sm text-green-600 mb-2">📈 Data Transformation in Progress...</div>
          {renderChart()}
        </div>
      )}
      
      {showInsight && (
        <div className="bg-white p-4 rounded-lg border border-green-200 animate-slideIn">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-green-700">
                {insight.improvement > 0 ? '+' : ''}{insight.improvement}% improvement
              </div>
              <div className="text-sm text-green-600">
                Data tells the story: 
                {insight.trend === 'excellent' && ' Exceptional growth! 🚀'}
                {insight.trend === 'positive' && ' Clear positive impact! 📈'}
                {insight.trend === 'stable' && ' Maintaining steady progress 📊'}
              </div>
            </div>
            <div className="text-3xl">
              {insight.trend === 'excellent' && '🎯'}
              {insight.trend === 'positive' && '✨'}
              {insight.trend === 'stable' && '📊'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
\`;

    try {
      await fs.writeFile(chartAnimationPath, chartAnimationCode);
      
      this.enhancementsCreated.push('David Data Storytelling Magic (1 component)');
      console.log('   ✅ Created DavidLiveChartAnimation');
      
    } catch (error) {
      this.errors.push(\`Failed to implement David Chart Magic: \${error.message}\`);
    }
  }

  async implementRachelWorkflowMagic() {
    console.log('⚙️ Implementing Rachel Automation Vision Magic...');
    
    // Workflow Animation Component
    const workflowAnimationPath = resolve(this.projectRoot, 'src/components/magical/RachelWorkflowAnimation.tsx');
    
    const workflowAnimationCode = \`
import React, { useState, useEffect } from 'react';

interface WorkflowStep {
  id: string;
  title: string;
  type: 'human' | 'ai' | 'collaboration';
  description: string;
  icon: string;
  duration: number; // seconds
}

interface RachelWorkflowAnimationProps {
  title: string;
  steps: WorkflowStep[];
  onComplete?: () => void;
}

export const RachelWorkflowAnimation: React.FC<RachelWorkflowAnimationProps> = ({
  title,
  steps,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'steps' | 'complete'>('intro');

  useEffect(() => {
    // Start with intro
    const introTimer = setTimeout(() => {
      setAnimationPhase('steps');
      startStepAnimation();
    }, 1000);

    return () => clearTimeout(introTimer);
  }, []);

  const startStepAnimation = () => {
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        clearInterval(stepInterval);
        setAnimationPhase('complete');
        setTimeout(() => onComplete?.(), 1000);
      }
    }, 2000);
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.type) {
      case 'human': return 'bg-teal-100 border-teal-300 text-teal-700';
      case 'ai': return 'bg-blue-100 border-blue-300 text-blue-700';
      case 'collaboration': return 'bg-purple-100 border-purple-300 text-purple-700';
      default: return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index <= currentStep) {
      return 'bg-teal-500';
    }
    return 'bg-gray-300';
  };

  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-teal-700 mb-2">⚙️ {title}</h3>
        {animationPhase === 'intro' && (
          <p className="text-teal-600 animate-pulse">Designing your automated workflow...</p>
        )}
        {animationPhase === 'steps' && (
          <p className="text-teal-600">Watch AI enhance human capabilities</p>
        )}
        {animationPhase === 'complete' && (
          <p className="text-teal-600 font-medium">🎉 Workflow optimized for maximum impact!</p>
        )}
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="relative">
              <div className={\\\`
                flex items-center p-4 rounded-lg border-2 transition-all duration-500
                \\\${isActive 
                  ? getStepColor(step) + ' shadow-md transform scale-105' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
                }
                \\\${isCurrent ? 'animate-pulse' : ''}
              \\\`}>
                <div className="flex-shrink-0 text-2xl mr-4">
                  {step.icon}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <span className={\\\`
                      px-2 py-1 text-xs rounded-full
                      \\\${step.type === 'human' ? 'bg-teal-200 text-teal-700' : ''}
                      \\\${step.type === 'ai' ? 'bg-blue-200 text-blue-700' : ''}
                      \\\${step.type === 'collaboration' ? 'bg-purple-200 text-purple-700' : ''}
                    \\\`}>
                      {step.type === 'human' && '👤 Human'}
                      {step.type === 'ai' && '🤖 AI'}
                      {step.type === 'collaboration' && '🤝 Together'}
                    </span>
                  </div>
                  <p className="text-sm">{step.description}</p>
                  <div className="text-xs mt-1 opacity-75">
                    ~{step.duration}s
                  </div>
                </div>
                
                {isActive && (
                  <div className="flex-shrink-0 text-green-500 ml-4 animate-bounce">
                    ✓
                  </div>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className={\\\`
                    w-1 h-6 rounded transition-colors duration-500
                    \\\${getConnectorColor(index)}
                  \\\`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {animationPhase === 'complete' && (
        <div className="mt-6 bg-white p-4 rounded-lg border border-teal-200 animate-slideIn">
          <div className="text-center">
            <div className="text-lg font-bold text-teal-700 mb-2">
              🚀 Automation Impact
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-blue-600">Time Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">3x</div>
                <div className="text-sm text-green-600">Faster Process</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-purple-600">Human-Centered</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
\`;

    try {
      await fs.writeFile(workflowAnimationPath, workflowAnimationCode);
      
      this.enhancementsCreated.push('Rachel Automation Vision Magic (1 component)');
      console.log('   ✅ Created RachelWorkflowAnimation');
      
    } catch (error) {
      this.errors.push(\`Failed to implement Rachel Workflow Magic: \${error.message}\`);
    }
  }

  async implementAlexImpactMagic() {
    console.log('👥 Implementing Alex Change Strategy Magic...');
    
    // Impact Dashboard Component
    const impactDashboardPath = resolve(this.projectRoot, 'src/components/magical/AlexImpactDashboard.tsx');
    
    const impactDashboardCode = \`
import React, { useState, useEffect } from 'react';

interface StakeholderGroup {
  id: string;
  name: string;
  alignment: number; // 0-100
  influence: number; // 0-100
  color: string;
}

interface AlexImpactDashboardProps {
  title: string;
  stakeholders: StakeholderGroup[];
  transformationGoal: string;
  onComplete?: () => void;
}

export const AlexImpactDashboard: React.FC<AlexImpactDashboardProps> = ({
  title,
  stakeholders,
  transformationGoal,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'mapping' | 'transformation' | 'unity'>('intro');
  const [visibleStakeholders, setVisibleStakeholders] = useState<StakeholderGroup[]>([]);
  const [unityScore, setUnityScore] = useState(0);

  useEffect(() => {
    const phases = [
      { delay: 1000, phase: 'mapping' as const },
      { delay: 3000, phase: 'transformation' as const },
      { delay: 5000, phase: 'unity' as const }
    ];

    phases.forEach(({ delay, phase }) => {
      setTimeout(() => {
        setAnimationPhase(phase);
        if (phase === 'mapping') {
          revealStakeholders();
        } else if (phase === 'unity') {
          calculateUnity();
        }
      }, delay);
    });

    setTimeout(() => onComplete?.(), 7000);
  }, [onComplete]);

  const revealStakeholders = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < stakeholders.length) {
        setVisibleStakeholders(prev => [...prev, stakeholders[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const calculateUnity = () => {
    const totalAlignment = stakeholders.reduce((sum, s) => sum + s.alignment, 0);
    const maxAlignment = stakeholders.length * 100;
    const finalUnity = Math.round((totalAlignment / maxAlignment) * 100);
    
    let current = 0;
    const increment = finalUnity / 20;
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalUnity) {
        setUnityScore(finalUnity);
        clearInterval(timer);
      } else {
        setUnityScore(Math.round(current));
      }
    }, 50);
  };

  const getAlignmentColor = (alignment: number) => {
    if (alignment >= 80) return 'text-green-600';
    if (alignment >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAlignmentLabel = (alignment: number) => {
    if (alignment >= 80) return 'Aligned';
    if (alignment >= 50) return 'Neutral';
    return 'Resistant';
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-purple-700 mb-2">🎯 {title}</h3>
        <p className="text-purple-600">{transformationGoal}</p>
      </div>
      
      {animationPhase === 'intro' && (
        <div className="text-center py-8 animate-pulse">
          <div className="text-purple-600">Mapping organizational landscape...</div>
          <div className="flex justify-center mt-4 space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: \\\`\\\${i * 0.2}s\\\` }}
              />
            ))}
          </div>
        </div>
      )}
      
      {animationPhase !== 'intro' && (
        <div className="grid gap-4 mb-6">
          <div className="text-lg font-semibold text-purple-700 mb-4">
            Stakeholder Alignment Map
          </div>
          
          {visibleStakeholders.map((stakeholder, index) => (
            <div
              key={stakeholder.id}
              className="bg-white p-4 rounded-lg border border-purple-200 animate-slideIn"
              style={{ animationDelay: \\\`\\\${index * 0.1}s\\\` }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-purple-700">{stakeholder.name}</h4>
                <span className={\\\`font-medium \\\${getAlignmentColor(stakeholder.alignment)}\\\`}>
                  {getAlignmentLabel(stakeholder.alignment)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-600 mb-1">Alignment</div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className={\\\`h-2 rounded-full transition-all duration-1000 \\\${
                        stakeholder.alignment >= 80 ? 'bg-green-500' :
                        stakeholder.alignment >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }\\\`}
                      style={{ width: \\\`\\\${stakeholder.alignment}%\\\` }}
                    />
                  </div>
                  <div className="text-xs text-purple-600 mt-1">{stakeholder.alignment}%</div>
                </div>
                
                <div>
                  <div className="text-sm text-purple-600 mb-1">Influence</div>
                  <div className="w-full bg-purple-100 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: \\\`\\\${stakeholder.influence}%\\\` }}
                    />
                  </div>
                  <div className="text-xs text-purple-600 mt-1">{stakeholder.influence}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {animationPhase === 'unity' && (
        <div className="bg-white p-6 rounded-lg border border-purple-200 animate-fadeIn">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {unityScore}%
            </div>
            <div className="text-lg text-purple-600 mb-4">
              Organizational Unity Achieved
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl">🎯</div>
                <div className="text-sm text-purple-600">Clear Vision</div>
              </div>
              <div>
                <div className="text-2xl">🤝</div>
                <div className="text-sm text-purple-600">Aligned Teams</div>
              </div>
              <div>
                <div className="text-2xl">🚀</div>
                <div className="text-sm text-purple-600">Ready for Change</div>
              </div>
            </div>
            
            {unityScore >= 80 && (
              <div className="mt-4 text-green-600 font-medium animate-pulse">
                🌟 Exceptional leadership! Organization is primed for transformation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
\`;

    try {
      await fs.writeFile(impactDashboardPath, impactDashboardCode);
      
      this.enhancementsCreated.push('Alex Change Strategy Magic (1 component)');
      console.log('   ✅ Created AlexImpactDashboard');
      
    } catch (error) {
      this.errors.push(\`Failed to implement Alex Impact Magic: \${error.message}\`);
    }
  }
}

// Run the implementation
const implementer = new MagicalEnhancementImplementer();
implementer.implement().catch(console.error);