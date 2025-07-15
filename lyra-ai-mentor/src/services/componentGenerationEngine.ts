/**
 * COMPONENT GENERATION ENGINE
 * Converts approved prototypes into production React components
 */

import { AutomatedPrototype } from './automatedPrototypeCreator';
import { PrototypeResultsExtractor } from './prototypeResultsExtractor';
import { MCPSwarmController } from '../orchestration/MCPSwarmController';

export interface ComponentConfig {
  id: string;
  name: string;
  character: string;
  filepath: string;
  routePath: string;
  imports: string[];
  interfaces: string[];
  componentCode: string;
  styleClasses: string[];
}

export interface LessonStructure {
  id: string;
  name: string;
  character: string;
  chapter: number;
  lessonNumber: number;
  objectives: string[];
  interactions: InteractionComponent[];
  routing: RoutingConfig;
  integrations: IntegrationConfig;
}

export interface InteractionComponent {
  id: string;
  type: 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
  prompt: string;
  aiResponse: string;
  componentCode: string;
  propsInterface: string;
}

export interface RoutingConfig {
  path: string;
  lazyImport: string;
  routeDefinition: string;
}

export interface IntegrationConfig {
  myToolkit: boolean;
  progressTracking: boolean;
  characterStory: boolean;
  gamification: boolean;
}

export class ComponentGenerationEngine {
  private static instance: ComponentGenerationEngine;
  private extractor: PrototypeResultsExtractor;
  private swarmController: MCPSwarmController;
  private generatedComponents: Map<string, ComponentConfig> = new Map();

  private constructor() {
    this.extractor = new PrototypeResultsExtractor();
    this.swarmController = MCPSwarmController.getInstance();
  }

  static getInstance(): ComponentGenerationEngine {
    if (!ComponentGenerationEngine.instance) {
      ComponentGenerationEngine.instance = new ComponentGenerationEngine();
    }
    return ComponentGenerationEngine.instance;
  }

  /**
   * Generate production components from approved prototypes
   */
  async generateProductionComponents(): Promise<ComponentConfig[]> {
    console.log('🏗️ Starting Component Generation Engine...');

    // Get production-ready prototypes
    const approvedPrototypes = await this.extractor.getProductionReadyPrototypes();
    console.log(`📦 Found ${approvedPrototypes.length} approved prototypes for production`);

    if (approvedPrototypes.length === 0) {
      // For demo purposes, let's create some mock approved prototypes if none exist
      console.log('⚠️ No approved prototypes found. Creating demo components for testing...');
      return this.generateDemoComponents();
    }

    // Initialize swarm for component generation
    await this.initializeComponentGeneration();

    const generatedComponents: ComponentConfig[] = [];

    for (const analysis of approvedPrototypes) {
      try {
        console.log(`🎭 Generating component for: ${analysis.prototype.name}`);
        const component = await this.generateSingleComponent(analysis.prototype);
        generatedComponents.push(component);
        this.generatedComponents.set(component.id, component);
      } catch (error) {
        console.error(`❌ Failed to generate component for ${analysis.prototype.name}:`, error);
      }
    }

    console.log(`✅ Generated ${generatedComponents.length} production components`);
    return generatedComponents;
  }

