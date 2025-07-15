#!/usr/bin/env ts-node
/**
 * Structure Guide Compliance Checker
 * Deep analysis of content structure, organization, and navigation patterns
 */

import { readFileSync, existsSync } from 'fs';
import { supabase } from '../src/integrations/supabase/client';

interface StructureComplianceResult {
  category: string;
  status: 'passed' | 'failed' | 'warning';
  score: number;
  details: string[];
  recommendations: string[];
}

interface StructureAnalysis {
  contentStructure: StructureComplianceResult;
  navigationFlow: StructureComplianceResult;
  lessonProgression: StructureComplianceResult;
  chapterConsistency: StructureComplianceResult;
  overallScore: number;
}

class StructureGuideComplianceChecker {
  
  async runStructureAnalysis(): Promise<StructureAnalysis> {
    console.log('🏗️ Starting deep structure analysis...');
    
    const contentStructure = await this.analyzeContentStructure();
    const navigationFlow = await this.analyzeNavigationFlow();
    const lessonProgression = await this.analyzeLessonProgression();
    const chapterConsistency = await this.analyzeChapterConsistency();
    
    const overallScore = Math.round(
      (contentStructure.score + navigationFlow.score + 
       lessonProgression.score + chapterConsistency.score) / 4
    );
    
    return {
      contentStructure,
      navigationFlow,
      lessonProgression,
      chapterConsistency,
      overallScore
    };
  }
  
  private async analyzeContentStructure(): Promise<StructureComplianceResult> {
    const details: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    
    // Check content blocks structure
    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('is_active', true);
    
    if (contentBlocks) {
      // Analyze content hierarchy
      const blocksWithHeadings = contentBlocks.filter(block => 
        block.content.includes('#') || block.content.includes('<h')
      );
      const headingPercentage = (blocksWithHeadings.length / contentBlocks.length) * 100;
      
      if (headingPercentage >= 80) {
        score += 25;
        details.push(`✅ ${Math.round(headingPercentage)}% of content blocks have proper headings`);
      } else {
        recommendations.push('Add more structured headings to content blocks');
        details.push(`⚠️ Only ${Math.round(headingPercentage)}% of content blocks have headings (target: 80%+)`);
      }
      
      // Check content length consistency
      const contentLengths = contentBlocks.map(block => block.content.length);
      const avgLength = contentLengths.reduce((a, b) => a + b, 0) / contentLengths.length;
      const varianceThreshold = avgLength * 0.5; // 50% variance allowed
      const consistentLengths = contentLengths.filter(length => 
        Math.abs(length - avgLength) <= varianceThreshold
      );
      const consistencyPercentage = (consistentLengths.length / contentLengths.length) * 100;
      
      if (consistencyPercentage >= 70) {
        score += 25;
        details.push(`✅ ${Math.round(consistencyPercentage)}% of content blocks have consistent length`);
      } else {
        recommendations.push('Standardize content block lengths for better pacing');
        details.push(`⚠️ Only ${Math.round(consistencyPercentage)}% of content blocks have consistent length`);
      }
      
      // Check for proper introduction/conclusion patterns
      const blocksWithIntro = contentBlocks.filter(block => 
        block.content.toLowerCase().includes('introduction') ||
        block.content.toLowerCase().includes('welcome') ||
        block.content.toLowerCase().includes('overview')
      );
      
      const blocksWithConclusion = contentBlocks.filter(block => 
        block.content.toLowerCase().includes('summary') ||
        block.content.toLowerCase().includes('conclusion') ||
        block.content.toLowerCase().includes('key takeaway')
      );
      
      if (blocksWithIntro.length >= 5 && blocksWithConclusion.length >= 5) {
        score += 25;
        details.push('✅ Good use of introduction and conclusion patterns');
      } else {
        recommendations.push('Add more introduction and conclusion content blocks');
        details.push(`⚠️ Limited intro/conclusion patterns (${blocksWithIntro.length} intros, ${blocksWithConclusion.length} conclusions)`);
      }
      
      // Check semantic structure (lists, emphasis, etc.)
      const semanticBlocks = contentBlocks.filter(block => 
        block.content.includes('**') || // Bold
        block.content.includes('*') ||  // Italic
        block.content.includes('-') ||  // Lists
        block.content.includes('1.') || // Numbered lists
        block.content.includes('```')   // Code blocks
      );
      const semanticPercentage = (semanticBlocks.length / contentBlocks.length) * 100;
      
      if (semanticPercentage >= 60) {
        score += 25;
        details.push(`✅ ${Math.round(semanticPercentage)}% of content uses semantic formatting`);
      } else {
        recommendations.push('Improve semantic formatting (bold, italic, lists) in content');
        details.push(`⚠️ Only ${Math.round(semanticPercentage)}% of content uses semantic formatting`);
      }
    }
    
    const status = score >= 75 ? 'passed' : score >= 50 ? 'warning' : 'failed';
    
    return {
      category: 'Content Structure',
      status,
      score,
      details,
      recommendations
    };
  }
  
