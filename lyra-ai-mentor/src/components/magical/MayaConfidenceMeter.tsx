import React from 'react';

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
          style={{ width: `${progress}%` }}
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