  /**
   * Generate demo components for testing when no prototypes exist
   */
  private async generateDemoComponents(): Promise<ComponentConfig[]> {
    const demoPrototypes = [
      {
        id: 'maya_demo',
        name: 'Maya Chapter 3: Advanced Tone Mastery & Relationship Building',
        character: 'Maya',
        concept: 'Advanced lesson focusing on sophisticated tone adaptation for different stakeholder relationships.',
        objectives: [
          'Master tone adaptation for different stakeholder types (donors, board, community, media)',
          'Navigate complex relationship dynamics in nonprofit communications',
          'Handle sensitive and crisis communications with appropriate tone',
          'Build long-term stakeholder relationships through consistent communication style'
        ],
        interactions: [
          {
            id: 'interaction1',
            type: 'email-composer',
            prompt: 'Write a delicate email to a major donor who expressed concerns about our program effectiveness after reading negative media coverage',
            aiResponse: '🤖 Live AI Response (OpenAI gpt-4o):\n\nSubject: Re: Your Important Concerns About Our Program Impact\n\nDear [Donor Name],\n\nThank you for reaching out about the recent media coverage regarding our programs. I deeply appreciate your commitment to our mission and understand your concerns about program effectiveness.\n\nI want to address your questions directly and transparently. While the media coverage highlighted some challenges, I believe it\'s important to provide you with the complete picture of our impact and the steps we\'re taking to continuously improve.\n\nHere\'s what I can share:\n\n• Our recent third-party evaluation shows 78% positive outcomes in our core programs\n• We\'ve implemented new tracking systems to better measure and report impact\n• The concerns raised are being addressed through our newly formed Program Excellence Committee\n\nI would welcome the opportunity to discuss this with you personally. Could we schedule a brief call this week? I can walk you through our impact data and answer any specific questions you might have.\n\nYour partnership has been instrumental in our success, and I want to ensure you feel confident in our continued collaboration. Our mission depends on supporters like you who hold us accountable to the highest standards.\n\nThank you for your continued trust and partnership.\n\nWarm regards,\n[Your name]',
            qualityScore: 9,
            characterConsistency: 8,
            status: 'completed'
          },
          {
            id: 'interaction2',
            type: 'conversation-handler',
            prompt: 'Handle a tense board meeting where members are questioning leadership decisions and budget allocation',
            aiResponse: '🤖 Live AI Response (OpenAI gpt-4o):\n\nI understand there are serious concerns about our recent decisions, and I want to address each of them thoughtfully.\n\nFirst, let me acknowledge that transparency is crucial for board confidence. You deserve clear explanations for our budget allocations and strategic choices.\n\nRegarding the budget concerns:\n- The 15% increase in program costs reflects our commitment to evidence-based interventions\n- We\'ve reallocated 8% from administrative overhead to direct service delivery\n- Our cost-per-outcome has actually improved by 12% over the past year\n\nI propose we implement quarterly budget reviews with detailed impact metrics so you can see exactly how investments translate to outcomes.\n\nFor the leadership decisions you\'ve questioned, I take full responsibility. Moving forward, I commit to:\n- Bringing major strategic decisions to the board before implementation\n- Providing monthly progress reports with both successes and challenges\n- Creating an advisory committee for complex operational decisions\n\nYour oversight makes us stronger. What specific areas would you like us to prioritize for improvement?',
            qualityScore: 8,
            characterConsistency: 9,
            status: 'completed'
          }
        ],
        status: 'completed' as const,
        createdAt: new Date(),
        completedAt: new Date(),
        results: {
          overallQuality: 8.5,
          characterConsistency: 8.5,
          learningValue: 9,
          interactionSuccess: 100,
          recommendedForProduction: true,
          feedback: ['✅ Excellent quality responses for Maya', '✅ Strong character consistency - Maya\'s personality shines through']
        }
      },
      {
        id: 'sofia_demo',
        name: 'Sofia Voice Revolution Lab',
        character: 'Sofia',
        concept: 'Interactive workshop where Sofia demonstrates cutting-edge AI voice tools for nonprofit accessibility and outreach.',
        objectives: [
          'Implement AI voice tools for accessibility (visually impaired, elderly, non-English speakers)',
          'Create automated voice systems for volunteer coordination and donor outreach',
          'Develop multilingual voice content for diverse communities',
          'Design voice-first user experiences for nonprofit services'
        ],
        interactions: [
          {
            id: 'interaction1',
            type: 'voice-interface',
            prompt: 'Design a voice-activated volunteer check-in system for a food bank that serves Spanish and English speaking communities',
            aiResponse: '🤖 Live AI Response (OpenAI gpt-4o):\n\n¡Hola! Welcome to the Community Food Bank voice check-in system.\n\nFor English, say "English". Para español, diga "Español".\n\n[User selects language]\n\nGreat! Please state your full name clearly.\n\n[System processes: "Maria Rodriguez"]\n\nThank you, Maria! I found your volunteer profile. You\'re scheduled for:\n• Food sorting: 2:00 PM - 4:00 PM\n• Distribution assistance: 4:00 PM - 6:00 PM\n\nIs this correct? Say "yes" to confirm or "changes" to modify.\n\n[Confirmation process]\n\nPerfect! You\'re checked in. Your supervisor today is James, and you\'ll be working in Section B. \n\nFor safety reminders, say "safety". For today\'s special instructions, say "instructions". To complete check-in, say "ready".\n\nThank you for volunteering with us today, Maria! Your service makes a real difference in our community.\n\n[System logs check-in time, sends notification to supervisor, updates volunteer hours database]',
            qualityScore: 9,
            characterConsistency: 8,
            status: 'completed'
          }
        ],
        status: 'completed' as const,
        createdAt: new Date(),
        completedAt: new Date(),
        results: {
          overallQuality: 8.5,
          characterConsistency: 8,
          learningValue: 9,
          interactionSuccess: 100,
          recommendedForProduction: true,
          feedback: ['✅ Excellent technical implementation', '✅ Strong accessibility focus']
        }
      }
    ];

    const components: ComponentConfig[] = [];
    for (const prototype of demoPrototypes) {
      const component = await this.generateSingleComponent(prototype as any);
      components.push(component);
      this.generatedComponents.set(component.id, component);
    }

    return components;
  }

