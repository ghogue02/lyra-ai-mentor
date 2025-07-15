#!/usr/bin/env ts-node
/**
 * Automated Guideline Compliance Checker
 * Runs checks against all active guidelines and generates a compliance report
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { supabase } from '../src/integrations/supabase/client';
import { StructureGuideComplianceChecker } from './structure-guide-compliance-checker';

interface ComplianceResult {
  guideline: string;
  status: 'passed' | 'failed' | 'warning';
  details: string[];
  checkedAt: string;
}

interface ComplianceReport {
  timestamp: string;
  overallCompliance: number;
  results: ComplianceResult[];
  recommendations: string[];
}

class GuidelineComplianceChecker {
  private guidelines = [
    '/documentation/guides/tone-style-guide.md',
    '/documentation/guides/structure-guide.md',
    '/documentation/interactive-elements/engagement-excellence-guidelines.md',
    '/documentation/guides/interactive-element-improvement-system.md',
    '/documentation/interactive-elements/storyline-evolution-guidelines.md',
    '/documentation/guides/ux-guide.md',
    '/documentation/interactive-elements/gamification-guidelines.md',
    '/documentation/guides/testing-standards.md'
  ];

  async runComplianceCheck(): Promise<ComplianceReport> {
    console.log('🔍 Starting guideline compliance check...');
    
    const results: ComplianceResult[] = [];
    
    // Check each guideline
    for (const guideline of this.guidelines) {
      const result = await this.checkGuideline(guideline);
      results.push(result);
    }
    
    // Calculate overall compliance
    const passedCount = results.filter(r => r.status === 'passed').length;
    const overallCompliance = Math.round((passedCount / results.length) * 100);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(results);
    
    const report: ComplianceReport = {
      timestamp: new Date().toISOString(),
      overallCompliance,
      results,
      recommendations
    };
    
    // Save report
    this.saveReport(report);
    
    return report;
  }

  private async checkGuideline(guidelinePath: string): Promise<ComplianceResult> {
    const guidelineName = guidelinePath.split('/').pop() || 'Unknown';
    
    try {
      switch (guidelineName) {
        case 'engagement-excellence-guidelines.md':
          return await this.checkEngagementExcellence();
        
        case 'testing-standards.md':
          return await this.checkTestingStandards();
        
        case 'tone-style-guide.md':
          return await this.checkToneStyle();
        
        case 'structure-guide.md':
          return await this.checkStructureGuide();
        
        default:
          return {
            guideline: guidelineName,
            status: 'warning',
            details: ['Automated check not implemented for this guideline'],
            checkedAt: new Date().toISOString()
          };
      }
    } catch (error) {
      return {
        guideline: guidelineName,
        status: 'failed',
        details: [`Error checking guideline: ${error.message}`],
        checkedAt: new Date().toISOString()
      };
    }
  }

  private async checkEngagementExcellence(): Promise<ComplianceResult> {
    const details: string[] = [];
    let status: 'passed' | 'failed' | 'warning' = 'passed';
    
    // Check interactive elements for required features
    const { data: elements } = await supabase
      .from('interactive_elements')
      .select('*')
      .eq('is_active', true);
    
    if (elements) {
      // Check for time savings metrics
      const elementsWithMetrics = elements.filter(e => 
        e.configuration?.timeSavings || e.configuration?.metrics
      );
      const metricsPercentage = (elementsWithMetrics.length / elements.length) * 100;
      
      if (metricsPercentage < 80) {
        status = 'warning';
        details.push(`Only ${Math.round(metricsPercentage)}% of elements have time metrics (target: 80%+)`);
      } else {
        details.push(`✅ ${Math.round(metricsPercentage)}% of elements have time metrics`);
      }
      
      // Check for character integration
      const elementsWithCharacter = elements.filter(e => 
        e.configuration?.character || e.configuration?.character_context
      );
      const characterPercentage = (elementsWithCharacter.length / elements.length) * 100;
      
      if (characterPercentage < 90) {
        status = status === 'passed' ? 'warning' : status;
        details.push(`Only ${Math.round(characterPercentage)}% of elements have character integration (target: 90%+)`);
      } else {
        details.push(`✅ ${Math.round(characterPercentage)}% of elements have character integration`);
      }
      
      // Check for phase variety
      const { data: phaseData } = await supabase.rpc('get_phase_variety_stats');
      if (phaseData?.average_variety < 1.5) {
        status = status === 'passed' ? 'warning' : status;
        details.push('Limited phase variety detected in lessons');
      } else {
        details.push('✅ Good phase variety across lessons');
      }
    }
    
    return {
      guideline: 'Engagement Excellence Guidelines',
      status,
      details,
      checkedAt: new Date().toISOString()
    };
  }

  private async checkTestingStandards(): Promise<ComplianceResult> {
    const details: string[] = [];
    let status: 'passed' | 'failed' | 'warning' = 'passed';
    
    // Check if test files exist
    const testDirs = [
      'src/components/interactive/__tests__',
      'tests'
    ];
    
    for (const dir of testDirs) {
      if (existsSync(dir)) {
        const files = readdirSync(dir);
        const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.'));
        details.push(`✅ Found ${testFiles.length} test files in ${dir}`);
      } else {
        status = 'warning';
        details.push(`⚠️ Test directory ${dir} not found`);
      }
    }
    
    // Check if test scripts are configured
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    if (packageJson.scripts?.test) {
      details.push('✅ Test script configured in package.json');
    } else {
      status = 'failed';
      details.push('❌ No test script found in package.json');
    }
    
    return {
      guideline: 'Testing Standards',
      status,
      details,
      checkedAt: new Date().toISOString()
    };
  }

  private async checkToneStyle(): Promise<ComplianceResult> {
    const details: string[] = [];
    let status: 'passed' | 'failed' | 'warning' = 'passed';
    
    // Check content blocks for tone consistency
    const { data: contentBlocks } = await supabase
      .from('content_blocks')
      .select('content')
      .eq('is_active', true)
      .limit(50);
    
    if (contentBlocks) {
      // Simple checks for tone indicators
      const formalTerms = ['hereby', 'aforementioned', 'pursuant', 'whereas'];
      const jargonTerms = ['synergize', 'leverage', 'ideate', 'pivot'];
      
      let formalCount = 0;
      let jargonCount = 0;
      
      contentBlocks.forEach(block => {
        const content = block.content.toLowerCase();
        formalTerms.forEach(term => {
          if (content.includes(term)) formalCount++;
        });
        jargonTerms.forEach(term => {
          if (content.includes(term)) jargonCount++;
        });
      });
      
      if (formalCount > 5) {
        status = 'warning';
        details.push(`⚠️ Found ${formalCount} instances of overly formal language`);
      } else {
        details.push('✅ Tone is appropriately conversational');
      }
      
      if (jargonCount > 3) {
        status = status === 'passed' ? 'warning' : status;
        details.push(`⚠️ Found ${jargonCount} instances of business jargon`);
      } else {
        details.push('✅ Minimal jargon detected');
      }
    }
    
    return {
      guideline: 'Tone & Style Guide',
      status,
      details,
      checkedAt: new Date().toISOString()
    };
  }

  private async checkStructureGuide(): Promise<ComplianceResult> {
    const details: string[] = [];
    let status: 'passed' | 'failed' | 'warning' = 'passed';
    
    try {
      const structureChecker = new StructureGuideComplianceChecker();
      const analysis = await structureChecker.runStructureAnalysis();
      
      // Overall assessment
      if (analysis.overallScore >= 75) {
        status = 'passed';
        details.push(`✅ Overall structure score: ${analysis.overallScore}%`);
      } else if (analysis.overallScore >= 50) {
        status = 'warning';
        details.push(`⚠️ Overall structure score: ${analysis.overallScore}% (target: 75%+)`);
      } else {
        status = 'failed';
        details.push(`❌ Overall structure score: ${analysis.overallScore}% (critical issues found)`);
      }
      
      // Add category details
      details.push(`📝 Content Structure: ${analysis.contentStructure.score}% - ${analysis.contentStructure.status.toUpperCase()}`);
      details.push(`🧭 Navigation Flow: ${analysis.navigationFlow.score}% - ${analysis.navigationFlow.status.toUpperCase()}`);
      details.push(`📈 Lesson Progression: ${analysis.lessonProgression.score}% - ${analysis.lessonProgression.status.toUpperCase()}`);
      details.push(`🎭 Chapter Consistency: ${analysis.chapterConsistency.score}% - ${analysis.chapterConsistency.status.toUpperCase()}`);
      
      // Add top recommendations
      const allRecommendations = [
        ...analysis.contentStructure.recommendations,
        ...analysis.navigationFlow.recommendations,
        ...analysis.lessonProgression.recommendations,
        ...analysis.chapterConsistency.recommendations
      ];
      
      if (allRecommendations.length > 0) {
        details.push(`🔧 Key recommendations: ${allRecommendations.slice(0, 3).join(', ')}`);
      }
      
    } catch (error) {
      status = 'failed';
      details.push(`❌ Error running structure analysis: ${error.message}`);
    }
    
    return {
      guideline: 'Structure Guide',
      status,
      details,
      checkedAt: new Date().toISOString()
    };
  }

  private generateRecommendations(results: ComplianceResult[]): string[] {
    const recommendations: string[] = [];
    
    results.forEach(result => {
      if (result.status === 'failed') {
        recommendations.push(`🚨 Critical: Address failures in ${result.guideline}`);
      } else if (result.status === 'warning') {
        recommendations.push(`⚠️ Improve: ${result.guideline} has warnings that should be addressed`);
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('✨ Excellent! All guidelines are being followed.');
    }
    
    return recommendations;
  }

  private saveReport(report: ComplianceReport): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `guideline-compliance-${timestamp}.json`;
    const filepath = join('audits', filename);
    
    writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📊 Compliance report saved to: ${filepath}`);
    
    // Also save a summary in markdown
    const summaryPath = join('audits', `compliance-summary-${timestamp}.md`);
    const summary = this.generateMarkdownSummary(report);
    writeFileSync(summaryPath, summary);
    console.log(`📝 Summary saved to: ${summaryPath}`);
  }

  private generateMarkdownSummary(report: ComplianceReport): string {
    let summary = `# Guideline Compliance Report
**Date**: ${new Date(report.timestamp).toLocaleDateString()}
**Overall Compliance**: ${report.overallCompliance}%

## Results Summary
`;

    report.results.forEach(result => {
      const emoji = result.status === 'passed' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
      summary += `\n### ${emoji} ${result.guideline}\n`;
      summary += `**Status**: ${result.status.toUpperCase()}\n`;
      result.details.forEach(detail => {
        summary += `- ${detail}\n`;
      });
    });

    summary += `\n## Recommendations\n`;
    report.recommendations.forEach(rec => {
      summary += `- ${rec}\n`;
    });

    return summary;
  }
}

// Run the checker if executed directly
const checker = new GuidelineComplianceChecker();
checker.runComplianceCheck()
  .then(report => {
    console.log(`\n✅ Compliance check complete!`);
    console.log(`Overall compliance: ${report.overallCompliance}%`);
  })
  .catch(error => {
    console.error('❌ Error running compliance check:', error);
    process.exit(1);
  });

export { GuidelineComplianceChecker, ComplianceReport };