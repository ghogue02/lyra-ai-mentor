import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Target, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import { ToolIntroduction } from '@/components/ui/ToolIntroduction';
import { StepGuidance } from '@/components/ui/StepGuidance';
import { StepNavigation } from '@/components/ui/StepNavigation';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LoadingOverlay } from '@/components/ui/LoadingState';
import { PromptPreviewBox } from '@/components/ui/PromptPreviewBox';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { InteractiveSelector, RatingGrid, ScenarioSelector } from '@/components/ui/InteractiveSelector';

type Phase = 'intro' | 'workshop' | 'celebration';

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
  },
  {
    id: 'program-expansion',
    name: 'Program Expansion Initiative',
    description: 'Scale existing programs to new communities or demographics while maintaining quality and impact.',
    data: {
      goals: ['expand-reach', 'maintain-quality', 'increase-impact'],
      kpis: ['beneficiaries-served', 'program-quality', 'cost-per-beneficiary'],
      roles: ['program-director', 'operations-manager', 'evaluation-specialist'],
      risks: ['resource-shortage', 'quality-dilution', 'community-resistance']
    }
  }
];

// Goal options
const goalOptions = [
  { id: 'increase-donations', label: 'Increase Donations', description: 'Grow fundraising revenue and donor base' },
  { id: 'raise-awareness', label: 'Raise Awareness', description: 'Increase public understanding of our cause' },
  { id: 'expand-reach', label: 'Expand Reach', description: 'Grow audience and community engagement' },
  { id: 'build-relationships', label: 'Build Relationships', description: 'Strengthen partnerships and networks' },
  { id: 'build-community', label: 'Build Community', description: 'Foster stronger local connections' },
  { id: 'generate-funds', label: 'Generate Funds', description: 'Create sustainable revenue streams' },
  { id: 'maintain-quality', label: 'Maintain Quality', description: 'Ensure consistent service standards' },
  { id: 'increase-impact', label: 'Increase Impact', description: 'Maximize positive outcomes for beneficiaries' }
];

// KPI options
const kpiOptions = [
  { id: 'fundraising-total', label: 'Fundraising Total', description: 'Total dollars raised through the initiative' },
  { id: 'donor-retention', label: 'Donor Retention Rate', description: 'Percentage of donors who give again' },
  { id: 'engagement-rate', label: 'Engagement Rate', description: 'Social media and event participation metrics' },
  { id: 'attendance', label: 'Event Attendance', description: 'Number of participants at events and activities' },
  { id: 'media-coverage', label: 'Media Coverage', description: 'Press mentions and media reach' },
  { id: 'beneficiaries-served', label: 'Beneficiaries Served', description: 'Number of people directly helped' },
  { id: 'program-quality', label: 'Program Quality Score', description: 'Quality assessment metrics' },
  { id: 'cost-per-beneficiary', label: 'Cost Per Beneficiary', description: 'Efficiency in resource utilization' }
];

// Role options  
const roleOptions = [
  { id: 'campaign-manager', label: 'Campaign Manager', description: 'Overall project leadership and coordination' },
  { id: 'donor-relations', label: 'Donor Relations Specialist', description: 'Donor outreach and relationship management' },
  { id: 'communications', label: 'Communications Lead', description: 'Marketing, PR, and content strategy' },
  { id: 'event-manager', label: 'Event Manager', description: 'Event planning and execution' },
  { id: 'volunteer-coordinator', label: 'Volunteer Coordinator', description: 'Volunteer recruitment and management' },
  { id: 'marketing', label: 'Marketing Specialist', description: 'Brand promotion and audience engagement' },
  { id: 'program-director', label: 'Program Director', description: 'Program oversight and strategic direction' },
  { id: 'operations-manager', label: 'Operations Manager', description: 'Day-to-day operational coordination' },
  { id: 'evaluation-specialist', label: 'Evaluation Specialist', description: 'Impact measurement and assessment' }
];