  private async analyzeNavigationFlow(): Promise<StructureComplianceResult> {
    const details: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    
    // Check chapter-lesson organization
    const { data: chapters } = await supabase
      .from('chapters')
      .select(`
        *,
        lessons (
          id,
          title,
          order_index,
          interactive_elements (id)
        )
      `)
      .eq('is_active', true)
      .order('order_index');
    
    if (chapters) {
      // Check chapter progression logic
      let hasLogicalProgression = true;
      for (let i = 0; i < chapters.length - 1; i++) {
        if (chapters[i].order_index >= chapters[i + 1].order_index) {
          hasLogicalProgression = false;
          break;
        }
      }
      
      if (hasLogicalProgression) {
        score += 25;
        details.push('✅ Chapters follow logical numerical progression');
      } else {
        recommendations.push('Fix chapter ordering inconsistencies');
        details.push('❌ Chapter order_index values are not sequential');
      }
      
      // Check lesson distribution across chapters
      const lessonCounts = chapters.map(chapter => chapter.lessons?.length || 0);
      const avgLessonsPerChapter = lessonCounts.reduce((a, b) => a + b, 0) / lessonCounts.length;
      const balancedDistribution = lessonCounts.every(count => 
        Math.abs(count - avgLessonsPerChapter) <= 2
      );
      
      if (balancedDistribution) {
        score += 25;
        details.push(`✅ Balanced lesson distribution (avg: ${Math.round(avgLessonsPerChapter)} lessons per chapter)`);
      } else {
        recommendations.push('Balance lesson distribution across chapters');
        details.push(`⚠️ Unbalanced lesson distribution: ${lessonCounts.join(', ')} lessons per chapter`);
      }
      
      // Check interactive element distribution
      const interactiveElementCounts = chapters.map(chapter => 
        chapter.lessons?.reduce((total, lesson) => 
          total + (lesson.interactive_elements?.length || 0), 0
        ) || 0
      );
      
      const minElements = Math.min(...interactiveElementCounts);
      const maxElements = Math.max(...interactiveElementCounts);
      const elementBalance = minElements / maxElements;
      
      if (elementBalance >= 0.7) { // Max 30% difference
        score += 25;
        details.push(`✅ Well-balanced interactive elements across chapters (${interactiveElementCounts.join(', ')})`);
      } else {
        recommendations.push('Balance interactive elements distribution across chapters');
        details.push(`⚠️ Unbalanced interactive elements: ${interactiveElementCounts.join(', ')} per chapter`);
      }
      
      // Check navigation components existence
      const navigationFiles = [
        'src/components/navigation/Chapter3Sidebar.tsx',
        'src/components/navigation/Chapter4Sidebar.tsx',
        'src/components/navigation/Chapter5Sidebar.tsx',
        'src/components/navigation/Chapter6Sidebar.tsx'
      ];
      
      const existingNavFiles = navigationFiles.filter(file => existsSync(file));
      const navCoverage = (existingNavFiles.length / chapters.length) * 100;
      
      if (navCoverage >= 75) {
        score += 25;
        details.push(`✅ ${Math.round(navCoverage)}% of chapters have dedicated navigation components`);
      } else {
        recommendations.push('Create navigation components for all chapters');
        details.push(`⚠️ Only ${Math.round(navCoverage)}% of chapters have navigation components`);
      }
    }
    
    const status = score >= 75 ? 'passed' : score >= 50 ? 'warning' : 'failed';
    
    return {
      category: 'Navigation Flow',
      status,
      score,
      details,
      recommendations
    };
  }
  
