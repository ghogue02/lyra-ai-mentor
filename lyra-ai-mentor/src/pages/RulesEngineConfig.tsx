/**
 * RULES ENGINE CONFIGURATION PAGE
 * Admin interface for Greg to configure all lesson generation rules
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RulesEngineConfigurator } from '@/components/admin/RulesEngineConfigurator';
import { RulesEngineConfig } from '@/config/rulesEngine';

const RulesEngineConfig: React.FC = () => {
  const navigate = useNavigate();

  const handleConfigurationComplete = (rules: RulesEngineConfig) => {
    console.log('✅ Rules Engine Configuration Complete!', rules);
    
    // Show success message and options for next steps
    alert('Rules Engine configured successfully! Ready to generate lessons.');
    
    // Navigate back to dashboard or stay for review
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎛️ Lesson Generation Rules Engine
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Configure how AI generates lessons, characters, narratives, and interactions. 
              These settings will govern all future lesson creation and ensure consistency 
              with your vision for the Lyra AI Mentor platform.
            </p>
          </div>
        </div>

        {/* Main Configurator */}
        <RulesEngineConfigurator onComplete={handleConfigurationComplete} />
        
        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            This configuration system will enable 10x faster lesson creation while 
            maintaining quality and consistency across all characters and chapters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesEngineConfig;