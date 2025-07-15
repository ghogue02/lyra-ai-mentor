import React, { useState } from 'react';

interface VoiceProfile {
  id: string;
  name: string;
  description: string;
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
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
                }
              `}
              onMouseEnter={() => setHoveredProfile(profile.id)}
              onMouseLeave={() => setHoveredProfile(null)}
              onClick={() => onProfileSelect?.(profile.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-purple-700">{profile.name}</h4>
                {isSelected && <span className="text-purple-500">✨</span>}
              </div>
              
              <div className="flex items-center justify-center h-12 mb-3">
                <div className="flex items-end space-x-1">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-purple-400 rounded transition-all duration-300`}
                      style={{
                        width: '3px',
                        height: `${(isSelected || isHovered ? 1 : 0.6) * (10 + Math.sin(i) * 15)}px`,
                        opacity: isSelected || isHovered ? 1 : 0.6
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-sm text-purple-600">{profile.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};