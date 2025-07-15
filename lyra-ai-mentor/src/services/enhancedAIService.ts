import { aiService, AIRequest, AIResponse, OPENAI_MODELS } from './aiService';
import { aiMonitoringService } from './aiMonitoringService';
import { getAIConfig, CharacterType } from '@/config/aiConfig';

// Enhanced AI Service with specialized methods for interactive components
export class EnhancedAIService {
  private static instance: EnhancedAIService;
  private cache = new Map<string, { response: string; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): EnhancedAIService {
    if (!EnhancedAIService.instance) {
      EnhancedAIService.instance = new EnhancedAIService();
    }
    return EnhancedAIService.instance;
  }

  private getCacheKey(prompt: string, context: string): string {
    return btoa(`${prompt}-${context}`).replace(/[^a-zA-Z0-9]/g, '');
  }

  private getCachedResponse(cacheKey: string): string | null {
    const cached = this.cache.get(cacheKey);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > this.CACHE_DURATION;
    if (isExpired) {
      this.cache.delete(cacheKey);
      return null;
    }
    
    return cached.response;
  }

  private setCachedResponse(cacheKey: string, response: string): void {
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
  }

  private async makeAIRequest(
    prompt: string,
    systemMessage: string,
    component: string,
    character?: CharacterType,
    options: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> {
    const config = getAIConfig();
    const startTime = Date.now();

    // Check rate limits
    const canRequest = aiMonitoringService.canMakeRequest(options.maxTokens || config.DEFAULTS.MAX_TOKENS);
    if (!canRequest.allowed) {
      throw new Error(canRequest.reason || 'Request not allowed');
    }

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: options.temperature || config.DEFAULTS.TEMPERATURE,
        maxTokens: options.maxTokens || config.DEFAULTS.MAX_TOKENS,
        model: character ? config.CHARACTERS[character].model || config.MODELS.TEXT_GENERATION : config.MODELS.TEXT_GENERATION,
        cache: true
      });

      const responseTime = Date.now() - startTime;

      // Record successful request
      aiMonitoringService.recordRequest(
        component,
        response.usage || {
          promptTokens: prompt.length / 4, // Rough estimate
          completionTokens: response.content.length / 4,
          totalTokens: (prompt.length + response.content.length) / 4,
          estimatedCost: 0
        },
        responseTime,
        true,
        character
      );

      return response.content;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      // Record failed request
      aiMonitoringService.recordRequest(
        component,
        { promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCost: 0 },
        responseTime,
        false,
        character,
        error instanceof Error ? error.message : 'Unknown error'
      );

