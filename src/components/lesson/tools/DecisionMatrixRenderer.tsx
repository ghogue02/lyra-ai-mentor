import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, Play, Sparkles, CheckCircle2, Target, BarChart3, Award, FileText, User, ChevronDown, ChevronUp, Copy, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import { useToast } from '@/hooks/use-toast';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { supabase } from '@/integrations/supabase/client';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

// New structure aligned with SofiaVoiceDiscovery: intro -> narrative -> workshop

type Phase = 'intro' | 'narrative' | 'workshop';

const defaultCriteria = ['Authentic voice alignment', 'Community representation', 'Donor engagement factor', 'Cultural authenticity'];
const defaultPrograms = ['Community Impact Documentary', 'Bilingual Family Stories Campaign', 'Youth Leadership Spotlight Series'];

const DecisionMatrixRenderer: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getStory } = useCharacterStory();
  const sofia = getStory('sofia');

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);

  // Builder state
  const [criteria, setCriteria] = useState<string[]>(defaultCriteria);
  const [weights, setWeights] = useState<number[]>(defaultCriteria.map(() => 5));
  const [programs, setPrograms] = useState<string[]>(defaultPrograms);
  const [scores, setScores] = useState<number[][]>(defaultPrograms.map(() => defaultCriteria.map(() => 5)));
  const [audience, setAudience] = useState('Executive Director');
  const [tone, setTone] = useState('Professional and concise');
  const [format, setFormat] = useState('Email memo');

  // No-typing preset options
  const criteriaPresets = [
    { name: 'Authentic voice alignment', icon: '🎭', weight: 8 },
    { name: 'Community representation', icon: '🤝', weight: 9 },
    { name: 'Donor engagement factor', icon: '💖', weight: 7 },
    { name: 'Cultural authenticity', icon: '🌍', weight: 8 },
    { name: 'Emotional resonance potential', icon: '💫', weight: 8 },
    { name: 'Production feasibility', icon: '🎬', weight: 6 },
    { name: 'Grant alignment', icon: '📋', weight: 9 },
    { name: 'Equity impact', icon: '⚖️', weight: 9 },
    { name: 'Measurable outcomes', icon: '📊', weight: 7 },
    { name: 'Story accessibility', icon: '♿', weight: 6 },
    { name: 'Timeline flexibility', icon: '⏰', weight: 5 },
    { name: 'Budget efficiency', icon: '💰', weight: 7 }
  ];

  const programPresets = [
    { name: 'Community Impact Documentary', desc: 'Feature-length community stories', icon: '🎬' },
    { name: 'Bilingual Family Stories Campaign', desc: 'Multi-language testimonials', icon: '🗣️' },
    { name: 'Youth Leadership Spotlight Series', desc: 'Young changemaker profiles', icon: '⭐' },
    { name: 'Donor Journey Video Collection', desc: 'Supporter transformation stories', icon: '💝' },
    { name: 'Alumni Success Story Series', desc: 'Graduate impact narratives', icon: '🎓' },
    { name: 'Community Voices Podcast', desc: 'Audio storytelling platform', icon: '🎙️' },
    { name: 'Impact Documentary Film', desc: 'Professional documentary', icon: '🏆' },
    { name: 'Social Media Story Campaign', desc: 'Bite-sized digital stories', icon: '📱' },
    { name: 'Interactive Story Hub', desc: 'Digital storytelling platform', icon: '💻' }
  ];

  const quickSetups = [
    { 
      name: 'Video Comparison', 
      description: "Sofia needs to recommend a video storytelling approach for the new campaign. Help her evaluate production complexity vs. community impact to secure board approval.",
      criteria: ['Authentic voice alignment', 'Production feasibility', 'Donor engagement factor'], 
      programs: ['Community Impact Documentary', 'Youth Leadership Spotlight Series', 'Social Media Story Campaign'] 
    },
    { 
      name: 'Grant Proposal Decision', 
      description: "A major foundation is requesting Sofia's top storytelling initiative for a $50K grant. Help her choose which project will demonstrate the strongest measurable community impact.",
      criteria: ['Grant alignment', 'Measurable outcomes', 'Community representation'], 
      programs: ['Bilingual Family Stories Campaign', 'Impact Documentary Film', 'Alumni Success Story Series'] 
    },
    { 
      name: 'Donor Engagement Focus', 
      description: "Sofia's major donors want more personal connection to the community. Help her select the storytelling format that will deepen donor relationships and increase retention.",
      criteria: ['Donor engagement factor', 'Emotional resonance potential', 'Story accessibility'], 
      programs: ['Donor Journey Video Collection', 'Community Voices Podcast', 'Interactive Story Hub'] 
    }
  ];

  const audienceOptions = ['Executive Director', 'Board', 'Program Directors'];
  const toneOptions = ['Professional and concise', 'Inspiring and mission-centered', 'Data-driven and neutral'];
  const formatOptions = ['Email memo', 'Board slide', 'Slack update'];

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');
  const [showPrompt, setShowPrompt] = useState(true);
  const [promptCopied, setPromptCopied] = useState(false);

  const totals = useMemo(() => programs.map((_, pIdx) => (
    criteria.reduce((sum, _c, cIdx) => sum + (scores[pIdx][cIdx] || 0) * (weights[cIdx] || 0), 0)
  )), [programs, scores, criteria, weights]);

  const bestIndex = totals.length ? totals.indexOf(Math.max(...totals)) : 0;

  const promptPreview = useMemo(() => {
    const basePrompt = `You are assisting a nonprofit communications leader. Create a ${format} for ${audience} in a ${tone} tone.`;
    
    if (currentStep === 0) {
      return basePrompt + `\n\nWeighted criteria: [To be determined based on scenario selection]\nOptions: [To be determined based on scenario selection]\nRecommend the best option based on weighted decision matrix analysis.`;
    }
    
    if (currentStep === 1) {
      return basePrompt + `\n\nWeighted criteria: ${criteria.map((c, i) => `${c} (weight: ${weights[i]}/10)`).join('; ')}.\nOptions: [Scores pending user input]\nRecommend the highest-scoring option with detailed rationale.`;
    }
    
    if (currentStep === 2) {
      return basePrompt + `\n\nWeighted criteria: ${criteria.map((c, i) => `${c} (weight: ${weights[i]}/10)`).join('; ')}.\nOptions and scores: ${programs.map((p, i) => `${p} [weighted total: ${totals[i]}]`).join('; ')}.\nRecommend: ${programs[bestIndex]} based on the decision matrix analysis, include rationale and next steps.`;
    }
    
    return basePrompt + `\n\nWeighted criteria: ${criteria.map((c, i) => `${c} (weight: ${weights[i]}/10)`).join('; ')}.\nOptions and scores: ${programs.map((p, i) => `${p} [weighted total: ${totals[i]}]`).join('; ')}.\nFinal recommendation: ${programs[bestIndex]} with complete justification and implementation steps.`;
  }, [format, audience, tone, criteria, weights, programs, totals, bestIndex, currentStep]);

  const handleComplete = () => {
    toast({ title: 'Decision Matrix Complete!', description: 'Saved a memo-ready recommendation.' });
    navigate('/chapter/3');
  };

  const runAI = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'article',
          topic: 'Storytelling initiative recommendation memo',
          context: `Sofia needs to write a concise, executive-level memo recommending a storytelling initiative. Keep it brief and actionable.

MEMO STRUCTURE (under 200 words total):
- Subject line
- Opening (1 sentence)
- Recommendation with key metrics (2-3 sentences)
- Top 2 reasons why (2 bullet points max)
- Next steps (2-3 action items)
- Professional closing

Context: ${promptPreview}

IMPORTANT: Do not use any markdown formatting (no **, __, *, etc.). Use plain text only with proper line breaks and spacing for readability.

Write in Sofia's voice: warm but professional, data-driven, focused on authentic community impact that drives funding success.`
        }
      });
      if (error) throw error;
      setAiContent(data.content || '');
      toast({ title: 'AI memo ready', description: 'Review and refine as needed.' });
    } catch (e) {
      toast({ title: 'Generation failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptPreview);
      setPromptCopied(true);
      toast({ title: 'Prompt copied!', description: 'You can now paste this into any AI tool.' });
      setTimeout(() => setPromptCopied(false), 2000);
    } catch (error) {
      toast({ title: 'Copy failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const PromptPreviewBox = () => (
    <Card className="mt-8 border-dashed border-2 border-primary/30 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">AI Prompt Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyPromptToClipboard}
              className="h-8 px-3"
            >
              <Copy className="w-4 h-4" />
              {promptCopied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPrompt(!showPrompt)}
              className="h-8 px-3"
            >
              {showPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showPrompt ? 'Hide' : 'Show'}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {showPrompt && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed text-muted-foreground font-semibold">
                  {promptPreview}
                </pre>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                💡 This prompt updates automatically as you make selections. Use it in ChatGPT, Claude, or any AI tool.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
  const narrativeMessages = [
    { id: '1', content: "At Casa de Esperanza, we had three storytelling proposals but couldn't agree on which would secure the $400K grant.", emotion: 'thoughtful' as const, showAvatar: true },
    { id: '2', content: "A weighted matrix clarified what mattered most: authentic community voices over polished production.", emotion: 'confident' as const },
    { id: '3', content: "My memo connected the choice to funding success — board approved in 24 hours, grant secured in 3 months.", emotion: 'empowered' as const },
  ];

  const progress = 66 + Math.min(34, currentStep * 8);

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6 flex items-center">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-4">
              <Button variant="ghost" onClick={() => navigate('/chapter/3')}>Back to Chapter 3</Button>
            </div>
            <Card className="nm-card p-8 animate-enter">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl nm-card-subtle flex items-center justify-center"><Scale className="w-6 h-6 text-primary" /></div>
                <div>
                  <h1 className="text-3xl font-bold">Storytelling Initiative Decision Matrix</h1>
                  <p className="nm-text-secondary mt-2">Make data-driven decisions like Sofia. Weight your criteria, score your options, and generate an executive-ready recommendation memo. Walk through the same framework that helped Sofia secure $2.5M in funding by turning competing proposals into clear, justified choices.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button size="lg" onClick={() => setPhase('narrative')} className="flex items-center gap-2"><Play className="w-5 h-5"/> Begin</Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Decision Matrix" characterName="Sofia" progress={33} />
          <div className="container mx-auto max-w-4xl pt-20">
            <NarrativeManager 
              messages={narrativeMessages} 
              onComplete={() => {
                console.log('Narrative complete, transitioning to workshop');
                setPhase('workshop');
              }} 
              phaseId="sofia-decision-matrix" 
              characterName="Sofia" 
            />
          </div>
        </motion.div>
      )}

      {phase === 'workshop' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Decision Matrix" characterName="Sofia" progress={progress} />
          <div className="container mx-auto max-w-2xl pt-20 space-y-8">
            <div className="mb-4"><Progress value={progress} className="h-2" /></div>

            <Card>
              <CardContent className="p-8 space-y-8">
                
                {/* Step 1: Quick Setup */}
                {currentStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-semibold mb-6">Choose Your Decision Scenario</h3>
                    <div className="space-y-4">
                      {quickSetups.slice(0, 3).map((setup, i) => (
                        <Button 
                          key={i} 
                          variant="outline" 
                          className="w-full h-auto justify-start p-6 text-left"
                          onClick={() => {
                            setCriteria(setup.criteria);
                            setWeights(setup.criteria.map(c => criteriaPresets.find(p => p.name === c)?.weight || 5));
                            setPrograms(setup.programs);
                            setScores(setup.programs.map(() => setup.criteria.map(() => 5)));
                            setCurrentStep(1);
                          }}
                        >
                          <div className="w-full space-y-2">
                            <div className="font-medium text-base text-left">{setup.name}</div>
                            <div className="text-sm text-muted-foreground leading-relaxed text-left whitespace-normal">
                              {setup.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                     </div>
                     <PromptPreviewBox />
                   </motion.div>
                 )}

                {/* Step 2: Adjust Weights */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-semibold mb-6">Rate What Matters Most</h3>
                    <div className="space-y-6">
                      {criteria.map((c, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{c}</span>
                            <Badge variant="secondary" className="text-base px-3 py-1">{weights[i]}/10</Badge>
                          </div>
                          <div className="grid grid-cols-10 gap-2">
                            {[1,2,3,4,5,6,7,8,9,10].map(value => (
                              <button
                                key={value}
                                className={`h-12 rounded font-medium transition-colors ${
                                  weights[i] >= value 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted hover:bg-muted/80'
                                }`}
                                onClick={() => setWeights(weights.map((w, idx) => idx === i ? value : w))}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                     <Button className="w-full mt-8" size="lg" onClick={() => setCurrentStep(2)}>
                       Continue to Scoring
                     </Button>
                     <PromptPreviewBox />
                   </motion.div>
                 )}

                {/* Step 3: Score Programs */}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-semibold mb-6">Score Each Option</h3>
                    <div className="space-y-6">
                      {programs.map((program, pIdx) => (
                        <div key={pIdx} className="border rounded-lg p-6 space-y-4">
                          <h4 className="font-semibold text-lg">{program}</h4>
                          {criteria.map((criterion, cIdx) => (
                            <div key={cIdx} className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">{criterion}</span>
                                <Badge variant="outline" className="text-base px-3 py-1">
                                  {scores[pIdx][cIdx]}/10
                                </Badge>
                              </div>
                              <div className="grid grid-cols-10 gap-1">
                                {[1,2,3,4,5,6,7,8,9,10].map(value => (
                                  <button
                                    key={value}
                                    className={`h-8 rounded text-sm font-medium transition-colors ${
                                      scores[pIdx][cIdx] >= value 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-muted hover:bg-muted/80'
                                    }`}
                                    onClick={() => {
                                      const newScores = [...scores];
                                      newScores[pIdx][cIdx] = value;
                                      setScores(newScores);
                                    }}
                                  >
                                    {value}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                     <Button className="w-full mt-8" size="lg" onClick={() => setCurrentStep(3)}>
                       View Recommendation
                     </Button>
                     <PromptPreviewBox />
                   </motion.div>
                 )}

                {/* Step 4: Results */}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h3 className="text-xl font-semibold mb-6">Sofia's Recommendation</h3>
                    
                    <div className="space-y-4 mb-8">
                      {programs.map((program, idx) => (
                        <div key={idx} className={`p-6 rounded-lg border-2 transition-all ${
                          idx === bestIndex 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border bg-muted/20'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{program}</span>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={idx === bestIndex ? "default" : "secondary"} 
                                className="text-base px-4 py-2"
                              >
                                {totals[idx]} points
                              </Badge>
                              {idx === bestIndex && <Award className="w-6 h-6 text-primary" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      <h4 className="font-semibold text-lg">Executive Summary</h4>
                      <p className="text-muted-foreground">
                        Based on your weighted criteria analysis, <strong>{programs[bestIndex]}</strong> emerges 
                        as the top choice with {totals[bestIndex]} points. This aligns with Sofia's proven approach 
                        that secured Casa de Esperanza their largest grant.
                      </p>
                      <Button onClick={runAI} disabled={isGenerating} className="w-full" size="lg">
                        {isGenerating ? 'Generating Memo...' : 'Generate Detailed Memo'}
                      </Button>
                    </div>

                     {aiContent && (
                       <div className="mt-6 p-6 border rounded-lg bg-background">
                         <h4 className="font-semibold mb-4">Recommendation Memo</h4>
                         <div className="prose prose-sm max-w-none">
                           <div className="whitespace-pre-line leading-relaxed text-sm font-normal">
                             {aiContent.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1')}
                           </div>
                         </div>
                         <Button onClick={handleComplete} className="w-full mt-6" size="lg">
                           Complete Matrix
                         </Button>
                       </div>
                     )}
                     <PromptPreviewBox />
                   </motion.div>
                 )}

               </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DecisionMatrixRenderer;
