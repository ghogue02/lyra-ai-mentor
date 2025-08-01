import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Users, Heart, Volume2, CheckCircle, Target, MessageSquare } from 'lucide-react';
import IndividualAudienceSuccess from './IndividualAudienceSuccess';

interface ToneAdaptedPACE {
  Purpose: string;
  Audience: string;
  Connection: string;
  Engagement: string;
  tone: 'professional' | 'empathetic' | 'reassuring';
  audienceType: 'board' | 'staff' | 'community';
}

interface MultiAudienceToneResult {
  board: ToneAdaptedPACE;
  staff: ToneAdaptedPACE;
  community: ToneAdaptedPACE;
  prompts: {
    board: string;
    staff: string;
    community: string;
  };
}

interface ToneGuidedPracticeProps {
  challenge: string;
  onPracticeComplete: (result: MultiAudienceToneResult) => void;
}

type AudienceType = 'board' | 'staff' | 'community';
type ToneType = 'professional' | 'empathetic' | 'reassuring';

const ToneGuidedPractice: React.FC<ToneGuidedPracticeProps> = ({
  challenge,
  onPracticeComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'audience-selection' | 'tone-building' | 'individual-success' | 'comparison' | 'review'>('intro');
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('board');
  const [audienceProgress, setAudienceProgress] = useState<Set<AudienceType>>(new Set());
  const [toneResults, setToneResults] = useState<Partial<Record<AudienceType, ToneAdaptedPACE>>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<Partial<Record<AudienceType, string>>>({});

  const [currentPace, setCurrentPace] = useState<ToneAdaptedPACE>({
    Purpose: '',
    Audience: '',
    Connection: '',
    Engagement: '',
    tone: 'professional',
    audienceType: 'board'
  });

  const audienceConfigs = {
    board: {
      title: 'Board Members',
      icon: Briefcase,
      tone: 'professional' as ToneType,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-100',
      description: 'Executive stakeholders who focus on strategic impact and fiscal responsibility',
      characteristics: ['Data-driven decisions', 'Strategic thinking', 'Fiscal accountability', 'Results-oriented'],
      toneGuidance: 'Professional, concise, solution-focused with clear metrics and accountability'
    },
    staff: {
      title: 'Staff Team',
      icon: Users,
      tone: 'empathetic' as ToneType,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      description: 'Your team members who are directly affected by these changes',
      characteristics: ['Personal investment', 'Emotional impact', 'Job security concerns', 'Need support'],
      toneGuidance: 'Empathetic, transparent, supportive with acknowledgment of impact and clear next steps'
    },
    community: {
      title: 'Community Members',
      icon: Heart,
      tone: 'reassuring' as ToneType,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-100',
      description: 'Program beneficiaries and community supporters who rely on your services',
      characteristics: ['Service dependency', 'Emotional connection', 'Need reassurance', 'Want involvement'],
      toneGuidance: 'Reassuring, hopeful, community-focused with emphasis on resilience and collaboration'
    }
  };

  const toneExamples = {
    board: {
      Purpose: 'Inform board of budget adjustments while maintaining confidence in organizational resilience and strategic planning',
      Audience: 'Board members who require data-driven analysis and strategic solutions for organizational sustainability',
      Connection: 'Acknowledge their fiduciary responsibility and demonstrate proactive leadership with clear accountability',
      Engagement: 'Present concrete financial data, mitigation strategies, and request strategic guidance for optimal outcomes'
    },
    staff: {
      Purpose: 'Transparently communicate budget changes while providing emotional support and clear job security information',
      Audience: 'Dedicated team members who are personally invested in our mission and concerned about their roles',
      Connection: 'Acknowledge their concerns, validate their feelings, and emphasize their value to the organization',
      Engagement: 'Provide honest updates, available support resources, and opportunities for team input and involvement'
    },
    community: {
      Purpose: 'Reassure community about continued commitment to services while being honest about temporary adjustments',
      Audience: 'Community members and families who depend on our programs and are invested in our mission',
      Connection: 'Emphasize shared values, community strength, and our unwavering commitment to serving them',
      Engagement: 'Highlight community partnership opportunities and ways they can help maintain program quality'
    }
  };

  const handleAudienceSelect = (audience: AudienceType) => {
    setSelectedAudience(audience);
    const config = audienceConfigs[audience];
    setCurrentPace({
      Purpose: '',
      Audience: '',
      Connection: '',
      Engagement: '',
      tone: config.tone,
      audienceType: audience
    });
    setCurrentStep('tone-building');
  };

  const handleToneBuildingComplete = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prompt = `Write a professional communication about budget cuts affecting programs.

Purpose: ${currentPace.Purpose}
Audience: ${currentPace.Audience}
Connection: ${currentPace.Connection}
Engagement: ${currentPace.Engagement}

Tone: ${currentPace.tone} (${audienceConfigs[selectedAudience].toneGuidance})

Please craft a message that:
1. Uses the appropriate ${currentPace.tone} tone for ${audienceConfigs[selectedAudience].title.toLowerCase()}
2. Addresses their specific concerns and communication preferences
3. Builds appropriate emotional connection and rapport
4. Includes engaging elements and clear next steps
5. Maintains authenticity while adapting to audience needs

Structure the response appropriately for the ${selectedAudience} audience.`;

    // Store the results
    setToneResults(prev => ({
      ...prev,
      [selectedAudience]: currentPace
    }));
    
    setGeneratedPrompts(prev => ({
      ...prev,
      [selectedAudience]: prompt
    }));

    const newProgress = new Set(audienceProgress);
    newProgress.add(selectedAudience);
    setAudienceProgress(newProgress);

    setIsGenerating(false);
    setCurrentStep('individual-success');
  };

  const handleIndividualSuccessContinue = () => {
    // Check if all audiences are complete
    if (audienceProgress.size === 3) {
      setCurrentStep('review');
    } else {
      setCurrentStep('audience-selection');
    }
  };

  const handleViewAllResults = () => {
    setCurrentStep('comparison');
  };

  const handleComplete = () => {
    if (Object.keys(toneResults).length === 3 && Object.keys(generatedPrompts).length === 3) {
      const finalResult: MultiAudienceToneResult = {
        board: toneResults.board!,
        staff: toneResults.staff!,
        community: toneResults.community!,
        prompts: {
          board: generatedPrompts.board!,
          staff: generatedPrompts.staff!,
          community: generatedPrompts.community!
        }
      };
      onPracticeComplete(finalResult);
    }
  };

  const renderStep = () => {
    if (currentStep === 'intro') {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <Volume2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Multi-Audience Tone Challenge</h3>
            <p className="text-gray-600">
              Help Maya create the same message with three different tones for her diverse audiences. Each tone will connect differently while maintaining the core purpose.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Maya's Challenge:</h4>
            <p className="text-sm text-purple-700">{challenge}</p>
          </div>
          <Button
            onClick={() => setCurrentStep('audience-selection')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Start Tone Adaptation
          </Button>
        </div>
      );
    }

    if (currentStep === 'audience-selection') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Choose Your Audience</h3>
            <p className="text-gray-600">Select which audience you'd like to create a tone-adapted message for.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(audienceConfigs) as AudienceType[]).map((audienceType) => {
              const config = audienceConfigs[audienceType];
              const Icon = config.icon;
              const isCompleted = audienceProgress.has(audienceType);
              
              return (
                <div key={audienceType} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-br ${config.bgColor.replace('50', '500/10').replace('100', '600/5')} rounded-xl blur-lg opacity-50`} />
                  <Card 
                    className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isCompleted ? 'border-green-500 bg-green-50' : 'hover:shadow-lg'
                    }`}
                    onClick={() => !isCompleted && handleAudienceSelect(audienceType)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <h4 className="font-bold text-lg mb-2">{config.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                      <Badge variant={isCompleted ? "default" : "secondary"} className="mb-3">
                        {isCompleted ? 'Completed' : `${config.tone} tone`}
                      </Badge>
                      <div className="space-y-1">
                        {config.characteristics.map((char, index) => (
                          <div key={index} className="text-xs text-gray-500">• {char}</div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {audienceProgress.size > 0 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Progress: {audienceProgress.size} of 3 audiences completed
              </p>
              
              <div className="bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(audienceProgress.size / 3) * 100}%` }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {audienceProgress.size >= 2 && (
                  <Button
                    onClick={() => setCurrentStep('comparison')}
                    variant="outline"
                    size="lg"
                  >
                    Compare Completed ({audienceProgress.size})
                  </Button>
                )}
                
                {audienceProgress.size === 3 && (
                  <Button
                    onClick={() => setCurrentStep('review')}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    View Final Results
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 'tone-building') {
      const config = audienceConfigs[selectedAudience];
      const Icon = config.icon;
      
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className={`w-16 h-16 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">{config.title} - {config.tone} Tone</h3>
            <p className="text-gray-600">{config.toneGuidance}</p>
          </div>

          <Card className={`bg-gradient-to-r ${config.bgColor} border-2`}>
            <CardHeader>
              <CardTitle className="text-lg">Build Your Tone-Adapted PACE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Purpose (with {config.tone} focus):</label>
                <Textarea
                  placeholder={`Adapt your purpose for ${config.title.toLowerCase()}...`}
                  value={currentPace.Purpose}
                  onChange={(e) => setCurrentPace(prev => ({ ...prev, Purpose: e.target.value }))}
                  className="min-h-16"
                />
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentPace(prev => ({ ...prev, Purpose: toneExamples[selectedAudience].Purpose }))}
                  >
                    Use Maya's example
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audience (specific to {config.title}):</label>
                <Textarea
                  placeholder={`Describe ${config.title.toLowerCase()} specifically...`}
                  value={currentPace.Audience}
                  onChange={(e) => setCurrentPace(prev => ({ ...prev, Audience: e.target.value }))}
                  className="min-h-16"
                />
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentPace(prev => ({ ...prev, Audience: toneExamples[selectedAudience].Audience }))}
                  >
                    Use Maya's example
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Connection (emotional {config.tone} approach):</label>
                <Textarea
                  placeholder={`How to connect emotionally with ${config.title.toLowerCase()}...`}
                  value={currentPace.Connection}
                  onChange={(e) => setCurrentPace(prev => ({ ...prev, Connection: e.target.value }))}
                  className="min-h-16"
                />
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentPace(prev => ({ ...prev, Connection: toneExamples[selectedAudience].Connection }))}
                  >
                    Use Maya's example
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Engagement (compelling for {config.title}):</label>
                <Textarea
                  placeholder={`How to engage ${config.title.toLowerCase()} effectively...`}
                  value={currentPace.Engagement}
                  onChange={(e) => setCurrentPace(prev => ({ ...prev, Engagement: e.target.value }))}
                  className="min-h-16"
                />
                <div className="mt-2">
                  <Badge 
                    variant="outline" 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setCurrentPace(prev => ({ ...prev, Engagement: toneExamples[selectedAudience].Engagement }))}
                  >
                    Use Maya's example
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleToneBuildingComplete}
            disabled={!currentPace.Purpose || !currentPace.Audience || !currentPace.Connection || !currentPace.Engagement || isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? 'Generating Tone-Adapted Message...' : `Complete ${config.title} Message`}
          </Button>
        </div>
      );
    }

    if (currentStep === 'individual-success') {
      const currentResult = toneResults[selectedAudience];
      const currentPrompt = generatedPrompts[selectedAudience];
      
      if (!currentResult || !currentPrompt) return null;
      
      return (
        <IndividualAudienceSuccess
          audienceType={selectedAudience}
          result={currentResult}
          prompt={currentPrompt}
          onContinue={handleIndividualSuccessContinue}
          onViewAllResults={audienceProgress.size >= 2 ? handleViewAllResults : undefined}
          completedCount={audienceProgress.size}
          totalCount={3}
        />
      );
    }

    if (currentStep === 'comparison') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Compare Your Tone Adaptations</h3>
            <p className="text-gray-600">See how the same message was adapted for different audiences.</p>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary">
                {audienceProgress.size} of 3 completed
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(audienceConfigs) as AudienceType[]).map((audienceType) => {
              const config = audienceConfigs[audienceType];
              const Icon = config.icon;
              const isCompleted = audienceProgress.has(audienceType);
              const result = toneResults[audienceType];
              
              if (!isCompleted || !result) {
                return (
                  <Card key={audienceType} className="opacity-50">
                    <CardContent className="p-6 text-center">
                      <Icon className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h4 className="font-bold text-gray-500">{config.title}</h4>
                      <p className="text-sm text-gray-400">Not completed yet</p>
                    </CardContent>
                  </Card>
                );
              }
              
              return (
                <Card key={audienceType} className={`bg-gradient-to-r ${config.bgColor} border-2 border-green-200`}>
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold">{config.title}</h4>
                      <Badge variant="secondary" className="mt-1">{config.tone} tone</Badge>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong>Purpose:</strong>
                        <p className="text-gray-700 mt-1">{result.Purpose}</p>
                      </div>
                      <div>
                        <strong>Connection:</strong>
                        <p className="text-gray-700 mt-1">{result.Connection}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep('audience-selection')}
                size="lg"
              >
                Continue Practice
              </Button>
              
              {audienceProgress.size === 3 && (
                <Button
                  onClick={() => setCurrentStep('review')}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Complete Workshop
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 'review') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">All Tone Adaptations Complete!</h3>
            <p className="text-gray-600">Review Maya's tone-adapted messages for each audience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(Object.keys(audienceConfigs) as AudienceType[]).map((audienceType) => {
              const config = audienceConfigs[audienceType];
              const Icon = config.icon;
              const result = toneResults[audienceType];
              
              return (
                <Card key={audienceType} className={`bg-gradient-to-r ${config.bgColor} border-2`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {config.title}
                    </CardTitle>
                    <Badge variant="secondary">{config.tone} tone</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <h5 className="font-semibold text-xs">Purpose:</h5>
                      <p className="text-xs text-gray-700">{result?.Purpose}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs">Engagement:</h5>
                      <p className="text-xs text-gray-700">{result?.Engagement}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button
            onClick={handleComplete}
            size="lg"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            Perfect! See Maya's Success
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white">
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicator for audience selection */}
      {currentStep === 'audience-selection' && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            {(Object.keys(audienceConfigs) as AudienceType[]).map((audience) => (
              <div
                key={audience}
                className={`w-3 h-3 rounded-full ${
                  audienceProgress.has(audience) ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToneGuidedPractice;