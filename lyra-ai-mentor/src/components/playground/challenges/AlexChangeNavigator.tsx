import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Brain, 
  Target,
  Heart,
  Shield,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lightbulb,
  Layers,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  stance: 'champion' | 'supporter' | 'neutral' | 'skeptic' | 'resistant';
  concerns: string[];
  influence: number;
  icon: React.ReactNode;
}

interface ChangeScenario {
  id: string;
  title: string;
  context: string;
  challenge: string;
  stakeholders: Stakeholder[];
  goals: string[];
}

const scenarios: ChangeScenario[] = [
  {
    id: 'ai-adoption',
    title: 'Organization-Wide AI Adoption',
    context: 'Your nonprofit is ready to integrate AI tools across all departments.',
    challenge: 'Lead a transformation that addresses fears while building excitement for AI possibilities.',
    stakeholders: [
      {
        id: 'ed',
        name: 'Executive Director',
        role: 'Leadership',
        stance: 'supporter',
        concerns: ['Budget constraints', 'Board approval needed'],
        influence: 90,
        icon: <Building className="w-4 h-4" />
      },
      {
        id: 'it',
        name: 'IT Manager',
        role: 'Technology',
        stance: 'champion',
        concerns: ['Security requirements', 'Integration complexity'],
        influence: 70,
        icon: <Shield className="w-4 h-4" />
      },
      {
        id: 'program',
        name: 'Program Directors',
        role: 'Operations',
        stance: 'neutral',
        concerns: ['Learning curve', 'Impact on service delivery'],
        influence: 80,
        icon: <Heart className="w-4 h-4" />
      },
      {
        id: 'staff',
        name: 'Front-line Staff',
        role: 'Implementation',
        stance: 'skeptic',
        concerns: ['Job security', 'Too much change', 'Lack of tech skills'],
        influence: 60,
        icon: <Users className="w-4 h-4" />
      },
      {
        id: 'board',
        name: 'Board Members',
        role: 'Governance',
        stance: 'resistant',
        concerns: ['Cost vs benefit', 'Mission alignment', 'Risk management'],
        influence: 100,
        icon: <Target className="w-4 h-4" />
      }
    ],
    goals: [
      'Achieve 95% stakeholder buy-in',
      'Create unified AI vision',
      'Address all major concerns',
      'Build excitement for transformation'
    ]
  }
];

interface ChangeStrategy {
  id: string;
  name: string;
  description: string;
  approach: string[];
  effectiveness: Record<string, number>;
}

const strategies: ChangeStrategy[] = [
  {
    id: 'inclusive',
    name: 'Inclusive Co-Creation',
    description: 'Involve all stakeholders in designing the AI transformation together',
    approach: [
      'Form cross-functional AI task force',
      'Host collaborative visioning sessions',
      'Create shared ownership of outcomes',
      'Celebrate small wins together'
    ],
    effectiveness: {
      'champion': 100,
      'supporter': 90,
      'neutral': 80,
      'skeptic': 70,
      'resistant': 60
    }
  },
  {
    id: 'pilot',
    name: 'Pilot & Scale',
    description: 'Start with small, successful pilots to build confidence',
    approach: [
      'Select high-impact, low-risk pilot',
      'Measure and share quick wins',
      'Address concerns through real examples',
      'Gradually expand based on success'
    ],
    effectiveness: {
      'champion': 90,
      'supporter': 85,
      'neutral': 75,
      'skeptic': 80,
      'resistant': 65
    }
  },
  {
    id: 'education',
    name: 'Education First',
    description: 'Focus on building AI literacy and addressing knowledge gaps',
    approach: [
      'Conduct AI literacy workshops',
      'Share success stories from peers',
      'Provide hands-on practice opportunities',
      'Build confidence through education'
    ],
    effectiveness: {
      'champion': 85,
      'supporter': 80,
      'neutral': 85,
      'skeptic': 75,
      'resistant': 55
    }
  }
];

