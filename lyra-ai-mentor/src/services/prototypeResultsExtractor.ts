/**
 * PROTOTYPE RESULTS EXTRACTOR
 * Extracts and analyzes results from automated prototype creation
 */

import AutomatedPrototypeCreator, { AutomatedPrototype } from './automatedPrototypeCreator';

export interface PrototypeAnalysis {
  prototype: AutomatedPrototype;
  aiResponses: string[];
  qualityAnalysis: {
    averageScore: number;
    characterConsistency: number;
    bestInteraction: string;
    worstInteraction: string;
  };
  recommendationLevel: 'excellent' | 'good' | 'needs-improvement' | 'failed';
  productionReadiness: boolean;
}

export class PrototypeResultsExtractor {
  private creator: AutomatedPrototypeCreator;

  constructor() {
    this.creator = AutomatedPrototypeCreator.getInstance();
  }

  /**
   * Extract all prototype results with detailed analysis
   */
  async extractAllResults(): Promise<PrototypeAnalysis[]> {
    const prototypes = this.creator.getPrototypeResults();
    const analyses: PrototypeAnalysis[] = [];

    for (const prototype of prototypes) {
      if (prototype.status === 'completed') {
        const analysis = this.analyzePrototype(prototype);
        analyses.push(analysis);
      }
    }

    return analyses.sort((a, b) => b.qualityAnalysis.averageScore - a.qualityAnalysis.averageScore);
  }

  /**
   * Get production-ready prototypes
   */
  async getProductionReadyPrototypes(): Promise<PrototypeAnalysis[]> {
    const allResults = await this.extractAllResults();
    return allResults.filter(analysis => analysis.productionReadiness);
  }

  /**
   * Analyze individual prototype
   */
  private analyzePrototype(prototype: AutomatedPrototype): PrototypeAnalysis {
    const completedInteractions = prototype.interactions.filter(i => i.status === 'completed');
    const scores = completedInteractions.map(i => i.qualityScore || 0);
    const consistencyScores = completedInteractions.map(i => i.characterConsistency || 0);
    
    const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const averageConsistency = consistencyScores.length > 0 ? consistencyScores.reduce((a, b) => a + b, 0) / consistencyScores.length : 0;

    const bestInteraction = completedInteractions.reduce((best, current) => 
      (current.qualityScore || 0) > (best.qualityScore || 0) ? current : best
    );

    const worstInteraction = completedInteractions.reduce((worst, current) => 
      (current.qualityScore || 0) < (worst.qualityScore || 0) ? current : worst
    );

    const aiResponses = completedInteractions.map(i => i.aiResponse || '');

    let recommendationLevel: 'excellent' | 'good' | 'needs-improvement' | 'failed';
    if (averageScore >= 8.5) recommendationLevel = 'excellent';
    else if (averageScore >= 7) recommendationLevel = 'good';
    else if (averageScore >= 5) recommendationLevel = 'needs-improvement';
    else recommendationLevel = 'failed';

    return {
      prototype,
      aiResponses,
      qualityAnalysis: {
        averageScore: Math.round(averageScore * 10) / 10,
        characterConsistency: Math.round(averageConsistency * 10) / 10,
        bestInteraction: `${bestInteraction.type} (${bestInteraction.qualityScore}/10)`,
        worstInteraction: `${worstInteraction.type} (${worstInteraction.qualityScore}/10)`
      },
      recommendationLevel,
      productionReadiness: averageScore >= 7 && averageConsistency >= 6
    };
  }

  /**
   * Generate summary report
   */
  async generateSummaryReport(): Promise<string> {
    const analyses = await this.extractAllResults();
    const productionReady = analyses.filter(a => a.productionReadiness);
    
    let report = `# 🎭 AUTOMATED PROTOTYPE CREATION RESULTS\n\n`;
    report += `**Summary:**\n`;
    report += `- ✅ **${analyses.length}** prototypes created\n`;
    report += `- 🚀 **${productionReady.length}** ready for production\n`;
    report += `- 🧠 **${analyses.reduce((sum, a) => sum + a.prototype.interactions.length, 0)}** live AI interactions executed\n\n`;

    for (const analysis of analyses) {
      const status = analysis.productionReadiness ? '✅ APPROVED' : '⚠️ NEEDS WORK';
      const level = analysis.recommendationLevel.toUpperCase();
      
      report += `## ${status} **${analysis.prototype.name}**\n`;
      report += `**Character:** ${analysis.prototype.character} | **Quality:** ${analysis.qualityAnalysis.averageScore}/10 | **Level:** ${level}\n\n`;
      
      report += `**Key Metrics:**\n`;
      report += `- Average Quality: ${analysis.qualityAnalysis.averageScore}/10\n`;
      report += `- Character Consistency: ${analysis.qualityAnalysis.characterConsistency}/10\n`;
      report += `- Best Interaction: ${analysis.qualityAnalysis.bestInteraction}\n`;
      report += `- Worst Interaction: ${analysis.qualityAnalysis.worstInteraction}\n\n`;

      report += `**AI Response Preview:**\n`;
      if (analysis.aiResponses[0]) {
        const preview = analysis.aiResponses[0].substring(0, 300) + '...';
        report += `\`\`\`\n${preview}\n\`\`\`\n\n`;
      }

      if (analysis.prototype.results?.feedback) {
        report += `**Feedback:**\n`;
        analysis.prototype.results.feedback.forEach(feedback => {
          report += `- ${feedback}\n`;
        });
        report += `\n`;
      }

      report += `---\n\n`;
    }

    return report;
  }

  /**
   * Get detailed AI responses for a specific prototype
   */
  getDetailedResponses(prototypeName: string): any {
    const prototypes = this.creator.getPrototypeResults();
    const prototype = prototypes.find(p => p.name === prototypeName);
    
    if (!prototype) return null;

    return {
      name: prototype.name,
      character: prototype.character,
      interactions: prototype.interactions.map(interaction => ({
        type: interaction.type,
        prompt: interaction.prompt,
        response: interaction.aiResponse,
        qualityScore: interaction.qualityScore,
        characterConsistency: interaction.characterConsistency
      }))
    };
  }
}

export default PrototypeResultsExtractor;