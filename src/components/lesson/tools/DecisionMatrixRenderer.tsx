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
import { Scale, Play, Sparkles, CheckCircle2, Target, Layers, FileText, Lightbulb } from 'lucide-react';
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

  // Quick-pick options
  const criteriaSuggestions = ['Emotional resonance potential', 'Production feasibility', 'Grant alignment', 'Equity impact', 'Measurable outcomes'];
  const programSuggestions = ['Donor Journey Video Collection', 'Alumni Success Story Series', 'Community Voices Podcast', 'Impact Documentary Film'];
  const audienceOptions = ['Executive Director', 'Board', 'Program Directors'];
  const toneOptions = ['Professional and concise', 'Inspiring and mission-centered', 'Data-driven and neutral'];
  const formatOptions = ['Email memo', 'Board slide', 'Slack update'];

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');

  const totals = useMemo(() => programs.map((_, pIdx) => (
    criteria.reduce((sum, _c, cIdx) => sum + (scores[pIdx][cIdx] || 0) * (weights[cIdx] || 0), 0)
  )), [programs, scores, criteria, weights]);

  const bestIndex = totals.length ? totals.indexOf(Math.max(...totals)) : 0;

  const promptPreview = useMemo(() => (
    `You are assisting a nonprofit communications leader. Create a ${format} for ${audience} in a ${tone} tone.\n` +
    `Weighted criteria: ${criteria.map((c, i) => `${c} (w:${weights[i]})`).join('; ')}.\n` +
    `Options and scores: ${programs.map((p, i) => `${p} [total:${totals[i]}]`).join('; ')}.\n` +
    `Recommend: ${programs[bestIndex]} based on the matrix, include rationale and next steps.`
  ), [format, audience, tone, criteria, weights, programs, totals, bestIndex]);

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
          context: `Sofia needs to write a compelling memo recommending a storytelling initiative based on weighted criteria analysis. The memo should connect to funding success and community impact.\n\nContext: ${promptPreview}\n\nWrite in Sofia's voice: warm, strategic, focused on authentic community stories that secure funding. Reference how authentic voices outweigh production polish, and connect the recommendation to long-term donor relationships.`
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
                  <p className="nm-text-secondary mt-2">Choose between competing storytelling proposals using Sofia's proven criteria framework. Generate a funding-ready recommendation memo that secured Casa de Esperanza $2.5M.</p>
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
            <NarrativeManager messages={narrativeMessages} onComplete={() => setPhase('workshop')} phaseId="sofia-decision-matrix" characterName="Sofia" />
          </div>
        </motion.div>
      )}

      {phase === 'workshop' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Decision Matrix" characterName="Sofia" progress={progress} />
          <div className="container mx-auto max-w-6xl pt-20 space-y-6">
            <div className="mb-2"><Progress value={progress} className="h-2" /></div>

            <div className="grid lg:grid-cols-2 gap-4">
              {/* Builder */}
              <Card className="border-border/40">
                <CardContent className="p-4 space-y-4">
                   {/* Criteria */}
                   <section>
                     <div className="flex items-center gap-2 mb-3">
                       <Target className="w-4 h-4 text-primary" />
                       <div>
                         <h3 className="font-semibold">Impact Criteria</h3>
                         <p className="text-xs nm-text-secondary">What matters most for securing funding and authentic community engagement?</p>
                       </div>
                     </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {criteria.map((c, i) => (
                        <div key={i} className="space-y-2">
                          <Input 
                            value={c} 
                            onChange={(e)=>{ setCriteria(criteria.map((v, idx)=> idx===i? e.target.value : v)); setCurrentStep((s)=>Math.min(4, s+1)); }}
                            className="h-9"
                          />
                          <div className="flex items-center gap-2">
                            <Slider value={[weights[i]]} onValueChange={(v)=>{ setWeights(weights.map((w, idx)=> idx===i? (v[0]||0) : w)); }} max={10} step={1} className="flex-1" />
                            <Badge variant="secondary" className="min-w-6 text-xs">{weights[i]}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={()=>{ setCriteria([...criteria, 'New criterion']); setWeights([...weights, 5]); }}>Add</Button>
                      {criteriaSuggestions.filter(s => !criteria.includes(s)).slice(0, 3).map((s, i) => (
                        <Button key={i} variant="ghost" size="sm" className="text-xs" onClick={()=> { setCriteria([...criteria, s]); setWeights([...weights, 5]); }}>+ {s}</Button>
                      ))}
                    </div>
                  </section>

                   {/* Programs */}
                   <section>
                     <div className="flex items-center gap-2 mb-3">
                       <Layers className="w-4 h-4 text-primary" />
                       <div>
                         <h3 className="font-semibold">Storytelling Initiatives</h3>
                         <p className="text-xs nm-text-secondary">Rate each proposal against your criteria (0-10 scale)</p>
                       </div>
                     </div>
                    <div className="space-y-3">
                      {programs.map((p, pIdx) => (
                        <div key={pIdx} className="border border-border/30 rounded-lg p-3 space-y-2">
                          <Input 
                            value={p} 
                            onChange={(e)=> setPrograms(programs.map((v,i)=> i===pIdx? e.target.value : v))}
                            className="h-9 font-medium"
                          />
                          <div className="grid sm:grid-cols-2 gap-2">
                            {criteria.map((c, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2">
                                <span className="text-xs nm-text-secondary flex-1 truncate">{c}</span>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  max={10} 
                                  value={scores[pIdx][cIdx] || 0} 
                                  onChange={(e)=> setScores(scores.map((row, ri)=> ri===pIdx? row.map((sv, ci)=> ci===cIdx? parseInt(e.target.value||'0') : sv) : row))}
                                  className="w-16 h-8 text-center"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                       <div className="flex flex-wrap gap-2">
                         <Button variant="outline" size="sm" onClick={()=>{ setPrograms([...programs, `Initiative ${programs.length + 1}`]); setScores([...scores, criteria.map(()=>5)]); }}>Add Initiative</Button>
                         {programSuggestions.filter(p => !programs.includes(p)).slice(0, 2).map((p, i) => (
                           <Button key={i} variant="ghost" size="sm" className="text-xs" onClick={()=> { setPrograms([...programs, p]); setScores([...scores, criteria.map(()=>5)]); }}>+ {p}</Button>
                         ))}
                       </div>
                    </div>
                  </section>

                   {/* Memo options */}
                   <section>
                     <div className="flex items-center gap-2 mb-3">
                       <FileText className="w-4 h-4 text-primary" />
                       <div>
                         <h3 className="font-semibold">Recommendation Memo</h3>
                         <p className="text-xs nm-text-secondary">How should Sofia present the winning proposal to leadership?</p>
                       </div>
                     </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {audienceOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {formatOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                  </section>
                </CardContent>
              </Card>

              {/* Guidance + Prompt */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sofia’s Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <ul className="list-disc pl-5 text-sm nm-text-secondary space-y-2">
                       <li><strong>Stories that resonate secure funding</strong> — weight emotional impact and authenticity highly</li>
                       <li><strong>Community voices outweigh polish</strong> — donors fund authentic connection, not production value</li>
                       <li><strong>Your memo tells the story behind the numbers</strong> — explain why this choice builds lasting relationships</li>
                     </ul>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <h4 className="font-medium">AI Analysis</h4>
                      </div>
                      <Button onClick={runAI} disabled={isGenerating} size="sm" className="h-8">
                        <Sparkles className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                        {isGenerating ? 'Generating...' : 'Generate'}
                      </Button>
                    </div>
                    {aiContent && (
                      <div className="border border-border/30 rounded-md p-3 text-sm">
                        <TemplateContentFormatter content={aiContent} contentType="lesson" variant="default" showMergeFieldTypes={false} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="font-medium">Results</h4>
                    <div className="grid gap-2">
                      {programs.map((p, i) => (
                        <div key={i} className={`flex items-center justify-between p-2 rounded border ${i===bestIndex? 'border-primary bg-primary/5' : 'border-border/30'}`}>
                          <span className="text-sm font-medium">{p}</span>
                          <Badge variant={i===bestIndex ? "default" : "secondary"} className="text-xs">{totals[i]}</Badge>
                        </div>
                      ))}
                    </div>
                    <Textarea 
                      className="min-h-[100px] text-sm" 
                      placeholder={`RECOMMENDATION: ${programs[bestIndex]} (weighted score: ${totals[bestIndex]})\n\nWHY: This initiative scores highest on authentic community voice and donor engagement potential, aligning with our $400K grant requirements.\n\nNEXT STEPS: Present to board with community partner commitments and budget projections.`}
                    />
                    <Button onClick={handleComplete} className="w-full h-9" size="sm">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Matrix
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DecisionMatrixRenderer;
