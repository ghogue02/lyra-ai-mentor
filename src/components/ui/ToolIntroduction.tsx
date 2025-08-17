import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Scale, Users, HelpCircle, Lightbulb, Target, Play } from 'lucide-react';

interface ToolIntroductionProps {
  toolName: string;
  description: string;
  whatIsIt: string;
  whyUseful: string[];
  howItWorks: string[];
  iconType: 'decision-matrix' | 'team-capacity';
  characterName: string;
  onBegin: () => void;
}

export const ToolIntroduction: React.FC<ToolIntroductionProps> = ({
  toolName,
  description,
  whatIsIt,
  whyUseful,
  howItWorks,
  iconType,
  characterName,
  onBegin
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'decision-matrix':
        return <Scale className="w-8 h-8 text-primary" />;
      case 'team-capacity':
        return <Users className="w-8 h-8 text-primary" />;
      default:
        return <Target className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Tool Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{toolName}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Content Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* What Is It */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold">What is it?</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {whatIsIt}
            </p>
          </CardContent>
        </Card>

        {/* Why Useful */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold">Why this matters</h3>
            </div>
            <ul className="space-y-2">
              {whyUseful.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">How we'll build it</h3>
            </div>
            <ol className="space-y-2">
              {howItWorks.map((step, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <Badge variant="outline" className="mt-0.5 text-xs w-5 h-5 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Character Context */}
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
              {characterName[0]}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-primary">{characterName}'s Experience</h4>
              <p className="text-muted-foreground mt-1">
                {iconType === 'decision-matrix' 
                  ? "At Casa de Esperanza, I had three storytelling proposals but couldn't agree on which would secure the $400K grant. A weighted matrix clarified what mattered most - authentic community voices over polished production. My memo connected the choice to funding success, and the board approved in 24 hours."
                  : "Before I pitch a new story sprint, I sanity-check our capacity. A quick tally of weekly bandwidth prevents painful mid-sprint surprises and helps me turn findings into clear go/no-go recommendations for stakeholders."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Begin Button */}
      <div className="flex justify-end">
        <Button size="lg" onClick={onBegin} className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          Begin Building
        </Button>
      </div>
    </div>
  );
};