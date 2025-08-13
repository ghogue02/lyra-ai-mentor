import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle2, Play } from 'lucide-react';

interface SectionProps { title: string; subtitle?: string; children?: React.ReactNode }
const Section: React.FC<SectionProps> = ({ title, subtitle, children }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold nm-text-primary">{title}</h2>
    {subtitle && <p className="text-sm nm-text-secondary">{subtitle}</p>}
    <div className="nm-card-subtle p-4">{children}</div>
  </section>
);

const ProjectCharterBuilder: React.FC = () => {
  const [phase, setPhase] = useState<'hook' | 'build' | 'preview' | 'celebrate'>('hook');
  const [projectName, setProjectName] = useState('Storytelling Campaign 2025');
  const [goals, setGoals] = useState('Increase donor engagement and community awareness.');
  const [kpis, setKpis] = useState('Email open rate, event attendance, donation conversions');
  const [smart, setSmart] = useState('Increase newsletter CTR to 6% by Q3.');
  const [roles, setRoles] = useState('Sofia [Owner], Jamie [Design], Alex [Stakeholders]');
  const [risks, setRisks] = useState('Timeline shifts [AI Generated], vendor delay [AI Generated]');

  const reviewNotice = 'Key details labeled [AI Generated] are placeholders. Validate and replace with your reality.';

  return (
    <main className="container mx-auto max-w-4xl p-4 space-y-6">
      <header className="flex items-center gap-3">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Project Charter</h1>
      </header>

      {phase === 'hook' && (
        <Card className="p-6 nm-card">
          <p className="nm-text-secondary mb-4">Sofia aligns stakeholders by drafting a clear, concise charter. We’ll combine your inputs with AI-marked placeholders you can refine.</p>
          <div className="flex justify-end">
            <Button onClick={() => setPhase('build')} className="flex items-center gap-2">
              <Play className="w-4 h-4" /> Start
            </Button>
          </div>
        </Card>
      )}

      {phase === 'build' && (
        <Card className="p-6 nm-card space-y-6">
          <Section title="Core Details" subtitle="Provide foundational details; AI will bracket placeholders.">
            <div className="grid sm:grid-cols-2 gap-3">
              <Input value={projectName} onChange={(e)=>setProjectName(e.target.value)} placeholder="Project name" />
              <Input value={roles} onChange={(e)=>setRoles(e.target.value)} placeholder="Roles & responsibilities" />
            </div>
            <Textarea value={goals} onChange={(e)=>setGoals(e.target.value)} placeholder="High-level goals" className="min-h-[80px]" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Textarea value={kpis} onChange={(e)=>setKpis(e.target.value)} placeholder="KPIs" className="min-h-[80px]" />
              <Textarea value={smart} onChange={(e)=>setSmart(e.target.value)} placeholder="SMART objectives" className="min-h-[80px]" />
            </div>
            <Textarea value={risks} onChange={(e)=>setRisks(e.target.value)} placeholder="Risks & mitigations" className="min-h-[80px]" />
          </Section>

          <div className="flex justify-end">
            <Button onClick={() => setPhase('preview')}>Generate Charter</Button>
          </div>
        </Card>
      )}

      {phase === 'preview' && (
        <Card className="p-6 nm-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Draft Charter</h3>
            <Badge variant="secondary">Review Required</Badge>
          </div>
          <div className="nm-card-subtle p-4">
            <div className="prose max-w-none text-sm whitespace-pre-wrap">
{`${reviewNotice}\n\nProject: ${projectName}\n\nGoals:\n- ${goals}\n- [AI Generated] Audience segmentation plan\n\nKPIs:\n- ${kpis}\n- [AI Generated] Story resonance index\n\nSMART Objectives:\n- ${smart}\n\nRoles & Responsibilities:\n- ${roles}\n- [AI Generated] QA reviewer assigned\n\nRisks & Mitigations:\n- ${risks}`}            </div>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPhase('build')}>Edit</Button>
            <Button onClick={() => setPhase('celebrate')} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Complete</Button>
          </div>
        </Card>
      )}

      {phase === 'celebrate' && (
        <Card className="p-6 nm-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">Charter Draft Completed</h3>
          <p className="nm-text-secondary">AI-added placeholders are clearly marked — refine for accuracy.</p>
        </Card>
      )}
    </main>
  );
};

export default ProjectCharterBuilder;