const AlexChangeNavigator: React.FC<{ onComplete?: (score: number) => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'assess' | 'strategy' | 'implement' | 'complete'>('intro');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [stakeholderActions, setStakeholderActions] = useState<Record<string, string>>({});
  const [visionStatement, setVisionStatement] = useState('');
  const [alignmentScore, setAlignmentScore] = useState(0);

  const scenario = scenarios[0]; // Using first scenario for now

  const calculateAlignment = () => {
    const strategy = strategies.find(s => s.id === selectedStrategy);
    if (!strategy) return 0;

    let totalAlignment = 0;
    let totalInfluence = 0;

    scenario.stakeholders.forEach(stakeholder => {
      const effectiveness = strategy.effectiveness[stakeholder.stance] || 50;
      const hasAction = stakeholderActions[stakeholder.id] ? 10 : 0;
      const stakeholderAlignment = effectiveness + hasAction;
      
      totalAlignment += stakeholderAlignment * (stakeholder.influence / 100);
      totalInfluence += stakeholder.influence;
    });

    // Vision statement bonus
    const visionBonus = visionStatement.length > 50 ? 10 : 0;

    return Math.min(Math.round((totalAlignment / scenario.stakeholders.length) + visionBonus), 100);
  };

  const getStanceColor = (stance: string) => {
    const colors = {
      champion: 'text-green-600 bg-green-100',
      supporter: 'text-blue-600 bg-blue-100',
      neutral: 'text-gray-600 bg-gray-100',
      skeptic: 'text-yellow-600 bg-yellow-100',
      resistant: 'text-red-600 bg-red-100'
    };
    return colors[stance as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const generateStakeholderResponse = (stakeholderId: string) => {
    const responses: Record<string, string> = {
      ed: "I'll advocate for AI adoption at the next board meeting with concrete ROI projections.",
      it: "I'll create a phased implementation plan addressing all security concerns.",
      program: "I'm willing to pilot AI tools in one program to demonstrate impact.",
      staff: "I'd like to be part of the AI task force to ensure our voices are heard.",
      board: "Show me successful examples from similar organizations and I'll reconsider."
    };
    
    setStakeholderActions(prev => ({
      ...prev,
      [stakeholderId]: responses[stakeholderId] || "I'm ready to support this initiative."
    }));
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Alex's Change Navigator</CardTitle>
                    <CardDescription>Lead AI adoption with confidence and strategy</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Master Change Leadership:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Navigate organizational resistance with empathy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Build coalition of AI champions across departments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <span>Create unified vision that excites and aligns</span>
                    </li>
                  </ul>
                </div>

                <Alert className="border-purple-200 bg-purple-50">
                  <Brain className="h-4 w-4 text-purple-600" />
                  <AlertDescription>
                    <strong>Leadership Principle:</strong> Change happens at the speed of trust. Build relationships before implementing technology.
                  </AlertDescription>
                </Alert>

                <div className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Your Challenge:</h4>
                  <p className="text-sm">{scenario.context}</p>
                  <p className="text-sm mt-2 font-medium">{scenario.challenge}</p>
                </div>

                <Button 
                  onClick={() => setPhase('assess')} 
                  size="lg" 
                  className="w-full"
                >
                  Begin Stakeholder Assessment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'assess' && (
          <motion.div
            key="assess"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Stakeholder Landscape</CardTitle>
                <CardDescription>Understand your key players and their positions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenario.stakeholders.map((stakeholder, index) => (
                    <motion.div
                      key={stakeholder.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded">
                            {stakeholder.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{stakeholder.name}</h4>
                            <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
                          </div>
                        </div>
                        <Badge className={getStanceColor(stakeholder.stance)}>
                          {stakeholder.stance}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Influence:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={stakeholder.influence} className="w-20 h-2" />
                            <span className="font-medium">{stakeholder.influence}%</span>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Concerns:</p>
                          <ul className="text-xs space-y-1">
                            {stakeholder.concerns.map((concern, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5" />
                                <span>{concern}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Key Insight:</strong> Focus on high-influence stakeholders and address skeptics' concerns early to build momentum.
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={() => setPhase('strategy')}
                  size="lg"
                  className="w-full"
                >
                  Choose Change Strategy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'strategy' && (
          <motion.div
            key="strategy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Select Your Change Strategy</CardTitle>
                <CardDescription>Choose the approach that best fits your organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  {strategies.map((strategy) => (
                    <Label
                      key={strategy.id}
                      htmlFor={strategy.id}
                      className="cursor-pointer"
                    >
                      <div className={`p-4 rounded-lg border-2 transition-all ${
                        selectedStrategy === strategy.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={strategy.id} id={strategy.id} className="mt-1" />
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{strategy.name}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                            <div className="space-y-1">
                              {strategy.approach.map((step, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">
                                    {index + 1}
                                  </div>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>

                <div>
                  <Label htmlFor="vision">Create Your AI Vision Statement</Label>
                  <Textarea
                    id="vision"
                    placeholder="Write an inspiring vision for AI transformation that addresses concerns and excites stakeholders..."
                    value={visionStatement}
                    onChange={(e) => setVisionStatement(e.target.value)}
                    className="mt-2 min-h-[100px]"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tip: Address both the "why" (mission impact) and "how" (supportive approach)
                  </p>
                </div>

                <Button 
                  onClick={() => setPhase('implement')}
                  disabled={!selectedStrategy}
                  size="lg"
                  className="w-full"
                >
                  Implement Strategy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'implement' && (
          <motion.div
            key="implement"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Strategy Implementation</CardTitle>
                <CardDescription>Engage stakeholders and build alignment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <strong>Your Strategy:</strong> {strategies.find(s => s.id === selectedStrategy)?.name}
                  </AlertDescription>
                </Alert>

                {visionStatement && (
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 text-sm">Your Vision Statement:</h4>
                    <p className="text-sm italic">"{visionStatement}"</p>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-semibold">Stakeholder Engagement:</h4>
                  {scenario.stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {stakeholder.icon}
                          <span className="font-medium">{stakeholder.name}</span>
                          <Badge variant="outline" className={getStanceColor(stakeholder.stance)}>
                            {stakeholder.stance}
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateStakeholderResponse(stakeholder.id)}
                          disabled={!!stakeholderActions[stakeholder.id]}
                        >
                          Engage
                        </Button>
                      </div>
                      
                      {stakeholderActions[stakeholder.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-muted/50 rounded text-sm"
                        >
                          <p className="italic">"{stakeholderActions[stakeholder.id]}"</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Organization Alignment Score</p>
                  <p className="text-3xl font-bold text-primary">{calculateAlignment()}%</p>
                  <Progress value={calculateAlignment()} className="mt-2" />
                </div>

                <Button 
                  onClick={() => {
                    setAlignmentScore(calculateAlignment());
                    setPhase('complete');
                    if (onComplete) onComplete(calculateAlignment());
                  }}
                  size="lg"
                  className="w-full"
                  disabled={Object.keys(stakeholderActions).length < 3}
                >
                  Complete Transformation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Change Leadership Success!</h2>
              <p className="text-lg">You've united your organization around AI transformation</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Final Alignment Score:</h3>
                  <div className="text-4xl font-bold text-primary mb-2">{alignmentScore}%</div>
                  <Progress value={alignmentScore} className="w-full max-w-xs mx-auto h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                  <div className="space-y-2">
                    <Layers className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Strategic Vision</h4>
                    <p className="text-sm text-muted-foreground">
                      Created unified AI vision for impact
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Heart className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Stakeholder Trust</h4>
                    <p className="text-sm text-muted-foreground">
                      Built coalition across all levels
                    </p>
                  </div>
                  <div className="space-y-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <h4 className="font-medium">Momentum Building</h4>
                    <p className="text-sm text-muted-foreground">
                      Transformed resistance into excitement
                    </p>
                  </div>
                </div>

                <Alert className="mt-6 border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <strong>Leadership Achievement:</strong> You've proven that successful AI transformation is about people, not just technology.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AlexChangeNavigator;