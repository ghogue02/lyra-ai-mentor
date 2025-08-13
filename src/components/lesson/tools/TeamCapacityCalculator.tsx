import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Users, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';

// Aligned with Voice Discovery: intro -> narrative -> workshop

type Phase = 'intro' | 'narrative' | 'workshop';

interface TeamMember { name: string; role: string; hoursPerWeek: number; currentTasks: string; }

const TeamCapacityCalculator: React.FC = () => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);

  const [requirements, setRequirements] = useState([
    { label: 'Estimated total hours', hours: 80 },
    { label: 'Deadline (weeks)', hours: 4 },
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    { name: 'Sofia', role: 'Comms Lead', hoursPerWeek: 20, currentTasks: 'Newsletter, social' },
    { name: 'Jamie', role: 'Designer', hoursPerWeek: 15, currentTasks: 'Event materials' },
  ]);

  const available = useMemo(() => team.reduce((s, m) => s + m.hoursPerWeek, 0), [team]);
  const reqHours = requirements.find(r => r.label.toLowerCase().includes('hours'))?.hours ?? 0;
  const recommendation = available >= reqHours ? 'Proceed with current capacity.' : 'Not enough capacity — reduce scope or extend timeline.';

  const promptPreview = `Analyze feasibility for a nonprofit campaign. Available weekly hours: ${available}. Required hours: ${reqHours}. Team: ${team.map(t=>`${t.name}(${t.role}:${t.hoursPerWeek}h/wk)`).join(', ')}. Recommend adjustments and risks.`;

  const narrativeMessages = [
    { id: '1', content: 'Before I pitch a new story sprint, I sanity-check our capacity.', emotion: 'thoughtful' as const, showAvatar: true },
    { id: '2', content: 'A quick tally of weekly bandwidth avoids painful mid-sprint surprises.', emotion: 'confident' as const },
    { id: '3', content: 'I turn findings into a clear go/no-go note for stakeholders.', emotion: 'empowered' as const },
  ];

  const progress = 66 + Math.min(34, currentStep * 8);

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6 flex items-center">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-4"><Button variant="ghost" onClick={() => navigate('/chapter/3')}>Back to Chapter 3</Button></div>
            <Card className="nm-card p-8 animate-enter">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl nm-card-subtle flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                <div>
                  <h1 className="text-3xl font-bold">Team Capacity Calculator</h1>
                  <p className="nm-text-secondary mt-2">Validate feasibility before committing your storytelling sprint.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end"><Button size="lg" onClick={() => setPhase('narrative')} className="flex items-center gap-2"><Play className="w-5 h-5"/> Begin</Button></div>
            </Card>
          </div>
        </motion.div>
      )}

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Team Capacity" characterName="Sofia" progress={33} />
          <div className="container mx-auto max-w-4xl pt-20">
            <NarrativeManager messages={narrativeMessages} onComplete={() => setPhase('workshop')} phaseId="sofia-team-capacity" characterName="Sofia" />
          </div>
        </motion.div>
      )}

      {phase === 'workshop' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Team Capacity" characterName="Sofia" progress={progress} />
          <div className="container mx-auto max-w-6xl pt-20 space-y-6">
            <div className="mb-2"><Progress value={progress} className="h-2" /></div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Define Requirements & Team</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <h3 className="font-semibold mb-2">1) New Project Requirements</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {requirements.map((r, i) => (
                        <div key={i} className="space-y-2">
                          <Input value={r.label} onChange={(e)=> setRequirements(requirements.map((v, idx)=> idx===i? { ...v, label: e.target.value } : v))} />
                          <div className="flex items-center gap-2">
                            <span className="text-sm nm-text-secondary w-24">Hours</span>
                            <Input type="number" value={r.hours} onChange={(e)=> setRequirements(requirements.map((v, idx)=> idx===i? { ...v, hours: parseInt(e.target.value||'0') } : v))} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3"><Button variant="outline" onClick={()=> setRequirements([...requirements, { label: 'New requirement', hours: 0 }])}>Add requirement</Button></div>
                  </section>

                  <section>
                    <h3 className="font-semibold mb-2">2) Team Members</h3>
                    <div className="space-y-4">
                      {team.map((m, i) => (
                        <div key={i} className="nm-card-subtle p-4 space-y-2">
                          <div className="grid sm:grid-cols-4 gap-2">
                            <Input value={m.name} onChange={(e)=> setTeam(team.map((t, idx)=> idx===i? { ...t, name: e.target.value } : t))} placeholder="Name" />
                            <Input value={m.role} onChange={(e)=> setTeam(team.map((t, idx)=> idx===i? { ...t, role: e.target.value } : t))} placeholder="Role" />
                            <div className="flex items-center gap-2">
                              <span className="text-sm nm-text-secondary w-28">Hours</span>
                              <Input type="number" value={m.hoursPerWeek} onChange={(e)=> setTeam(team.map((t, idx)=> idx===i? { ...t, hoursPerWeek: parseInt(e.target.value||'0') } : t))} />
                            </div>
                            <Textarea value={m.currentTasks} onChange={(e)=> setTeam(team.map((t, idx)=> idx===i? { ...t, currentTasks: e.target.value } : t))} placeholder="Current tasks" />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" onClick={()=> setTeam([...team, { name: 'New Member', role: '', hoursPerWeek: 0, currentTasks: '' }])}>Add member</Button>
                    </div>
                  </section>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Sofia’s Guidance</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm nm-text-secondary space-y-1">
                      <li>Count only realistic weekly focus hours.</li>
                      <li>Flag critical skills and potential gaps early.</li>
                      <li>Turn the summary into a go/no-go note.</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="w-4 h-4"/> LLM Prompt Preview</CardTitle></CardHeader>
                  <CardContent>
                    <pre className="text-xs whitespace-pre-wrap nm-card-subtle p-3 rounded-md">{promptPreview}</pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Capacity Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between"><span className="text-sm nm-text-secondary">Available / week</span><Badge variant="secondary">{available} hrs</Badge></div>
                    <div className="flex items-center justify-between"><span className="text-sm nm-text-secondary">Required</span><Badge>{reqHours} hrs</Badge></div>
                    <Textarea className="min-h-[120px] mt-2" defaultValue={`Recommendation: ${recommendation}\nRisks: [List risks] \nAdjustments: [Proposed changes]`} />
                    <div className="flex justify-end"><Button className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Mark Complete</Button></div>
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

export default TeamCapacityCalculator;
