import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Lightbulb, Copy, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIService } from '@/services/aiService';

interface AIPromptBuilderProps {
  character: {
    name: string;
    role: string;
    challenge: string;
  };
  onComplete: () => void;
}

const promptTemplates = {
  email: {
    name: 'Professional Email',
    structure: 'Context + Objective + Tone + Key Points + Call to Action',
    example: 'Write a donation request email for our annual fundraiser. Context: Food bank serving 500 families. Objective: Raise $50,000. Tone: Warm and urgent. Key points: Impact stories, matching grant opportunity.'
  },
  grant: {
    name: 'Grant Proposal',
    structure: 'Organization Background + Project Description + Impact Goals + Budget Overview',
    example: 'Create a grant proposal summary for youth mentorship program. Background: 10 years serving at-risk youth. Project: After-school STEM program. Goals: Serve 100 students, improve test scores by 25%.'
  },
  report: {
    name: 'Impact Report',
    structure: 'Executive Summary + Key Metrics + Success Stories + Future Plans',
    example: 'Generate quarterly impact report. Summary: Q3 achievements. Metrics: Served 1,200 clients, 85% satisfaction. Stories: 3 client transformations. Plans: Expand to new neighborhood.'
  },
  story: {
    name: 'Mission Story',
    structure: 'Character + Challenge + Transformation + Impact + Call to Action',
    example: 'Tell story of Maria, single mother who received job training. Challenge: Unemployment after layoff. Transformation: Completed IT certification. Impact: Now earning living wage, mentoring others.'
  },
  social: {
    name: 'Social Media Campaign',
    structure: 'Campaign Goal + Target Audience + Key Messages + Content Types',
    example: 'Create volunteer recruitment campaign. Goal: Recruit 50 new volunteers. Audience: Young professionals. Messages: Flexible commitment, skill-building, community impact.'
  }
};

export default function AIPromptBuilder({ character, onComplete }: AIPromptBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof promptTemplates>('email');
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(true);

  const aiService = AIService.getInstance();
  const template = promptTemplates[selectedTemplate];

  const generatePrompt = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    try {
      const prompt = await aiService.generatePrompt(
        template.name,
        `User needs: ${userInput}\nStructure: ${template.structure}\nCharacter context: ${character.name} is a ${character.role} working on ${character.challenge}`
      );
      setGeneratedPrompt(prompt);
    } catch (error) {
      console.error('Error generating prompt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const executePrompt = async () => {
    if (!generatedPrompt) return;
    
    setIsExecuting(true);
    setAiResponse('');
    
    try {
      await aiService.streamResponse(
        { 
          prompt: generatedPrompt,
          context: `You are helping ${character.name}, a ${character.role}, with their work.`
        },
        (chunk) => {
          setAiResponse(prev => prev + chunk);
        },
        () => {
          onComplete();
        }
      );
    } catch (error) {
      console.error('Error executing prompt:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Lightbulb className="h-5 w-5 mr-2" />
            Master the Art of AI Prompting
          </CardTitle>
          <CardDescription className="text-blue-700">
            Learn how to create effective prompts that get the results you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            As {character.name}, you'll learn to craft prompts that help with {character.challenge.toLowerCase()}.
            Good prompts are specific, contextual, and goal-oriented.
          </p>
        </CardContent>
      </Card>

      {/* Template Selection */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="template">Choose a task type</Label>
          <Select value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as keyof typeof promptTemplates)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(promptTemplates).map(([key, template]) => (
                <SelectItem key={key} value={key}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Template Structure */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Prompt Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium text-gray-700 mb-2">{template.structure}</p>
            <Alert>
              <AlertDescription className="text-xs">
                <strong>Example:</strong> {template.example}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* User Input */}
      <div className="space-y-2">
        <Label htmlFor="user-input">Describe what you need</Label>
        <Textarea
          id="user-input"
          placeholder={`Describe your ${template.name.toLowerCase()} needs...`}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
          className="resize-none"
        />
        <Button 
          onClick={generatePrompt} 
          disabled={!userInput.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate AI Prompt
            </>
          )}
        </Button>
      </div>

      {/* Generated Prompt */}
      <AnimatePresence>
        {generatedPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-900">Your AI Prompt</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyPrompt}
                    className="text-green-700"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm whitespace-pre-wrap">{generatedPrompt}</p>
                </div>
                <Button 
                  onClick={executePrompt}
                  disabled={isExecuting}
                  className="w-full mt-4"
                >
                  {isExecuting ? (
                    <>Generating Response...</>
                  ) : (
                    <>
                      Test This Prompt
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Response */}
      <AnimatePresence>
        {aiResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>AI Response</CardTitle>
                <CardDescription>
                  See how AI interpreted and executed your prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{aiResponse}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      {showTips && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-amber-900 text-base">Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>• Be specific about your goals and constraints</li>
              <li>• Include relevant context about your organization</li>
              <li>• Specify the tone and style you want</li>
              <li>• Break complex tasks into smaller, focused prompts</li>
              <li>• Iterate and refine based on the results</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}