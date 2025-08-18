/**
 * Utility functions for converting retention data to PriorityCard format
 */

import { PriorityCard } from '@/components/ui/interaction-patterns/PriorityCardSystem';
import { OptionItem } from '@/components/ui/VisualOptionGrid';

export interface RetentionCardData {
  riskFactors: string[];
  interventions: string[];
  goals: string[];
  metrics: string[];
}

/**
 * Convert VisualOptionGrid OptionItems to PriorityCards for retention factors
 */
export function convertRiskFactorsToPriorityCards(
  riskOptions: OptionItem[],
  selectedRisks: string[]
): PriorityCard[] {
  return selectedRisks.map((riskId, index) => {
    const option = riskOptions.find(opt => opt.id === riskId);
    if (!option) return null;

    return {
      id: option.id,
      title: option.label,
      description: option.description,
      category: 'Risk Factor',
      icon: option.icon,
      priority: index + 1,
      originalPriority: index + 1,
      metadata: {
        impact: option.recommended ? 'high' : 'medium',
        urgency: index < 2 ? 'high' : index < 4 ? 'medium' : 'low',
        effort: 'medium',
        risk: index < 2 ? 'high' : 'medium',
        tags: ['retention-risk', 'predictive'],
        estimatedTime: index < 2 ? 8 : 4
      }
    };
  }).filter(Boolean) as PriorityCard[];
}

/**
 * Convert intervention strategies to PriorityCards
 */
export function convertInterventionsToPriorityCards(
  interventionOptions: OptionItem[],
  selectedInterventions: string[]
): PriorityCard[] {
  return selectedInterventions.map((interventionId, index) => {
    const option = interventionOptions.find(opt => opt.id === interventionId);
    if (!option) return null;

    return {
      id: option.id,
      title: option.label,
      description: option.description,
      category: 'Intervention',
      icon: option.icon,
      priority: index + 1,
      originalPriority: index + 1,
      metadata: {
        impact: option.recommended ? 'high' : 'medium',
        urgency: 'medium',
        effort: option.label.includes('Development') || option.label.includes('Training') ? 'high' : 'medium',
        risk: 'low',
        tags: ['intervention', 'proactive'],
        estimatedTime: option.label.includes('Conversation') ? 2 : 6
      }
    };
  }).filter(Boolean) as PriorityCard[];
}

/**
 * Convert goals to PriorityCards
 */
export function convertGoalsToPriorityCards(
  goalOptions: OptionItem[],
  selectedGoals: string[]
): PriorityCard[] {
  return selectedGoals.map((goalId, index) => {
    const option = goalOptions.find(opt => opt.id === goalId);
    if (!option) return null;

    return {
      id: option.id,
      title: option.label,
      description: option.description,
      category: 'Strategic Goal',
      icon: option.icon,
      priority: index + 1,
      originalPriority: index + 1,
      metadata: {
        impact: option.recommended ? 'high' : 'medium',
        urgency: option.label.includes('Retain') ? 'high' : 'medium',
        effort: option.label.includes('Culture') || option.label.includes('Pipeline') ? 'high' : 'medium',
        risk: 'medium',
        tags: ['strategic', 'long-term'],
        estimatedTime: option.label.includes('Cost') ? 12 : 16
      }
    };
  }).filter(Boolean) as PriorityCard[];
}

/**
 * Create comprehensive retention strategy priority cards
 */
export function createRetentionPriorityCards(
  cardData: RetentionCardData,
  riskOptions: OptionItem[],
  interventionOptions: OptionItem[],
  goalOptions: OptionItem[]
): {
  riskCards: PriorityCard[];
  interventionCards: PriorityCard[];
  goalCards: PriorityCard[];
} {
  return {
    riskCards: convertRiskFactorsToPriorityCards(riskOptions, cardData.riskFactors),
    interventionCards: convertInterventionsToPriorityCards(interventionOptions, cardData.interventions),
    goalCards: convertGoalsToPriorityCards(goalOptions, cardData.goals)
  };
}

/**
 * Extract priority insights for DynamicPromptBuilder
 */
export function extractPriorityInsights(cards: PriorityCard[]): string {
  if (cards.length === 0) return '';
  
  const topPriorities = cards.slice(0, 3);
  const criticalCount = cards.filter(c => c.priority <= 2).length;
  const highImpactCount = cards.filter(c => c.metadata?.impact === 'high').length;
  
  const insights = [
    `Top 3 priorities: ${topPriorities.map(c => c.title).join(', ')}`,
    `${criticalCount} critical items requiring immediate attention`,
    `${highImpactCount} high-impact initiatives identified`
  ];
  
  return insights.join('. ');
}

/**
 * Generate retention strategy recommendations based on priority cards
 */
export function generateRetentionRecommendations(
  riskCards: PriorityCard[],
  interventionCards: PriorityCard[],
  goalCards: PriorityCard[]
): {
  immediate: string[];
  shortTerm: string[];
  longTerm: string[];
} {
  const immediate = [];
  const shortTerm = [];
  const longTerm = [];
  
  // Immediate actions (priority 1-2)
  const immediateRisks = riskCards.filter(c => c.priority <= 2);
  const immediateInterventions = interventionCards.filter(c => c.priority <= 2);
  
  if (immediateRisks.length > 0) {
    immediate.push(`Address critical risks: ${immediateRisks.map(c => c.title).join(', ')}`);
  }
  if (immediateInterventions.length > 0) {
    immediate.push(`Implement top interventions: ${immediateInterventions.map(c => c.title).join(', ')}`);
  }
  
  // Short-term actions (priority 3-5)
  const shortTermInterventions = interventionCards.filter(c => c.priority >= 3 && c.priority <= 5);
  if (shortTermInterventions.length > 0) {
    shortTerm.push(`Deploy strategic interventions: ${shortTermInterventions.map(c => c.title).join(', ')}`);
  }
  
  // Long-term goals
  const strategicGoals = goalCards.filter(c => c.priority <= 3);
  if (strategicGoals.length > 0) {
    longTerm.push(`Achieve strategic objectives: ${strategicGoals.map(c => c.title).join(', ')}`);
  }
  
  return { immediate, shortTerm, longTerm };
}