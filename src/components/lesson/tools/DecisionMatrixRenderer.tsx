import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, ListChecks, Scale, Play } from 'lucide-react';

const criteriaTemplates = [
  'Impact on mission',
  'Cost/ROI',
  'Feasibility',
  'Time to implement',
  'Stakeholder alignment'
];

const programsTemplates = ['Program A', 'Program B', 'Program C'];

interface SectionProps { title: string; subtitle?: string; children?: React.ReactNode }
const Section: React.FC<SectionProps> = ({ title, subtitle, children }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold nm-text-primary">{title}</h2>
    {subtitle && <p className="text-sm nm-text-secondary">{subtitle}</p>}
    <div className="nm-card-subtle p-4">{children}</div>
  </section>
);

const WeightSlider: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="flex items-center gap-3">
    <Slider value={[value]} onValueChange={(v) => onChange(v[0] || 0)} max={10} step={1} className="flex-1" />
    <Badge variant="secondary">{value}</Badge>
  </div>
);

const ScoreInput: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <Input type="number" min={0} max={10} value={value} onChange={(e) => onChange(parseInt(e.target.value || '0'))} />
);

const DecisionMatrixRenderer: React.FC = () => {
  const [phase, setPhase] = useState<'hook' | 'build' | 'preview' | 'celebrate'>('hook');
  const [audience, setAudience] = useState('Executive Director');
  const [tone, setTone] = useState('Professional and concise');
  const [format, setFormat] = useState('Email memo');
  const [criteria, setCriteria] = useState<string[]>(criteriaTemplates);
  const [weights, setWeights] = useState<number[]>(criteria.map(() => 5));
  const [programs, setPrograms] = useState<string[]>(programsTemplates);
  const [scores, setScores] = useState<number[][]>(programs.map(() => criteria.map(() => 5)));

  const totalScores = programs.map((_, pIdx) => {
    return criteria.reduce((sum, _c, cIdx) => sum + (scores[pIdx][cIdx] || 0) * (weights[cIdx] || 0), 0);
  });

  const bestIndex = totalScores.indexOf(Math.max(...totalScores));

  return (
    <main className="container mx-auto max-w-4xl p-4 space-y-6">
      <header className="flex items-center gap-3">
        <Scale className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Decision Matrix</h1>
      </header>

      {phase === 'hook' && (
        <Card className="p-6 nm-card">
          <p className="nm-text-secondary mb-4">Sofia needs to choose which story initiative to lead next. Help her pick the most impactful option using a weighted decision matrix.</p>
          <div className="flex justify-end">
            <Button onClick={() => setPhase('build')} className="flex items-center gap-2">
              <Play className="w-4 h-4" /> Start
            </Button>
          </div>
        </Card>
      )}

      {phase === 'build' && (
        <Card className="p-6 nm-card space-y-6">
          <Section title="1) Criteria" subtitle="Add or edit what matters. Weight each 0-10.">
            <div className="grid sm:grid-cols-2 gap-4">
              {criteria.map((c, i) => (
                <div key={i} className="space-y-2">
                  <Input value={c} onChange={(e) => setCriteria(criteria.map((v, idx) => (idx === i ? e.target.value : v)))} />
                  <WeightSlider value={weights[i]} onChange={(v) => setWeights(weights.map((w, idx) => (idx === i ? v : w)))} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => setCriteria([...criteria, 'New criterion'])}>Add criterion</Button>
              <Button variant="outline" onClick={() => setWeights([...weights, 5])}>Add weight</Button>
            </div>
          </Section>

          <Section title="2) Programs/Options" subtitle="Score each 0-10 for every criterion.">
            <div className="flex gap-2 mb-2">
              <Button variant="outline" onClick={() => {
                setPrograms([...programs, `Program ${String.fromCharCode(65 + programs.length)}`]);
                setScores([...scores, criteria.map(() => 5)]);
              }}>Add program</Button>
            </div>
            <div className="space-y-4">
              {programs.map((p, pIdx) => (
                <div key={pIdx} className="nm-card-subtle p-4 space-y-2">
                  <Input value={p} onChange={(e) => setPrograms(programs.map((v, i) => (i === pIdx ? e.target.value : v)))} />
                  <div className="grid sm:grid-cols-2 gap-3">
                    {criteria.map((c, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between gap-3">
                        <span className="text-sm nm-text-secondary truncate">{c}</span>
                        <ScoreInput value={scores[pIdx][cIdx] || 0} onChange={(v) => setScores(scores.map((row, ri) => (ri === pIdx ? row.map((sv, ci) => (ci === cIdx ? v : sv)) : row)))} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="3) Memo Options" subtitle="Who is this for and how should it read?">
            <div className="grid sm:grid-cols-3 gap-3">
              <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
              <Input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="Tone" />
              <Input value={format} onChange={(e) => setFormat(e.target.value)} placeholder="Format" />
            </div>
          </Section>

          <div className="flex justify-end">
            <Button onClick={() => setPhase('preview')}>Run Matrix</Button>
          </div>
        </Card>
      )}

      {phase === 'preview' && (
        <Card className="p-6 nm-card space-y-6">
          <Section title="Results" subtitle="Weighted totals per option.">
            <div className="grid sm:grid-cols-2 gap-3">
              {programs.map((p, i) => (
                <div key={i} className={`nm-card p-3 ${i === bestIndex ? 'ring-1 ring-primary' : ''}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p}</span>
                    <Badge>{totalScores[i]}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Justification Memo" subtitle={`${format} to ${audience} in a ${tone} tone.`}>
            <Textarea className="min-h-[160px]" defaultValue={`Decision: Proceed with ${programs[bestIndex]} (highest weighted score).\n\nRationale:\n- Criteria considered: ${criteria.join(', ')}\n- Weighting method: user-defined (0-10)\n- Notable strengths: [Fill in]\n- Risks/mitigations: [Fill in]\n\nNext Steps:\n- Confirm assumptions with stakeholders\n- Pilot and gather feedback\n- Prepare board update`} />
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
          <h3 className="text-lg font-semibold">Decision Matrix Completed</h3>
          <p className="nm-text-secondary">You created a weighted evaluation and a draft memo.</p>
        </Card>
      )}
    </main>
  );
};

export default DecisionMatrixRenderer;
