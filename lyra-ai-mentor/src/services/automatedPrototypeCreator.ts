/**
 * AUTOMATED PROTOTYPE CREATOR
 * Automatically generates demo prototypes using live AI integration
 */

import { LiveAIService } from './liveAIService';
import { MCPSwarmController } from '../orchestration/MCPSwarmController';

export interface AutomatedPrototype {
  id: string;
  name: string;
  character: string;
  concept: string;
  objectives: string[];
  interactions: AutomatedInteraction[];
  status: 'creating' | 'testing' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  results?: PrototypeResults;
}

export interface AutomatedInteraction {
  id: string;
  type: 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
  prompt: string;
  expectedFocus: string;
  aiResponse?: string;
  qualityScore?: number;
  characterConsistency?: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface PrototypeResults {
  overallQuality: number;
  characterConsistency: number;
  learningValue: number;
  interactionSuccess: number;
  recommendedForProduction: boolean;
  feedback: string[];
}

export interface PrototypeTemplate {
  name: string;
  character: string;
  concept: string;
  objectives: string[];
  testInteractions: Array<{
    type: 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
    prompt: string;
    expectedFocus: string;
  }>;
}

export class AutomatedPrototypeCreator {
  private static instance: AutomatedPrototypeCreator;
  private liveAI: LiveAIService;
  private swarmController: MCPSwarmController;
  private activePrototypes: Map<string, AutomatedPrototype> = new Map();

  private constructor() {
    this.liveAI = LiveAIService.getInstance();
    this.swarmController = MCPSwarmController.getInstance();
    // Load any existing prototypes from storage
    this.loadPrototypesFromStorage();
  }

  static getInstance(): AutomatedPrototypeCreator {
    if (!AutomatedPrototypeCreator.instance) {
      AutomatedPrototypeCreator.instance = new AutomatedPrototypeCreator();
      // Make available globally for debugging
      (window as any).AutomatedPrototypeCreator = AutomatedPrototypeCreator;
    }
    return AutomatedPrototypeCreator.instance;
  }

  /**
   * Create all 5 strategic prototypes automatically
   */
  async createAllPrototypes(): Promise<AutomatedPrototype[]> {
    console.log('🚀 Starting automated creation of 5 strategic prototypes...');

    const templates = this.getPrototypeTemplates();
    const createdPrototypes: AutomatedPrototype[] = [];

    // Initialize swarm for batch creation
    await this.initializeSwarmForBatchCreation();

    for (const template of templates) {
      try {
        console.log(`🎭 Creating prototype: ${template.name}`);
        const prototype = await this.createSinglePrototype(template);
        createdPrototypes.push(prototype);
        this.activePrototypes.set(prototype.id, prototype);
        
        // Save to localStorage for persistence
        this.savePrototypesToStorage();
      } catch (error) {
        console.error(`❌ Failed to create prototype ${template.name}:`, error);
      }
    }

    console.log(`✅ Created ${createdPrototypes.length}/5 prototypes successfully`);
    
    // Final save to storage
    this.savePrototypesToStorage();
    
    return createdPrototypes;
  }

  /**
   * Initialize swarm for batch prototype creation
   */
  private async initializeSwarmForBatchCreation(): Promise<void> {
    console.log('🐝 Initializing swarm for batch prototype creation...');
    
    try {
      // Initialize swarm coordination system
      await this.swarmController.initializeSwarmSystem();
      console.log('✅ Swarm initialized for batch creation');
    } catch (error) {
      console.warn('⚠️ Swarm initialization failed, continuing with direct mode:', error);
    }
  }

