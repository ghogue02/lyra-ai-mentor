#!/usr/bin/env ts-node
/**
 * Run Structure Compliance Audit
 */

import { StructureGuideComplianceChecker } from './structure-guide-compliance-checker';
import { writeFileSync } from 'fs';

async function runStructureComplianceAudit() {
  console.log('🏗️ Running Structure Compliance Audit...\n');
  
  const checker = new StructureGuideComplianceChecker();
  const analysis = await checker.runStructureAnalysis();
  
  console.log('📊 STRUCTURE COMPLIANCE ANALYSIS RESULTS');
  console.log('=' .repeat(80));
  
  // Display results
  const categories = [
    analysis.contentStructure,
    analysis.navigationFlow,
    analysis.lessonProgression,
    analysis.chapterConsistency
  ];
  
  categories.forEach(category => {
    console.log(`\n📋 ${category.category}`);
    console.log('-'.repeat(40));
    console.log(`Status: ${category.status === 'passed' ? '✅' : category.status === 'warning' ? '⚠️' : '❌'} ${category.status.toUpperCase()}`);
    console.log(`Score: ${category.score}/100`);
    
    if (category.details.length > 0) {
      console.log('\nDetails:');
      category.details.forEach(detail => console.log(`  ${detail}`));
    }
    
    if (category.recommendations.length > 0) {
      console.log('\nRecommendations:');
      category.recommendations.forEach(rec => console.log(`  • ${rec}`));
    }
  });
  
  console.log('\n\n📊 OVERALL COMPLIANCE SCORE');
  console.log('=' .repeat(80));
  console.log(`Overall Score: ${analysis.overallScore}/100`);
  console.log(`Status: ${analysis.overallScore >= 75 ? '✅ PASSED' : analysis.overallScore >= 50 ? '⚠️ NEEDS IMPROVEMENT' : '❌ FAILED'}`);
  
  // Save audit results
  const auditReport = {
    timestamp: new Date().toISOString(),
    analysisResults: analysis,
    summary: {
      overallScore: analysis.overallScore,
      categoryScores: {
        contentStructure: analysis.contentStructure.score,
        navigationFlow: analysis.navigationFlow.score,
        lessonProgression: analysis.lessonProgression.score,
        chapterConsistency: analysis.chapterConsistency.score
      },
      totalRecommendations: categories.reduce((total, cat) => total + cat.recommendations.length, 0)
    }
  };
  
  const filename = `/Users/greghogue/Lyra New/lyra-ai-mentor/audits/structure-compliance-${new Date().toISOString().split('T')[0]}.json`;
  writeFileSync(filename, JSON.stringify(auditReport, null, 2));
  console.log(`\n📝 Audit report saved to: ${filename}`);
  
  return analysis;
}

runStructureComplianceAudit().catch(console.error);