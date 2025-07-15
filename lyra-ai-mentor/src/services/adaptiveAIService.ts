import { enhancedAIService } from './enhancedAIService';
import { progressTrackingService, UserProgress } from './progressTrackingService';

export interface MayaPersonalityProfile {
  communicationStyle: 'warm-professional' | 'direct-caring' | 'enthusiastic-supportive';
  anxietyTriggers: string[];
  confidenceBuilders: string[];
  currentStressLevel: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLearningStyle: 'visual' | 'hands-on' | 'storytelling' | 'data-driven';
  timeConstraints: 'very-busy' | 'moderate' | 'flexible';
}

export interface AdaptiveCoachingSession {
  sessionId: string;
  userId: string;
  character: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  context: string;
  suggestions: string[];
  personalizedTips: string[];
  stressManagement?: string[];
  confidenceBuilders?: string[];
  nextSteps: string[];
  estimatedTime: number;
}

export interface PredictiveSupport {
  riskFactors: string[];
  preventiveActions: string[];
  optimizations: string[];
  timing: 'immediate' | 'within-hour' | 'daily' | 'weekly';
}

class AdaptiveAIService {
  private userProfiles: Map<string, MayaPersonalityProfile> = new Map();

  // Maya's adaptive personality AI
  async createMayaPersonalityProfile(
    userId: string,
    initialData?: {
      communicationStyle?: string;
      stressLevel?: number;
      timeAvailable?: number;
      currentChallenges?: string[];
    }
  ): Promise<MayaPersonalityProfile> {
    // Get user's progress history to understand patterns
    const progress = await progressTrackingService.getUserProgress(userId, { chapterId: 2 });
    
    // Analyze communication patterns from completed elements
    const communicationData = progress.filter(p => 
      p.data?.emailsSent || p.data?.communicationStyle
    );

    // Determine personality profile
    const profile: MayaPersonalityProfile = {
      communicationStyle: this.determineCommunicationStyle(communicationData, initialData?.communicationStyle),
      anxietyTriggers: this.identifyAnxietyTriggers(progress),
      confidenceBuilders: this.identifyConfidenceBuilders(progress),
      currentStressLevel: initialData?.stressLevel || this.calculateCurrentStress(progress),
      skillLevel: this.determineSkillLevel(progress),
      preferredLearningStyle: this.determineLearningStyle(progress),
      timeConstraints: this.assessTimeConstraints(initialData?.timeAvailable || 15)
    };

    // Cache profile for quick access
    this.userProfiles.set(userId, profile);
    
    return profile;
  }

  // Real-time adaptive coaching
  async provideAdaptiveCoaching(
    userId: string,
    context: {
      currentActivity: string;
      stressLevel?: number;
      timeAvailable?: number;
      specificChallenge?: string;
      character: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
    }
  ): Promise<AdaptiveCoachingSession> {
    const profile = this.userProfiles.get(userId) || await this.createMayaPersonalityProfile(userId);
    
    // Get AI-powered suggestions based on profile and context
    const aiSuggestions = await this.generateContextualSuggestions(profile, context);
    
    // Generate personalized tips
    const personalizedTips = await this.generatePersonalizedTips(profile, context);
    
    // Stress management if needed
    let stressManagement: string[] = [];
    if ((context.stressLevel || profile.currentStressLevel) > 6) {
      stressManagement = await this.generateStressManagement(profile, context.stressLevel || profile.currentStressLevel);
    }

    // Confidence builders
    const confidenceBuilders = await this.generateConfidenceBuilders(profile, context);

    // Next steps
    const nextSteps = await this.generateNextSteps(profile, context);

    return {
      sessionId: `coaching-${Date.now()}`,
      userId,
      character: context.character,
      context: context.currentActivity,
      suggestions: aiSuggestions,
      personalizedTips,
      stressManagement,
      confidenceBuilders,
      nextSteps,
      estimatedTime: this.estimateTimeNeeded(context.timeAvailable || 15, profile.timeConstraints)
    };
  }

  // Predictive support system
  async providePredictiveSupport(
    userId: string,
    upcomingActivities: string[],
    timeframe: 'today' | 'this-week' | 'this-month'
  ): Promise<PredictiveSupport> {
    const profile = this.userProfiles.get(userId) || await this.createMayaPersonalityProfile(userId);
    const progress = await progressTrackingService.getUserProgress(userId);

    // Analyze patterns to predict challenges
    const riskFactors = this.predictRiskFactors(profile, upcomingActivities, progress);
    
    // Generate preventive actions
    const preventiveActions = await this.generatePreventiveActions(riskFactors, profile);
    
    // Identify optimization opportunities
    const optimizations = await this.identifyOptimizations(profile, progress, upcomingActivities);

    return {
      riskFactors,
      preventiveActions,
      optimizations,
      timing: this.determineTiming(riskFactors, timeframe)
    };
  }

  // Voice-powered coaching integration
  async startVoiceCoachingSession(
    userId: string,
    sessionType: 'confidence-building' | 'stress-management' | 'skill-practice' | 'real-time-help'
  ): Promise<{
    sessionScript: string[];
    voicePrompts: string[];
    interactiveExercises: string[];
    successMetrics: string[];
  }> {
    const profile = this.userProfiles.get(userId) || await this.createMayaPersonalityProfile(userId);
    
    const sessionContent = await enhancedAIService.generateContent({
      type: 'voice-coaching-session',
      context: {
        sessionType,
        communicationStyle: profile.communicationStyle,
        currentStress: profile.currentStressLevel,
        skillLevel: profile.skillLevel,
        personalTriggers: profile.anxietyTriggers,
        confidenceBuilders: profile.confidenceBuilders
      },
      tone: 'supportive-coach',
      length: 'medium'
    });

    return {
      sessionScript: this.parseSessionScript(sessionContent),
      voicePrompts: this.generateVoicePrompts(sessionType, profile),
      interactiveExercises: this.createInteractiveExercises(sessionType, profile),
      successMetrics: this.defineSuccessMetrics(sessionType)
    };
  }

  // Learning path optimization
  async optimizeLearningPath(
    userId: string,
    currentPath: string,
    performance: UserProgress[]
  ): Promise<{
    adjustedDifficulty: 'easier' | 'maintain' | 'harder';
    recommendedModifications: string[];
    alternativeApproaches: string[];
    timeOptimizations: string[];
  }> {
    const profile = this.userProfiles.get(userId) || await this.createMayaPersonalityProfile(userId);
    
    // Analyze performance patterns
    const avgCompletion = performance.reduce((sum, p) => sum + p.progress_percentage, 0) / performance.length;
    const avgConfidence = performance
      .filter(p => p.confidence_score)
      .reduce((sum, p) => sum + p.confidence_score!, 0) / performance.filter(p => p.confidence_score).length;

    // Determine adjustments
    let adjustedDifficulty: 'easier' | 'maintain' | 'harder' = 'maintain';
    if (avgCompletion < 60 || avgConfidence < 5) {
      adjustedDifficulty = 'easier';
    } else if (avgCompletion > 90 && avgConfidence > 8) {
      adjustedDifficulty = 'harder';
    }

    return {
      adjustedDifficulty,
      recommendedModifications: await this.generatePathModifications(profile, performance, adjustedDifficulty),
      alternativeApproaches: await this.suggestAlternatives(profile, currentPath),
      timeOptimizations: await this.optimizeTimeUsage(profile, performance)
    };
  }

  // Private helper methods
  private determineCommunicationStyle(
    data: UserProgress[],
    hint?: string
  ): MayaPersonalityProfile['communicationStyle'] {
    if (hint?.includes('warm')) return 'warm-professional';
    if (hint?.includes('direct')) return 'direct-caring';
    
    // Analyze from data patterns
    const hasWarmLanguage = data.some(p => 
      p.data?.emailContent?.includes('hope') || 
      p.data?.emailContent?.includes('appreciate')
    );
    
    return hasWarmLanguage ? 'warm-professional' : 'enthusiastic-supportive';
  }

  private identifyAnxietyTriggers(progress: UserProgress[]): string[] {
    const triggers: string[] = [];
    
    const highStressElements = progress.filter(p => 
      (p.data?.stressLevelBefore || 0) > 7
    );
    
    if (highStressElements.some(p => p.data?.emailType === 'parent')) {
      triggers.push('parent complaints');
    }
    if (highStressElements.some(p => p.data?.emailType === 'board')) {
      triggers.push('board communications');
    }
    if (highStressElements.some(p => p.data?.deadline)) {
      triggers.push('tight deadlines');
    }
    
    return triggers.length > 0 ? triggers : ['complex communications', 'time pressure'];
  }

