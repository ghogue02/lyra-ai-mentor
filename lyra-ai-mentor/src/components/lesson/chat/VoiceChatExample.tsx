import React, { useState, useEffect } from 'react';
import { VoiceChatInterface } from '@/components/VoiceChatInterface';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Mic, Settings } from 'lucide-react';

/**
 * Example implementation of the Voice Chat features
 * This component demonstrates how to integrate the voice-enabled chat interface
 */
export const VoiceChatExample: React.FC = () => {
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showSetup, setShowSetup] = useState(true);

  // Check for saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setShowSetup(false);
    }
  }, []);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const key = formData.get('apiKey') as string;
    if (key) {
      setApiKey(key);
      localStorage.setItem('openai_api_key', key);
      setShowSetup(false);
    }
  };

  // Example lesson context
  const lessonContext = {
    chapterTitle: "AI Fundamentals",
    lessonTitle: "Understanding Voice Interfaces",
    content: "This lesson covers voice-enabled AI interactions..."
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Setup Instructions */}
      {showSetup && (
        <Card className="max-w-2xl mx-auto mb-8 p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold">Voice Chat Setup</h2>
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                To use voice features, you'll need an OpenAI API key with access to:
                <ul className="list-disc ml-5 mt-2">
                  <li>Whisper API (speech-to-text)</li>
                  <li>TTS API (text-to-speech)</li>
                </ul>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                  OpenAI API Key
                </label>
                <input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="sk-..."
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Save API Key and Continue
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Voice-Enabled Chat Demo</h1>
          
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4" />
                Voice Features Available:
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Voice input with real-time transcription</li>
                <li>✓ Text-to-speech for AI responses</li>
                <li>✓ Multiple voice personalities</li>
                <li>✓ Adjustable speech speed and volume</li>
                <li>✓ Mobile-optimized touch controls</li>
                <li>✓ Accessibility-focused transcript view</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-2">
                <Settings className="w-4 h-4" />
                How to Use:
              </h3>
              <ol className="space-y-2 text-sm list-decimal ml-5">
                <li>Click the chat button to open Lyra</li>
                <li>Use the microphone button to switch to voice input</li>
                <li>Hold the mic button to record (mobile) or click to toggle (desktop)</li>
                <li>Access voice settings from the settings icon in the chat header</li>
                <li>Your preferences are automatically saved</li>
              </ol>
            </div>

            {!showSetup && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => setIsChatExpanded(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-500"
                >
                  Open Voice Chat
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Usage Examples */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Example Voice Commands</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Learning & Understanding</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>"Explain this concept in simple terms"</li>
                <li>"Give me a real-world example"</li>
                <li>"What are the key takeaways?"</li>
                <li>"How does this apply to nonprofits?"</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Practical Application</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>"Help me write an email about this"</li>
                <li>"Create a summary for my team"</li>
                <li>"What tools can I use for this?"</li>
                <li>"Show me best practices"</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {/* Voice Chat Interface */}
      {!showSetup && (
        <VoiceChatInterface
          isExpanded={isChatExpanded}
          onToggleExpanded={() => setIsChatExpanded(!isChatExpanded)}
          lessonContext={lessonContext}
          apiKey={apiKey}
        />
      )}
    </div>
  );
};

// Integration Guide Comment
/**
 * To integrate voice chat into your application:
 * 
 * 1. Import the VoiceChatInterface component:
 *    import { VoiceChatInterface } from '@/components/VoiceChatInterface';
 * 
 * 2. Add it to your component with an API key:
 *    <VoiceChatInterface
 *      isExpanded={isChatExpanded}
 *      onToggleExpanded={() => setIsChatExpanded(!isChatExpanded)}
 *      lessonContext={lessonContext} // optional
 *      apiKey={yourOpenAIKey}
 *    />
 * 
 * 3. The component handles all voice functionality internally:
 *    - Microphone permissions
 *    - Recording and transcription
 *    - Text-to-speech playback
 *    - Settings persistence
 * 
 * 4. Customize the experience:
 *    - Modify VoiceSettings component for different options
 *    - Update voice personalities in VOICE_OPTIONS
 *    - Adjust visual themes in the components
 *    - Add custom voice commands and responses
 */