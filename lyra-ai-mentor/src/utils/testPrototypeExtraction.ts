/**
 * TEST PROTOTYPE EXTRACTION
 * Testing script to extract and display prototype results
 */

import { PrototypeResultsExtractor } from '../services/prototypeResultsExtractor';
import { AutomatedPrototypeCreator } from '../services/automatedPrototypeCreator';

export async function testPrototypeExtraction() {
  console.log('🔍 Extracting prototype results...');
  
  const extractor = new PrototypeResultsExtractor();
  const creator = AutomatedPrototypeCreator.getInstance();
  
  // Get all prototype results
  const allPrototypes = creator.getPrototypeResults();
  console.log(`Found ${allPrototypes.length} prototypes`);
  
  // Analyze results
  const analyses = await extractor.extractAllResults();
  const productionReady = await extractor.getProductionReadyPrototypes();
  
  console.log('📊 PROTOTYPE ANALYSIS RESULTS:');
  console.log(`Total Created: ${analyses.length}`);
  console.log(`Production Ready: ${productionReady.length}`);
  
  // Log each prototype summary
  for (const analysis of analyses) {
    console.log(`\n🎭 ${analysis.prototype.name}`);
    console.log(`Character: ${analysis.prototype.character}`);
    console.log(`Quality: ${analysis.qualityAnalysis.averageScore}/10`);
    console.log(`Consistency: ${analysis.qualityAnalysis.characterConsistency}/10`);
    console.log(`Status: ${analysis.productionReadiness ? '✅ READY' : '⚠️ NEEDS WORK'}`);
    console.log(`Level: ${analysis.recommendationLevel.toUpperCase()}`);
  }
  
  // Generate and return full report
  const report = await extractor.generateSummaryReport();
  console.log('\n📋 Full Report Generated');
  
  return {
    analyses,
    productionReady,
    report,
    allPrototypes
  };
}

// Export for use in console or other components
(window as any).testPrototypeExtraction = testPrototypeExtraction;