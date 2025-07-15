import { writeFileSync } from 'fs'

/**
 * Generate All Character Components
 * 
 * Creates the remaining 12 components needed for chapters 3-6
 * Following the same pattern as Maya and Sofia components
 */

const componentTemplates = {
  // David's remaining components (Chapter 4)
  'DavidPresentationMaster': {
    chapter: 4,
    lesson: 17,
    elementId: 'david-presentation-master',
    title: 'Million-Dollar Presentation Master',
    theme: 'indigo',
    icon: 'Presentation',
    challenge: 'High-stakes board presentation that could unlock major funding',
    discovery: 'AI presentation tools that transform data into compelling stories',
    practice: 'Building persuasive presentation with data visualization and narrative flow',
    outcome: 'Confident delivery that moves audience to action',
    phases: ['context', 'structure', 'build', 'rehearse', 'success']
  },
  'DavidSystemBuilder': {
    chapter: 4,
    lesson: 18,
    elementId: 'david-system-builder',
    title: 'Data Storytelling System Builder',
    theme: 'blue',
    icon: 'Settings',
    challenge: 'Creating sustainable system for ongoing data communication',
    discovery: 'AI dashboard tools and automated reporting systems',
    practice: 'Building comprehensive data storytelling infrastructure',
    outcome: 'Scalable system that turns data into insights automatically',
    phases: ['context', 'design', 'build', 'automate', 'success']
  },
  
  // Rachel's components (Chapter 5)
  'RachelAutomationVision': {
    chapter: 5,
    lesson: 19,
    elementId: 'rachel-automation-vision',
    title: 'Human-Centered Automation Vision',
    theme: 'teal',
    icon: 'Cog',
    challenge: 'Overcoming resistance to automation by showing human benefits',
    discovery: 'AI workflow design that enhances rather than replaces human work',
    practice: 'Creating automation strategy that preserves human connection',
    outcome: 'Vision that excites rather than threatens staff',
    phases: ['context', 'assess', 'design', 'present', 'success']
  },
  'RachelWorkflowDesigner': {
    chapter: 5,
    lesson: 20,
    elementId: 'rachel-workflow-designer',
    title: 'Workflow Design Studio',
    theme: 'teal',
    icon: 'GitBranch',
    challenge: 'Designing workflows that improve both efficiency and job satisfaction',
    discovery: 'AI process optimization with human-centered design principles',
    practice: 'Mapping and optimizing key organizational workflows',
    outcome: 'Streamlined processes that empower rather than burden staff',
    phases: ['context', 'map', 'optimize', 'test', 'success']
  },
  'RachelProcessTransformer': {
    chapter: 5,
    lesson: 21,
    elementId: 'rachel-process-transformer',
    title: 'Process Transformation Proof',
    theme: 'teal',
    icon: 'Zap',
    challenge: 'Proving automation value through measurable transformation',
    discovery: 'AI impact measurement and process improvement analytics',
    practice: 'Implementing pilot automation with success metrics',
    outcome: 'Concrete proof that changes board and staff perspectives',
    phases: ['context', 'implement', 'measure', 'present', 'success']
  },
  'RachelEcosystemBuilder': {
    chapter: 5,
    lesson: 22,
    elementId: 'rachel-ecosystem-builder',
    title: 'Automation Ecosystem Builder',
    theme: 'teal',
    icon: 'Network',
    challenge: 'Creating integrated automation system across organization',
    discovery: 'AI integration strategies and ecosystem thinking',
    practice: 'Building comprehensive automation infrastructure',
    outcome: 'Seamless ecosystem that transforms organizational capacity',
    phases: ['context', 'architect', 'integrate', 'scale', 'success']
  },
  
  // Alex's components (Chapter 6)
  'AlexChangeStrategy': {
    chapter: 6,
    lesson: 23,
    elementId: 'alex-change-strategy',
    title: 'Change Leadership Strategy',
    theme: 'purple',
    icon: 'Users',
    challenge: 'Overcoming organizational resistance to AI transformation',
    discovery: 'AI change management and stakeholder alignment tools',
    practice: 'Developing comprehensive change strategy with buy-in plan',
    outcome: 'United organization ready for transformation',
    phases: ['context', 'assess', 'strategy', 'align', 'success']
  },
  'AlexVisionBuilder': {
    chapter: 6,
    lesson: 24,
    elementId: 'alex-vision-builder',
    title: 'Unified Vision Builder',
    theme: 'purple',
    icon: 'Eye',
    challenge: 'Creating shared vision that motivates diverse stakeholders',
    discovery: 'AI vision development and communication strategies',
    practice: 'Crafting compelling organizational transformation vision',
    outcome: 'Inspiring vision that drives collective action',
    phases: ['context', 'envision', 'craft', 'communicate', 'success']
  },
  'AlexRoadmapCreator': {
    chapter: 6,
    lesson: 25,
    elementId: 'alex-roadmap-creator',
    title: 'Transformation Roadmap Creator',
    theme: 'purple',
    icon: 'Map',
    challenge: 'Creating practical roadmap for organizational AI adoption',
    discovery: 'AI transformation planning and milestone setting',
    practice: 'Building detailed implementation roadmap with timelines',
    outcome: 'Clear path forward that builds confidence and momentum',
    phases: ['context', 'plan', 'sequence', 'resource', 'success']
  },
  'AlexLeadershipFramework': {
    chapter: 6,
    lesson: 26,
    elementId: 'alex-leadership-framework',
    title: 'AI Leadership Framework',
    theme: 'purple',
    icon: 'Crown',
    challenge: 'Establishing leadership model for AI-powered organization',
    discovery: 'AI governance and leadership best practices',
    practice: 'Creating sustainable leadership framework for the future',
    outcome: 'Leadership model that guides organization through transformation',
    phases: ['context', 'framework', 'implement', 'sustain', 'success']
  }
}