  private async analyzeLessonProgression(): Promise<StructureComplianceResult> {
    const details: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    
    // Check lesson complexity progression within chapters
    const { data: lessons } = await supabase
      .from('lessons')
      .select(`
        *,
        chapter:chapters!inner(id, order_index),
        interactive_elements (
          id,
          type,
          configuration
        ),
        content_blocks (id)
      `)
      .eq('chapter.is_active', true)
      .order('chapter.order_index, order_index');
    
    if (lessons) {
      // Group lessons by chapter
      const lessonsByChapter = lessons.reduce((acc, lesson) => {
        const chapterNum = lesson.chapter.order_index;
        if (!acc[chapterNum]) acc[chapterNum] = [];
        acc[chapterNum].push(lesson);
        return acc;
      }, {} as Record<number, any[]>);
      
      let progressionScore = 0;
      let chaptersAnalyzed = 0;
      
      for (const [chapterNum, chapterLessons] of Object.entries(lessonsByChapter)) {
        chaptersAnalyzed++;
        
        // Check if complexity increases within chapter
        const complexityScores = chapterLessons.map(lesson => {
          const interactiveCount = lesson.interactive_elements?.length || 0;
          const contentBlockCount = lesson.content_blocks?.length || 0;
          const phaseComplexity = lesson.interactive_elements?.reduce((total: number, element: any) => {
            const phases = element.configuration?.phases;
            return total + (Array.isArray(phases) ? phases.length : 1);
          }, 0) || 0;
          
          return interactiveCount + contentBlockCount + phaseComplexity;
        });
        
        // Check if generally increasing (allowing for some variation)
        let increasingTrend = true;
        for (let i = 0; i < complexityScores.length - 1; i++) {
          const currentWindow = complexityScores.slice(i, i + 2);
          const nextWindow = complexityScores.slice(i + 1, i + 3);
          const currentAvg = currentWindow.reduce((a, b) => a + b, 0) / currentWindow.length;
          const nextAvg = nextWindow.reduce((a, b) => a + b, 0) / nextWindow.length;
          
          if (nextAvg < currentAvg * 0.8) { // Allow 20% decrease
            increasingTrend = false;
            break;
          }
        }
        
        if (increasingTrend) {
          progressionScore++;
          details.push(`✅ Chapter ${chapterNum}: Complexity increases appropriately`);
        } else {
          recommendations.push(`Improve complexity progression in Chapter ${chapterNum}`);
          details.push(`⚠️ Chapter ${chapterNum}: Complexity progression needs improvement`);
        }
      }
      
      if (progressionScore / chaptersAnalyzed >= 0.75) {
        score += 50;
      } else {
        score += Math.round((progressionScore / chaptersAnalyzed) * 50);
      }
      
      // Check lesson title consistency patterns
      const titlePatterns = lessons.map(lesson => {
        const title = lesson.title || '';
        return {
          hasCharacterName: /\b(Maya|Sofia|David|Rachel|Alex)\b/.test(title),
          hasActionWord: /\b(Create|Build|Master|Transform|Analyze|Discover)\b/.test(title),
          length: title.length
        };
      });
      
      const consistentNaming = titlePatterns.filter(pattern => 
        pattern.hasCharacterName || pattern.hasActionWord
      );
      const namingConsistency = (consistentNaming.length / titlePatterns.length) * 100;
      
      if (namingConsistency >= 80) {
        score += 50;
        details.push(`✅ ${Math.round(namingConsistency)}% of lessons follow consistent naming patterns`);
      } else {
        recommendations.push('Improve lesson title consistency (character names or action words)');
        details.push(`⚠️ Only ${Math.round(namingConsistency)}% of lessons follow consistent naming patterns`);
      }
    }
    
    const status = score >= 75 ? 'passed' : score >= 50 ? 'warning' : 'failed';
    
    return {
      category: 'Lesson Progression',
      status,
      score,
      details,
      recommendations
    };
  }
  