      throw error;
    }
  }

  // ===================
  // MAYA - EMAIL COMPOSER
  // ===================
  async generateEmail(recipe: {
    tone: string;
    recipient: string;
    purpose: string;
    context?: string;
  }): Promise<string> {
    const cacheKey = this.getCacheKey(
      `${recipe.tone}-${recipe.recipient}-${recipe.purpose}`,
      recipe.context || ''
    );
    
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const config = getAIConfig();
    const characterConfig = config.CHARACTERS.maya;

    const prompt = `Create a professional email for a nonprofit professional with these specifications:

TONE: ${recipe.tone}
RECIPIENT: ${recipe.recipient}
PURPOSE: ${recipe.purpose}
${recipe.context ? `CONTEXT: ${recipe.context}` : ''}

Requirements:
- Professional but warm tone appropriate for nonprofit sector
- Clear, empathetic communication
- Actionable next steps when relevant
- Proper email formatting
- Length: 3-4 paragraphs
- Include appropriate greeting and closing

Generate a complete email that Maya Rodriguez (Program Director) would be proud to send.`;

    try {
      const emailContent = await this.makeAIRequest(
        prompt,
        characterConfig.systemMessage,
        'MayaEmailComposer',
        'maya',
        {
          temperature: characterConfig.temperature,
          maxTokens: characterConfig.maxTokens
        }
      );

      this.setCachedResponse(cacheKey, emailContent);
      return emailContent;
    } catch (error) {
      console.error('Email generation error:', error);
      throw new Error('Failed to generate email. Please try again.');
    }
  }

  async streamEmail(
    recipe: {
      tone: string;
      recipient: string;
      purpose: string;
      context?: string;
    },
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const prompt = `Create a professional email for a nonprofit professional with these specifications:

TONE: ${recipe.tone}
RECIPIENT: ${recipe.recipient}
PURPOSE: ${recipe.purpose}
${recipe.context ? `CONTEXT: ${recipe.context}` : ''}

Requirements:
- Professional but warm tone appropriate for nonprofit sector
- Clear, empathetic communication
- Actionable next steps when relevant
- Proper email formatting
- Length: 3-4 paragraphs
- Include appropriate greeting and closing

Generate a complete email that Maya Rodriguez (Program Director) would be proud to send.`;

    const config = getAIConfig();
    const systemMessage = config.CHARACTERS.maya.systemMessage;

    try {
      await aiService.streamResponse({
        prompt,
        systemMessage,
        temperature: 0.7,
        maxTokens: 800,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI
      }, onChunk);
    } catch (error) {
      console.error('Email streaming error:', error);
      throw new Error('Failed to stream email. Please try again.');
    }
  }

  // ===================
  // ALEX - CHANGE STRATEGY
  // ===================
  async enhanceChangeStrategy(input: string): Promise<string> {
    const cacheKey = this.getCacheKey('change-strategy', input);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const config = getAIConfig();
    const characterConfig = config.CHARACTERS.alex;

    const prompt = `Analyze and enhance this change management approach for AI adoption in a nonprofit:

INPUT: ${input}

Provide a comprehensive enhancement that includes:
1. Strategic framework for change management
2. Stakeholder alignment strategies
3. Communication plan
4. Risk mitigation approaches
5. Success metrics and timeline
6. Specific tactics for overcoming resistance

Format as a professional change management strategy that Alex Chen (Executive Director) would present to the board.`;

    try {
      const enhancement = await this.makeAIRequest(
        prompt,
        characterConfig.systemMessage,
        'AlexChangeStrategy',
        'alex',
        {
          temperature: characterConfig.temperature,
          maxTokens: characterConfig.maxTokens
        }
      );

      this.setCachedResponse(cacheKey, enhancement);
      return enhancement;
    } catch (error) {
      console.error('Change strategy enhancement error:', error);
      throw new Error('Failed to enhance change strategy. Please try again.');
    }
  }

  // ===================
  // DAVID - DATA COACHING
  // ===================
  async generateDataInsight(dataDescription: string, objective: string): Promise<string> {
    const cacheKey = this.getCacheKey('data-insight', `${dataDescription}-${objective}`);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const prompt = `As a data analysis expert, provide insights for this nonprofit data scenario:

DATA DESCRIPTION: ${dataDescription}
OBJECTIVE: ${objective}

Provide:
1. Key insights and patterns to look for
2. Recommended visualization approaches
3. Potential story angles for stakeholders
4. Actionable recommendations
5. Metrics to track success

Format as coaching advice that David Chen (Data Analyst) would find valuable and actionable.`;

    const systemMessage = `You are an expert data analyst and coach specializing in nonprofit analytics. You help nonprofit professionals extract meaningful insights from data and communicate them effectively to drive decision-making and impact.`;

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: 0.7,
        maxTokens: 1000,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        cache: true
      });

      const insight = response.content;
      this.setCachedResponse(cacheKey, insight);
      return insight;
    } catch (error) {
      console.error('Data insight generation error:', error);
      throw new Error('Failed to generate data insight. Please try again.');
    }
  }

  // ===================
  // RACHEL - AUTOMATION
  // ===================
  async optimizeWorkflow(workflowDescription: string): Promise<string> {
    const cacheKey = this.getCacheKey('workflow-optimization', workflowDescription);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const prompt = `Analyze and optimize this nonprofit workflow for automation:

WORKFLOW: ${workflowDescription}

Provide:
1. Automation opportunities and priorities
2. Technology recommendations
3. Implementation timeline
4. Resource requirements
5. ROI projections
6. Risk mitigation strategies

Format as a comprehensive automation strategy that Rachel Torres (Operations Manager) would implement.`;

    const systemMessage = `You are an expert in nonprofit operations and automation. You help nonprofit professionals streamline workflows, reduce manual tasks, and implement technology solutions that improve efficiency and impact.`;

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: 0.8,
        maxTokens: 1200,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        cache: true
      });

      const optimization = response.content;
      this.setCachedResponse(cacheKey, optimization);
      return optimization;
    } catch (error) {
      console.error('Workflow optimization error:', error);
      throw new Error('Failed to optimize workflow. Please try again.');
    }
  }

  // ===================
  // SOFIA - STORYTELLING
  // ===================
  async enhanceStory(storyInput: string, audience: string): Promise<string> {
    const cacheKey = this.getCacheKey('story-enhancement', `${storyInput}-${audience}`);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const prompt = `Enhance this nonprofit story for maximum impact:

STORY INPUT: ${storyInput}
AUDIENCE: ${audience}

Provide:
1. Compelling narrative structure
2. Emotional connection points
3. Authentic voice and tone
4. Call to action
5. Supporting details that resonate

Format as a polished story that Sofia Reyes (Communications Director) would proudly share with stakeholders.`;

    const systemMessage = `You are an expert nonprofit storyteller and communications specialist. You help nonprofit professionals craft compelling narratives that connect with audiences emotionally and inspire action while maintaining authenticity and impact.`;

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: 0.8,
        maxTokens: 1000,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        cache: true
      });

      const enhancement = response.content;
      this.setCachedResponse(cacheKey, enhancement);
      return enhancement;
    } catch (error) {
      console.error('Story enhancement error:', error);
      throw new Error('Failed to enhance story. Please try again.');
    }
  }

  // ===================
  // GENERAL PURPOSE METHODS
  // ===================
  async improveText(text: string, purpose: string, character?: string): Promise<string> {
    const cacheKey = this.getCacheKey('improve-text', `${text}-${purpose}-${character}`);
    const cached = this.getCachedResponse(cacheKey);
    if (cached) return cached;

    const characterContext = character ? `from the perspective of ${character}` : '';
    
    const prompt = `Improve the following text for ${purpose} ${characterContext}:

TEXT: ${text}

Provide an enhanced version that is:
- More engaging and professional
- Clear and actionable
- Appropriate for nonprofit sector
- Maintains the original intent while improving impact`;

    const systemMessage = `You are an expert nonprofit communications specialist. You help nonprofit professionals improve their written communication to be more engaging, professional, and impactful while maintaining authenticity and purpose.`;

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: 0.7,
        maxTokens: 800,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        cache: true
      });

      const improvement = response.content;
      this.setCachedResponse(cacheKey, improvement);
      return improvement;
    } catch (error) {
      console.error('Text improvement error:', error);
      throw new Error('Failed to improve text. Please try again.');
    }
  }

  async generateSuggestions(context: string, goal: string): Promise<string[]> {
    const prompt = `Generate 5 practical suggestions for this nonprofit scenario:

CONTEXT: ${context}
GOAL: ${goal}

Provide specific, actionable suggestions that a nonprofit professional could implement immediately.`;

    const systemMessage = `You are an expert nonprofit consultant who provides practical, actionable advice. Your suggestions should be specific, feasible, and tailored to the nonprofit sector.`;

    try {
      const response = await aiService.generateResponse({
        prompt,
        systemMessage,
        temperature: 0.8,
        maxTokens: 500,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        cache: false
      });

      const suggestions = response.content
        .split('\n')
        .filter(line => line.trim() && (line.includes('1.') || line.includes('2.') || line.includes('3.') || line.includes('4.') || line.includes('5.') || line.includes('-')))
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').trim())
        .slice(0, 5);

      return suggestions;
    } catch (error) {
      console.error('Suggestion generation error:', error);
      throw new Error('Failed to generate suggestions. Please try again.');
    }
  }

  // ===================
  // UTILITY METHODS
  // ===================
  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const enhancedAIService = EnhancedAIService.getInstance();