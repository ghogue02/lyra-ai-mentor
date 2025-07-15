#!/usr/bin/env node

/**
 * Simple Magical Enhancement Creation Script
 * Creates the magical components for Phase 2 implementation
 */

import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function createMagicalComponents() {
  const projectRoot = resolve(__dirname, '..');
  const magicalDir = resolve(projectRoot, 'src/components/magical');
  
  console.log('✨ Creating magical enhancement components...');
  
  try {
    // Ensure directory exists
    await fs.mkdir(magicalDir, { recursive: true });
    
    // 1. Maya's Confidence Meter
    const mayaConfidenceCode = `import React from 'react';

interface ConfidenceMeterProps {
  progress: number;
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
};`;

    // 2. Sofia's Voice Visualization
    const sofiaVoiceCode = `import React, { useState } from 'react';

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
              className={\`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                \${isSelected 
                  ? 'border-purple-500 bg-purple-50 shadow-lg' 
                  : 'border-purple-200 bg-white hover:border-purple-300 hover:shadow-md'
                }
              \`}
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
                      className={\`bg-purple-400 rounded transition-all duration-300\`}
                      style={{
                        width: '3px',
                        height: \`\${(isSelected || isHovered ? 1 : 0.6) * (10 + Math.sin(i) * 15)}px\`,
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
};`;

    // 3. Create all component files
    const components = [
      { name: 'MayaConfidenceMeter.tsx', code: mayaConfidenceCode },
      { name: 'SofiaVoiceVisualization.tsx', code: sofiaVoiceCode }
    ];

    for (const component of components) {
      const filePath = resolve(magicalDir, component.name);
      await fs.writeFile(filePath, component.code);
      console.log(`✅ Created ${component.name}`);
    }

    // Create an index file for easy imports
    const indexCode = `// Magical Enhancement Components
export { MayaConfidenceMeter } from './MayaConfidenceMeter';
export { SofiaVoiceVisualization } from './SofiaVoiceVisualization';
`;

    await fs.writeFile(resolve(magicalDir, 'index.ts'), indexCode);
    console.log('✅ Created index.ts');

    console.log('\\n🎉 Magical components created successfully!');
    console.log('📁 Location: src/components/magical/');
    console.log('📋 Next: Integrate into existing interactive components');

  } catch (error) {
    console.error('❌ Error creating magical components:', error);
    throw error;
  }
}

createMagicalComponents().catch(console.error);