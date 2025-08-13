import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Users, ClipboardList, CheckCircle2, Play } from 'lucide-react';

interface TeamMember { name: string; role: string; hoursPerWeek: number; currentTasks: string; }

interface SectionProps { title: string; subtitle?: string; children?: React.ReactNode }
const Section: React.FC<SectionProps> = ({ title, subtitle, children }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold nm-text-primary">{title}</h2>
    {subtitle && <p className="text-sm nm-text-secondary">{subtitle}</p>}
    <div className="nm-card-subtle p-4">{children}</div>
  </section>
);

const TeamCapacityCalculator: React.FC = () => {
  const [phase, setPhase] = useState<'hook' | 'build' | 'preview' | 'celebrate'>('hook');

  // New Project Requirements FIRST per feedback
  const [requirements, setRequirements] = useState([
    { label: 'Estimated total hours', hours: 80 },
    { label: 'Deadline (weeks)', hours: 4 },
    { label: 'Critical skills needed', hours: 0 },
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    { name: 'Sofia', role: 'Communications Lead', hoursPerWeek: 20, currentTasks: 'Newsletter, social content' },
    { name: 'Jamie', role: 'Designer', hoursPerWeek: 15, currentTasks: 'Event materials' },
  ]);

  const availableCapacity = team.reduce((sum, m) => sum + m.hoursPerWeek, 0);

  return (
    <main className="container mx-auto max-w-4xl p-4 space-y-6">
      <header className="flex items-center gap-3">
        <Users className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Team Capacity Calculator</h1>
      </header>

      {phase === 'hook' && (
        <Card className="p-6 nm-card">
          <p className="nm-text-secondary mb-4">Before Sofia commits to a new storytelling campaign, she needs to ensure the team has capacity. Let’s validate feasibility together.</p>
          <div className="flex justify-end">
            <Button onClick={() => setPhase('build')} className="flex items-center gap-2">
              <Play className="w-4 h-4" /> Start
            </Button>
          </div>
        </Card>
      )}

      {phase === 'build' && (
        <Card className="p-6 nm-card space-y-6">
          <Section title="1) New Project Requirements" subtitle="Define what this project demands.">
            <div className="grid sm:grid-cols-2 gap-4">
              {requirements.map((r, i) => (
                <div key={i} className="space-y-2">
                  <Input value={r.label} onChange={(e) => setRequirements(requirements.map((v, idx) => idx===i? { ...v, label: e.target.value }: v))} />
                  <div className="flex items-center gap-2">
                    <span className="text-sm nm-text-secondary w-24">Hours</span>
                    <Input type="number" value={r.hours} onChange={(e) => setRequirements(requirements.map((v, idx) => idx===i? { ...v, hours: parseInt(e.target.value || '0') }: v))} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => setRequirements([...requirements, { label: 'New requirement', hours: 0 }])}>Add requirement</Button>
            </div>
          </Section>

          <Section title="2) Team Members" subtitle="Bandwidth and current workload.">
            <div className="space-y-4">
              {team.map((m, i) => (
                <div key={i} className="nm-card-subtle p-4 space-y-2">
                  <div className="grid sm:grid-cols-4 gap-2">
                    <Input value={m.name} onChange={(e) => setTeam(team.map((t, idx) => idx===i? { ...t, name: e.target.value }: t))} placeholder="Name" />
                    <Input value={m.role} onChange={(e) => setTeam(team.map((t, idx) => idx===i? { ...t, role: e.target.value }: t))} placeholder="Role" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm nm-text-secondary w-28">Hours</span>
                      <Input type="number" value={m.hoursPerWeek} onChange={(e) => setTeam(team.map((t, idx) => idx===i? { ...t, hoursPerWeek: parseInt(e.target.value || '0') }: t))} />
                    </div>
                    <Textarea value={m.currentTasks} onChange={(e) => setTeam(team.map((t, idx) => idx===i? { ...t, currentTasks: e.target.value }: t))} placeholder="Current tasks" />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={() => setTeam([...team, { name: 'New Member', role: '', hoursPerWeek: 0, currentTasks: '' }])}>Add member</Button>
            </div>
          </Section>

          <div className="flex justify-end">
            <Button onClick={() => setPhase('preview')}>Analyze</Button>
          </div>
        </Card>
      )}

      {phase === 'preview' && (
        <Card className="p-6 nm-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Capacity Summary</h3>
            <Badge variant="secondary">Available / week: {availableCapacity} hrs</Badge>
          </div>
          <div className="nm-card-subtle p-4">
            <p className="text-sm nm-text-secondary">Required hours: <strong>{requirements.find(r=>r.label.toLowerCase().includes('estimated'))?.hours ?? 0}</strong></p>
            <p className="text-sm nm-text-secondary">Recommendation: {availableCapacity >= (requirements.find(r=>r.label.toLowerCase().includes('estimated'))?.hours ?? 0) ? 'Proceed with current team capacity.' : 'Not enough capacity — reduce scope, extend timeline, or reassign tasks.'}</p>
          </div>
          <Section title="Optimization Suggestions" subtitle="Propose rebalancing based on current workload.">
            <ul className="list-disc pl-5 text-sm nm-text-secondary space-y-1">
              <li>Identify tasks to pause during campaign window.</li>
              <li>Consider upskilling team members with adjacent skills.</li>
              <li>Timebox weekly focus blocks for critical deliverables.</li>
            </ul>
          </Section>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPhase('build')}>Adjust</Button>
            <Button onClick={() => setPhase('celebrate')} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/>Complete</Button>
          </div>
        </Card>
      )}

      {phase === 'celebrate' && (
        <Card className="p-6 nm-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
          <h3 className="text-lg font-semibold">Capacity Analysis Completed</h3>
          <p className="nm-text-secondary">You validated feasibility and captured optimization options.</p>
        </Card>
      )}
    </main>
  );
};

export default TeamCapacityCalculator;