  /**
   * Create a single prototype from template
   */
  private async createSinglePrototype(template: PrototypeTemplate): Promise<AutomatedPrototype> {
    const prototype: AutomatedPrototype = {
      id: `proto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      character: template.character,
      concept: template.concept,
      objectives: template.objectives,
      interactions: [],
      status: 'creating',
      createdAt: new Date()
    };

    // Orchestrate prototype creation through swarm
    try {
      await this.swarmController.orchestrateTask(
        `Create prototype "${template.name}" for character ${template.character}`,
        'adaptive'
      );
    } catch (error) {
      console.warn('⚠️ Swarm orchestration failed, continuing with direct creation:', error);
    }

    // Create interactions with live AI
    prototype.status = 'testing';
    for (const interactionTemplate of template.testInteractions) {
      const interaction = await this.createInteraction(prototype, interactionTemplate);
      prototype.interactions.push(interaction);
    }

    // Analyze results and generate scores
    prototype.results = await this.analyzePrototypeResults(prototype);
    prototype.status = 'completed';
    prototype.completedAt = new Date();

    console.log(`✅ Completed prototype: ${prototype.name}`);
    return prototype;
  }

  /**
   * Create and execute a single interaction
   */
  private async createInteraction(
    prototype: AutomatedPrototype, 
    template: { type: string; prompt: string; expectedFocus: string }
  ): Promise<AutomatedInteraction> {
    const interaction: AutomatedInteraction = {
      id: `int_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type: template.type as any,
      prompt: template.prompt,
      expectedFocus: template.expectedFocus,
      status: 'running'
    };

    try {
      console.log(`🧠 Executing ${template.type} interaction for ${prototype.character}`);
      
      // Execute live AI interaction
      const aiResponse = await this.liveAI.executeInteraction({
        id: interaction.id,
        type: interaction.type,
        prompt: interaction.prompt,
        character: prototype.character,
        timestamp: new Date()
      });

      interaction.aiResponse = aiResponse;
      interaction.status = 'completed';

      // Analyze interaction quality
      const analysis = await this.analyzeInteractionQuality(interaction, prototype.character);
      interaction.qualityScore = analysis.qualityScore;
      interaction.characterConsistency = analysis.characterConsistency;

      console.log(`✅ Interaction completed with quality score: ${interaction.qualityScore}`);
    } catch (error) {
      console.error(`❌ Interaction failed:`, error);
      interaction.status = 'failed';
      interaction.qualityScore = 0;
      interaction.characterConsistency = 0;
    }

    return interaction;
  }

  /**
   * Analyze interaction quality using AI
   */
  private async analyzeInteractionQuality(
    interaction: AutomatedInteraction, 
    character: string
  ): Promise<{ qualityScore: number; characterConsistency: number }> {
    try {
      const analysisPrompt = `Analyze this AI interaction for quality and character consistency:

Character: ${character}
Interaction Type: ${interaction.type}
Prompt: ${interaction.prompt}
AI Response: ${interaction.aiResponse}

Rate on scale 1-10:
1. Overall Quality (clarity, usefulness, educational value)
2. Character Consistency (matches ${character}'s personality and expertise)

Provide scores in format: Quality: X/10, Consistency: Y/10`;

      const analysisResponse = await this.liveAI.executeInteraction({
        id: 'analysis_' + interaction.id,
        type: 'email-composer', // Use any type for analysis
        prompt: analysisPrompt,
        character: 'Maya', // Use Maya for analysis
        timestamp: new Date()
      });

      // Parse scores from response (simplified parsing)
      const qualityMatch = analysisResponse.match(/Quality:\s*(\d+)/i);
      const consistencyMatch = analysisResponse.match(/Consistency:\s*(\d+)/i);

      const qualityScore = qualityMatch ? parseInt(qualityMatch[1]) : 7;
      const characterConsistency = consistencyMatch ? parseInt(consistencyMatch[1]) : 7;

      return { qualityScore, characterConsistency };
    } catch (error) {
      console.warn('⚠️ Analysis failed, using default scores:', error);
      return { qualityScore: 7, characterConsistency: 7 };
    }
  }

  /**
   * Analyze overall prototype results
   */
  private async analyzePrototypeResults(prototype: AutomatedPrototype): Promise<PrototypeResults> {
    const completedInteractions = prototype.interactions.filter(i => i.status === 'completed');
    
    if (completedInteractions.length === 0) {
      return {
        overallQuality: 0,
        characterConsistency: 0,
        learningValue: 0,
        interactionSuccess: 0,
        recommendedForProduction: false,
        feedback: ['No successful interactions completed']
      };
    }

    const avgQuality = completedInteractions.reduce((sum, i) => sum + (i.qualityScore || 0), 0) / completedInteractions.length;
    const avgConsistency = completedInteractions.reduce((sum, i) => sum + (i.characterConsistency || 0), 0) / completedInteractions.length;
    const successRate = completedInteractions.length / prototype.interactions.length;

    const overallScore = (avgQuality + avgConsistency + (successRate * 10)) / 3;

    return {
      overallQuality: Math.round(avgQuality * 10) / 10,
      characterConsistency: Math.round(avgConsistency * 10) / 10,
      learningValue: Math.round(avgQuality * 10) / 10, // Simplified
      interactionSuccess: Math.round(successRate * 100),
      recommendedForProduction: overallScore >= 7,
      feedback: this.generatePrototypeFeedback(prototype, avgQuality, avgConsistency, successRate)
    };
  }

  /**
   * Generate feedback for prototype
   */
  private generatePrototypeFeedback(
    prototype: AutomatedPrototype,
    avgQuality: number,
    avgConsistency: number,
    successRate: number
  ): string[] {
    const feedback: string[] = [];

    if (avgQuality >= 8) {
      feedback.push(`✅ Excellent quality responses for ${prototype.character}`);
    } else if (avgQuality >= 6) {
      feedback.push(`⚠️ Good quality but could improve clarity and depth`);
    } else {
      feedback.push(`❌ Quality needs improvement - responses lack depth or clarity`);
    }

    if (avgConsistency >= 8) {
      feedback.push(`✅ Strong character consistency - ${prototype.character}'s personality shines through`);
    } else if (avgConsistency >= 6) {
      feedback.push(`⚠️ Moderate character consistency - some responses feel generic`);
    } else {
      feedback.push(`❌ Poor character consistency - responses don't match ${prototype.character}'s expertise`);
    }

    if (successRate >= 0.8) {
      feedback.push(`✅ High interaction success rate (${Math.round(successRate * 100)}%)`);
    } else {
      feedback.push(`⚠️ Some interactions failed - check API connectivity`);
    }

    const bestInteraction = prototype.interactions.reduce((best, current) => 
      (current.qualityScore || 0) > (best.qualityScore || 0) ? current : best
    );
    feedback.push(`🌟 Best interaction: ${bestInteraction.type} (Score: ${bestInteraction.qualityScore}/10)`);

    return feedback;
  }

