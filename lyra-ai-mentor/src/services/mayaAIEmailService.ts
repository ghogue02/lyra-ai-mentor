// Maya AI Email Service - Live prompt building and email generation
import { aiService, OPENAI_MODELS } from './aiService';

export interface MayaEmailPrompt {
  purpose: string;
  audience: string;
  audienceContext: string;
  situationDetails: string;
  tone: string;
  aiPrompt: string;
}

export interface AIEmailResponse {
  email: string;
  explanation: string;
  promptQuality: 'poor' | 'good' | 'excellent';
  suggestions?: string[];
}

export class MayaAIEmailService {
  private static instance: MayaAIEmailService;

  static getInstance(): MayaAIEmailService {
    if (!MayaAIEmailService.instance) {
      MayaAIEmailService.instance = new MayaAIEmailService();
    }
    return MayaAIEmailService.instance;
  }

  /**
   * Generate email using Maya's PACE framework
   */
  async generateEmailWithPACE(prompt: MayaEmailPrompt): Promise<AIEmailResponse> {
    try {
      const finalPrompt = this.buildComprehensivePrompt(prompt);
      
      const response = await aiService.generateResponse({
        prompt: finalPrompt,
        systemMessage: `You are Maya Rodriguez, Program Director at Hope Gardens Community Center. You're helping someone learn to write emails using AI. 

Your role:
- Write authentic, warm emails that fit a nonprofit community setting
- Show how good prompts create better responses
- Explain why the email works for the specific audience and situation
- Keep Maya's voice: caring, professional but approachable, community-focused

Return a JSON response with:
{
  "email": "The generated email content",
  "explanation": "Brief explanation of why this email works for the audience and situation",
  "promptQuality": "poor|good|excellent",
  "suggestions": ["Optional array of tips to improve the prompt"]
}`,
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        temperature: 0.7,
        maxTokens: 800,
        cache: true
      });
      
      const result = response.content;
      if (!result) {
        throw new Error('No response from AI');
      }

      // Parse JSON response
      try {
        const parsed = JSON.parse(result);
        // Validate the response structure
        if (!parsed.email) {
          throw new Error('Invalid response structure');
        }
        return {
          email: parsed.email,
          explanation: parsed.explanation || "Email generated successfully",
          promptQuality: parsed.promptQuality || 'good',
          suggestions: parsed.suggestions || []
        };
      } catch (parseError) {
        console.warn('Failed to parse JSON response, using raw content', parseError);
        // Fallback if JSON parsing fails
        return {
          email: result,
          explanation: "Email generated successfully using PACE framework",
          promptQuality: 'good' as const
        };
      }
    } catch (error) {
      console.error('Maya AI Email Service error:', error);
      return this.getFallbackResponse(prompt);
    }
  }

  /**
   * Show comparison between good and bad prompts
   */
  async demonstratePromptComparison(basicPrompt: string, improvedPrompt: MayaEmailPrompt): Promise<{
    badExample: AIEmailResponse;
    goodExample: AIEmailResponse;
  }> {
    try {
      // Generate bad example with basic prompt
      const badResponse = await aiService.generateResponse({
        prompt: basicPrompt,
        systemMessage: 'You are a generic AI assistant. Write a formal, corporate-style email response.',
        model: OPENAI_MODELS.TEXT.GPT_4O_MINI,
        temperature: 0.3,
        maxTokens: 300,
        cache: false
      });

      // Generate good example with PACE prompt
      const goodResponse = await this.generateEmailWithPACE(improvedPrompt);

      return {
        badExample: {
          email: badResponse.content || 'Generic email response',
          explanation: "This is what you get with vague prompts - formal and impersonal",
          promptQuality: 'poor'
        },
        goodExample: goodResponse
      };
    } catch (error) {
      console.error('Prompt comparison error:', error);
      return this.getFallbackComparison();
    }
  }

  /**
   * Build comprehensive prompt from PACE components
   */
  private buildComprehensivePrompt(prompt: MayaEmailPrompt): string {
    return `Please help me write an email for Hope Gardens Community Center.

PURPOSE: ${prompt.aiPrompt || prompt.purpose}

AUDIENCE: ${prompt.audience}
- Context: ${prompt.audienceContext}

SITUATION: ${prompt.situationDetails}

TONE: ${prompt.tone}

Please write an email that:
1. Fits our nonprofit community center environment
2. Matches the audience's context and needs
3. Reflects the situation appropriately
4. Uses the requested tone while staying authentic to our mission

The email should feel personal and genuine, like it's coming from someone who truly cares about our community.`;
  }

  /**
   * Fallback response for errors
   */
  private getFallbackResponse(prompt: MayaEmailPrompt): AIEmailResponse {
    const fallbackEmails = {
      'Thank a volunteer parent': `Subject: Thank you for making magic happen! ✨

Hi there!

I just had to reach out and say THANK YOU for volunteering with us! Your help made such a difference for our kids and families.

Seeing you jump in and support our community means the world to all of us at Hope Gardens. We couldn't do what we do without amazing people like you.

With heartfelt gratitude,
Maya Rodriguez
Program Director, Hope Gardens Community Center`,

      'Request program feedback': `Subject: Your thoughts would mean so much to us 💭

Hi!

I hope you and your family are doing well! As we continue growing our programs at Hope Gardens, I'd love to hear your thoughts.

What's working well? What could we improve? Any ideas you'd like to share?

Your perspective helps us serve our community better, and we truly value your input.

Thank you for being part of the Hope Gardens family!

Warmly,
Maya`,

      'default': `Subject: From Hope Gardens Community Center

Hello!

Thank you for being part of our Hope Gardens community. Your support and involvement make a real difference in the lives of our children and families.

We appreciate you!

Best regards,
Maya Rodriguez
Program Director`
    };

    const email = fallbackEmails[prompt.purpose] || fallbackEmails['default'];

    return {
      email,
      explanation: "This email uses Maya's warm, community-focused approach while addressing your specific audience and situation.",
      promptQuality: 'good'
    };
  }

  /**
   * Fallback comparison for demo
   */
  private getFallbackComparison() {
    return {
      badExample: {
        email: `Subject: Acknowledgment of Participation

Dear Recipient,

Thank you for your participation in our program. Your involvement has been noted and is appreciated by our organization.

We look forward to continued engagement with our services.

Sincerely,
Program Administration`,
        explanation: "Generic AI response - formal, cold, impersonal",
        promptQuality: 'poor' as const
      },
      goodExample: {
        email: `Subject: You made our kids' day! 🎨

Hi Sarah!

I had to share this with you - after you helped with the art station yesterday, three different kids asked when "the nice art lady" was coming back!

Your patience with little Emma while she worked on her clay sculpture was exactly what she needed. She's been talking about it all week and even asked her mom to buy clay for home.

Thank you for bringing such joy and creativity to our Hope Gardens family. You're amazing!

With so much gratitude,
Maya`,
        explanation: "PACE method result - specific, warm, personal, and community-focused",
        promptQuality: 'excellent' as const
      }
    };
  }
}

export const mayaAIEmailService = MayaAIEmailService.getInstance();