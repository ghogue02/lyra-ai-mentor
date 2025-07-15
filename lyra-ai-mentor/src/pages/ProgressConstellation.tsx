import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Sparkles, User, CheckCircle, Circle, Lock } from 'lucide-react';

interface CharacterProgress {
  id: string;
  name: string;
  character: string;
  color: string;
  lessonsCompleted: number;
  totalLessons: number;
  skills: string[];
  x: number;
  y: number;
}

const ProgressConstellation = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [showConnections, setShowConnections] = useState(true);
  const [animateStars, setAnimateStars] = useState(false);

  const characters: CharacterProgress[] = [
    {
      id: 'maya',
      name: 'Maya Rodriguez',
      character: 'Email Master',
      story: 'From 15-hour email weeks to 2-hour triumphs',
      color: '#9333EA',
      lessonsCompleted: 3,
      totalLessons: 4,
      skills: ['Email Confidence', 'Professional Writing', 'Grant Communication'],
      x: 20,
      y: 30
    },
    {
      id: 'sofia',
      name: 'Sofia Martinez',
      character: 'Voice Finder',
      story: 'Found her voice and $2.5M in funding',
      color: '#7C3AED',
      lessonsCompleted: 2,
      totalLessons: 4,
      skills: ['Authentic Voice', 'Storytelling', 'Audience Engagement'],
      x: 50,
      y: 20
    },
    {
      id: 'david',
      name: 'David Chen',
      character: 'Data Storyteller',
      story: 'Turned invisible data into 156% more engagement',
      color: '#10B981',
      lessonsCompleted: 4,
      totalLessons: 4,
      skills: ['Data Visualization', 'Impact Metrics', 'Presentation Skills'],
      x: 80,
      y: 35
    },
    {
      id: 'rachel',
      name: 'Rachel Thompson',
      character: 'Automation Architect',
      story: 'Automated 60% of manual tasks, freeing her team',
      color: '#14B8A6',
      lessonsCompleted: 1,
      totalLessons: 4,
      skills: ['Process Optimization', 'Workflow Design', 'Team Alignment'],
      x: 65,
      y: 65
    },
    {
      id: 'alex',
      name: 'Alex Rivera',
      character: 'Change Leader',
      story: 'Transformed resistance into organizational champions',
      color: '#8B5CF6',
      lessonsCompleted: 0,
      totalLessons: 4,
      skills: ['Strategic Leadership', 'Organizational Change', 'Innovation'],
      x: 35,
      y: 70
    }
  ];

  // Calculate overall progress
  const totalProgress = characters.reduce((sum, char) => sum + char.lessonsCompleted, 0);
  const totalPossible = characters.reduce((sum, char) => sum + char.totalLessons, 0);
  const overallPercentage = Math.round((totalProgress / totalPossible) * 100);

  useEffect(() => {
    // Trigger star animation on mount
    setTimeout(() => setAnimateStars(true), 500);
  }, []);

  const StarNode = ({ character, isSelected }: { character: CharacterProgress; isSelected: boolean }) => {
    const progress = (character.lessonsCompleted / character.totalLessons) * 100;
    const isComplete = progress === 100;
    const isLocked = character.lessonsCompleted === 0;

    return (
      <div
        className={`absolute cursor-pointer transition-all duration-500 hover:scale-110 ${
          animateStars ? 'animate-star-appear' : 'opacity-0 scale-0'
        } ${isSelected ? 'scale-125 brightness-125' : 'scale-100 brightness-100'}`}
        style={{ 
          left: `${character.x}%`, 
          top: `${character.y}%`,
          animationDelay: `${characters.indexOf(character) * 100}ms`
        }}
        onClick={() => setSelectedCharacter(character.id)}
      >
        <div className="relative">
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{ 
              backgroundColor: character.color,
              width: '60px',
              height: '60px',
              left: '-10px',
              top: '-10px'
            }}
          />
          
          {/* Star icon */}
          <div 
            className="relative w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: character.color }}
          >
            {isLocked ? (
              <Lock className="w-5 h-5 text-white" />
            ) : isComplete ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <Star className="w-5 h-5 text-white" fill="white" />
            )}
          </div>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-10 h-10 -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="18"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 18}`}
              strokeDashoffset={`${2 * Math.PI * 18 * (1 - progress / 100)}`}
              className="transition-all duration-500"
            />
          </svg>

          {/* Character name */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            <p className="text-xs font-medium text-gray-700">{character.name.split(' ')[0]}</p>
          </div>
        </div>
      </div>
    );
  };

  const ConnectionLines = () => {
    if (!showConnections) return null;

    const connections = [
      { from: 'maya', to: 'sofia' },
      { from: 'sofia', to: 'david' },
      { from: 'david', to: 'rachel' },
      { from: 'rachel', to: 'alex' },
      { from: 'alex', to: 'maya' },
      { from: 'maya', to: 'david' },
      { from: 'sofia', to: 'rachel' }
    ];

    return (
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn, idx) => {
          const fromChar = characters.find(c => c.id === conn.from);
          const toChar = characters.find(c => c.id === conn.to);
          if (!fromChar || !toChar) return null;

          return (
            <line
              key={idx}
              x1={`${fromChar.x}%`}
              y1={`${fromChar.y}%`}
              x2={`${toChar.x}%`}
              y2={`${toChar.y}%`}
              stroke="url(#gradient)"
              strokeWidth="1"
              strokeDasharray="5,5"
              className="animate-draw-line opacity-30"
              style={{ animationDelay: `${idx * 100}ms` }}
            />
          );
        })}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="50%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950">
      {/* Add custom CSS animations */}
      <style jsx>{`
        @keyframes star-appear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2) rotate(90deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes draw-line {
          from {
            stroke-dashoffset: 100;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes progress-fill {
          from {
            width: 0;
          }
          to {
            width: var(--progress-width);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-star-appear {
          animation: star-appear 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-draw-line {
          stroke-dasharray: 100;
          animation: draw-line 1.5s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .animate-progress-fill {
          animation: progress-fill 1s ease-out 0.5s forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>

      {/* Starfield background */}
      <div className="fixed inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's'
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="animate-slide-down">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-yellow-400" />
              Progress Constellation
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </h1>
            <p className="text-lg text-purple-200">
              Join 5 nonprofit heroes on their AI transformation journeys
            </p>
            <p className="text-sm text-purple-300 mt-2">
              ✨ Every star represents a real story of impact and transformation
            </p>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="animate-scale-in" style={{ animationDelay: '200ms' }}>
          <Card className="mb-8 p-6 bg-white/10 backdrop-blur-lg border-purple-300/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Overall Journey Progress</h2>
              <span className="text-3xl font-bold text-yellow-400">{overallPercentage}%</span>
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-progress-fill"
                style={{ '--progress-width': `${overallPercentage}%` } as React.CSSProperties}
              />
            </div>
            <div className="mt-4 flex justify-between text-sm text-purple-200">
              <span>{totalProgress} lessons completed</span>
              <span>{totalPossible - totalProgress} lessons remaining</span>
            </div>
          </Card>
        </div>

        {/* Constellation Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Constellation View */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-purple-300/20 h-[500px] relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Character Journey Map</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConnections(!showConnections)}
                  className="text-purple-200 hover:text-white"
                >
                  {showConnections ? 'Hide' : 'Show'} Connections
                </Button>
              </div>
              
              <div className="relative h-full">
                <ConnectionLines />
                {characters.map(char => (
                  <StarNode 
                    key={char.id} 
                    character={char} 
                    isSelected={selectedCharacter === char.id}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Character Details */}
          <div>
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-purple-300/20 h-[500px]">
              <h3 className="text-lg font-semibold text-white mb-4">Character Details</h3>
              
              <div className="relative">
                {selectedCharacter ? (
                  <div
                    key={selectedCharacter}
                    className="animate-slide-in-right"
                  >
                    {(() => {
                      const char = characters.find(c => c.id === selectedCharacter)!;
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: char.color }}
                            >
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{char.name}</h4>
                              <p className="text-sm text-purple-200">{char.character}</p>
                            </div>
                          </div>

                          <div className="bg-purple-900/20 p-3 rounded-lg">
                            <p className="text-xs text-purple-300 italic">"{char.story}"</p>
                          </div>

                          <div>
                            <p className="text-sm text-purple-200 mb-2">Progress</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-purple-900/30 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-500"
                                  style={{ width: `${(char.lessonsCompleted / char.totalLessons) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-white">
                                {char.lessonsCompleted}/{char.totalLessons}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-purple-200 mb-2">Skills Unlocked</p>
                            <div className="space-y-2">
                              {char.skills.map((skill, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  {idx < char.lessonsCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-purple-400" />
                                  )}
                                  <span className={`text-sm ${idx < char.lessonsCompleted ? 'text-white' : 'text-purple-300'}`}>
                                    {skill}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Button 
                            className="w-full mt-4"
                            style={{ 
                              backgroundColor: char.color,
                              color: 'white'
                            }}
                            disabled={char.lessonsCompleted === 0 && char.id !== 'maya'}
                          >
                            {char.lessonsCompleted === 0 && char.id !== 'maya' ? 'Locked' : 'Continue Journey'}
                          </Button>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-center text-purple-200 mt-20">
                    <Star className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Click on a character to view their progress</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Achievement Unlocks */}
        <div className="animate-slide-up" style={{ animationDelay: '800ms' }}>
          <Card className="mt-6 p-6 bg-white/10 backdrop-blur-lg border-purple-300/20">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-purple-800/20 rounded-lg">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" fill="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email Confidence Master</p>
                  <p className="text-xs text-purple-200">Maya's Journey</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-800/20 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Data Storyteller</p>
                  <p className="text-xs text-green-200">David's Journey Complete!</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-800/20 rounded-lg opacity-50">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-300">Change Leader</p>
                  <p className="text-xs text-gray-400">Complete Alex's Journey</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressConstellation;