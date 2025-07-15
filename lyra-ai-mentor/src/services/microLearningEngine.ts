/**
 * MICRO-LEARNING ENGINE
 * Handles granular, AI-powered micro-lessons with scaffolded progression
 */

import { MicroLesson, RubricCriterion, UserAttempt, AttemptScores, UserContext } from '../config/microLearningSystem';
import { LiveAIService } from './liveAIService';

export class MicroLearningEngine {
  private static instance: MicroLearningEngine;
  private liveAI: LiveAIService;
  private userAttempts: Map<string, UserAttempt[]> = new Map();
  private userSkillProgress: Map<string, Record<string, number>> = new Map();

  private constructor() {
    this.liveAI = LiveAIService.getInstance();
  }

  static getInstance(): MicroLearningEngine {
    if (!MicroLearningEngine.instance) {
      MicroLearningEngine.instance = new MicroLearningEngine();
    }
    return MicroLearningEngine.instance;
  }

  /**
   * Execute a micro-lesson attempt with AI integration
   */
  async executeMicroLesson(
    lesson: MicroLesson,
    userResponse: string,
    userContext: UserContext,
    attemptNumber: number = 1
  ): Promise<UserAttempt> {
    console.log(`🎯 Executing micro-lesson: ${lesson.title}`);

    // Step 1: Generate AI output based on user's response
    const aiOutput = await this.generateAIOutput(lesson, userResponse, userContext);
    
    // Step 2: Score the attempt using AI rubric evaluation
    const scores = await this.scoreAttempt(lesson, userResponse, aiOutput, userContext);
    
    // Step 3: Generate specific feedback
    const feedback = await this.generateFeedback(lesson, userResponse, scores, attemptNumber);
    
    // Step 4: Create attempt record
    const attempt: UserAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lessonId: lesson.id,
      userId: userContext.organizationName || 'anonymous',
      attempt: attemptNumber,
      userResponse,
      aiGeneratedOutput: aiOutput,
      scores,
      feedback,
      passed: scores.overall >= lesson.rubric.passingScore,
      timestamp: new Date(),
      scaffoldingLevel: lesson.scaffoldingStage
    };

    // Step 5: Update user progress tracking
    this.updateUserProgress(attempt, lesson);
    
    // Step 6: Store attempt
    const userAttempts = this.userAttempts.get(attempt.userId) || [];
    userAttempts.push(attempt);
    this.userAttempts.set(attempt.userId, userAttempts);

    console.log(`📊 Attempt completed: ${scores.overall}/10 (${attempt.passed ? 'PASSED' : 'RETRY NEEDED'})`);
    return attempt;
  }

  /**
   * Generate AI output based on user's response and lesson type
   */
  private async generateAIOutput(
    lesson: MicroLesson,
    userResponse: string,
    userContext: UserContext
  ): Promise<string> {
    const contextualPrompt = this.buildContextualPrompt(lesson, userResponse, userContext);
    
    const aiResponse = await this.liveAI.executeInteraction({
      id: `ai_output_${Date.now()}`,
      type: lesson.aiIntegration.primaryTool,
      prompt: contextualPrompt,
      character: lesson.character,
      timestamp: new Date()
    });

    return aiResponse;
  }

  /**
   * Score attempt using AI-based rubric evaluation
   */
  private async scoreAttempt(
    lesson: MicroLesson,
    userResponse: string,
    aiOutput: string,
    userContext: UserContext
  ): Promise<AttemptScores> {
    const rubricPrompt = this.buildRubricPrompt(lesson, userResponse, aiOutput);
    
    const scoringResponse = await this.liveAI.executeInteraction({
      id: `scoring_${Date.now()}`,
      type: 'email-composer', // Use for text analysis
      prompt: rubricPrompt,
      character: lesson.character,
      timestamp: new Date()
    });

    // Parse AI scoring response
    const scores = this.parseAIScoring(scoringResponse, lesson.rubric.criteria);
    
    return {
      overall: scores.overall,
      criteria: scores.criteria,
      needsRetry: scores.overall < lesson.rubric.passingScore,
      readyForNext: scores.overall >= lesson.rubric.passingScore
    };
  }

  /**
   * Generate specific feedback for improvement
   */
  private async generateFeedback(
    lesson: MicroLesson,
    userResponse: string,
    scores: AttemptScores,
    attemptNumber: number
  ): Promise<string[]> {
    const feedbackPrompt = this.buildFeedbackPrompt(lesson, userResponse, scores, attemptNumber);
    
    const feedbackResponse = await this.liveAI.executeInteraction({
      id: `feedback_${Date.now()}`,
      type: 'email-composer',
      prompt: feedbackPrompt,
      character: lesson.character,
      timestamp: new Date()
    });

    // Parse feedback into actionable items
    return this.parseFeedback(feedbackResponse, scores.needsRetry);
  }

  /**
   * Build contextual prompt for AI output generation
   */
  private buildContextualPrompt(
    lesson: MicroLesson,
    userResponse: string,
    userContext: UserContext
  ): string {
    const orgContext = userContext.organizationName 
      ? `Organization: ${userContext.organizationName} (${userContext.organizationType})`
      : 'Nonprofit organization';
    
    const roleContext = userContext.role ? `Role: ${userContext.role}` : '';
    
    return `You are ${lesson.character}, helping a nonprofit professional learn ${lesson.skillFocus}.

Context:
${orgContext}
${roleContext}
Real-world application: ${lesson.context.realWorldApplication}

The user's response/attempt:
"${userResponse}"

Based on their input, generate a practical, actionable output that demonstrates how AI can help them with ${lesson.skillFocus}. Make it specific to their nonprofit context and show them what good looks like.

Focus on: ${lesson.aiIntegration.userAIInteraction}`;
  }

  /**
   * Build rubric evaluation prompt
   */
  private buildRubricPrompt(
    lesson: MicroLesson,
    userResponse: string,
    aiOutput: string
  ): string {
    const criteriaText = lesson.rubric.criteria.map(c => 
      `${c.name} (${c.weight * 100}%): ${c.description}`
    ).join('\n');

    return `Evaluate this micro-lesson attempt on a 1-10 scale:

Skill Focus: ${lesson.skillFocus}

User's Response: "${userResponse}"
AI Generated Output: "${aiOutput}"

Rubric Criteria:
${criteriaText}

Provide scores for each criterion and overall score in this format:
Overall: X/10
${lesson.rubric.criteria.map(c => `${c.name}: X/10`).join('\n')}

Passing threshold: ${lesson.rubric.passingScore}/10`;
  }

  /**
   * Build feedback prompt
   */
  private buildFeedbackPrompt(
    lesson: MicroLesson,
    userResponse: string,
    scores: AttemptScores,
    attemptNumber: number
  ): string {
    const scaffoldingLevel = attemptNumber > 1 ? 'increased' : 'current';
    
    return `Provide specific, actionable feedback for this micro-lesson attempt:

Skill: ${lesson.skillFocus}
User Response: "${userResponse}"
Overall Score: ${scores.overall}/10
Attempt: ${attemptNumber}

${scores.needsRetry ? 'RETRY REQUIRED' : 'PASSED'} 

Provide feedback that:
1. Specifically addresses each low-scoring rubric criteria
2. Gives concrete next steps for improvement
3. ${scaffoldingLevel === 'increased' ? 'Provides more structured guidance since this is a retry' : 'Encourages while being specific about improvements needed'}
4. Relates to their real nonprofit work context

Format as 3-5 bullet points of actionable feedback.`;
  }

  /**
   * Parse AI scoring response
   */
  private parseAIScoring(
    scoringResponse: string,
    criteria: RubricCriterion[]
  ): { overall: number; criteria: Record<string, number> } {
    try {
      const overallMatch = scoringResponse.match(/Overall:\s*(\d+(?:\.\d+)?)/i);
      const overall = overallMatch ? parseFloat(overallMatch[1]) : 5;

      const criteriaScores: Record<string, number> = {};
      criteria.forEach(criterion => {
        const match = scoringResponse.match(new RegExp(`${criterion.name}:\\s*(\\d+(?:\\.\\d+)?)`, 'i'));
        criteriaScores[criterion.name] = match ? parseFloat(match[1]) : 5;
      });

      return { overall, criteria: criteriaScores };
    } catch (error) {
      console.error('Failed to parse AI scoring:', error);
      return {
        overall: 5,
        criteria: criteria.reduce((acc, c) => ({ ...acc, [c.name]: 5 }), {})
      };
    }
  }

  /**
   * Parse feedback into actionable items
   */
  private parseFeedback(feedbackResponse: string, needsRetry: boolean): string[] {
    try {
      // Extract bullet points or numbered items
      const bulletRegex = /[•\-\*]\s*(.+)/g;
      const numberedRegex = /\d+\.\s*(.+)/g;
      
      let feedback: string[] = [];
      let match;
      
      while ((match = bulletRegex.exec(feedbackResponse)) !== null) {
        feedback.push(match[1].trim());
      }
      
      if (feedback.length === 0) {
        while ((match = numberedRegex.exec(feedbackResponse)) !== null) {
          feedback.push(match[1].trim());
        }
      }
      
      if (feedback.length === 0) {
        // Fallback: split by sentences
        feedback = feedbackResponse.split('.').filter(f => f.trim().length > 10).slice(0, 4);
      }

      return feedback.slice(0, 5); // Max 5 feedback items
    } catch (error) {
      console.error('Failed to parse feedback:', error);
      return [needsRetry ? 'Please try again with more specific details.' : 'Good work! Continue practicing this skill.'];
    }
  }

  /**
   * Update user progress tracking
   */
  private updateUserProgress(attempt: UserAttempt, lesson: MicroLesson): void {
    const userId = attempt.userId;
    const currentProgress = this.userSkillProgress.get(userId) || {};
    
    // Update skill-specific progress
    currentProgress[lesson.skillFocus] = Math.max(
      currentProgress[lesson.skillFocus] || 0,
      attempt.scores.overall
    );
    
    this.userSkillProgress.set(userId, currentProgress);
  }

  /**
   * Get user's skill progress
   */
  getUserProgress(userId: string): Record<string, number> {
    return this.userSkillProgress.get(userId) || {};
  }

  /**
   * Get user's attempt history
   */
  getUserAttempts(userId: string): UserAttempt[] {
    return this.userAttempts.get(userId) || [];
  }

  /**
   * Determine if user is ready for next scaffolding level
   */
  isReadyForNextLevel(userId: string, skillFocus: string): boolean {
    const attempts = this.getUserAttempts(userId).filter(a => a.lessonId.includes(skillFocus));
    const recentPasses = attempts.slice(-3).filter(a => a.passed);
    return recentPasses.length >= 2; // Need 2 out of last 3 attempts to pass
  }
}

export default MicroLearningEngine;