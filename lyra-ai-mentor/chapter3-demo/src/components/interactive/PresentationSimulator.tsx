import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Mic, Users, Clock, Star } from 'lucide-react';

interface PresentationSimulatorProps {
  scenario: {
    id: string;
    title: string;
    context: string;
    audience_type: string;
    duration: number;
  };
  onComplete?: (performance: PresentationPerformance) => void;
}

interface PresentationPerformance {
  confidence: number;
  clarity: number;
  engagement: number;
  timing: number;
  overall: number;
}

export const PresentationSimulator: React.FC<PresentationSimulatorProps> = ({
  scenario,
  onComplete
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'prep' | 'presenting' | 'qa' | 'complete'>('prep');
  const [performance, setPerformance] = useState<PresentationPerformance>({
    confidence: 0,
    clarity: 0,
    engagement: 0,
    timing: 0,
    overall: 0
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startPresentation = () => {
    setIsActive(true);
    setCurrentPhase('presenting');
    setTimeElapsed(0);
  };

  const pausePresentation = () => {
    setIsActive(false);
  };

  const endPresentation = () => {
    setIsActive(false);
    setCurrentPhase('complete');
    
    // Calculate performance metrics based on timing and scenario
    const timingScore = Math.max(0, 100 - Math.abs(timeElapsed - scenario.duration * 60) / 6);
    const newPerformance: PresentationPerformance = {
      confidence: Math.floor(Math.random() * 20) + 75, // Simulated based on practice
      clarity: Math.floor(Math.random() * 15) + 80,
      engagement: Math.floor(Math.random() * 25) + 70,
      timing: Math.round(timingScore),
      overall: 0
    };
    
    newPerformance.overall = Math.round(
      (newPerformance.confidence + newPerformance.clarity + newPerformance.engagement + newPerformance.timing) / 4
    );
    
    setPerformance(newPerformance);
    onComplete?.(newPerformance);
  };

  const resetSimulation = () => {
    setIsActive(false);
    setTimeElapsed(0);
    setCurrentPhase('prep');
    setPerformance({
      confidence: 0,
      clarity: 0,
      engagement: 0,
      timing: 0,
      overall: 0
    });
  };

  const getPhaseTitle = () => {
    switch (currentPhase) {
      case 'prep': return 'Preparation Phase';
      case 'presenting': return 'Presenting Now';
      case 'qa': return 'Q&A Session';
      case 'complete': return 'Presentation Complete';
      default: return 'Preparation';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const sofiaFeedback = () => {
    const overall = performance.overall;
    if (overall >= 90) {
      return "Outstanding! You delivered that presentation with real confidence and skill. I can see all your practice paying off!";
    } else if (overall >= 80) {
      return "Great job! You're really developing your speaking skills. Focus on maintaining that energy throughout your entire presentation.";
    } else if (overall >= 70) {
      return "Good effort! You're on the right track. Keep practicing and remember to breathe and connect with your audience.";
    } else {
      return "You're learning and growing! Every presentation is practice. Focus on one improvement area at a time - you'll get there!";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">Presentation Simulator</h3>
          <p className="text-gray-600">{scenario.title}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Target Duration</p>
          <p className="text-lg font-semibold text-blue-600">{scenario.duration} min</p>
        </div>
      </div>

      {/* Scenario Details */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 mb-2">Scenario</h4>
        <p className="text-blue-700 mb-2">{scenario.context}</p>
        <div className="flex items-center space-x-4 text-sm text-blue-600">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{scenario.audience_type}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{scenario.duration} minutes</span>
          </div>
        </div>
      </div>

      {/* Current Phase */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Mic className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{getPhaseTitle()}</h4>
              <p className="text-gray-600 text-sm">Time: {formatTime(timeElapsed)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {!isActive && currentPhase === 'prep' && (
              <button
                onClick={startPresentation}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start</span>
              </button>
            )}
            
            {isActive && (
              <>
                <button
                  onClick={pausePresentation}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                >
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={endPresentation}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  End
                </button>
              </>
            )}
            
            {currentPhase === 'complete' && (
              <button
                onClick={resetSimulation}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Performance Results */}
      {currentPhase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4">Performance Report</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.confidence)}`}>
                  {performance.confidence}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Clarity</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.clarity)}`}>
                  {performance.clarity}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Engagement</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.engagement)}`}>
                  {performance.engagement}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Timing</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(performance.timing)}`}>
                  {performance.timing}%
                </p>
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">Overall Grade</p>
              <div className="flex items-center justify-center space-x-2">
                <p className={`text-4xl font-bold ${getPerformanceColor(performance.overall)}`}>
                  {getPerformanceGrade(performance.overall)}
                </p>
                <p className={`text-2xl font-semibold ${getPerformanceColor(performance.overall)}`}>
                  ({performance.overall}%)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Sofia's Feedback</h5>
                  <p className="text-gray-700 italic">"{sofiaFeedback()}"</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Practice Tips */}
      {currentPhase === 'prep' && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Pre-Presentation Tips</h4>
          <ul className="space-y-1 text-yellow-700 text-sm">
            <li>• Take 3 deep breaths to center yourself</li>
            <li>• Review your key points one more time</li>
            <li>• Visualize a successful presentation</li>
            <li>• Remember: your audience wants you to succeed</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PresentationSimulator;