  private identifyConfidenceBuilders(progress: UserProgress[]): string[] {
    const builders: string[] = [];
    
    const successfulElements = progress.filter(p => 
      p.status === 'completed' && (p.confidence_score || 0) > 7
    );
    
    if (successfulElements.some(p => p.data?.templateUsed)) {
      builders.push('using proven templates');
    }
    if (successfulElements.some(p => p.data?.timesSaved)) {
      builders.push('seeing time savings');
    }
    if (successfulElements.some(p => p.data?.positiveResponse)) {
      builders.push('positive recipient feedback');
    }
    
    return builders.length > 0 ? builders : ['step-by-step guidance', 'practice success', 'AI support'];
  }

  private calculateCurrentStress(progress: UserProgress[]): number {
    const recentStress = progress
      .filter(p => p.data?.stressLevelAfter && new Date(p.last_accessed_at!).getTime() > Date.now() - 24 * 60 * 60 * 1000)
      .map(p => p.data.stressLevelAfter);
    
    return recentStress.length > 0 
      ? recentStress.reduce((sum, level) => sum + level, 0) / recentStress.length 
      : 5;
  }

  private determineSkillLevel(progress: UserProgress[]): 'beginner' | 'intermediate' | 'advanced' {
    const completedCount = progress.filter(p => p.status === 'completed').length;
    const avgConfidence = progress
      .filter(p => p.confidence_score)
      .reduce((sum, p) => sum + p.confidence_score!, 0) / progress.filter(p => p.confidence_score).length;

    if (completedCount < 3 || avgConfidence < 6) return 'beginner';
    if (completedCount < 8 || avgConfidence < 8) return 'intermediate';
    return 'advanced';
  }

  private determineLearningStyle(progress: UserProgress[]): MayaPersonalityProfile['preferredLearningStyle'] {
    // Analyze completion patterns to infer learning style
    const handsOnElements = progress.filter(p => p.data?.interactionType === 'hands-on');
    const visualElements = progress.filter(p => p.data?.interactionType === 'visual');
    
    if (handsOnElements.length > visualElements.length) return 'hands-on';
    return 'storytelling'; // Default for Maya's character
  }

  private assessTimeConstraints(timeAvailable: number): MayaPersonalityProfile['timeConstraints'] {
    if (timeAvailable < 10) return 'very-busy';
    if (timeAvailable < 20) return 'moderate';
    return 'flexible';
  }

  private async generateContextualSuggestions(
    profile: MayaPersonalityProfile,
    context: any
  ): Promise<string[]> {
    const prompt = `Based on Maya's profile (${profile.communicationStyle}, stress: ${profile.currentStressLevel}, skill: ${profile.skillLevel}), 
    provide 3 specific suggestions for ${context.currentActivity}. Consider her anxiety triggers: ${profile.anxietyTriggers.join(', ')}.`;
    
    const suggestions = await enhancedAIService.generateContent({
      prompt,
      type: 'suggestions',
      tone: 'supportive-coach',
      length: 'short'
    });

    return this.parseSuggestions(suggestions);
  }

  private async generatePersonalizedTips(
    profile: MayaPersonalityProfile,
    context: any
  ): Promise<string[]> {
    return [
      `For your ${profile.communicationStyle} style: Start with a warm greeting that feels natural to you.`,
      `Time-saving tip: Use the ${profile.skillLevel === 'beginner' ? 'basic' : 'advanced'} recipe template.`,
      `Confidence boost: Remember your success with ${profile.confidenceBuilders[0] || 'previous emails'}.`
    ];
  }

  private async generateStressManagement(
    profile: MayaPersonalityProfile,
    stressLevel: number
  ): Promise<string[]> {
    if (stressLevel > 8) {
      return [
        "Take 3 deep breaths before starting. You've handled similar situations before.",
        "Remember: AI is your writing partner, not your replacement.",
        "Start with just the main message - you can refine it step by step."
      ];
    }
    
    return [
      "Trust the process - the recipe method has worked for you before.",
      "Focus on helping the recipient, not perfect wording."
    ];
  }

  private async generateConfidenceBuilders(
    profile: MayaPersonalityProfile,
    context: any
  ): Promise<string[]> {
    return [
      `You've successfully completed ${profile.skillLevel === 'advanced' ? '8+' : '3+'} email challenges.`,
      `Your communication style (${profile.communicationStyle}) is perfect for this situation.`,
      "Every email is practice for your authentic professional voice."
    ];
  }