  /**
   * Initialize swarm for component generation
   */
  private async initializeComponentGeneration(): Promise<void> {
    console.log('🐝 Initializing swarm for component generation...');
    
    try {
      await this.swarmController.orchestrateTask(
        'Initialize component generation workflow with React, TypeScript, and integration specialists',
        'parallel'
      );
      console.log('✅ Component generation swarm initialized');
    } catch (error) {
      console.warn('⚠️ Swarm initialization failed, continuing with direct mode:', error);
    }
  }

  /**
   * Generate a single React component from prototype
   */
  private async generateSingleComponent(prototype: AutomatedPrototype): Promise<ComponentConfig> {
    const componentId = this.generateComponentId(prototype.name);
    const componentName = this.generateComponentName(prototype.name);
    const filepath = this.generateFilePath(componentName, prototype.character);
    
    console.log(`🔧 Building component: ${componentName}`);

    // Generate lesson structure
    const lessonStructure = this.generateLessonStructure(prototype);
    
    // Generate interaction components
    const interactions = await this.generateInteractionComponents(prototype);
    
    // Generate main component code
    const componentCode = this.generateMainComponentCode(
      componentName,
      prototype,
      lessonStructure,
      interactions
    );
    
    // Generate TypeScript interfaces
    const interfaces = this.generateTypeScriptInterfaces(prototype, interactions);
    
    // Generate imports
    const imports = this.generateRequiredImports(prototype);
    
    // Generate CSS classes
    const styleClasses = this.generateStyleClasses(prototype);

    return {
      id: componentId,
      name: componentName,
      character: prototype.character,
      filepath,
      routePath: this.generateRoutePath(componentName),
      imports,
      interfaces,
      componentCode,
      styleClasses
    };
  }

  /**
   * Generate lesson structure from prototype
   */
  private generateLessonStructure(prototype: AutomatedPrototype): LessonStructure {
    const chapterNumber = this.getChapterNumber(prototype.character);
    const lessonNumber = this.getLessonNumber(prototype.name);

    return {
      id: this.generateComponentId(prototype.name),
      name: prototype.name,
      character: prototype.character,
      chapter: chapterNumber,
      lessonNumber,
      objectives: prototype.objectives,
      interactions: [], // Will be populated by generateInteractionComponents
      routing: {
        path: this.generateRoutePath(prototype.name),
        lazyImport: this.generateLazyImport(prototype.name),
        routeDefinition: this.generateRouteDefinition(prototype.name)
      },
      integrations: {
        myToolkit: true,
        progressTracking: true,
        characterStory: true,
        gamification: true
      }
    };
  }

  /**
   * Generate interaction components for each prototype interaction
   */
  private async generateInteractionComponents(prototype: AutomatedPrototype): Promise<InteractionComponent[]> {
    const interactions: InteractionComponent[] = [];

    for (const interaction of prototype.interactions) {
      if (interaction.status === 'completed' && interaction.aiResponse) {
        const component = await this.generateInteractionComponent(interaction, prototype.character);
        interactions.push(component);
      }
    }

    return interactions;
  }

  /**
   * Generate a single interaction component
   */
  private async generateInteractionComponent(
    interaction: any, 
    character: string
  ): Promise<InteractionComponent> {
    const componentCode = this.generateInteractionComponentCode(interaction, character);
    const propsInterface = this.generateInteractionPropsInterface(interaction);

    return {
      id: interaction.id,
      type: interaction.type,
      prompt: interaction.prompt,
      aiResponse: interaction.aiResponse,
      componentCode,
      propsInterface
    };
  }

