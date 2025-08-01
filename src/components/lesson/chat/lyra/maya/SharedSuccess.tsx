import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, User, Copy, Check, Trophy, Target, Users, Heart, Zap } from 'lucide-react';

interface PACEFramework {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
}

interface Result {
  challenge: string;
  pace: PACEFramework;
  prompt: string;
  generatedContent?: string;
}

interface SharedSuccessProps {
  mayaResult: Result;
  userResult: Result;
  onContinue: () => void;
}

const SharedSuccess: React.FC<SharedSuccessProps> = ({
  mayaResult,
  userResult,
  onContinue
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState<'maya' | 'user' | null>(null);

  const copyToClipboard = async (text: string, type: 'maya' | 'user') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPrompt(type);
      setTimeout(() => setCopiedPrompt(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const paceIcons = {
    Purpose: Target,
    Audience: Users,
    Connection: Heart,
    Engagement: Zap
  };

  const paceColors = {
    Purpose: 'text-blue-600 bg-blue-50',
    Audience: 'text-green-600 bg-green-50',
    Connection: 'text-pink-600 bg-pink-50',
    Engagement: 'text-purple-600 bg-purple-50'
  };

  const renderPACEComparison = () => {
    return (
      <div className="space-y-4">
        {Object.entries(paceIcons).map(([key, Icon]) => (
          <Card key={key} className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className={`w-5 h-5 ${paceColors[key as keyof typeof paceColors].split(' ')[0]}`} />
                {key}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Maya's Approach
                  </Badge>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                    {mayaResult.pace[key as keyof PACEFramework]}
                  </p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Your Approach
                  </Badge>
                  <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                    {userResult.pace[key as keyof PACEFramework]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderPromptCard = (result: Result, type: 'maya' | 'user', title: string, badgeColor: string) => {
    const isCopied = copiedPrompt === type;
    
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {type === 'maya' ? (
                <Sparkles className="w-5 h-5 text-purple-600" />
              ) : (
                <User className="w-5 h-5 text-blue-600" />
              )}
              {title}
            </div>
            <Badge className={badgeColor}>
              {type === 'maya' ? 'Maya' : 'You'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Challenge:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{result.challenge}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-1">Generated Prompt:</h4>
              <div className="bg-gray-50 p-3 rounded-lg relative">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap font-mono">
                  {result.prompt}
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  onClick={() => copyToClipboard(result.prompt, type)}
                >
                  {isCopied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            {result.generatedContent && (
              <div>
                <h4 className="font-semibold text-sm text-gray-700 mb-1">Sample Output:</h4>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  {result.generatedContent}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Success! 🎉</h2>
        <p className="text-gray-600 text-lg">
          You and Maya have both created powerful prompts using the PACE framework!
        </p>
      </motion.div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">PACE Comparison</TabsTrigger>
          <TabsTrigger value="prompts">Your Prompts</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">PACE Framework Comparison</CardTitle>
              <p className="text-gray-600">
                See how you and Maya approached each element of the PACE framework
              </p>
            </CardHeader>
            <CardContent>
              {renderPACEComparison()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPromptCard(
              mayaResult,
              'maya',
              'Maya\'s Prompt',
              'bg-purple-100 text-purple-800'
            )}
            {renderPromptCard(
              userResult,
              'user',
              'Your Prompt',
              'bg-blue-100 text-blue-800'
            )}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">What You've Accomplished</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Identified your unique challenge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Mastered the PACE framework</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Created a personalized prompt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Learned alongside Maya</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Key Insights:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Purpose drives clarity</li>
                    <li>• Audience shapes approach</li>
                    <li>• Connection builds trust</li>
                    <li>• Engagement creates action</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-green-800 mb-2">Ready for Your Personal Toolkit?</h3>
              <p className="text-green-700">
                Now that you've mastered the PACE framework, let's create your personalized prompt engineering toolkit!
              </p>
            </div>
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Create My Toolkit
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SharedSuccess;