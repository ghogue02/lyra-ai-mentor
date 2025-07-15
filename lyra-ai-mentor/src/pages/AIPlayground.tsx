import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Brain, Puzzle, Target, Sparkles, Users, ChevronRight, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { challengeComponents } from '@/components/playground/challenges';

// Character challenge metadata
const challenges = {
  maya: {
    title: "Maya's Email Overwhelm Challenge",
    description: "Transform a chaotic inbox into confident communication",
    icon: <Users className="w-6 h-6" />,
    color: "from-purple-600 to-cyan-500",
    difficulty: "Intermediate",
    timeEstimate: "15 mins",
    skills: ["Email Writing", "AI Prompting", "Communication"]
  },
  sofia: {
    title: "Sofia's Authentic Voice Finder",
    description: "Discover and amplify your unique professional voice",
    icon: <Sparkles className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    difficulty: "Beginner",
    timeEstimate: "10 mins",
    skills: ["Voice Discovery", "Content Creation", "Authenticity"]
  },
  david: {
    title: "David's Data Story Challenge",
    description: "Turn overwhelming metrics into compelling narratives",
    icon: <Target className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    difficulty: "Advanced",
    timeEstimate: "20 mins",
    skills: ["Data Storytelling", "Visualization", "Impact Metrics"]
  },
  rachel: {
    title: "Rachel's Automation Designer",
    description: "Build AI workflows that enhance human work",
    icon: <Puzzle className="w-6 h-6" />,
    color: "from-teal-500 to-cyan-500",
    difficulty: "Advanced",
    timeEstimate: "25 mins",
    skills: ["Process Design", "AI Integration", "Team Alignment"]
  },
  alex: {
    title: "Alex's Change Navigator",
    description: "Lead AI adoption with confidence and strategy",
    icon: <Brain className="w-6 h-6" />,
    color: "from-purple-600 to-blue-600",
    difficulty: "Expert",
    timeEstimate: "30 mins",
    skills: ["Change Management", "Leadership", "Strategy"]
  }
};

interface ChallengeCardProps {
  challenge: typeof challenges.maya;
  characterKey: string;
  onStart: (key: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, characterKey, onStart }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="h-full"
  >
    <Card className="h-full hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className={`h-2 bg-gradient-to-r ${challenge.color}`} />
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${challenge.color} text-white`}>
            {challenge.icon}
          </div>
          <Badge variant="outline">{challenge.difficulty}</Badge>
        </div>
        <CardTitle className="text-xl">{challenge.title}</CardTitle>
        <CardDescription className="mt-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium">Time:</span>
            <span className="ml-2">{challenge.timeEstimate}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {challenge.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <Button 
            onClick={() => onStart(characterKey)}
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          >
            Start Challenge
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

const AIPlayground: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'communication' | 'data' | 'automation'>('all');
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const handleStartChallenge = (challengeKey: string) => {
    setActiveChallenge(challengeKey);
  };

  const handleCompleteChallenge = (score: number) => {
    console.log(`Challenge completed with score: ${score}`);
    // TODO: Save progress to database
  };

  const filteredChallenges = Object.entries(challenges).filter(([key, challenge]) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'communication' && ['maya', 'sofia'].includes(key)) return true;
    if (selectedCategory === 'data' && ['david'].includes(key)) return true;
    if (selectedCategory === 'automation' && ['rachel', 'alex'].includes(key)) return true;
    return false;
  });

  // Get the active challenge component
  const ChallengeComponent = activeChallenge ? challengeComponents[activeChallenge as keyof typeof challengeComponents] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI Learning Playground
              </h1>
              <p className="text-muted-foreground mt-1">
                Master AI skills through real nonprofit challenges
              </p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!activeChallenge ? (
        <div className="container mx-auto px-4 py-8">
          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)} className="mb-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="data">Data & Analytics</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Challenge Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {filteredChallenges.map(([key, challenge], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ChallengeCard
                  challenge={challenge}
                  characterKey={key}
                  onStart={handleStartChallenge}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ) : (
        // Active Challenge View
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setActiveChallenge(null)}
              className="mb-4"
            >
              <X className="w-4 h-4 mr-2" />
              Back to Challenges
            </Button>
          </div>
          
          <Suspense fallback={<LoadingFallback />}>
            {ChallengeComponent && (
              <ChallengeComponent onComplete={handleCompleteChallenge} />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default AIPlayground;