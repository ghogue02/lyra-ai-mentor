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
import { Scale, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import { useToast } from '@/hooks/use-toast';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { supabase } from '@/integrations/supabase/client';
import { TemplateContentFormatter } from '@/components/ui/TemplateContentFormatter';

// New structure aligned with SofiaVoiceDiscovery: intro -> narrative -> workshop

type Phase = 'intro' | 'narrative' | 'workshop';

const defaultCriteria = ['Impact on mission', 'Cost/ROI', 'Feasibility', 'Time to implement'];
const defaultPrograms = ['Program A', 'Program B', 'Program C'];

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
  const criteriaSuggestions = ['Audience reach', 'Grant alignment', 'Risk level', 'Equity impact', 'Data availability'];
  const programSuggestions = ['Annual Gala Campaign', 'Community Story Series', 'Donor Impact Report', 'Volunteer Spotlight Series'];
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
          topic: 'Decision matrix recommendation memo',
          context: `Use this prompt to produce a concise memo.\n${promptPreview}`
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
    { id: '1', content: "We kept debating ideas without criteria — decisions felt subjective.", emotion: 'thoughtful' as const, showAvatar: true },
    { id: '2', content: "A simple weighted matrix made trade‑offs clear and consensus fast.", emotion: 'confident' as const },
    { id: '3', content: "I wrap it with a memo so leaders see the why, not just the what.", emotion: 'empowered' as const },
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
                  <h1 className="text-3xl font-bold">Decision Matrix</h1>
                  <p className="nm-text-secondary mt-2">Prioritize storytelling initiatives with a weighted criteria matrix and produce a memo-ready recommendation.</p>
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

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Builder */}
              <Card>
                <CardHeader>
                  <CardTitle>Build Your Matrix</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Criteria */}
                  <section>
                    <h3 className="font-semibold mb-2">1) Criteria and Weights</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {criteria.map((c, i) => (
                        <div key={i} className="space-y-2">
                          <Input value={c} onChange={(e)=>{ setCriteria(criteria.map((v, idx)=> idx===i? e.target.value : v)); setCurrentStep((s)=>Math.min(4, s+1)); }} />
                          <div className="flex items-center gap-3">
                            <Slider value={[weights[i]]} onValueChange={(v)=>{ setWeights(weights.map((w, idx)=> idx===i? (v[0]||0) : w)); }} max={10} step={1} className="flex-1" />
                            <Badge variant="secondary">{weights[i]}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Button variant="outline" onClick={()=>{ setCriteria([...criteria, 'New criterion']); setWeights([...weights, 5]); }}>Add criterion</Button>
                      {criteriaSuggestions.filter(s => !criteria.includes(s)).map((s, i) => (
                        <Button key={i} variant="outline" size="sm" onClick={()=> { setCriteria([...criteria, s]); setWeights([...weights, 5]); }}>+ {s}</Button>
                      ))}
                    </div>
                  </section>

                  {/* Programs */}
                  <section>
                    <h3 className="font-semibold mb-2">2) Programs/Options</h3>
                    <div className="space-y-4">
                      {programs.map((p, pIdx) => (
                        <div key={pIdx} className="nm-card-subtle p-4 space-y-2">
                          <Input value={p} onChange={(e)=> setPrograms(programs.map((v,i)=> i===pIdx? e.target.value : v))} />
                          <div className="grid sm:grid-cols-2 gap-3">
                            {criteria.map((c, cIdx) => (
                              <div key={cIdx} className="flex items-center justify-between gap-3">
                                <span className="text-sm nm-text-secondary truncate">{c}</span>
                                <Input type="number" min={0} max={10} value={scores[pIdx][cIdx] || 0} onChange={(e)=> setScores(scores.map((row, ri)=> ri===pIdx? row.map((sv, ci)=> ci===cIdx? parseInt(e.target.value||'0') : sv) : row))} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={()=>{ setPrograms([...programs, `Program ${String.fromCharCode(65 + programs.length)}`]); setScores([...scores, criteria.map(()=>5)]); }}>Add program</Button>
                      <div className="flex flex-wrap gap-2">
                        {programSuggestions.filter(p => !programs.includes(p)).map((p, i) => (
                          <Button key={i} variant="outline" size="sm" onClick={()=> { setPrograms([...programs, p]); setScores([...scores, criteria.map(()=>5)]); }}>+ {p}</Button>
                        ))}
                      </div>
                    </div>
                  </section>

                  {/* Memo options */}
                  <section>
                    <h3 className="font-semibold mb-2">3) Memo Options</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs nm-text-secondary">Audience</label>
                        <Select value={audience} onValueChange={setAudience}>
                          <SelectTrigger><SelectValue placeholder="Select audience" /></SelectTrigger>
                          <SelectContent>
                            {audienceOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs nm-text-secondary">Tone</label>
                        <Select value={tone} onValueChange={setTone}>
                          <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                          <SelectContent>
                            {toneOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-xs nm-text-secondary">Format</label>
                        <Select value={format} onValueChange={setFormat}>
                          <SelectTrigger><SelectValue placeholder="Select format" /></SelectTrigger>
                          <SelectContent>
                            {formatOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                          </SelectContent>
                        </Select>
                      </div>
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
                    <ul className="list-disc pl-5 text-sm nm-text-secondary space-y-1">
                      <li>Weights reflect importance — not scores.</li>
                      <li>Keep criteria independent to avoid double counting.</li>
                      <li>Use the memo to explain trade-offs succinctly.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4"/> LLM Prompt Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <pre className="text-xs whitespace-pre-wrap nm-card-subtle p-3 rounded-md">{promptPreview}</pre>
                    <div className="flex justify-end">
                      <Button onClick={runAI} disabled={isGenerating} className="flex items-center gap-2">
                        <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} /> {isGenerating ? 'Generating...' : 'Generate AI Memo'}
                      </Button>
                    </div>
                    {aiContent && (
                      <div className="nm-card-subtle p-4 rounded-md">
                        <TemplateContentFormatter content={aiContent} contentType="lesson" variant="default" showMergeFieldTypes={true} />
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {programs.map((p, i) => (
                        <div key={i} className={`nm-card p-3 ${i===bestIndex? 'ring-1 ring-primary' : ''}`}>
                          <div className="flex items-center justify-between"><span className="font-medium">{p}</span><Badge>{totals[i]}</Badge></div>
                        </div>
                      ))}
                    </div>
                    <Textarea className="min-h-[140px]" defaultValue={`Decision: Proceed with ${programs[bestIndex]} (highest weighted score).\nRationale: [Add a sentence per top criteria]\nNext steps: Confirm with stakeholders, pilot, prepare update.`} />
                    <div className="flex justify-end"><Button onClick={handleComplete} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Mark Complete</Button></div>
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
