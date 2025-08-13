import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { FileText, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';

// Aligned with Voice Discovery: intro -> narrative -> workshop

type Phase = 'intro' | 'narrative' | 'workshop';

const ProjectCharterBuilder: React.FC = () => {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);

  // Builder state
  const [projectName, setProjectName] = useState('Storytelling Campaign 2025');
  const [goals, setGoals] = useState('Increase donor engagement and community awareness.');
  const [kpis, setKpis] = useState('Email open rate, event attendance, donation conversions');
  const [smart, setSmart] = useState('Increase newsletter CTR to 6% by Q3.');
  const [roles, setRoles] = useState('Sofia [Owner], Jamie [Design], Alex [Stakeholders]');
  const [risks, setRisks] = useState('Timeline shifts [AI Generated], vendor delay [AI Generated]');

  const reviewNotice = 'Key details labeled [AI Generated] are placeholders. Validate and replace with your reality.';

  const promptPreview = useMemo(() => (
    `Draft a concise nonprofit project charter. Project: ${projectName}. Goals: ${goals}. KPIs: ${kpis}. SMART: ${smart}. Roles: ${roles}. Risks: ${risks}. Mark uncertain details with [AI Generated] for review.`
  ), [projectName, goals, kpis, smart, roles, risks]);

  const narrativeMessages = [
    { id: '1', content: 'When everyone sees the same one-page charter, alignment happens fast.', emotion: 'confident' as const, showAvatar: true },
    { id: '2', content: 'I add AI placeholders where we need decisions — it invites collaboration.', emotion: 'thoughtful' as const },
    { id: '3', content: 'The charter becomes our single source of truth for launch.', emotion: 'empowered' as const },
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
                <div className="w-12 h-12 rounded-xl nm-card-subtle flex items-center justify-center"><FileText className="w-6 h-6 text-primary" /></div>
                <div>
                  <h1 className="text-3xl font-bold">Project Charter</h1>
                  <p className="nm-text-secondary mt-2">Align stakeholders fast with a crisp, shareable one-pager.</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end"><Button size="lg" onClick={() => setPhase('narrative')} className="flex items-center gap-2"><Play className="w-5 h-5"/> Begin</Button></div>
            </Card>
          </div>
        </motion.div>
      )}

      {phase === 'narrative' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Project Charter" characterName="Sofia" progress={33} />
          <div className="container mx-auto max-w-4xl pt-20">
            <NarrativeManager messages={narrativeMessages} onComplete={() => setPhase('workshop')} phaseId="sofia-project-charter" characterName="Sofia" />
          </div>
        </motion.div>
      )}

      {phase === 'workshop' && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
          <MicroLessonNavigator chapterNumber={3} chapterTitle="Sofia's Storytelling Mastery" lessonTitle="Project Charter" characterName="Sofia" progress={progress} />
          <div className="container mx-auto max-w-6xl pt-20 space-y-6">
            <div className="mb-2"><Progress value={progress} className="h-2" /></div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Draft Your Charter</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input value={projectName} onChange={(e)=>{ setProjectName(e.target.value); setCurrentStep((s)=>Math.min(4, s+1)); }} placeholder="Project name" />
                    <Input value={roles} onChange={(e)=> setRoles(e.target.value)} placeholder="Roles & responsibilities" />
                  </div>
                  <Textarea value={goals} onChange={(e)=> setGoals(e.target.value)} placeholder="High-level goals" className="min-h-[80px]" />
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Textarea value={kpis} onChange={(e)=> setKpis(e.target.value)} placeholder="KPIs" className="min-h-[80px]" />
                    <Textarea value={smart} onChange={(e)=> setSmart(e.target.value)} placeholder="SMART objectives" className="min-h-[80px]" />
                  </div>
                  <Textarea value={risks} onChange={(e)=> setRisks(e.target.value)} placeholder="Risks & mitigations" className="min-h-[80px]" />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Sofia’s Guidance</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 text-sm nm-text-secondary space-y-1">
                      <li>Make the charter scannable — headers first, prose second.</li>
                      <li>Bracket unknowns with [AI Generated] to signal validation.</li>
                      <li>Share early to invite fast feedback loops.</li>
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
                  <CardHeader><CardTitle>Draft Charter</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between"><h3 className="font-semibold">{projectName}</h3><Badge variant="secondary">Review Required</Badge></div>
                    <div className="prose max-w-none text-sm whitespace-pre-wrap nm-card-subtle p-4 rounded-md">{`${reviewNotice}\n\nProject: ${projectName}\n\nGoals:\n- ${goals}\n- [AI Generated] Audience segmentation plan\n\nKPIs:\n- ${kpis}\n- [AI Generated] Story resonance index\n\nSMART Objectives:\n- ${smart}\n\nRoles & Responsibilities:\n- ${roles}\n- [AI Generated] QA reviewer assigned\n\nRisks & Mitigations:\n- ${risks}`}</div>
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

export default ProjectCharterBuilder;
