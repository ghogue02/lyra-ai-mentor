import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceInput } from '@/components/ui/voice-input';
import { MessageSquare, Sparkles } from 'lucide-react';

const VoiceInputExample: React.FC = () => {
  const [collectedText, setCollectedText] = useState('');
  const [currentInterim, setCurrentInterim] = useState('');

  const handleTranscript = (transcript: string) => {
    setCollectedText(prev => prev + ' ' + transcript);
  };

  const handleInterimTranscript = (transcript: string) => {
    setCurrentInterim(transcript);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Voice Input Component Example</CardTitle>
              <CardDescription>
                Reusable voice input with Web Speech API integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Simple Voice Input */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Basic Voice Input</h3>
            <VoiceInput 
              onTranscript={handleTranscript}
              placeholder="Click the button and start speaking..."
            />
          </div>

          {/* Voice Input with Custom Styling */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Custom Styled Voice Input</h3>
            <VoiceInput 
              onTranscript={handleTranscript}
              onInterimTranscript={handleInterimTranscript}
              buttonClassName="px-6 py-3"
              visualizerClassName="h-20 bg-gradient-to-r from-purple-50 to-cyan-50"
              placeholder="Your voice message here..."
            />
          </div>

          {/* Voice Input without Transcript Display */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Minimal Voice Input (No Transcript)</h3>
            <VoiceInput 
              onTranscript={handleTranscript}
              showTranscript={false}
              buttonClassName="w-full"
            />
          </div>

          {/* Collected Text Display */}
          {collectedText && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Collected Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-800">{collectedText}</p>
                {currentInterim && (
                  <p className="text-purple-600 italic mt-2">
                    Currently speaking: {currentInterim}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Usage Instructions */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">How to Use VoiceInput Component</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
{`import { VoiceInput } from '@/components/ui/voice-input';

// Basic usage
<VoiceInput 
  onTranscript={(text) => console.log('Final:', text)}
/>

// With all options
<VoiceInput 
  onTranscript={(text) => handleFinalText(text)}
  onInterimTranscript={(text) => handleInterimText(text)}
  placeholder="Custom placeholder..."
  className="custom-wrapper-class"
  buttonClassName="custom-button-class"
  visualizerClassName="custom-visualizer-class"
  showTranscript={true}
  continuous={true}
  language="en-US"
/>`}</pre>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceInputExample;