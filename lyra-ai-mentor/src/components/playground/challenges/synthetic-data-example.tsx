import React from 'react';
import { SyntheticDataBuilder } from '@/components/ai-playground';

/**
 * Example integration of the Synthetic Data Builder
 * This shows how to integrate the builder into the AI playground or any other part of the application
 */
export default function SyntheticDataExample() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">AI-Powered Synthetic Nonprofit Data Builder</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How it works:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Answer questions about your nonprofit organization</li>
          <li>Lyra AI generates realistic synthetic data based on your specifications</li>
          <li>Preview and customize the generated data</li>
          <li>Export in JSON or CSV format for use in your applications</li>
        </ol>
      </div>

      <SyntheticDataBuilder />
    </div>
  );
}

/**
 * Usage Notes:
 * 
 * The SyntheticDataBuilder can be integrated in several ways:
 * 
 * 1. Standalone Page:
 *    Import and use directly in a route component
 * 
 * 2. Modal/Dialog:
 *    Wrap in a Dialog component for overlay presentation
 * 
 * 3. Embedded in Dashboard:
 *    Include as a section in the AI playground or admin dashboard
 * 
 * 4. API Integration:
 *    The syntheticDataService can be used directly for programmatic generation
 * 
 * Example API usage:
 * ```typescript
 * import { generateSyntheticData } from '@/services/syntheticDataService';
 * 
 * const data = await generateSyntheticData({
 *   organizationType: 'education',
 *   budgetRange: 'medium',
 *   staffSize: 'small',
 *   geographicScope: 'city',
 *   programDescription: 'After-school tutoring, STEM workshops',
 *   donorTypes: ['individuals', 'foundations'],
 *   dataTypes: ['donors', 'programs', 'volunteers']
 * });
 * ```
 */