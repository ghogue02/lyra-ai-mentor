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
import { Scale, Play, Sparkles, CheckCircle2, Target, BarChart3, Award, FileText, User } from 'lucide-react';
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
    { name: 'Video Comparison', criteria: ['Authentic voice alignment', 'Production feasibility', 'Donor engagement factor'], programs: ['Community Impact Documentary', 'Youth Leadership Spotlight Series', 'Social Media Story Campaign'] },
    { name: 'Grant Proposal Decision', criteria: ['Grant alignment', 'Measurable outcomes', 'Community representation'], programs: ['Bilingual Family Stories Campaign', 'Impact Documentary Film', 'Alumni Success Story Series'] },
    { name: 'Donor Engagement Focus', criteria: ['Donor engagement factor', 'Emotional resonance potential', 'Story accessibility'], programs: ['Donor Journey Video Collection', 'Community Voices Podcast', 'Interactive Story Hub'] }
  ];

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
          <div className="container mx-auto max-w-6xl pt-20 space-y-6">
            <div className="mb-2"><Progress value={progress} className="h-2" /></div>

            <div className="grid lg:grid-cols-2 gap-3">
              {/* Builder */}
              <Card className="border-border/40">
                 <CardContent className="p-3 space-y-3">
                   {/* Quick Setup */}
                   <section>
                     <div className="flex items-center gap-2 mb-2">
                       <Sparkles className="w-5 h-5 text-primary" />
                       <h3 className="font-semibold">Quick Setup</h3>
                     </div>
                     <div className="grid grid-cols-3 gap-1">
                       {quickSetups.map((setup, i) => (
                         <Button 
                           key={i} 
                           variant="outline" 
                           size="sm" 
                           className="h-16 text-xs flex-col gap-1" 
                           onClick={() => {
                             setCriteria(setup.criteria);
                             setWeights(setup.criteria.map(c => criteriaPresets.find(p => p.name === c)?.weight || 5));
                             setPrograms(setup.programs);
                             setScores(setup.programs.map(() => setup.criteria.map(() => 5)));
                             setCurrentStep(2);
                           }}
                         >
                           <span className="font-medium">{setup.name}</span>
                           <span className="text-xs opacity-70">{setup.criteria.length} criteria</span>
                         </Button>
                       ))}
                     </div>
                   </section>

                   {/* Criteria Selection */}
                   <section>
                     <div className="flex items-center gap-2 mb-2">
                       <Target className="w-5 h-5 text-primary" />
                       <h3 className="font-semibold">Select Criteria</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                       {criteriaPresets.map((preset, i) => {
                         const isSelected = criteria.includes(preset.name);
                         return (
                           <Button
                             key={i}
                             variant={isSelected ? "default" : "outline"}
                             size="sm"
                             className="h-12 text-xs flex-col gap-1 relative"
                             onClick={() => {
                               if (isSelected) {
                                 const idx = criteria.indexOf(preset.name);
                                 setCriteria(criteria.filter((_, i) => i !== idx));
                                 setWeights(weights.filter((_, i) => i !== idx));
                                 setScores(scores.map(row => row.filter((_, i) => i !== idx)));
                               } else {
                                 setCriteria([...criteria, preset.name]);
                                 setWeights([...weights, preset.weight]);
                                 setScores(scores.map(row => [...row, 5]));
                               }
                               setCurrentStep(Math.min(4, currentStep + 1));
                             }}
                           >
                             {isSelected && <CheckCircle2 className="w-3 h-3 absolute top-1 right-1" />}
                             <span>{preset.icon}</span>
                             <span className="leading-tight">{preset.name.split(' ').slice(0, 2).join(' ')}</span>
                           </Button>
                         );
                       })}
                     </div>
                     
                     {/* Weight Adjustment for Selected Criteria */}
                     {criteria.length > 0 && (
                       <div className="space-y-1 mt-2">
                         <p className="text-xs text-muted-foreground">Adjust importance (1-10):</p>
                         {criteria.map((c, i) => (
                           <div key={i} className="flex items-center gap-2">
                             <span className="text-xs flex-1 truncate">{c}</span>
                             <div className="flex items-center gap-1">
                               {[1,2,3,4,5,6,7,8,9,10].map(star => (
                                 <button
                                   key={star}
                                   className={`w-3 h-3 text-xs ${weights[i] >= star ? 'text-primary' : 'text-muted-foreground'}`}
                                   onClick={() => setWeights(weights.map((w, idx) => idx === i ? star : w))}
                                 >
                                   ⭐
                                 </button>
                               ))}
                               <Badge variant="secondary" className="w-6 h-4 text-xs">{weights[i]}</Badge>
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </section>

                   {/* Program Selection */}
                   <section>
                     <div className="flex items-center gap-2 mb-2">
                       <BarChart3 className="w-5 h-5 text-primary" />
                       <h3 className="font-semibold">Select Initiatives</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
                       {programPresets.map((preset, i) => {
                         const isSelected = programs.includes(preset.name);
                         return (
                           <Button
                             key={i}
                             variant={isSelected ? "default" : "outline"}
                             size="sm"
                             className="h-14 text-xs justify-start flex-col gap-1 relative p-2"
                             onClick={() => {
                               if (isSelected) {
                                 const idx = programs.indexOf(preset.name);
                                 setPrograms(programs.filter((_, i) => i !== idx));
                                 setScores(scores.filter((_, i) => i !== idx));
                               } else {
                                 setPrograms([...programs, preset.name]);
                                 setScores([...scores, criteria.map(() => 5)]);
                               }
                               setCurrentStep(Math.min(4, currentStep + 1));
                             }}
                           >
                             {isSelected && <CheckCircle2 className="w-3 h-3 absolute top-1 right-1" />}
                             <div className="flex items-center gap-2 w-full">
                               <span className="text-sm">{preset.icon}</span>
                               <div className="text-left flex-1">
                                 <div className="font-medium leading-tight">{preset.name}</div>
                                 <div className="text-xs opacity-70">{preset.desc}</div>
                               </div>
                             </div>
                           </Button>
                         );
                       })}
                     </div>
                     
                     {/* Visual Scoring for Selected Programs */}
                     {programs.length > 0 && criteria.length > 0 && (
                       <div className="space-y-2 mt-2">
                         <p className="text-xs text-muted-foreground">Rate each initiative (1-10 stars):</p>
                         {programs.map((p, pIdx) => (
                           <div key={pIdx} className="border border-border/30 rounded p-2">
                             <div className="font-medium text-sm mb-1">{p}</div>
                             <div className="space-y-1">
                               {criteria.map((c, cIdx) => (
                                 <div key={cIdx} className="flex items-center gap-2">
                                   <span className="text-xs flex-1 truncate">{c}</span>
                                   <div className="flex">
                                     {[1,2,3,4,5,6,7,8,9,10].map(star => (
                                       <button
                                         key={star}
                                         className={`w-3 h-3 text-xs ${(scores[pIdx][cIdx] || 0) >= star ? 'text-primary' : 'text-muted-foreground'}`}
                                         onClick={() => setScores(scores.map((row, ri) => ri === pIdx ? row.map((sv, ci) => ci === cIdx ? star : sv) : row))}
                                       >
                                         ⭐
                                       </button>
                                     ))}
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         ))}
                       </div>
                     )}
                   </section>

                   {/* Memo options */}
                   <section>
                     <div className="flex items-center gap-2 mb-2">
                       <FileText className="w-5 h-5 text-primary" />
                       <h3 className="font-semibold">Memo Setup</h3>
                     </div>
                    <div className="grid grid-cols-3 gap-1">
                      <Select value={audience} onValueChange={setAudience}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {audienceOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {toneOptions.map((o)=> (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
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
                    <div className="border border-border/30 rounded p-3 bg-background/50">
                      <div className="text-sm space-y-2">
                        <div><strong>RECOMMENDATION:</strong> {programs[bestIndex]} (weighted score: {totals[bestIndex]})</div>
                        <div><strong>WHY:</strong> This initiative scores highest on authentic community voice and donor engagement potential, aligning with our $400K grant requirements.</div>
                        <div><strong>NEXT STEPS:</strong> Present to board with community partner commitments and budget projections.</div>
                      </div>
                    </div>
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