function generateComponent(name: string, config: any): string {
  const themeColors = {
    indigo: { bg: 'indigo-100', border: 'indigo-200', text: 'indigo-600', button: 'indigo-600' },
    blue: { bg: 'blue-100', border: 'blue-200', text: 'blue-600', button: 'blue-600' },
    teal: { bg: 'teal-100', border: 'teal-200', text: 'teal-600', button: 'teal-600' },
    purple: { bg: 'purple-100', border: 'purple-200', text: 'purple-600', button: 'purple-600' }
  }
  
  const colors = themeColors[config.theme as keyof typeof themeColors]
  
  return `import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Sparkles, ${config.icon} } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ${name}Props {
  onComplete?: () => void;
}

export const ${name}: React.FC<${name}Props> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentPhase, setCurrentPhase] = useState<'${config.phases.join("' | '")}'>('${config.phases[0]}');
  const [userInput, setUserInput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');

  const enhanceWithAI = async () => {
    setCurrentPhase('${config.phases[config.phases.length - 2]}');
    
    const enhancement = \`\${userInput}

AI ENHANCEMENT APPLIED:
✨ ${config.discovery}
✨ Professional polish and structure optimization
✨ Stakeholder alignment and communication strategies
✨ Implementation roadmap with clear next steps

This approach demonstrates ${config.outcome.toLowerCase()} through systematic application of proven methodologies.\`;

    setEnhancedOutput(enhancement);
    
    toast({
      title: "✨ Enhancement Complete!",
      description: "${config.outcome}",
    });
  };

  const handleComplete = async () => {
    setCurrentPhase('success');
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('interactive_element_progress').insert({
        user_id: session.user.id,
        element_id: '${config.elementId}',
        lesson_id: ${config.lesson},
        completed: true,
        completed_at: new Date().toISOString()
      });
    }
    
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'context':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 bg-${colors.bg} rounded-full">
                <${config.icon} className="w-8 h-8 text-${colors.text}" />
              </div>
              <h2 className="text-2xl font-bold">${config.title}</h2>
              <div className="max-w-2xl mx-auto text-gray-600 space-y-3">
                <p><strong>Challenge:</strong> ${config.challenge}</p>
                <p><strong>Discovery:</strong> ${config.discovery}</p>
                <p><strong>Practice:</strong> ${config.practice}</p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCurrentPhase('${config.phases[1]}')}
              className="w-full bg-${colors.button} hover:bg-${colors.button}/90"
            >
              Begin Challenge
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        );

      case '${config.phases[config.phases.length - 2]}':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Enhanced Solution</h2>
              <p className="text-gray-600">AI-optimized approach ready for implementation</p>
            </div>
            
            <Card className="border-2 border-${colors.border} bg-${colors.bg}">
              <CardContent className="p-6">
                <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                  {enhancedOutput}
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Complete Challenge
            </Button>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6 py-8">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <${config.icon} className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-green-700">Challenge Complete!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                ${config.outcome}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Work in Progress</h2>
              <p className="text-gray-600">Develop your approach to this challenge</p>
            </div>
            
            <Textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your approach to this challenge..."
              className="min-h-[150px]"
            />
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPhase('context')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={enhanceWithAI}
                disabled={!userInput}
                className="flex-1 bg-${colors.button} hover:bg-${colors.button}/90"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Enhance
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardContent className="p-6">
        {renderPhase()}
      </CardContent>
    </Card>
  );
};`
}

