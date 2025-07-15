import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic, VolumeX, Download, Users, Target, MessageSquare } from 'lucide-react';

interface VoiceAnalysis {
  tone: string;
  personality: string;
  strengths: string[];
  recommendations: string[];
  audience: string;
  confidence: number;
}

const VoiceProfileAnalyzer: React.FC = () => {
  const [voiceSample, setVoiceSample] = useState('');
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const samplePrompts = [
    "Write about a challenge you've overcome recently...",
    "Describe your organization's mission in your own words...",
    "Tell a story about why your work matters...",
    "Explain a complex concept to a 12-year-old..."
  ];

  const analyzeVoice = async () => {
    if (!voiceSample.trim()) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);
    
    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      
      // Generate analysis based on sample
      const toneAnalysis = analyzeTone(voiceSample);
      const personalityAnalysis = analyzePersonality(voiceSample);
      
      setAnalysis({
        tone: toneAnalysis.tone,
        personality: personalityAnalysis.type,
        strengths: toneAnalysis.strengths,
        recommendations: personalityAnalysis.recommendations,
        audience: toneAnalysis.audience,
        confidence: Math.floor(Math.random() * 15) + 85
      });
      
      setIsAnalyzing(false);
    }, 2500);
  };

  const analyzeTone = (text: string) => {
    const words = text.toLowerCase();
    
    if (words.includes('data') || words.includes('results') || words.includes('analysis')) {
      return {
        tone: 'Analytical & Data-Driven',
        strengths: ['Clear reasoning', 'Evidence-based', 'Logical flow'],
        audience: 'Professional & Technical'
      };
    } else if (words.includes('story') || words.includes('feel') || words.includes('heart')) {
      return {
        tone: 'Warm & Storytelling',
        strengths: ['Emotional connection', 'Narrative flow', 'Relatable examples'],
        audience: 'General & Emotional'
      };
    } else if (words.includes('action') || words.includes('now') || words.includes('urgent')) {
      return {
        tone: 'Direct & Action-Oriented',
        strengths: ['Clear calls-to-action', 'Sense of urgency', 'Motivational'],
        audience: 'Decision-Makers'
      };
    } else {
      return {
        tone: 'Balanced & Professional',
        strengths: ['Well-rounded approach', 'Professional tone', 'Accessible language'],
        audience: 'Broad Professional'
      };
    }
  };

  const analyzePersonality = (text: string) => {
    const length = text.length;
    const sentences = text.split('.').length;
    const avgSentenceLength = length / sentences;
    
    if (avgSentenceLength > 20) {
      return {
        type: 'Thoughtful Elaborator',
        recommendations: [
          'Consider breaking long sentences into shorter ones',
          'Add more bullet points for easier reading',
          'Use subheadings to organize complex ideas'
        ]
      };
    } else if (avgSentenceLength < 10) {
      return {
        type: 'Concise Communicator',
        recommendations: [
          'Add more descriptive details where helpful',
          'Include examples to illustrate points',
          'Consider expanding on key concepts'
        ]
      };
    } else {
      return {
        type: 'Balanced Communicator',
        recommendations: [
          'Maintain your natural balance',
          'Consider your audience when adjusting detail level',
          'Use your flexibility as a strength'
        ]
      };
    }
  };

  const exportProfile = () => {
    if (!analysis) return;
    
    const profile = {
      voiceProfile: {
        tone: analysis.tone,
        personality: analysis.personality,
        strengths: analysis.strengths,
        targetAudience: analysis.audience,
        confidence: analysis.confidence
      },
      recommendations: analysis.recommendations,
      sampleText: voiceSample,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voice-profile-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Voice Profile Analyzer</h1>
        </div>
        <p className="text-muted-foreground">
          Discover your unique communication style and learn how to adapt it for different audiences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Sample Input
          </CardTitle>
          <CardDescription>
            Write 2-3 paragraphs about any topic. The more natural, the better!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sample Prompts (optional):</label>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceSample(prompt)}
                  className="text-xs"
                >
                  {prompt.split('...')[0]}...
                </Button>
              ))}
            </div>
          </div>
          
          <Textarea
            placeholder="Write naturally about any topic that interests you..."
            value={voiceSample}
            onChange={(e) => setVoiceSample(e.target.value)}
            className="min-h-[200px]"
          />
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {voiceSample.length} characters
            </span>
            <Button 
              onClick={analyzeVoice}
              disabled={!voiceSample.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Voice'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <VolumeX className="h-5 w-5 animate-pulse" />
                <span className="font-medium">Analyzing your voice...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Processing tone, personality, and communication patterns...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Voice Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Communication Tone</h4>
                  <Badge variant="secondary" className="text-sm">
                    {analysis.tone}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Personality Type</h4>
                  <Badge variant="outline" className="text-sm">
                    {analysis.personality}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Target Audience</h4>
                  <Badge variant="default" className="text-sm">
                    {analysis.audience}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Confidence Level</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={analysis.confidence} className="flex-1" />
                    <span className="text-sm font-medium">{analysis.confidence}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Voice Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <MessageSquare className="h-4 w-4" />
            <AlertDescription>
              Your voice profile is ready! Use this analysis to tailor your communication 
              for different audiences and situations.
            </AlertDescription>
          </Alert>

          <div className="flex justify-center">
            <Button onClick={exportProfile} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Voice Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceProfileAnalyzer;