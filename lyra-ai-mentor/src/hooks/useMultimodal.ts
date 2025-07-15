import { useState, useCallback, useRef, useEffect } from 'react';
import { multimodalService, MultimodalInput, MultimodalOutput, MultimodalProcessingOptions, ProcessingStep } from '@/services/multimodalService';
import { useToast } from '@/hooks/use-toast';

export interface UseMultimodalOptions {
  sessionId?: string;
  autoCreateSession?: boolean;
  onProcessingStart?: () => void;
  onProcessingComplete?: (output: MultimodalOutput) => void;
  onError?: (error: Error) => void;
}

export interface MultimodalState {
  isProcessing: boolean;
  currentInput: MultimodalInput | null;
  lastOutput: MultimodalOutput | null;
  sessionId: string | null;
  error: Error | null;
  history: {
    inputs: MultimodalInput[];
    outputs: MultimodalOutput[];
  };
}

export interface UseMultimodalReturn extends MultimodalState {
  // Core processing functions
  process: (input: MultimodalInput, options: MultimodalProcessingOptions) => Promise<MultimodalOutput>;
  batchProcess: (inputs: MultimodalInput[], options: MultimodalProcessingOptions) => Promise<MultimodalOutput[]>;
  processPipeline: (input: MultimodalInput, pipeline: ProcessingStep[]) => Promise<MultimodalOutput>;
  
  // Convenience functions for common operations
  transcribeAudio: (audioBlob: Blob) => Promise<string>;
  synthesizeSpeech: (text: string, voice?: string, speed?: number) => Promise<HTMLAudioElement>;
  generateImage: (prompt: string, style?: string) => Promise<string>;
  exportDocument: (content: any, format: 'pdf' | 'docx' | 'txt', title?: string) => Promise<void>;
  
  // Session management
  createSession: (metadata?: Record<string, any>) => string;
  clearSession: () => void;
  getSessionData: () => any;
  
  // Utility functions
  reset: () => void;
  clearError: () => void;
}