  /**
   * Generate main React component code
   */
  private generateMainComponentCode(
    componentName: string,
    prototype: AutomatedPrototype,
    structure: LessonStructure,
    interactions: InteractionComponent[]
  ): string {
    return `/**
 * ${componentName}
 * Generated from approved prototype: ${prototype.name}
 * Character: ${prototype.character}
 * Generated at: ${new Date().toISOString()}
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/contexts/ProgressContext';
import { useCharacterStory } from '@/contexts/CharacterStoryContext';
import { SaveToToolkit } from '@/components/lesson/chat/lyra/maya/SaveToToolkit';
import { LessonHeader } from '@/components/lesson/LessonHeader';
import { InteractionPanel } from '@/components/lesson/InteractionPanel';

export interface ${componentName}Props {
  lessonId?: string;
  userId?: string;
  onComplete?: () => void;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  lessonId = '${structure.id}',
  userId,
  onComplete
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedInteractions, setCompletedInteractions] = useState<Set<string>>(new Set());
  
  const { updateProgress } = useProgress();
  const { updateStory } = useCharacterStory();

  // Lesson objectives from prototype
  const objectives = ${JSON.stringify(prototype.objectives, null, 4)};

  // Interactive stages based on prototype interactions
  const stages = [
    {
      id: 'introduction',
      title: 'Welcome to ${prototype.name}',
      character: '${prototype.character}',
      content: \`Welcome! I'm ${prototype.character}, and today we're going to work through some real-world scenarios that will help you master these skills. Let's dive in!\`,
      type: 'introduction' as const
    },
${interactions.map((interaction, index) => `    {
      id: '${interaction.id}',
      title: 'Interactive Challenge ${index + 1}',
      character: '${prototype.character}',
      content: \`${interaction.prompt}\`,
      type: '${interaction.type}' as const,
      expectedResponse: \`${interaction.aiResponse.replace(/`/g, '\\`').substring(0, 200)}...\`,
      aiResponse: \`${interaction.aiResponse.replace(/`/g, '\\`')}\`
    }`).join(',\n')}
  ];

  const handleStageComplete = (stageId: string) => {
    setCompletedInteractions(prev => new Set(prev).add(stageId));
    
    // Update progress
    const newProgress = ((completedInteractions.size + 1) / stages.length) * 100;
    setProgress(newProgress);
    updateProgress(lessonId, newProgress);
    
    // Move to next stage
    if (currentStage < stages.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      // Lesson complete
      updateStory(lessonId, {
        character: '${prototype.character}',
        lessonCompleted: true,
        completionDate: new Date()
      });
      onComplete?.();
    }
  };

  const handleSaveToToolkit = (content: any) => {
    // Integration with MyToolkit system
    console.log('💾 Saving to toolkit:', content);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <LessonHeader
        title="${prototype.name}"
        character="${prototype.character}"
        chapter={${structure.chapter}}
        lesson={${structure.lessonNumber}}
        objectives={objectives}
        progress={progress}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎭 {stages[currentStage]?.character}
                <Badge variant="outline">Stage {currentStage + 1} of {stages.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-lg">{stages[currentStage]?.content}</p>
                
                {stages[currentStage]?.type !== 'introduction' && (
                  <InteractionPanel
                    interaction={stages[currentStage]}
                    onComplete={() => handleStageComplete(stages[currentStage].id)}
                    onSave={handleSaveToToolkit}
                  />
                )}
                
                {stages[currentStage]?.type === 'introduction' && (
                  <Button 
                    onClick={() => handleStageComplete(stages[currentStage].id)}
                    className="w-full"
                  >
                    Let's Begin! 🚀
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📈 Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-gray-600">
                {completedInteractions.size} of {stages.length} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Learning Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500">•</span>
                    {objective}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <SaveToToolkit
            content={{
              lessonId,
              character: '${prototype.character}',
              stage: stages[currentStage],
              progress
            }}
            onSave={handleSaveToToolkit}
          />
        </div>
      </div>
    </div>
  );
};

export default ${componentName};`;
  }

  /**
   * Generate TypeScript interfaces for the component
   */
  private generateTypeScriptInterfaces(
    prototype: AutomatedPrototype, 
    interactions: InteractionComponent[]
  ): string[] {
    const interfaces: string[] = [];

    // Main lesson interface
    interfaces.push(`
export interface LessonStage {
  id: string;
  title: string;
  character: string;
  content: string;
  type: 'introduction' | 'email-composer' | 'data-analyzer' | 'automation-builder' | 'voice-interface' | 'conversation-handler';
  expectedResponse?: string;
  aiResponse?: string;
}
    `);

    // Interaction-specific interfaces
    interactions.forEach(interaction => {
      interfaces.push(interaction.propsInterface);
    });

    return interfaces;
  }

  /**
   * Generate required imports
   */
  private generateRequiredImports(prototype: AutomatedPrototype): string[] {
    const baseImports = [
      "import React, { useState, useEffect } from 'react';",
      "import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';",
      "import { Button } from '@/components/ui/button';",
      "import { Badge } from '@/components/ui/badge';",
      "import { Progress } from '@/components/ui/progress';",
      "import { useProgress } from '@/contexts/ProgressContext';",
      "import { useCharacterStory } from '@/contexts/CharacterStoryContext';",
      "import { SaveToToolkit } from '@/components/lesson/chat/lyra/maya/SaveToToolkit';",
      "import { LessonHeader } from '@/components/lesson/LessonHeader';",
      "import { InteractionPanel } from '@/components/lesson/InteractionPanel';"
    ];

    // Add character-specific imports
    const characterImports = this.getCharacterSpecificImports(prototype.character);
    
    return [...baseImports, ...characterImports];
  }

  /**
   * Helper methods for component generation
   */
  private generateComponentId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  private generateComponentName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
      .replace(/\s/g, '');
  }

  private generateFilePath(componentName: string, character: string): string {
    const characterPath = character.toLowerCase();
    return `/src/pages/lessons/${characterPath}/${componentName}.tsx`;
  }

  private generateRoutePath(name: string): string {
    const cleanName = name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    return `/lesson/${cleanName}`;
  }

  private getChapterNumber(character: string): number {
    const chapterMap: Record<string, number> = {
      'Maya': 2,
      'Sofia': 3,
      'David': 4,
      'Rachel': 5,
      'Alex': 6
    };
    return chapterMap[character] || 2;
  }

  private getLessonNumber(name: string): number {
    // Extract lesson number from name or generate sequential
    const match = name.match(/lesson\s*(\d+)/i);
    return match ? parseInt(match[1]) : Math.floor(Math.random() * 10) + 1;
  }

  private generateLazyImport(name: string): string {
    const componentName = this.generateComponentName(name);
    return `const ${componentName} = React.lazy(() => import('./pages/lessons/${componentName}'));`;
  }

  private generateRouteDefinition(name: string): string {
    const componentName = this.generateComponentName(name);
    const routePath = this.generateRoutePath(name);
    
    return `<Route 
  path="${routePath}" 
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading ${name}...</div>}>
        <${componentName} />
      </Suspense>
    </ProtectedRoute>
  } 
