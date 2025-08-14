import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Users, Play, CheckCircle2, Target, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MicroLessonNavigator } from '@/components/navigation/MicroLessonNavigator';
import { useToast } from '@/hooks/use-toast';
import NarrativeManager from '@/components/lesson/chat/lyra/maya/NarrativeManager';
import { supabase } from '@/integrations/supabase/client';
import { PromptPreviewBox } from '@/components/ui/PromptPreviewBox';
import { AIContentDisplay } from '@/components/ui/AIContentDisplay';
import { InteractiveSelector, ScenarioSelector } from '@/components/ui/InteractiveSelector';

type Phase = 'intro' | 'narrative' | 'workshop';

interface TeamMember { 
  id: string;
  name: string; 
  role: string; 
  hoursPerWeek: number; 
  currentTasks: string[];
}

interface Requirement {
  id: string;
  category: string;
  hours: number;
}

interface ProjectScenario {
  id: string;
  name: string;
  description: string;
  data: {
    requirements: Requirement[];
    suggestedTeam: Omit<TeamMember, 'id'>[];
  };
}

const TeamCapacityCalculator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<ProjectScenario | null>(null);

  const projectScenarios: ProjectScenario[] = [
    {
      id: 'campaign-launch',
      name: 'Major Campaign Launch',
      description: 'Multi-channel advocacy campaign promoting new policy initiative across digital and traditional media channels',
      data: {
        requirements: [
          { id: '1', category: 'Content Creation', hours: 40 },
          { id: '2', category: 'Design Work', hours: 20 },
          { id: '3', category: 'Review & Approval', hours: 10 },
          { id: '4', category: 'Coordination', hours: 15 }
        ],
        suggestedTeam: [
          { name: 'Sofia', role: 'Communications Lead', hoursPerWeek: 25, currentTasks: ['Newsletter', 'Social media'] },
          { name: 'Alex', role: 'Content Writer', hoursPerWeek: 20, currentTasks: ['Blog posts'] }
        ]
      }
    },
    {
      id: 'event-planning',
      name: 'Annual Fundraising Gala', 
      description: 'Large-scale 300-person fundraising event with venue coordination, catering, entertainment, donor relations, and volunteer management',
      data: {
        requirements: [
          { id: '1', category: 'Event Logistics', hours: 30 },
          { id: '2', category: 'Marketing Materials', hours: 15 },
          { id: '3', category: 'Stakeholder Coordination', hours: 25 },
          { id: '4', category: 'Content Creation', hours: 20 }
        ],
        suggestedTeam: [
          { name: 'Jordan', role: 'Event Manager', hoursPerWeek: 30, currentTasks: ['Vendor coordination'] },
          { name: 'Sam', role: 'Marketing Specialist', hoursPerWeek: 20, currentTasks: ['Social campaigns'] }
        ]
      }
    },
    {
      id: 'content-sprint',
      name: 'Annual Report Production',
      description: 'Comprehensive annual report including data analysis, impact stories, financial reporting, design, and multi-format distribution',
      data: {
        requirements: [
          { id: '1', category: 'Writing & Research', hours: 50 },
          { id: '2', category: 'Design & Graphics', hours: 20 },
          { id: '3', category: 'Video Production', hours: 15 },
          { id: '4', category: 'Editing & Review', hours: 10 }
        ],
        suggestedTeam: [
          { name: 'Maya', role: 'Content Lead', hoursPerWeek: 25, currentTasks: ['Editorial calendar'] },
          { name: 'Riley', role: 'Designer', hoursPerWeek: 15, currentTasks: ['Brand materials'] }
        ]
      }
    }
  ];

  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', category: 'Content Creation', hours: 40 },
    { id: '2', category: 'Design Work', hours: 20 }
  ]);

  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Sofia', role: 'Communications Lead', hoursPerWeek: 20, currentTasks: ['Newsletter', 'Social media'] },
    { id: '2', name: 'Jamie', role: 'Designer', hoursPerWeek: 15, currentTasks: ['Event materials'] }
  ]);

  const hourPresets = [
    { id: 'light', label: 'Light', description: '10 hours', value: 10 },
    { id: 'medium', label: 'Medium', description: '25 hours', value: 25 },
    { id: 'heavy', label: 'Heavy', description: '40 hours', value: 40 },
    { id: 'intensive', label: 'Intensive', description: '60 hours', value: 60 }
  ];

  const capacityPresets = [
    { id: 'part-time', label: 'Part-time', description: '10h/week', value: 10 },
    { id: 'standard', label: 'Standard', description: '20h/week', value: 20 },
    { id: 'full-time', label: 'Full-time', description: '35h/week', value: 35 }
  ];

  const rolePresets = [
    { id: 'comms-lead', label: 'Communications Lead', description: 'Strategy, messaging, stakeholder relations', value: 25 },
    { id: 'content-writer', label: 'Content Writer', description: 'Articles, blogs, social content', value: 20 },
    { id: 'designer', label: 'Visual Designer', description: 'Graphics, layouts, brand materials', value: 15 },
    { id: 'project-manager', label: 'Project Manager', description: 'Coordination, timelines, oversight', value: 25 },
    { id: 'data-analyst', label: 'Data Analyst', description: 'Research, metrics, insights', value: 10 },
    { id: 'event-coordinator', label: 'Event Coordinator', description: 'Logistics, vendors, execution', value: 30 }
  ];

  const taskPresets = [
    'Newsletter management', 'Social media', 'Website updates', 'Event planning', 
    'Grant writing', 'Donor communications', 'Volunteer coordination', 'Media relations',
    'Program evaluation', 'Community outreach', 'Partnership development', 'Fundraising'
  ];

  const available = useMemo(() => team.reduce((s, m) => s + m.hoursPerWeek, 0), [team]);
  const reqHours = useMemo(() => requirements.reduce((s, r) => s + r.hours, 0), [requirements]);
  const utilizationRate = available > 0 ? (reqHours / available) * 100 : 0;
  
  const riskLevel = utilizationRate > 90 ? 'high' : utilizationRate > 70 ? 'medium' : 'low';
  const recommendation = useMemo(() => {
    if (utilizationRate <= 70) return 'Green light - healthy capacity buffer';
    if (utilizationRate <= 90) return 'Proceed with caution - monitor closely';
    return 'High risk - reduce scope or add resources';
  }, [utilizationRate]);

  const promptPreview = `Analyze team capacity for nonprofit project:

CAPACITY OVERVIEW:
- Available weekly hours: ${available}
- Required total hours: ${reqHours}
- Utilization rate: ${utilizationRate.toFixed(1)}%
- Risk level: ${riskLevel}

TEAM COMPOSITION:
${team.map(t => `• ${t.name} (${t.role}): ${t.hoursPerWeek}h/week - Current: ${t.currentTasks.join(', ')}`).join('\n')}

REQUIREMENTS BREAKDOWN:
${requirements.map(r => `• ${r.category}: ${r.hours} hours`).join('\n')}

Provide a concise feasibility assessment with specific recommendations for timeline, scope adjustments, or resource needs.`;

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiContent, setAiContent] = useState<string>('');

  const narrativeMessages = [
    { id: '1', content: 'Before I pitch a new story sprint, I sanity-check our capacity.', emotion: 'thoughtful' as const, showAvatar: true },
    { id: '2', content: 'A quick tally of weekly bandwidth avoids painful mid-sprint surprises.', emotion: 'confident' as const },
    { id: '3', content: 'I turn findings into a clear go/no-go note for stakeholders.', emotion: 'empowered' as const },
  ];

  const progress = useMemo(() => {
    let baseProgress = phase === 'intro' ? 0 : phase === 'narrative' ? 33 : 66;
    if (phase === 'workshop') {
      const hasScenario = selectedScenario ? 8 : 0;
      const hasRequirements = requirements.length > 0 ? 8 : 0;
      const hasTeam = team.length > 0 ? 8 : 0;
      const hasGenerated = aiContent ? 10 : 0;
      baseProgress += hasScenario + hasRequirements + hasTeam + hasGenerated;
    }
    return Math.min(100, baseProgress);
  }, [phase, selectedScenario, requirements, team, aiContent]);

  const runAI = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-character-content', {
        body: {
          characterType: 'sofia',
          contentType: 'article',
          topic: 'Team capacity and feasibility summary',
          context: `Use this context to produce a concise feasibility note.\n${promptPreview}`
        }
      });
      
      if (error) throw error;
      
      // Check for success response format
      if (data && data.success && data.content) {
        setAiContent(data.content);
        toast({ title: 'AI analysis ready', description: 'Review the capacity assessment below.' });
      } else {
        throw new Error(data?.error || 'Failed to generate analysis');
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An error occurred';
      console.error('AI generation error:', e);
      toast({ 
        title: 'Generation failed', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScenarioSelect = (scenario: ProjectScenario) => {
    setSelectedScenario(scenario);
    setRequirements(scenario.data.requirements);
    setTeam(scenario.data.suggestedTeam.map((member, index) => ({
      ...member,
      id: `${Date.now()}-${index}`,
      currentTasks: member.currentTasks || []
    })));
    setCurrentStep(1);
  };

  const updateRequirement = (id: string, hours: number) => {
    setRequirements(reqs => reqs.map(r => r.id === id ? { ...r, hours } : r));
  };

  const addTeamMember = (roleId: string) => {
    const preset = rolePresets.find(r => r.id === roleId);
    if (preset) {
      const newMember: TeamMember = {
        id: `${Date.now()}`,
        name: 'New Team Member',
        role: preset.label,
        hoursPerWeek: preset.value || 20,
        currentTasks: []
      };
      setTeam(prev => [...prev, newMember]);
    }
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setTeam(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const addTaskToMember = (memberId: string, task: string) => {
    setTeam(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, currentTasks: [...member.currentTasks, task] }
        : member
    ));
  };

  const removeTaskFromMember = (memberId: string, taskIndex: number) => {
    setTeam(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, currentTasks: member.currentTasks.filter((_, i) => i !== taskIndex) }
        : member
    ));
  };

  const handleComplete = () => {
    toast({ title: 'Capacity Analysis Complete!', description: 'Team capacity validated successfully.' });
    navigate('/chapter/3');
  };

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
                  <p className="nm-text-secondary mt-2">Transform capacity chaos into clear go/no-go decisions. Calculate realistic team bandwidth and identify risks before they derail your storytelling sprint.</p>
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
            <div className="mb-6">
              <Progress value={progress} className="h-2" />
              <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of 4</span>
                <span>{progress}% Complete</span>
              </div>
            </div>

            {currentStep === 0 && (
              <ScenarioSelector
                title="Choose Your Project Type"
                scenarios={projectScenarios}
                onSelect={handleScenarioSelect}
                className="max-w-4xl mx-auto"
              />
            )}

            {currentStep >= 1 && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Project Summary */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-primary">{selectedScenario?.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedScenario?.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Total Project Scope
                          </h4>
                          <div className="text-2xl font-bold text-primary">
                            {reqHours} hours
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Estimated time to complete all requirements
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                            Key Requirements
                          </h4>
                          <div className="space-y-1">
                            {requirements.slice(0, 3).map((req) => (
                              <div key={req.id} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{req.category}</span>
                                <span className="font-medium">{req.hours}h</span>
                              </div>
                            ))}
                            {requirements.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{requirements.length - 3} more categories
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requirements Section */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <CardTitle>Project Requirements</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Total hours needed for the entire project
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {requirements.map((req) => (
                          <div key={req.id} className="space-y-3 p-4 rounded-lg nm-card-subtle border border-dashed border-primary/20">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <span className="font-medium">{req.category}</span>
                                <div className="text-xs text-muted-foreground">
                                  {req.category === 'Content Creation' && 'Blog posts, social media content, press releases, web copy, email campaigns'}
                                  {req.category === 'Design Work' && 'Graphics, layouts, infographics, social media visuals, print materials'}
                                  {req.category === 'Review & Approval' && 'Stakeholder review cycles, legal compliance, brand consistency checks'}
                                  {req.category === 'Coordination' && 'Team meetings, vendor communication, timeline management, status updates'}
                                  {req.category === 'Event Logistics' && 'Venue booking, catering, A/V setup, transportation, vendor coordination'}
                                  {req.category === 'Marketing Materials' && 'Invitations, promotional flyers, social media graphics, website updates'}
                                  {req.category === 'Stakeholder Coordination' && 'Donor outreach, board communications, sponsor relations, VIP management'}
                                  {req.category === 'Writing & Research' && 'Impact stories, financial analysis, program summaries, data collection'}
                                  {req.category === 'Design & Graphics' && 'Layout design, charts, infographics, photo editing, print preparation'}
                                  {req.category === 'Video Production' && 'Filming interviews, editing footage, motion graphics, audio production'}
                                  {req.category === 'Editing & Review' && 'Copy editing, fact-checking, stakeholder approval, final proofreading'}
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {req.hours}h total
                              </Badge>
                            </div>
                            
                            {/* Hour Preset Buttons */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Project scope presets
                              </label>
                              <div className="flex gap-2">
                                {hourPresets.map((preset) => (
                                  <Button
                                    key={preset.id}
                                    variant={req.hours === preset.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => updateRequirement(req.id, preset.value)}
                                    className="flex-1"
                                  >
                                    {preset.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            
                            {/* Fine-tune Slider */}
                            <div className="space-y-2">
                              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Fine-tune hours
                              </label>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>0h</span>
                                <span>80h</span>
                              </div>
                              <Slider
                                value={[req.hours]}
                                onValueChange={([value]) => updateRequirement(req.id, value)}
                                max={80}
                                min={0}
                                step={5}
                                className="w-full"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {currentStep === 1 && (
                          <div className="pt-4 border-t">
                            <Button onClick={() => setCurrentStep(2)} className="w-full">
                              Continue to Team Setup
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                   {/* Team Section */}
                  {currentStep >= 2 && (
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          <CardTitle>Build Your Team</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            Set weekly availability for each team member
                          </p>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Add Team Member Button */}
                          <InteractiveSelector
                            title="Quick Add Team Members"
                            options={rolePresets}
                            selectedIds={[]}
                            onSelect={addTeamMember}
                            variant="list"
                          />

                          {/* Team Members */}
                          <div className="space-y-4">
                            {team.map((member) => (
                              <div key={member.id} className="p-4 rounded-lg nm-card-subtle border border-dashed border-secondary/30 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <div className="space-y-1">
                                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                        Team member name
                                      </label>
                                      <input
                                        value={member.name}
                                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                                        className="w-full px-3 py-2 text-lg font-medium bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                        placeholder="Enter team member name"
                                      />
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">{member.role}</div>
                                  </div>
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setTeam(prev => prev.filter(m => m.id !== member.id))}
                                      className="text-muted-foreground hover:text-destructive"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {/* Capacity Presets */}
                                <div className="space-y-3">
                                  <div className="space-y-1">
                                    <label className="text-sm font-medium text-foreground">Weekly Availability</label>
                                    <p className="text-xs text-muted-foreground">
                                      How many hours per week can this person work on your project?
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    {capacityPresets.map((preset) => (
                                      <Button
                                        key={preset.id}
                                        variant={member.hoursPerWeek === preset.value ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => updateTeamMember(member.id, 'hoursPerWeek', preset.value)}
                                        className="flex-1"
                                      >
                                        {preset.label}
                                      </Button>
                                    ))}
                                  </div>
                                  
                                  {/* Fine-tune Slider */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                      Fine-tune hours
                                    </label>
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                      <span>5h</span>
                                      <span>40h</span>
                                    </div>
                                    <Slider
                                      value={[member.hoursPerWeek]}
                                      onValueChange={([value]) => updateTeamMember(member.id, 'hoursPerWeek', value)}
                                      max={40}
                                      min={5}
                                      step={1}
                                      className="w-full"
                                    />
                                  </div>
                                </div>

                                {/* Current Tasks */}
                                <div className="space-y-2">
                                  <span className="text-sm font-medium">Current Tasks</span>
                                  <div className="flex flex-wrap gap-2">
                                    {member.currentTasks.map((task, index) => (
                                      <Badge 
                                        key={index} 
                                        variant="outline" 
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => removeTaskFromMember(member.id, index)}
                                      >
                                        {task} <X className="w-3 h-3 ml-1" />
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  {/* Task Presets */}
                                  <div className="flex flex-wrap gap-1">
                                    {taskPresets.slice(0, 6).map((task) => (
                                      <Button
                                        key={task}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => !member.currentTasks.includes(task) && addTaskToMember(member.id, task)}
                                        className="text-xs h-6 px-2"
                                        disabled={member.currentTasks.includes(task)}
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {task}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {currentStep === 2 && (
                            <div className="pt-4 border-t">
                              <Button onClick={() => setCurrentStep(3)} className="w-full">
                                Generate Analysis
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar with Dynamic Prompt Preview */}
                <div className="space-y-6">
                  {/* Capacity Overview Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Capacity Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm p-2 rounded-md bg-secondary/10">
                          <span className="text-muted-foreground">Team Weekly Capacity</span>
                          <span className="font-medium text-secondary-foreground">{available}h/week available</span>
                        </div>
                        <div className="flex justify-between text-sm p-2 rounded-md bg-primary/10">
                          <span className="text-muted-foreground">Project Requirements</span>
                          <span className="font-medium text-primary">{reqHours}h total needed</span>
                        </div>
                        <div className="flex justify-between text-sm p-2 rounded-md bg-muted/50">
                          <span className="text-muted-foreground">Capacity Utilization</span>
                          <span className={`font-medium ${riskLevel === 'high' ? 'text-destructive' : riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {utilizationRate.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <Progress value={Math.min(utilizationRate, 100)} className="h-3" />
                      
                      <div className={`p-3 rounded-lg text-sm ${riskLevel === 'high' ? 'bg-destructive/10 text-destructive' : riskLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-medium capitalize">{riskLevel} Risk</span>
                        </div>
                        <p className="mt-1">{recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Dynamic Prompt Preview */}
                  {currentStep >= 1 && (
                    <PromptPreviewBox
                      prompt={promptPreview}
                      isGenerating={isGenerating}
                      onGenerate={runAI}
                      generateButtonText="Generate Capacity Analysis"
                      title="AI Analysis Prompt"
                    />
                  )}

                  {/* AI Analysis Results */}
                  {aiContent && (
                    <Card className="border-primary/20">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <CardTitle>Capacity Analysis Results</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Visual Capacity Metrics */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${
                                riskLevel === 'high' ? 'text-destructive' : 
                                riskLevel === 'medium' ? 'text-warning' : 'text-success'
                              }`}>
                                {utilizationRate.toFixed(1)}%
                              </div>
                              <p className="text-sm text-muted-foreground">Team Utilization</p>
                            </div>
                            <div className="text-center">
                              <div className={`text-2xl font-bold ${
                                riskLevel === 'high' ? 'text-destructive' : 
                                riskLevel === 'medium' ? 'text-warning' : 'text-success'
                              }`}>
                                {riskLevel.toUpperCase()}
                              </div>
                              <p className="text-sm text-muted-foreground">Risk Level</p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Capacity Usage</span>
                              <span>{reqHours}h / {available}h weekly</span>
                            </div>
                            <Progress 
                              value={Math.min(utilizationRate, 100)} 
                              className="h-3"
                              data-level={riskLevel}
                            />
                            <p className="text-xs text-muted-foreground">{recommendation}</p>
                          </div>

                          {/* AI Analysis Content */}
                          <div className="space-y-4">
                            <h4 className="font-medium text-primary">Sofia's Assessment:</h4>
                            <AIContentDisplay content={aiContent} />
                          </div>
                          
                          <div className="pt-4 border-t">
                            <Button onClick={handleComplete} className="w-full">
                              Complete Analysis
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TeamCapacityCalculator;