  private async generateNextSteps(
    profile: MayaPersonalityProfile,
    context: any
  ): Promise<string[]> {
    const timeFrameSteps = profile.timeConstraints === 'very-busy' 
      ? ["Quick 2-minute recipe setup", "Send and track response"]
      : ["Complete recipe method", "Review and personalize", "Send with confidence"];
    
    return timeFrameSteps;
  }

  private estimateTimeNeeded(
    availableTime: number,
    constraints: MayaPersonalityProfile['timeConstraints']
  ): number {
    if (constraints === 'very-busy') return Math.min(availableTime, 5);
    if (constraints === 'moderate') return Math.min(availableTime, 10);
    return Math.min(availableTime, 15);
  }

  private predictRiskFactors(
    profile: MayaPersonalityProfile,
    activities: string[],
    progress: UserProgress[]
  ): string[] {
    const risks: string[] = [];
    
    // Check for known anxiety triggers in upcoming activities
    activities.forEach(activity => {
      profile.anxietyTriggers.forEach(trigger => {
        if (activity.toLowerCase().includes(trigger.toLowerCase())) {
          risks.push(`Potential anxiety from ${trigger} in upcoming ${activity}`);
        }
      });
    });

    // Check stress pattern trends
    if (profile.currentStressLevel > 6) {
      risks.push("Current elevated stress may impact performance");
    }

    return risks;
  }

  private async generatePreventiveActions(
    risks: string[],
    profile: MayaPersonalityProfile
  ): Promise<string[]> {
    const actions: string[] = [];
    
    risks.forEach(risk => {
      if (risk.includes('anxiety')) {
        actions.push("Schedule 5-minute confidence session before the task");
      }
      if (risk.includes('stress')) {
        actions.push("Use stress-reduction breathing technique");
      }
    });

    return actions;
  }

  private async identifyOptimizations(
    profile: MayaPersonalityProfile,
    progress: UserProgress[],
    activities: string[]
  ): Promise<string[]> {
    return [
      "Batch similar communications to maximize efficiency",
      "Pre-set templates for recurring situations",
      "Schedule AI assistance during peak energy hours"
    ];
  }

  private determineTiming(
    risks: string[],
    timeframe: string
  ): PredictiveSupport['timing'] {
    if (risks.some(r => r.includes('elevated stress'))) return 'immediate';
    if (risks.some(r => r.includes('upcoming'))) return 'within-hour';
    return 'daily';
  }

  // Parsing helper methods
  private parseSuggestions(content: string): string[] {
    return content.split('\n').filter(line => line.trim().length > 0).slice(0, 3);
  }

  private parseSessionScript(content: string): string[] {
    return content.split('\n').filter(line => line.trim().length > 0);
  }

  private generateVoicePrompts(
    sessionType: string,
    profile: MayaPersonalityProfile
  ): string[] {
    return [
      "Let's practice with your natural speaking voice",
      "Repeat after me with confidence",
      "Now try it in your own words"
    ];
  }

  private createInteractiveExercises(
    sessionType: string,
    profile: MayaPersonalityProfile
  ): string[] {
    return [
      "Record yourself reading the email draft",
      "Practice the key message out loud",
      "Role-play the recipient's perspective"
    ];
  }

  private defineSuccessMetrics(sessionType: string): string[] {
    return [
      "Stress level reduced by 2+ points",
      "Confidence score 7+",
      "Completion time under 5 minutes"
    ];
  }

  private async generatePathModifications(
    profile: MayaPersonalityProfile,
    performance: UserProgress[],
    difficulty: string
  ): Promise<string[]> {
    return [
      `Adjust pace for ${profile.timeConstraints} schedule`,
      `Add more ${difficulty === 'easier' ? 'guided practice' : 'advanced challenges'}`,
      "Include more confidence-building checkpoints"
    ];
  }

  private async suggestAlternatives(
    profile: MayaPersonalityProfile,
    currentPath: string
  ): Promise<string[]> {
    return [
      "Voice-first learning approach",
      "Peer collaboration sessions",
      "Real-world application focus"
    ];
  }

  private async optimizeTimeUsage(
    profile: MayaPersonalityProfile,
    performance: UserProgress[]
  ): Promise<string[]> {
    return [
      "Reduce setup time with pre-loaded templates",
      "Skip recap for mastered concepts",
      "Focus practice on weak areas only"
    ];
  }
}

export const adaptiveAIService = new AdaptiveAIService();