// Risk options
const riskOptions = [
  { id: 'economic-downturn', label: 'Economic Downturn', description: 'Economic conditions affecting donations' },
  { id: 'donor-fatigue', label: 'Donor Fatigue', description: 'Reduced donor responsiveness to appeals' },
  { id: 'competition', label: 'Competition', description: 'Other organizations competing for same donors' },
  { id: 'weather', label: 'Weather Issues', description: 'Poor weather affecting outdoor events' },
  { id: 'low-attendance', label: 'Low Attendance', description: 'Fewer participants than expected' },
  { id: 'budget-overrun', label: 'Budget Overrun', description: 'Costs exceeding planned budget' },
  { id: 'resource-shortage', label: 'Resource Shortage', description: 'Insufficient staff or materials' },
  { id: 'quality-dilution', label: 'Quality Dilution', description: 'Service quality decline during expansion' },
  { id: 'community-resistance', label: 'Community Resistance', description: 'Local opposition to new programs' }
];

const ProjectCharterBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedRisks, setSelectedRisks] = useState<string[]>([]);
  const [goalPriorities, setGoalPriorities] = useState<{ [key: string]: number }>({});
  const [riskSeverity, setRiskSeverity] = useState<{ [key: string]: number }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < 4;
  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return selectedScenario && projectName;
      case 2: return selectedGoals.length > 0 && Object.keys(goalPriorities).length > 0;
      case 3: return selectedRoles.length > 0 && selectedRisks.length > 0;
      case 4: return aiContent;
      default: return false;
    }
  };

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

    const risksSummary = selectedRisks.length > 0
      ? selectedRisks.map(id => {
          const risk = riskOptions.find(r => r.id === id);
          const severity = riskSeverity[id] || 5;
          return `${risk?.label} (severity: ${severity}/10)`;
        }).join(', ')
      : 'Risks pending';

    return `Create a comprehensive project charter for: ${projectName || '[Project Name]'}

PROJECT GOALS & PRIORITIES: ${goalsSummary}
KEY PERFORMANCE INDICATORS: ${kpisSummary}  
TEAM ROLES & RESPONSIBILITIES: ${rolesSummary}
RISK ASSESSMENT: ${risksSummary}

Generate a professional project charter that ensures team alignment, sets clear expectations, and includes actionable next steps for project success. Structure it with executive summary, objectives, scope, stakeholder roles, success metrics, risk mitigation strategies, and timeline milestones.`;
  }, [projectName, selectedGoals, selectedKpis, selectedRoles, selectedRisks, goalPriorities, riskSeverity]);

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

  const handleNext = () => {
    if (canGoNext && isStepComplete()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoBack) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setPhase('celebration');
    toast({ title: 'Charter Complete!', description: 'Project charter ready for stakeholder review.' });
  };

  const handleScenarioSelect = (scenario: any) => {
    setSelectedScenario(scenario.id);
    setProjectName(scenario.name);
    setSelectedGoals(scenario.data.goals);
    setSelectedKpis(scenario.data.kpis);
    setSelectedRoles(scenario.data.roles);
    setSelectedRisks(scenario.data.risks);
    
    // Set default priorities and severities
    const defaultPriorities: { [key: string]: number } = {};
    scenario.data.goals.forEach((id: string, index: number) => {
      defaultPriorities[id] = 8 - index; // Decreasing priority
    });
    setGoalPriorities(defaultPriorities);

    const defaultSeverities: { [key: string]: number } = {};
    scenario.data.risks.forEach((id: string) => {
      defaultSeverities[id] = 5; // Medium severity default
    });
    setRiskSeverity(defaultSeverities);
  };

  const getStepType = () => {
    switch (currentStep) {
      case 1: return 'setup';
      case 2: return 'weighting';
      case 3: return 'scoring';
      case 4: return 'analysis';
      default: return 'setup';
    }
  };

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6 flex items-center">
            <div className="container mx-auto max-w-6xl">
              <ToolIntroduction
                toolName="Project Charter Builder"
                description="Transform project chaos into stakeholder clarity. Create a comprehensive charter that aligns your team on goals, roles, and success metrics from day one."
                whatIsIt="A project charter is a foundational document that formally authorizes a project and provides the project manager with the authority to apply resources to project activities. It serves as a contract between the project team and stakeholders."
                whyUseful={[
                  "Reduces project planning time from 4 hours to 45 minutes",
                  "Ensures all stakeholders understand project scope and objectives",
                  "Provides clear accountability with defined roles and responsibilities",
                  "Establishes success metrics and risk mitigation strategies upfront",
                  "Creates a reference document that prevents scope creep"
                ]}
                howItWorks={[
                  "Choose your project scenario and customize the details",
                  "Define goals with priority ratings and select key performance indicators",
                  "Configure team roles and assess potential project risks",
                  "Generate a professional charter with AI-powered content and review"
                ]}
                iconType="decision-matrix"
                characterName="Sofia"
                onBegin={() => setPhase('workshop')}
              />
            </div>
          </motion.div>
        )}

        {phase === 'workshop' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6">
            <MicroLessonNavigator 
              chapterNumber={3} 
              chapterTitle="Sofia's Storytelling Mastery" 
              lessonTitle="Project Charter Builder" 
              characterName="Sofia" 
              progress={20 + (currentStep * 20)} 
            />
            
            <div className="container mx-auto max-w-4xl pt-20 space-y-6">
              <LoadingOverlay isLoading={isGenerating} message="Generating your project charter...">
                
                <StepGuidance
                  title={`Step ${currentStep}: ${
                    currentStep === 1 ? 'Choose Project Type' :
                    currentStep === 2 ? 'Define Goals & Priorities' :
                    currentStep === 3 ? 'Configure Team & Risks' :
                    'Generate & Review Charter'
                  }`}
                  description={
                    currentStep === 1 ? 'Select a project scenario and customize your project name to get started.' :
                    currentStep === 2 ? 'Set your project goals and rate their priority levels to focus your efforts.' :
                    currentStep === 3 ? 'Define team roles and assess potential risks with severity ratings.' :
                    'Review your charter configuration and generate the final document.'
                  }
                  tips={
                    currentStep === 1 ? [
                      "Choose the scenario that best matches your upcoming project",
                      "Customize the project name to reflect your specific initiative",
                      "The scenario will pre-populate recommended goals, KPIs, and roles"
                    ] :
                    currentStep === 2 ? [
                      "Rate goals from 1-10, with 10 being highest priority",
                      "Focus on 3-5 key goals to maintain clarity",
                      "Choose KPIs that directly measure your goal achievement"
                    ] :
                    currentStep === 3 ? [
                      "Include all essential roles for project success",
                      "Rate risks by severity and likelihood of occurrence",
                      "Consider both internal and external risk factors"
                    ] : [
                      "Review all inputs before generating the charter",
                      "The AI will create a comprehensive, stakeholder-ready document",
                      "Use the charter as your project's single source of truth"
                    ]
                  }
                  currentStep={currentStep}
                  totalSteps={4}
                  stepType={getStepType()}
                  characterName="Sofia"
                />

                <Card>
                  <CardContent className="p-8 space-y-8">
                    
                    {/* Step 1: Scenario Selection */}
                    {currentStep === 1 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ScenarioSelector
                          title="Choose Your Project Type"
                          scenarios={charterScenarios}
                          onSelect={handleScenarioSelect}
                        />
                        
                        {selectedScenario && (
                          <div className="mt-6 space-y-4">
                            <label className="text-sm font-medium">Customize Project Name</label>
                            <input
                              type="text"
                              placeholder="Enter your project name"
                              value={projectName}
                              onChange={(e) => setProjectName(e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 2: Goals & Priorities */}
                    {currentStep === 2 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Target className="w-6 h-6 text-primary" />
                            Goals & Priorities
                          </h2>
                          <p className="text-muted-foreground">Define what success looks like for your project</p>
                        </div>

                        <InteractiveSelector
                          title="Project Goals"
                          options={goalOptions}
                          selectedIds={selectedGoals}
                          onSelect={(id) => {
                            if (selectedGoals.includes(id)) {
                              setSelectedGoals(prev => prev.filter(gId => gId !== id));
                            } else if (selectedGoals.length < 5) {
                              setSelectedGoals(prev => [...prev, id]);
                            }
                          }}
                          multiSelect={true}
                        />

                        {selectedGoals.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Goal Priorities</h4>
                            {selectedGoals.map(id => {
                              const goal = goalOptions.find(g => g.id === id)!;
                              return (
                                <RatingGrid
                                  key={id}
                                  title={goal.label}
                                  value={goalPriorities[id] || 5}
                                  onChange={(value) => setGoalPriorities(prev => ({ ...prev, [id]: value }))}
                                  max={10}
                                  min={1}
                                />
                              );
                            })}
                          </div>
                        )}

                        <InteractiveSelector
                          title="Key Performance Indicators"
                          options={kpiOptions}
                          selectedIds={selectedKpis}
                          onSelect={(id) => {
                            if (selectedKpis.includes(id)) {
                              setSelectedKpis(prev => prev.filter(kId => kId !== id));
                            } else if (selectedKpis.length < 4) {
                              setSelectedKpis(prev => [...prev, id]);
                            }
                          }}
                          multiSelect={true}
                        />
                      </motion.div>
                    )}

                    {/* Step 3: Team & Risks */}
                    {currentStep === 3 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <Users className="w-6 h-6 text-secondary" />
                            Team Roles & Risk Assessment
                          </h2>
                          <p className="text-muted-foreground">Define who's responsible and what could go wrong</p>
                        </div>

                        <InteractiveSelector
                          title="Team Roles"
                          options={roleOptions}
                          selectedIds={selectedRoles}
                          onSelect={(id) => {
                            if (selectedRoles.includes(id)) {
                              setSelectedRoles(prev => prev.filter(rId => rId !== id));
                            } else if (selectedRoles.length < 6) {
                              setSelectedRoles(prev => [...prev, id]);
                            }
                          }}
                          multiSelect={true}
                        />

                        <InteractiveSelector
                          title="Potential Risks"
                          options={riskOptions}
                          selectedIds={selectedRisks}
                          onSelect={(id) => {
                            if (selectedRisks.includes(id)) {
                              setSelectedRisks(prev => prev.filter(rId => rId !== id));
                            } else if (selectedRisks.length < 5) {
                              setSelectedRisks(prev => [...prev, id]);
                            }
                          }}
                          multiSelect={true}
                        />

                        {selectedRisks.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Risk Severity Assessment</h4>
                            {selectedRisks.map(id => {
                              const risk = riskOptions.find(r => r.id === id)!;
                              return (
                                <RatingGrid
                                  key={id}
                                  title={risk.label}
                                  value={riskSeverity[id] || 5}
                                  onChange={(value) => setRiskSeverity(prev => ({ ...prev, [id]: value }))}
                                  max={10}
                                  min={1}
                                />
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Step 4: Generate & Review */}
                    {currentStep === 4 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="text-center space-y-2">
                          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                            <FileText className="w-6 h-6 text-accent" />
                            Generate & Review Charter
                          </h2>
                          <p className="text-muted-foreground">Create your professional project charter</p>
                        </div>

                        <PromptPreviewBox
                          prompt={promptPreview}
                          isGenerating={isGenerating}
                          onGenerate={runAI}
                          generateButtonText="Generate Charter"
                          title="Charter Configuration Summary"
                        />

                        {aiContent && (
                          <AIContentDisplay content={aiContent} />
                        )}

                        {aiContent && (
                          <div className="text-center">
                            <Button onClick={handleComplete} size="lg" className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              Complete Charter
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                <StepNavigation
                  currentStep={currentStep - 1}
                  totalSteps={4}
                  onPrevious={canGoBack ? handlePrevious : undefined}
                  onNext={canGoNext && isStepComplete() ? handleNext : undefined}
                  nextButtonDisabled={!isStepComplete()}
                  nextButtonText={currentStep === 4 ? "Review Complete" : "Continue"}
                />
              </LoadingOverlay>
            </div>
          </motion.div>
        )}

        {phase === 'celebration' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-purple-50 p-6 flex items-center">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-12 text-center space-y-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold">Charter Complete!</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Your project charter is ready for stakeholder review. Sofia's approach has helped you create a comprehensive document that ensures team alignment from day one.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-primary">3.75 hours</div>
                        <div className="text-sm text-muted-foreground">Time saved</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Target className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-secondary">{selectedGoals.length}</div>
                        <div className="text-sm text-muted-foreground">Prioritized goals</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Users className="w-8 h-8 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-accent">{selectedRoles.length}</div>
                        <div className="text-sm text-muted-foreground">Defined roles</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                        S
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-primary">Sofia's Success Tip</h4>
                        <p className="text-muted-foreground mt-1">
                          "Share this charter in your next team meeting. When everyone sees the same one-page document, alignment happens fast. The clear goals and roles eliminate confusion before it starts."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate('/chapter/3')} size="lg" variant="outline">
                      Back to Chapter 3
                    </Button>
                    <Button onClick={() => window.print()} size="lg">
                      Export Charter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default ProjectCharterBuilder;