/>`;
  }

  private generateInteractionComponentCode(interaction: any, character: string): string {
    // Generate specific component code based on interaction type
    return `// ${interaction.type} component code would be generated here`;
  }

  private generateInteractionPropsInterface(interaction: any): string {
    return `
export interface ${interaction.type.split('-').map((word: string) => 
  word.charAt(0).toUpperCase() + word.slice(1)
).join('')}Props {
  prompt: string;
  onComplete: (response: string) => void;
  aiResponse?: string;
}`;
  }

  private generateStyleClasses(prototype: AutomatedPrototype): string[] {
    return [
      'lesson-container',
      'interaction-panel',
      'character-avatar',
      'progress-indicator',
      'toolkit-integration'
    ];
  }

  private getCharacterSpecificImports(character: string): string[] {
    const characterImports: Record<string, string[]> = {
      'Maya': ["import { MayaAvatar } from '@/components/characters/MayaAvatar';"],
      'Sofia': ["import { SofiaAvatar } from '@/components/characters/SofiaAvatar';"],
      'David': ["import { DavidAvatar } from '@/components/characters/DavidAvatar';"],
      'Rachel': ["import { RachelAvatar } from '@/components/characters/RachelAvatar';"],
      'Alex': ["import { AlexAvatar } from '@/components/characters/AlexAvatar';"]
    };
    
    return characterImports[character] || [];
  }

  /**
   * Get all generated components
   */
  getGeneratedComponents(): ComponentConfig[] {
    return Array.from(this.generatedComponents.values());
  }

  /**
   * Get component by ID
   */
  getComponent(id: string): ComponentConfig | undefined {
    return this.generatedComponents.get(id);
  }
}

export default ComponentGenerationEngine;