  /**
   * Get all prototype templates
   */
  private getPrototypeTemplates(): PrototypeTemplate[] {
    return [
      {
        name: "Maya Chapter 3: Advanced Tone Mastery & Relationship Building",
        character: "Maya",
        concept: "Advanced lesson focusing on sophisticated tone adaptation for different stakeholder relationships. Maya guides users through complex communication scenarios including board presentations, donor relations, community outreach, and crisis communication. Builds on Chapter 2's foundation with nuanced relationship management.",
        objectives: [
          "Master tone adaptation for different stakeholder types (donors, board, community, media)",
          "Navigate complex relationship dynamics in nonprofit communications",
          "Handle sensitive and crisis communications with appropriate tone",
          "Build long-term stakeholder relationships through consistent communication style",
          "Integrate emotional intelligence with professional communication strategies"
        ],
        testInteractions: [
          {
            type: 'email-composer',
            prompt: "Write a delicate email to a major donor who expressed concerns about our program effectiveness after reading negative media coverage",
            expectedFocus: "Sophisticated tone that acknowledges concerns while rebuilding confidence"
          },
          {
            type: 'conversation-handler',
            prompt: "Handle a tense board meeting where members are questioning leadership decisions and budget allocation",
            expectedFocus: "Professional, transparent communication that maintains authority while showing accountability"
          },
          {
            type: 'email-composer',
            prompt: "Craft a community announcement about program changes that some stakeholders oppose",
            expectedFocus: "Balanced tone that respects concerns while communicating necessary changes"
          }
        ]
      },

      {
        name: "Sofia Voice Revolution Lab",
        character: "Sofia",
        concept: "Interactive workshop where Sofia demonstrates cutting-edge AI voice tools for nonprofit accessibility and outreach. Users learn to implement voice interfaces, automated phone systems, and audio content creation. Focus on breaking down barriers and reaching underserved communities through voice technology.",
        objectives: [
          "Implement AI voice tools for accessibility (visually impaired, elderly, non-English speakers)",
          "Create automated voice systems for volunteer coordination and donor outreach",
          "Develop multilingual voice content for diverse communities",
          "Design voice-first user experiences for nonprofit services",
          "Measure and improve voice interaction effectiveness"
        ],
        testInteractions: [
          {
            type: 'voice-interface',
            prompt: "Design a voice-activated volunteer check-in system for a food bank that serves Spanish and English speaking communities",
            expectedFocus: "Multilingual accessibility with clear, warm voice interactions"
          },
          {
            type: 'automation-builder',
            prompt: "Create an automated phone system that helps elderly clients navigate our transportation services",
            expectedFocus: "Patient, clear voice automation designed for older adults"
          },
          {
            type: 'voice-interface',
            prompt: "Build a voice interface for blind and visually impaired users to access our resource database",
            expectedFocus: "Comprehensive accessibility with intuitive voice navigation"
          }
        ]
      },

      {
        name: "David Data Detective Challenge",
        character: "David",
        concept: "Mystery-solving adventure where David teaches data analysis through investigating nonprofit impact questions. Users become 'data detectives' uncovering insights about program effectiveness, donor behavior, and community needs. Combines storytelling with practical data skills using real nonprofit scenarios.",
        objectives: [
          "Investigate program impact using data analysis techniques",
          "Uncover hidden patterns in donor and volunteer behavior",
          "Solve community needs assessment puzzles through data",
          "Create compelling data stories that drive organizational decisions",
          "Build confidence in data interpretation and presentation"
        ],
        testInteractions: [
          {
            type: 'data-analyzer',
            prompt: "Investigate why our youth mentoring program shows great attendance but poor long-term outcomes - what does the data reveal?",
            expectedFocus: "Detective-style data exploration revealing correlation vs causation insights"
          },
          {
            type: 'email-composer',
            prompt: "Present data findings about declining volunteer retention to the board in a way that motivates action rather than blame",
            expectedFocus: "Data storytelling that transforms numbers into compelling narratives"
          },
          {
            type: 'data-analyzer',
            prompt: "Analyze donation patterns to predict which donors are at risk of lapsing and why",
            expectedFocus: "Predictive analysis with actionable insights for donor relations"
          }
        ]
      },

      {
        name: "Rachel Automation Academy",
        character: "Rachel",
        concept: "Comprehensive training program where Rachel systematically transforms nonprofit operations through intelligent automation. Users learn to identify automation opportunities, design workflows, and implement systems that free up time for mission-critical work. Focus on practical, implementable solutions.",
        objectives: [
          "Identify high-impact automation opportunities in nonprofit operations",
          "Design and implement donor management automation workflows",
          "Create volunteer coordination and communication systems",
          "Automate reporting and compliance processes",
          "Build scalable systems that grow with organizational needs"
        ],
        testInteractions: [
          {
            type: 'automation-builder',
            prompt: "Design a complete new donor onboarding automation that personalizes the experience based on donation source and amount",
            expectedFocus: "Systematic workflow design with personalization and follow-up sequences"
          },
          {
            type: 'automation-builder',
            prompt: "Create an automated volunteer scheduling system that handles availability, skills matching, and reminder communications",
            expectedFocus: "Complex automation balancing human needs with operational efficiency"
          },
          {
            type: 'email-composer',
            prompt: "Write documentation for staff on how to maintain and update the new automation systems",
            expectedFocus: "Clear, step-by-step guidance for non-technical staff"
          }
        ]
      },

      {
        name: "Alex Change Leadership Clinic",
        character: "Alex",
        concept: "Strategic change management workshop where Alex guides leaders through organizational AI adoption challenges. Focus on overcoming resistance, building buy-in, and creating sustainable change culture. Addresses real fears and concerns while demonstrating practical benefits.",
        objectives: [
          "Assess organizational readiness for AI tool adoption",
          "Design change management strategies for technology implementation",
          "Handle resistance and fears about AI in nonprofit work",
          "Build coalition and buy-in across different stakeholder groups",
          "Create sustainable practices for ongoing technology adaptation"
        ],
        testInteractions: [
          {
            type: 'conversation-handler',
            prompt: "Handle a staff meeting where long-term employees express fear that AI tools will replace their jobs or devalue their experience",
            expectedFocus: "Empathetic leadership that addresses fears while showing value of human+AI collaboration"
          },
          {
            type: 'email-composer',
            prompt: "Communicate a new AI tools policy to the board that addresses ethical concerns while showing potential impact",
            expectedFocus: "Strategic communication balancing innovation with organizational values"
          },
          {
            type: 'conversation-handler',
            prompt: "Facilitate a difficult conversation between tech-enthusiastic younger staff and change-resistant senior leadership",
            expectedFocus: "Diplomatic mediation that bridges generational and technological divides"
          }
        ]
      }
    ];
  }