export function useMultimodal(options: UseMultimodalOptions = {}): UseMultimodalReturn {
  const { toast } = useToast();
  const [state, setState] = useState<MultimodalState>({
    isProcessing: false,
    currentInput: null,
    lastOutput: null,
    sessionId: options.sessionId || null,
    error: null,
    history: {
      inputs: [],
      outputs: []
    }
  });

  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Auto-create session on mount if requested
  useEffect(() => {
    if (options.autoCreateSession && !state.sessionId) {
      const sessionId = multimodalService.createSession({ autoCreated: true });
      setState(prev => ({ ...prev, sessionId }));
    }
  }, [options.autoCreateSession]);

  // Core processing function
  const process = useCallback(async (
    input: MultimodalInput,
    processingOptions: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentInput: input,
      error: null
    }));

    optionsRef.current.onProcessingStart?.();

    try {
      const sessionId = state.sessionId || multimodalService.createSession();
      if (!state.sessionId) {
        setState(prev => ({ ...prev, sessionId }));
      }

      const output = await multimodalService.process(input, processingOptions, sessionId);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        lastOutput: output,
        history: {
          inputs: [...prev.history.inputs, input],
          outputs: [...prev.history.outputs, output]
        }
      }));

      optionsRef.current.onProcessingComplete?.(output);
      return output;
    } catch (error) {
      const err = error as Error;
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err
      }));

      optionsRef.current.onError?.(err);
      
      toast({
        title: "Processing Error",
        description: err.message,
        variant: "destructive"
      });
      
      throw err;
    }
  }, [state.sessionId, toast]);

  // Batch processing
  const batchProcess = useCallback(async (
    inputs: MultimodalInput[],
    processingOptions: MultimodalProcessingOptions
  ): Promise<MultimodalOutput[]> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null
    }));

    try {
      const sessionId = state.sessionId || multimodalService.createSession();
      if (!state.sessionId) {
        setState(prev => ({ ...prev, sessionId }));
      }

      const outputs = await multimodalService.batchProcess(inputs, processingOptions, sessionId);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        history: {
          inputs: [...prev.history.inputs, ...inputs],
          outputs: [...prev.history.outputs, ...outputs]
        }
      }));

      return outputs;
    } catch (error) {
      const err = error as Error;
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err
      }));
      throw err;
    }
  }, [state.sessionId]);

  // Pipeline processing
  const processPipeline = useCallback(async (
    input: MultimodalInput,
    pipeline: ProcessingStep[]
  ): Promise<MultimodalOutput> => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentInput: input,
      error: null
    }));

    try {
      const sessionId = state.sessionId || multimodalService.createSession();
      if (!state.sessionId) {
        setState(prev => ({ ...prev, sessionId }));
      }

      const output = await multimodalService.processPipeline(input, pipeline, sessionId);

      setState(prev => ({
        ...prev,
        isProcessing: false,
        lastOutput: output,
        history: {
          inputs: [...prev.history.inputs, input],
          outputs: [...prev.history.outputs, output]
        }
      }));

      return output;
    } catch (error) {
      const err = error as Error;
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: err
      }));
      throw err;
    }
  }, [state.sessionId]);

  // Convenience function: Transcribe audio
  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string> => {
    const input: MultimodalInput = {
      type: 'voice',
      data: audioBlob
    };

    const options: MultimodalProcessingOptions = {
      inputType: 'voice',
      outputType: 'text'
    };

    const output = await process(input, options);
    return output.content as string;
  }, [process]);

  // Convenience function: Synthesize speech
  const synthesizeSpeech = useCallback(async (
    text: string,
    voice: string = 'alloy',
    speed: number = 1.0
  ): Promise<HTMLAudioElement> => {
    const input: MultimodalInput = {
      type: 'text',
      data: text
    };

    const options: MultimodalProcessingOptions = {
      inputType: 'text',
      outputType: 'audio',
      voiceSettings: {
        selectedVoice: voice,
        voiceSpeed: speed,
        voiceVolume: 1.0,
        autoPlayResponses: false,
        inputMode: 'text'
      }
    };

    const output = await process(input, options);
    return output.content as HTMLAudioElement;
  }, [process]);

  // Convenience function: Generate image
  const generateImage = useCallback(async (
    prompt: string,
    style: string = 'natural'
  ): Promise<string> => {
    const input: MultimodalInput = {
      type: 'text',
      data: prompt
    };

    const options: MultimodalProcessingOptions = {
      inputType: 'text',
      outputType: 'image',
      processingSteps: [{
        type: 'generate',
        config: { style }
      }]
    };

    const output = await process(input, options);
    return output.content as string;
  }, [process]);

  // Convenience function: Export document
  const exportDocument = useCallback(async (
    content: any,
    format: 'pdf' | 'docx' | 'txt',
    title: string = 'Document'
  ): Promise<void> => {
    const input: MultimodalInput = {
      type: 'text',
      data: typeof content === 'string' ? content : JSON.stringify(content),
      metadata: { title }
    };

    const options: MultimodalProcessingOptions = {
      inputType: 'text',
      outputType: 'document',
      exportOptions: {
        format,
        includeMetadata: true
      }
    };

    await process(input, options);
  }, [process]);

  // Session management
  const createSession = useCallback((metadata?: Record<string, any>): string => {
    const sessionId = multimodalService.createSession(metadata);
    setState(prev => ({ ...prev, sessionId }));
    return sessionId;
  }, []);

  const clearSession = useCallback(() => {
    if (state.sessionId) {
      multimodalService.clearSession(state.sessionId);
      setState(prev => ({
        ...prev,
        sessionId: null,
        history: { inputs: [], outputs: [] }
      }));
    }
  }, [state.sessionId]);

  const getSessionData = useCallback(() => {
    if (state.sessionId) {
      return multimodalService.getSession(state.sessionId);
    }
    return null;
  }, [state.sessionId]);

  // Utility functions
  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      currentInput: null,
      lastOutput: null,
      sessionId: null,
      error: null,
      history: { inputs: [], outputs: [] }
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    process,
    batchProcess,
    processPipeline,
    transcribeAudio,
    synthesizeSpeech,
    generateImage,
    exportDocument,
    createSession,
    clearSession,
    getSessionData,
    reset,
    clearError
  };
}