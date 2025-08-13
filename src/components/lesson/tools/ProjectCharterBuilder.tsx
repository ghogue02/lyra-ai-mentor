import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Play, Target, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { PromptPreviewBox } from '@/components/ui/PromptPreviewBox';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { InteractiveSelector, RatingGrid, ScenarioSelector } from '@/components/ui/InteractiveSelector';

type Phase = 'intro' | 'narrative' | 'workshop';

// Charter scenarios
const charterScenarios = [
  {
    id: 'donor-campaign',
    name: 'Major Donor Campaign',
    description: 'Launch a targeted campaign to engage high-value donors and foundations for a specific cause or program.',
    data: {
      goals: ['increase-donations', 'expand-reach', 'build-relationships'],
      kpis: ['fundraising-total', 'donor-retention', 'engagement-rate'],
      roles: ['campaign-manager', 'donor-relations', 'communications'],
      risks: ['economic-downturn', 'donor-fatigue', 'competition']
    }
  },
  {
    id: 'community-event',
    name: 'Community Impact Event',
    description: 'Organize a large-scale community event to raise awareness, funds, and strengthen local partnerships.',
    data: {
      goals: ['raise-awareness', 'build-community', 'generate-funds'],
      kpis: ['attendance', 'media-coverage', 'fundraising-total'],
      roles: ['event-manager', 'volunteer-coordinator', 'marketing'],
      risks: ['weather', 'low-attendance', 'budget-overrun']
    }
  }
];

// Goal options
const goalOptions = [
  { id: 'increase-donations', label: 'Increase Donations', description: 'Grow fundraising revenue and donor base' },
  { id: 'raise-awareness', label: 'Raise Awareness', description: 'Increase public understanding of our cause' },
  { id: 'expand-reach', label: 'Expand Reach', description: 'Grow audience and community engagement' },
  { id: 'build-relationships', label: 'Build Relationships', description: 'Strengthen partnerships and networks' }
];

// KPI options
const kpiOptions = [
  { id: 'fundraising-total', label: 'Fundraising Total', description: 'Total dollars raised through the initiative' },
  { id: 'donor-retention', label: 'Donor Retention Rate', description: 'Percentage of donors who give again' },
  { id: 'engagement-rate', label: 'Engagement Rate', description: 'Social media and event participation metrics' },
  { id: 'attendance', label: 'Event Attendance', description: 'Number of participants at events and activities' }
];

// Role options  
const roleOptions = [
  { id: 'campaign-manager', label: 'Campaign Manager', description: 'Overall project leadership and coordination' },
  { id: 'donor-relations', label: 'Donor Relations Specialist', description: 'Donor outreach and relationship management' },
  { id: 'communications', label: 'Communications Lead', description: 'Marketing, PR, and content strategy' },
  { id: 'event-manager', label: 'Event Manager', description: 'Event planning and execution' }
];

// Risk options
const riskOptions = [
  { id: 'economic-downturn', label: 'Economic Downturn', description: 'Economic conditions affecting donations' },
  { id: 'donor-fatigue', label: 'Donor Fatigue', description: 'Reduced donor responsiveness to appeals' },
  { id: 'competition', label: 'Competition', description: 'Other organizations competing for same donors' },
  { id: 'weather', label: 'Weather Issues', description: 'Poor weather affecting outdoor events' }
];

const ProjectCharterBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [goalPriorities, setGoalPriorities] = useState<{ [key: string]: number }>({});
  const [riskSeverity, setRiskSeverity] = useState<{ [key: string]: number }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');

  const promptPreview = useMemo(() => {
    const goalsSummary = selectedGoals.length > 0 
      ? selectedGoals.map(id => {
          const goal = goalOptions.find(g => g.id === id);
          const priority = goalPriorities[id] || 5;
          return `${goal?.label} (priority: ${priority}/10)`;
        }).join(', ')
      : 'Goals pending';
    
    const kpisSummary = selectedKpis.length > 0 
      ? selectedKpis.map(id => kpiOptions.find(k => k.id === id)?.label).join(', ')
      : 'KPIs pending';
    
    const rolesSummary = selectedRoles.length > 0 
      ? selectedRoles.map(id => roleOptions.find(r => r.id === id)?.label).join(', ')
      : 'Roles pending';

    return `Create a comprehensive project charter for: ${projectName || '[Project Name]'}

PROJECT GOALS: ${goalsSummary}
KEY PERFORMANCE INDICATORS: ${kpisSummary}  
TEAM ROLES & RESPONSIBILITIES: ${rolesSummary}

Generate a professional project charter that ensures team alignment and sets clear expectations for project success.`;
  }, [projectName, selectedGoals, selectedKpis, selectedRoles, goalPriorities]);

  const runAI = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'document',
          topic: 'Project charter draft',
          context: promptPreview
        }
      });
      if (error) throw error;
      setAiContent(data.content || '');
      toast({ title: 'Charter ready', description: 'Review the draft below.' });
    } catch (e) {
      toast({ title: 'Generation failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    toast({ title: 'Charter Complete!', description: 'Project charter ready for stakeholder review.' });
    navigate('/chapter/3');
  };

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
                  <h1 className="text-3xl font-bold">Project Charter Builder</h1>
                  <p className="nm-text-secondary mt-2">Turn project chaos into stakeholder clarity. Create a collaborative charter that gets everyone aligned on goals, roles, and success metrics from day one.</p>
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
          <div className="container mx-auto max-w-2xl pt-20 space-y-8">
            <div className="mb-4"><Progress value={progress} className="h-2" /></div>

            <Card>
              <CardContent className="p-8 space-y-8">
                
                {/* Step 0: Scenario Selection */}
                {currentStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ScenarioSelector
                      title="Choose Your Charter Type"
                      scenarios={charterScenarios}
                      onSelect={(scenario) => {
                        setProjectName(scenario.name);
                        setSelectedGoals(scenario.data.goals);
                        setSelectedKpis(scenario.data.kpis);
                        setSelectedRoles(scenario.data.roles);
                        setSelectedRisks(scenario.data.risks);
                        setCurrentStep(1);
                      }}
                    />
                    <PromptPreviewBox
                      prompt={promptPreview}
                      isGenerating={isGenerating}
                      onGenerate={runAI}
                      generateButtonText="Generate Charter"
                      title="AI Prompt Preview"
                    />
                  </motion.div>
                )}

                {/* Step 1: Charter Summary */}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="space-y-6">
                      <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Charter Summary</h2>
                        <p className="text-muted-foreground">Review your project charter configuration</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Project Name</label>
                        <input
                          type="text"
                          placeholder="Enter your project name"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6">
                          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-primary" />
                            Goals & KPIs
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2">Goals ({selectedGoals.length})</div>
                              <div className="text-xs text-muted-foreground">
                                {selectedGoals.map(id => goalOptions.find(g => g.id === id)?.label).join(', ')}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">KPIs ({selectedKpis.length})</div>
                              <div className="text-xs text-muted-foreground">
                                {selectedKpis.map(id => kpiOptions.find(k => k.id === id)?.label).join(', ')}
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6">
                          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-secondary" />
                            Team & Risks
                          </h3>
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2">Roles ({selectedRoles.length})</div>
                              <div className="text-xs text-muted-foreground">
                                {selectedRoles.map(id => roleOptions.find(r => r.id === id)?.label).join(', ')}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">Risks ({selectedRisks.length})</div>
                              <div className="text-xs text-muted-foreground">
                                {selectedRisks.map(id => riskOptions.find(r => r.id === id)?.label).join(', ')}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>

                      <PromptPreviewBox
                        prompt={promptPreview}
                        isGenerating={isGenerating}
                        onGenerate={runAI}
                        generateButtonText="Generate Charter"
                        title="AI Prompt Preview"
                      />

                      {aiContent && (
                        <AIContentDisplay content={aiContent} />
                      )}

                      {aiContent && (
                        <Button onClick={handleComplete} className="w-full" size="lg">
                          Mark Complete
                        </Button>
                      )}
                    </div>
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

export default ProjectCharterBuilder;