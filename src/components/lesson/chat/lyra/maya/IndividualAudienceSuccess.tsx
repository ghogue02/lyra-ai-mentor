import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Copy, Star, TrendingUp, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ToneAdaptedPACE {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
  tone: 'professional' | 'empathetic' | 'reassuring';
  audienceType: 'board' | 'staff' | 'community';
}

interface IndividualAudienceSuccessProps {
  audienceType: 'board' | 'staff' | 'community';
  result: ToneAdaptedPACE;
  prompt: string;
  onContinue: () => void;
  onViewAllResults?: () => void;
  completedCount: number;
  totalCount: number;
}

const IndividualAudienceSuccess: React.FC<IndividualAudienceSuccessProps> = ({
  audienceType,
  result,
  prompt,
  onContinue,
  onViewAllResults,
  completedCount,
  totalCount
}) => {
  const { toast } = useToast();

  const audienceConfigs = {
    board: {
      title: 'Board Members',
      icon: '💼',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100',
      tone: 'Professional',
      response: 'Maya, thank you for the clear financial analysis and recovery plan. Your proactive approach and transparency give us confidence in your leadership. Please proceed with Phase 1 of the mitigation strategy.',
      metrics: { clarity: 95, professionalism: 98, actionability: 92 },
      impact: 'Board immediately approved recovery plan and praised Maya\'s strategic approach',
      keyWin: 'Gained executive confidence and strategic approval'
    },
    staff: {
      title: 'Staff Team',
      icon: '👥',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      tone: 'Empathetic',
      response: 'Thank you for being so transparent with us, Maya. While this is challenging news, I appreciate how you acknowledged our concerns and showed us the path forward. Knowing our jobs are secure helps immensely.',
      metrics: { empathy: 96, clarity: 89, reassurance: 94 },
      impact: 'Staff felt heard and supported, anxiety transformed into collaborative problem-solving',
      keyWin: 'Built trust and reduced team anxiety'
    },
    community: {
      title: 'Community Members',
      icon: '❤️',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-100',
      tone: 'Reassuring',
      response: 'We appreciate your honesty and commitment to keeping our programs running. The community fundraising ideas sound great - we\'re ready to help however we can. Thank you for always putting families first.',
      metrics: { reassurance: 97, hope: 93, engagement: 95 },
      impact: 'Community rallied with fundraising ideas instead of panicking about cuts',
      keyWin: 'Transformed concern into community action'
    }
  };

  const config = audienceConfigs[audienceType];
  const isLastAudience = completedCount === totalCount;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Prompt Copied!",
      description: `${config.title} tone adaptation prompt copied to clipboard.`
    });
  };

  const getNextAudienceText = () => {
    if (isLastAudience) return "View Complete Results";
    const remaining = totalCount - completedCount;
    return `Continue to Next Audience (${remaining} remaining)`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Success Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
            className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">{config.icon}</span>
            <h2 className="text-3xl font-bold">{config.title} Success!</h2>
          </div>
          
          <p className="text-xl text-muted-foreground mb-4">
            Maya's {config.tone.toLowerCase()} tone perfectly connected with this audience
          </p>
          
          <Badge variant="secondary" className="text-sm">
            {completedCount} of {totalCount} audiences completed
          </Badge>
        </div>

        {/* Main Result Card */}
        <Card className={`bg-gradient-to-r ${config.bgColor} border-2 border-green-200`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              {config.tone} Tone Adaptation Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Win */}
            <div className="bg-white/80 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Key Achievement</h3>
              </div>
              <p className="text-green-700 font-medium">{config.keyWin}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(config.metrics).map(([metric, score]) => (
                <div key={metric} className="text-center">
                  <div className="bg-white/60 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{score}%</div>
                    <div className="text-sm capitalize text-gray-600">{metric}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Audience Response */}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-500" />
                Audience Response:
              </h4>
              <div className="bg-white p-4 rounded-lg">
                <p className="italic text-gray-700">"{config.response}"</p>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Impact:</h4>
              <p className="text-green-700">{config.impact}</p>
            </div>
          </CardContent>
        </Card>

        {/* Generated Prompt (Collapsible) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Tone-Adapted Prompt</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPrompt}
                className="flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy Prompt
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                {prompt}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onViewAllResults && completedCount > 1 && (
            <Button
              variant="outline"
              onClick={onViewAllResults}
              size="lg"
            >
              Compare All Results ({completedCount} completed)
            </Button>
          )}
          
          <Button
            onClick={onContinue}
            size="lg"
            className={`${
              isLastAudience 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {getNextAudienceText()}
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default IndividualAudienceSuccess;