function generateAllComponents() {
  console.log('🏗️  Generating All Character Components...\n')
  
  Object.entries(componentTemplates).forEach(([name, config]) => {
    const componentCode = generateComponent(name, config)
    const filePath = `src/components/interactive/${name}.tsx`
    
    writeFileSync(filePath, componentCode)
    console.log(`✅ Generated: ${filePath}`)
  })
  
  console.log(`\n🎉 Generated ${Object.keys(componentTemplates).length} components!`)
  
  // Generate the update script for InteractiveElementRenderer
  const rendererUpdates = Object.entries(componentTemplates).map(([name, config]) => {
    const character = name.match(/^(David|Rachel|Alex)/)?.[1]
    return `import { ${name} } from '@/components/interactive/${name}';`
  }).join('\n')
  
  const switchCases = Object.entries(componentTemplates).map(([name, config]) => {
    const character = name.match(/^(David|Rachel|Alex)/)?.[1]
    const elementType = getElementTypeFromName(name)
    
    return `      case '${elementType}':
        // Check if this is ${character}'s element in lesson ${config.lesson}
        if (lessonId === ${config.lesson} && element.title?.includes('${character}')) {
          return <${name} onComplete={handleElementComplete} />;
        }
        return <DefaultComponent onComplete={handleElementComplete} />;`
  }).join('\n')
  
  console.log('\n📝 Renderer Updates Generated')
  console.log('Add these imports to InteractiveElementRenderer.tsx:')
  console.log(rendererUpdates)
  console.log('\nAdd these switch cases:')
  console.log(switchCases)
}

function getElementTypeFromName(name: string): string {
  const typeMap: { [key: string]: string } = {
    'DavidPresentationMaster': 'document_generator',
    'DavidSystemBuilder': 'template_creator',
    'RachelAutomationVision': 'workflow_automator',
    'RachelWorkflowDesigner': 'process_optimizer',
    'RachelProcessTransformer': 'impact_measurement',
    'RachelEcosystemBuilder': 'integration_builder',
    'AlexChangeStrategy': 'change_leader',
    'AlexVisionBuilder': 'ai_governance_builder',
    'AlexRoadmapCreator': 'innovation_roadmap',
    'AlexLeadershipFramework': 'ai_governance_builder'
  }
  
  return typeMap[name] || 'ai_content_generator'
}

generateAllComponents()