  private async analyzeChapterConsistency(): Promise<StructureComplianceResult> {
    const details: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    
    // Check character assignment consistency
    const { data: chapters } = await supabase
      .from('chapters')
      .select(`
        *,
        lessons (
          id,
          title,
          content_blocks (content),
          interactive_elements (title, configuration)
        )
      `)
      .eq('is_active', true);
    
    if (chapters) {
      const characterAssignments = {
        2: 'Maya',
        3: 'Sofia', 
        4: 'David',
        5: 'Rachel',
        6: 'Alex'
      };
      
      let consistentChapters = 0;
      
      for (const chapter of chapters) {
        const expectedCharacter = characterAssignments[chapter.order_index as keyof typeof characterAssignments];
        if (!expectedCharacter) continue;
        
        let characterMentions = 0;
        let wrongCharacterMentions = 0;
        
        // Check content blocks
        for (const lesson of chapter.lessons || []) {
          for (const contentBlock of lesson.content_blocks || []) {
            const content = contentBlock.content || '';
            if (content.includes(expectedCharacter)) {
              characterMentions++;
            }
            
            // Check for wrong character mentions
            for (const [chapterNum, character] of Object.entries(characterAssignments)) {
              if (parseInt(chapterNum) !== chapter.order_index && content.includes(character)) {
                wrongCharacterMentions++;
              }
            }
          }
          
          // Check interactive elements
          for (const element of lesson.interactive_elements || []) {
            const title = element.title || '';
            const component = element.configuration?.component || '';
            
            if (title.includes(expectedCharacter) || component.includes(expectedCharacter)) {
              characterMentions++;
            }
            
            // Check for wrong character mentions
            for (const [chapterNum, character] of Object.entries(characterAssignments)) {
              if (parseInt(chapterNum) !== chapter.order_index && 
                  (title.includes(character) || component.includes(character))) {
                wrongCharacterMentions++;
              }
            }
          }
        }
        
        const consistencyRatio = characterMentions / (characterMentions + wrongCharacterMentions + 1);
        
        if (consistencyRatio >= 0.9) {
          consistentChapters++;
          details.push(`✅ Chapter ${chapter.order_index}: Strong ${expectedCharacter} focus (${characterMentions} mentions, ${wrongCharacterMentions} cross-references)`);
        } else {
          recommendations.push(`Clean up character consistency in Chapter ${chapter.order_index}`);
          details.push(`⚠️ Chapter ${chapter.order_index}: Character consistency issues (${characterMentions} ${expectedCharacter}, ${wrongCharacterMentions} others)`);
        }
      }
      
      const consistencyPercentage = (consistentChapters / Object.keys(characterAssignments).length) * 100;
      score = Math.round(consistencyPercentage);
      
      if (consistencyPercentage >= 80) {
        details.push(`✅ Overall character consistency: ${Math.round(consistencyPercentage)}%`);
      } else {
        details.push(`⚠️ Overall character consistency: ${Math.round(consistencyPercentage)}% (target: 80%+)`);
      }
    }
    
    const status = score >= 75 ? 'passed' : score >= 50 ? 'warning' : 'failed';
    
    return {
      category: 'Chapter Consistency',
      status,
      score,
      details,
      recommendations
    };
  }
}

export { StructureGuideComplianceChecker, StructureAnalysis };