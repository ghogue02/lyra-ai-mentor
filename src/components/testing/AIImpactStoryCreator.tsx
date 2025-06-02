import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, BookOpen, Copy, CheckCircle } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
export const AIImpactStoryCreator = () => {
  const [programName, setProgramName] = useState('');
  const [beneficiaryInfo, setBeneficiaryInfo] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [context, setContext] = useState('');
  const [generatedStory, setGeneratedStory] = useState('');
  const [copied, setCopied] = useState(false);
  const {
    callAI,
    loading
  } = useAITestingAssistant();
  const generateStory = async () => {
    if (!programName || !beneficiaryInfo || !outcomes) return;
    try {
      const prompt = `Program: ${programName}
Beneficiary: ${beneficiaryInfo}
Outcomes: ${outcomes}
${context ? `Additional Context: ${context}` : ''}

Create a compelling impact story that showcases the transformation and success. Include specific details, emotional connection, and measurable outcomes. Structure it as a narrative that would work well in grant applications or marketing materials.`;
      const result = await callAI('success_story', prompt);
      setGeneratedStory(result);
    } catch (error) {
      console.error('Error generating story:', error);
    }
  };
  const copyStory = async () => {
    await navigator.clipboard.writeText(generatedStory);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const canGenerate = programName.trim() && beneficiaryInfo.trim() && outcomes.trim();
  return <div className="space-y-4">
      <div className="text-center">
        
        <p className="text-sm text-gray-600">Transform program data into compelling success stories</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Program Name</label>
          <Input placeholder="e.g., After-School Tutoring Program" value={programName} onChange={e => setProgramName(e.target.value)} className="text-sm" />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Beneficiary Information</label>
          <Textarea placeholder="Describe the person or group helped (anonymized)..." value={beneficiaryInfo} onChange={e => setBeneficiaryInfo(e.target.value)} className="text-sm resize-none" rows={2} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Outcomes & Impact</label>
          <Textarea placeholder="What changed? Include specific metrics and improvements..." value={outcomes} onChange={e => setOutcomes(e.target.value)} className="text-sm resize-none" rows={2} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Additional Context (Optional)</label>
          <Textarea placeholder="Challenges overcome, community impact, future goals..." value={context} onChange={e => setContext(e.target.value)} className="text-sm resize-none" rows={2} />
        </div>

        <Button onClick={generateStory} disabled={!canGenerate || loading} className="w-full" size="sm">
          {loading ? <>
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              Creating Story...
            </> : <>
              <BookOpen className="w-3 h-3 mr-2" />
              Generate Impact Story
            </>}
        </Button>
      </div>

      {generatedStory && <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-green-100 text-green-700 text-xs">
                AI Generated Story
              </Badge>
              <Button onClick={copyStory} variant="ghost" size="sm" className="text-xs">
                {copied ? <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Copied!
                  </> : <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>}
              </Button>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {generatedStory}
            </div>
          </CardContent>
        </Card>}
    </div>;
};