  /**
   * Get results for all prototypes
   */
  getPrototypeResults(): AutomatedPrototype[] {
    return Array.from(this.activePrototypes.values());
  }

  /**
   * Get recommended prototypes for production
   */
  getRecommendedPrototypes(): AutomatedPrototype[] {
    return this.getPrototypeResults().filter(p => 
      p.results?.recommendedForProduction && p.status === 'completed'
    );
  }

  /**
   * Save prototypes to localStorage for persistence
   */
  private savePrototypesToStorage(): void {
    try {
      const prototypesArray = Array.from(this.activePrototypes.values());
      const serializedData = JSON.stringify(prototypesArray, null, 2);
      localStorage.setItem('automated_prototypes', serializedData);
      console.log(`💾 Saved ${prototypesArray.length} prototypes to storage`);
    } catch (error) {
      console.error('❌ Failed to save prototypes to storage:', error);
    }
  }

  /**
   * Load prototypes from localStorage
   */
  private loadPrototypesFromStorage(): void {
    try {
      const stored = localStorage.getItem('automated_prototypes');
      if (stored) {
        const prototypesArray: AutomatedPrototype[] = JSON.parse(stored);
        this.activePrototypes.clear();
        
        prototypesArray.forEach(prototype => {
          // Convert date strings back to Date objects
          prototype.createdAt = new Date(prototype.createdAt);
          if (prototype.completedAt) {
            prototype.completedAt = new Date(prototype.completedAt);
          }
          // Convert interaction timestamps
          prototype.interactions.forEach(interaction => {
            if (interaction.timestamp) {
              (interaction as any).timestamp = new Date((interaction as any).timestamp);
            }
          });
          
          this.activePrototypes.set(prototype.id, prototype);
        });
        
        console.log(`📂 Loaded ${prototypesArray.length} prototypes from storage`);
      }
    } catch (error) {
      console.error('❌ Failed to load prototypes from storage:', error);
    }
  }

  /**
   * Clear all stored prototypes (for testing)
   */
  clearStoredPrototypes(): void {
    localStorage.removeItem('automated_prototypes');
    this.activePrototypes.clear();
    console.log('🗑️ Cleared all stored prototypes');
  }
}

export default AutomatedPrototypeCreator;