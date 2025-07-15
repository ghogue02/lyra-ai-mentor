import React, { useState } from 'react';
import { Heart, Sparkles, Star, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import '@/styles/minimal-ui.css';

const VisualOptionsShowcase: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string>('minimal');
  
  const visualOptions = [
    {
      id: 'minimal',
      name: 'Current Minimal',
      description: 'Clean, focused, no distractions',
      features: ['No animations', 'Solid colors', 'Clear typography', 'Maximum focus']
    },
    {
      id: 'subtle-magic',
      name: 'Subtle Magic',
      description: 'Minimal with gentle flourishes',
      features: ['Soft glow effects', 'Micro-animations', 'Warm accents', 'Emotional hints']
    },
    {
      id: 'dreamworks-lite',
      name: 'DreamWorks Lite',
      description: 'Storytelling with visual warmth',
      features: ['Character expressions', 'Ambient particles', 'Color emotions', 'Journey visualization']
    },
    {
      id: 'full-narrative',
      name: 'Full Narrative',
      description: 'Rich visual storytelling',
      features: ['Scene transitions', 'Character animations', 'Environmental effects', 'Cinematic moments']
    }
  ];

  const DemoPanel = ({ option }: { option: string }) => {
    const baseClasses = "p-8 rounded-xl transition-all duration-500";
    
    switch(option) {
      case 'minimal':
        return (
          <div className={`${baseClasses} bg-white border`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Lyra</h3>
                <p className="text-sm text-gray-600">AI Guide</p>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <p className="text-gray-800">
                I'm Lyra, and I want to tell you about Maya Rodriguez...
              </p>
            </div>
          </div>
        );
        
      case 'subtle-magic':
        return (
          <div className={`${baseClasses} bg-white border relative overflow-hidden`}>
            {/* Subtle glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 animate-pulse" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    Lyra
                  </h3>
                  <p className="text-sm text-gray-600">AI Guide ✨</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400 shadow-sm">
                <p className="text-gray-800">
                  I'm Lyra, and I want to tell you about Maya Rodriguez...
                  <Sparkles className="inline-block w-4 h-4 ml-1 text-purple-500 animate-pulse" />
                </p>
              </div>
            </div>
          </div>
        );
        
      case 'dreamworks-lite':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-50 via-white to-pink-50 border relative overflow-hidden`}>
            {/* Ambient particles */}
            <div className="absolute top-10 left-10 w-2 h-2 bg-purple-300 rounded-full opacity-50 animate-ping" />
            <div className="absolute bottom-10 right-10 w-1 h-1 bg-pink-300 rounded-full opacity-50 animate-ping" style={{ animationDelay: '1s' }} />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform">
                  <Heart className="w-6 h-6 text-white drop-shadow" />
                  {/* Emotional indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                    Lyra
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    Your Story Guide 
                    <Star className="w-3 h-3 text-yellow-500 animate-pulse" />
                  </p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-5 border-l-4 border-purple-400 shadow-lg">
                <p className="text-gray-800 text-lg leading-relaxed">
                  I'm Lyra, and I want to tell you about Maya Rodriguez...
                  <span className="text-purple-600 ml-2">Her story might just change yours.</span>
                </p>
              </div>
              
              {/* Journey progress hint */}
              <div className="mt-4 flex items-center gap-2 text-xs text-purple-600">
                <div className="w-8 h-1 bg-purple-200 rounded-full">
                  <div className="w-2 h-1 bg-purple-600 rounded-full animate-pulse" />
                </div>
                <span>Beginning of an amazing journey</span>
              </div>
            </div>
          </div>
        );
        
      case 'full-narrative':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 border-2 border-purple-200 relative overflow-hidden`}>
            {/* Cinematic bars */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-purple-400 flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-all">
                    <Heart className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                  {/* Floating elements */}
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-bounce" />
                  <Zap className="absolute -bottom-1 -left-1 w-3 h-3 text-blue-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 bg-clip-text text-transparent animate-gradient">
                    Lyra
                  </h3>
                  <p className="text-sm text-gray-700 font-medium">
                    Your Transformation Narrator ✨
                  </p>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-2xl border-2 border-purple-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-2xl" />
                <p className="text-gray-800 text-lg leading-relaxed font-medium relative z-10">
                  I'm Lyra, and I want to tell you about Maya Rodriguez...
                  <span className="block text-purple-600 mt-2 text-base italic">
                    "Her transformation began with a single email that took 32 minutes..."
                  </span>
                </p>
              </div>
              
              {/* Scene indicator */}
              <div className="mt-6 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                  <span className="font-medium">Scene 1: The Beginning</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-1 h-1 rounded-full ${i === 1 ? 'bg-purple-600' : 'bg-purple-200'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Visual Options for Lyra's Storytelling</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore different visual approaches for the narrative experience. 
            Each option maintains functionality while offering different levels of visual richness.
          </p>
        </div>

        {/* Option Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {visualOptions.map(option => (
            <Card 
              key={option.id}
              className={`p-4 cursor-pointer transition-all ${
                selectedOption === option.id 
                  ? 'border-purple-600 shadow-lg scale-105' 
                  : 'hover:border-purple-300 hover:shadow-md'
              }`}
              onClick={() => setSelectedOption(option.id)}
            >
              <h3 className="font-semibold mb-2">{option.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{option.description}</p>
              <ul className="text-xs space-y-1">
                {option.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Demo Display */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Preview: {visualOptions.find(o => o.id === selectedOption)?.name}</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </div>
          </div>
          
          <DemoPanel option={selectedOption} />
        </div>

        {/* Implementation Notes */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Implementation Notes
          </h3>
          <div className="space-y-2 text-sm text-gray-700">
            <p>• <strong>Minimal</strong>: Current implementation, maximum focus on content</p>
            <p>• <strong>Subtle Magic</strong>: Add CSS classes for glows and micro-animations</p>
            <p>• <strong>DreamWorks Lite</strong>: Include emotion indicators and journey progress</p>
            <p>• <strong>Full Narrative</strong>: Requires additional animation libraries and scene management</p>
          </div>
        </div>

        {/* Style Variables */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="font-semibold mb-3">CSS Variables to Add</h3>
          <pre className="text-xs bg-white p-4 rounded overflow-x-auto">
{`/* For enhanced visual options */
:root {
  --glow-purple: 0 0 20px rgba(147, 51, 234, 0.3);
  --glow-pink: 0 0 20px rgba(236, 72, 153, 0.3);
  --gradient-warm: linear-gradient(135deg, #9333EA, #EC4899);
  --animation-float: float 3s ease-in-out infinite;
  --animation-gradient: gradient 3s ease infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}`}</pre>
        </div>
      </div>
    </div>
  );
};

export default VisualOptionsShowcase;