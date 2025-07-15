import { useState, useEffect, useCallback } from 'react';
import ContentScalingEngine, { CharacterArchetype, ContentTemplate } from '../services/contentScalingEngine';
import ContentAutomationPipeline, { PipelineJob, PipelineJobParameters } from '../services/contentAutomationPipeline';

// Custom hook for content scaling operations
export const useContentScaling = () => {
  const [scalingEngine] = useState(() => new ContentScalingEngine());
  const [automationPipeline] = useState(() => new ContentAutomationPipeline());
  
  const [characters, setCharacters] = useState<CharacterArchetype[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        const characterList = scalingEngine.getAllCharacterArchetypes();
        const templateList = scalingEngine.getAllContentTemplates();
        
        setCharacters(characterList);
        setTemplates(templateList);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize content scaling');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [scalingEngine]);

  // Generate content for a specific chapter and character
  const generateContent = useCallback(async (
    chapterNumber: number,
    characterId: string,
    templateId: string,
    customVariables: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await scalingEngine.generateChapterContent(
        chapterNumber,
        characterId,
        templateId,
        customVariables
      );
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Content generation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [scalingEngine]);

  // Generate content for an entire chapter (all characters and templates)
  const generateChapterBatch = useCallback(async (
    chapterNumbers: number[],
    options: {
      templateIds?: string[];
      characterIds?: string[];
      customVariables?: Record<string, any>;
      qualityThreshold?: number;
      autoApprove?: boolean;
    } = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const jobParameters: PipelineJobParameters = {
        chapterNumbers,
        templateIds: options.templateIds,
        characterIds: options.characterIds,
        customVariables: options.customVariables,
        qualityThreshold: options.qualityThreshold || 0.85,
        autoApprove: options.autoApprove || false,
        outputFormat: 'both'
      };

      const jobId = await automationPipeline.createJob(
        'chapter_batch',
        jobParameters,
        'high'
      );

      return jobId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch generation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [automationPipeline]);

  // Apply a template to multiple chapters and characters
  const applyTemplate = useCallback(async (
    templateId: string,
    chapterNumbers: number[],
    characterIds?: string[],
    customVariables: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const jobParameters: PipelineJobParameters = {
        templateIds: [templateId],
        chapterNumbers,
        characterIds,
        customVariables,
        qualityThreshold: 0.85,
        autoApprove: false,
        outputFormat: 'both'
      };

      const jobId = await automationPipeline.createJob(
        'template_application',
        jobParameters,
        'medium'
      );

      return jobId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Template application failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [automationPipeline]);

  // Get job status
  const getJobStatus = useCallback(async (jobId: string) => {
    try {
      return await automationPipeline.getJobStatus(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get job status');
      return null;
    }
  }, [automationPipeline]);

  // Cancel a running job
  const cancelJob = useCallback(async (jobId: string) => {
    try {
      return await automationPipeline.cancelJob(jobId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel job');
      return false;
    }
  }, [automationPipeline]);

  // Get queue status
  const getQueueStatus = useCallback(async () => {
    try {
      return await automationPipeline.getQueueStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get queue status');
      return null;
    }
  }, [automationPipeline]);

  // Get character by ID
  const getCharacter = useCallback((characterId: string) => {
    return characters.find(char => char.id === characterId);
  }, [characters]);

  // Get template by ID
  const getTemplate = useCallback((templateId: string) => {
    return templates.find(template => template.id === templateId);
  }, [templates]);

  // Get characters suitable for a specific template
  const getApplicableCharacters = useCallback((templateId: string) => {
    const template = getTemplate(templateId);
    if (!template) return [];

    if (template.characterArchetype === 'any' || !template.characterArchetype) {
      return characters;
    }

    return characters.filter(char => char.id === template.characterArchetype);
  }, [characters, getTemplate]);

  // Get templates suitable for a specific character
  const getApplicableTemplates = useCallback((characterId: string) => {
    return templates.filter(template => 
      template.characterArchetype === 'any' || 
      !template.characterArchetype ||
      template.characterArchetype === characterId
    );
  }, [templates]);

  // Generate preview content without storing
  const generatePreview = useCallback(async (
    templateId: string,
    characterId: string,
    chapterNumber: number,
    customVariables: Record<string, any> = {}
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const template = getTemplate(templateId);
      const character = getCharacter(characterId);

      if (!template || !character) {
        throw new Error('Template or character not found');
      }

      // Generate preview without storing in database
      const previewContent = {
        templateId,
        characterId,
        chapterNumber,
        skillName: customVariables.skillName || character.primarySkill,
        practicalScenario: customVariables.practicalScenario || character.contextualScenarios[0],
        timeMetrics: customVariables.timeMetrics || character.transformationArc.timeMetrics,
        character,
        template
      };

      return previewContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Preview generation failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [getTemplate, getCharacter]);

  // Validate content parameters
  const validateParameters = useCallback((
    templateId: string,
    characterId: string,
    chapterNumber: number,
    customVariables: Record<string, any> = {}
  ) => {
    const errors: string[] = [];

    const template = getTemplate(templateId);
    const character = getCharacter(characterId);

    if (!template) {
      errors.push(`Template '${templateId}' not found`);
    }

    if (!character) {
      errors.push(`Character '${characterId}' not found`);
    }

    if (chapterNumber < 1 || chapterNumber > 10) {
      errors.push('Chapter number must be between 1 and 10');
    }

    // Validate template variables
    if (template) {
      template.templateVariables.forEach(variable => {
        if (variable.required && !customVariables[variable.name]) {
          errors.push(`Required variable '${variable.name}' is missing`);
        }
      });
    }

    // Validate character compatibility
    if (template && character && template.characterArchetype !== 'any' && template.characterArchetype !== character.id) {
      errors.push(`Template '${templateId}' is not compatible with character '${characterId}'`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [getTemplate, getCharacter]);

  // Generate content with real-time progress tracking
  const generateWithProgress = useCallback(async (
    chapterNumbers: number[],
    options: {
      templateIds?: string[];
      characterIds?: string[];
      customVariables?: Record<string, any>;
      onProgress?: (progress: number, status: string) => void;
    } = {}
  ) => {
    const { onProgress } = options;
    
    try {
      const jobId = await generateChapterBatch(chapterNumbers, options);
      
      // Poll for progress updates
      const pollInterval = setInterval(async () => {
        const job = await getJobStatus(jobId);
        if (job) {
          onProgress?.(job.progress, job.status);
          
          if (['completed', 'failed', 'cancelled'].includes(job.status)) {
            clearInterval(pollInterval);
          }
        }
      }, 1000);

      return jobId;
    } catch (err) {
      throw err;
    }
  }, [generateChapterBatch, getJobStatus]);

  return {
    // Data
    characters,
    templates,
    isLoading,
    error,

    // Generation methods
    generateContent,
    generateChapterBatch,
    applyTemplate,
    generatePreview,
    generateWithProgress,

    // Job management
    getJobStatus,
    cancelJob,
    getQueueStatus,

    // Utility methods
    getCharacter,
    getTemplate,
    getApplicableCharacters,
    getApplicableTemplates,
    validateParameters,

    // Clear error
    clearError: () => setError(null)
  };
};

export default useContentScaling;