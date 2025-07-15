import { voiceService, VoiceSettings } from './voiceService';
import { exportService, ExportOptions, ExportData } from './exportService';
import { aiService, AIRequest, AIResponse, ImageRequest, VoiceRequest, TranscriptionRequest } from './aiService';
import { toast } from '@/hooks/use-toast';

export interface MultimodalInput {
  type: 'text' | 'voice' | 'image' | 'document';
  data: string | File | Blob;
  metadata?: Record<string, any>;
}

export interface MultimodalOutput {
  type: 'text' | 'audio' | 'image' | 'document';
  content: any;
  format?: string;
  metadata?: Record<string, any>;
}

export interface MultimodalProcessingOptions {
  inputType: MultimodalInput['type'];
  outputType: MultimodalOutput['type'];
  processingSteps?: ProcessingStep[];
  aiEnhancement?: boolean;
  voiceSettings?: VoiceSettings;
  exportOptions?: ExportOptions;
}

export interface ProcessingStep {
  type: 'transcribe' | 'synthesize' | 'analyze' | 'generate' | 'export' | 'enhance';
  config?: Record<string, any>;
}

export interface MultimodalSession {
  id: string;
  startTime: Date;
  inputs: MultimodalInput[];
  outputs: MultimodalOutput[];
  processingHistory: ProcessingStep[];
  metadata: Record<string, any>;
}

export interface ImageProcessingOptions {
  action: 'generate' | 'analyze' | 'enhance';
  prompt?: string;
  style?: 'natural' | 'artistic' | 'professional';
  size?: '256x256' | '512x512' | '1024x1024';
}

export class MultimodalService {
  private static instance: MultimodalService;
  private sessions: Map<string, MultimodalSession> = new Map();
  private processingQueue: Array<() => Promise<any>> = [];
  private isProcessing = false;

  static getInstance(): MultimodalService {
    if (!MultimodalService.instance) {
      MultimodalService.instance = new MultimodalService();
    }
    return MultimodalService.instance;
  }

  private constructor() {
    // Initialize service connections
    this.validateServices();
  }

  private validateServices(): void {
    // Ensure all dependent services are available
    if (!voiceService || !exportService || !aiService) {
      console.warn('Some multimodal services are not fully initialized');
    }
  }

  // Create a new multimodal session
  createSession(metadata: Record<string, any> = {}): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: MultimodalSession = {
      id: sessionId,
      startTime: new Date(),
      inputs: [],
      outputs: [],
      processingHistory: [],
      metadata
    };
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  // Process multimodal input with specified options
  async process(
    input: MultimodalInput,
    options: MultimodalProcessingOptions,
    sessionId?: string
  ): Promise<MultimodalOutput> {
    try {
      // Create or get session
      const activeSessionId = sessionId || this.createSession();
      const session = this.sessions.get(activeSessionId);
      
      if (!session) {
        throw new Error('Invalid session ID');
      }

      // Record input
      session.inputs.push(input);

      // Process based on input and output types
      let result: MultimodalOutput;

      switch (input.type) {
        case 'voice':
          result = await this.processVoiceInput(input, options);
          break;
        case 'text':
          result = await this.processTextInput(input, options);
          break;
        case 'image':
          result = await this.processImageInput(input, options);
          break;
        case 'document':
          result = await this.processDocumentInput(input, options);
          break;
        default:
          throw new Error(`Unsupported input type: ${input.type}`);
      }

      // Apply AI enhancement if requested
      if (options.aiEnhancement) {
        result = await this.enhanceWithAI(result, options);
      }

      // Record output and processing steps
      session.outputs.push(result);
      if (options.processingSteps) {
        session.processingHistory.push(...options.processingSteps);
      }

      return result;
    } catch (error) {
      console.error('Multimodal processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process multimodal input. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Process voice input (speech-to-text, voice analysis, etc.)
  private async processVoiceInput(
    input: MultimodalInput,
    options: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> {
    const audioBlob = input.data as Blob;
    
    switch (options.outputType) {
      case 'text':
        // Transcribe audio to text
        const transcription = await voiceService.speechToText(audioBlob);
        return {
          type: 'text',
          content: transcription,
          metadata: {
            originalType: 'voice',
            transcriptionModel: 'whisper-1'
          }
        };
        
      case 'audio':
        // Process or enhance audio
        return {
          type: 'audio',
          content: audioBlob,
          metadata: { processed: true }
        };
        
      case 'document':
        // Transcribe and export to document
        const text = await voiceService.speechToText(audioBlob);
        const exportData: ExportData = {
          title: 'Voice Transcription',
          content: text,
          metadata: {
            createdAt: new Date().toISOString(),
            source: 'voice'
          }
        };
        await exportService.export(exportData, options.exportOptions || { format: 'docx' });
        return {
          type: 'document',
          content: exportData,
          format: options.exportOptions?.format || 'docx'
        };
        
      default:
        throw new Error(`Cannot convert voice to ${options.outputType}`);
    }
  }

  // Process text input (TTS, analysis, generation, etc.)
  private async processTextInput(
    input: MultimodalInput,
    options: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> {
    const text = input.data as string;
    
    switch (options.outputType) {
      case 'audio':
        // Convert text to speech
        const voice = options.voiceSettings?.selectedVoice || 'alloy';
        const speed = options.voiceSettings?.voiceSpeed || 1.0;
        const audio = await voiceService.textToSpeech(text, voice, speed);
        return {
          type: 'audio',
          content: audio,
          metadata: {
            voice,
            speed,
            originalText: text
          }
        };
        
      case 'text':
        // Process or enhance text
        if (options.aiEnhancement) {
          const enhanced = await this.enhanceTextWithAI(text, options);
          return {
            type: 'text',
            content: enhanced,
            metadata: { enhanced: true }
          };
        }
        return {
          type: 'text',
          content: text,
          metadata: { processed: true }
        };
        
      case 'document':
        // Export text to document
        const exportData: ExportData = {
          title: input.metadata?.title || 'Text Document',
          content: text,
          metadata: {
            createdAt: new Date().toISOString(),
            ...input.metadata
          }
        };
        await exportService.export(exportData, options.exportOptions || { format: 'pdf' });
        return {
          type: 'document',
          content: exportData,
          format: options.exportOptions?.format || 'pdf'
        };
        
      case 'image':
        // Generate image from text
        const imageResult = await this.generateImageFromText(text, options);
        return {
          type: 'image',
          content: imageResult,
          metadata: {
            prompt: text,
            model: 'dall-e-3'
          }
        };
        
      default:
        throw new Error(`Cannot convert text to ${options.outputType}`);
    }
  }

  // Process image input (analysis, enhancement, etc.)
  private async processImageInput(
    input: MultimodalInput,
    options: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> {
    const imageData = input.data;
    
    switch (options.outputType) {
      case 'text':
        // Analyze image and generate description
        const description = await this.analyzeImage(imageData);
        return {
          type: 'text',
          content: description,
          metadata: {
            originalType: 'image',
            analysisType: 'description'
          }
        };
        
      case 'image':
        // Process or enhance image
        if (options.aiEnhancement) {
          const enhanced = await this.enhanceImage(imageData, options);
          return {
            type: 'image',
            content: enhanced,
            metadata: { enhanced: true }
          };
        }
        return {
          type: 'image',
          content: imageData,
          metadata: { processed: true }
        };
        
      case 'document':
        // Create document with image
        const exportData: ExportData = {
          title: 'Image Document',
          content: 'Image analysis and documentation',
          sections: [{
            title: 'Image',
            content: imageData,
            type: 'image'
          }],
          metadata: {
            createdAt: new Date().toISOString(),
            hasImages: true
          }
        };
        await exportService.export(exportData, options.exportOptions || { format: 'pdf' });
        return {
          type: 'document',
          content: exportData,
          format: options.exportOptions?.format || 'pdf'
        };
        
      default:
        throw new Error(`Cannot convert image to ${options.outputType}`);
    }
  }

  // Process document input
  private async processDocumentInput(
    input: MultimodalInput,
    options: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> {
    // For now, pass through document data
    return {
      type: 'document',
      content: input.data,
      metadata: input.metadata
    };
  }

  // Enhance output with AI
  private async enhanceWithAI(
    output: MultimodalOutput,
    options: MultimodalProcessingOptions
  ): Promise<MultimodalOutput> {
    if (output.type === 'text') {
      const enhanced = await this.enhanceTextWithAI(output.content, options);
      return {
        ...output,
        content: enhanced,
        metadata: {
          ...output.metadata,
          aiEnhanced: true
        }
      };
    }
    return output;
  }

  // AI text enhancement
  private async enhanceTextWithAI(
    text: string,
    options: MultimodalProcessingOptions
  ): Promise<string> {
    const request: AIRequest = {
      prompt: text,
      context: "Enhance the following text while maintaining its core message and authenticity. Make it more engaging, clear, and impactful.",
      maxTokens: 1000,
      temperature: 0.7
    };
    
    const response = await aiService.generateResponse(request);
    return response.content;
  }

  // Generate image from text using AI
  private async generateImageFromText(
    prompt: string,
    options: MultimodalProcessingOptions
  ): Promise<string> {
    const imageRequest: ImageRequest = {
      prompt,
      size: '1024x1024',
      quality: 'standard',
      style: 'natural',
      n: 1
    };
    
    const results = await aiService.generateImage(imageRequest);
    return results[0] || '';
  }

  // Analyze image using AI
  private async analyzeImage(imageData: string | File | Blob): Promise<string> {
    // Convert image to URL if needed
    let imageUrl: string;
    
    if (imageData instanceof File || imageData instanceof Blob) {
      // For now, we'll need to upload the image first or use a data URL
      // In a production app, you'd upload to a service and get a URL
      imageUrl = await this.fileToBase64(imageData);
    } else {
      imageUrl = imageData;
    }
    
    const result = await aiService.analyzeImageWithText(
      imageUrl,
      "Analyze this image and provide a detailed description of what you see, including any text, objects, people, and context."
    );
    
    return result;
  }

  // Enhance image (placeholder for future implementation)
  private async enhanceImage(
    imageData: string | File | Blob,
    options: MultimodalProcessingOptions
  ): Promise<any> {
    // For now, return original image
    // Future: Implement image enhancement using AI services
    return imageData;
  }

  // Utility: Convert file to base64
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Get session data
  getSession(sessionId: string): MultimodalSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Clear session
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  // Batch processing for multiple inputs
  async batchProcess(
    inputs: MultimodalInput[],
    options: MultimodalProcessingOptions,
    sessionId?: string
  ): Promise<MultimodalOutput[]> {
    const results: MultimodalOutput[] = [];
    const activeSessionId = sessionId || this.createSession({ batchProcessing: true });
    
    for (const input of inputs) {
      try {
        const result = await this.process(input, options, activeSessionId);
        results.push(result);
      } catch (error) {
        console.error('Batch processing error for input:', input, error);
        results.push({
          type: 'text',
          content: 'Processing failed',
          metadata: { error: true }
        });
      }
    }
    
    return results;
  }

  // Pipeline processing with multiple steps
  async processPipeline(
    input: MultimodalInput,
    pipeline: ProcessingStep[],
    sessionId?: string
  ): Promise<MultimodalOutput> {
    let currentData: any = input;
    const activeSessionId = sessionId || this.createSession({ pipeline: true });
    
    for (const step of pipeline) {
      currentData = await this.executeStep(currentData, step, activeSessionId);
    }
    
    return currentData as MultimodalOutput;
  }

  // Execute a single processing step
  private async executeStep(
    data: any,
    step: ProcessingStep,
    sessionId: string
  ): Promise<any> {
    switch (step.type) {
      case 'transcribe':
        return voiceService.speechToText(data);
        
      case 'synthesize':
        return voiceService.textToSpeech(
          data,
          step.config?.voice || 'alloy',
          step.config?.speed || 1.0
        );
        
      case 'analyze':
        return this.analyzeContent(data, step.config);
        
      case 'generate':
        return this.generateContent(data, step.config);
        
      case 'export':
        return this.exportContent(data, step.config);
        
      case 'enhance':
        return this.enhanceContent(data, step.config);
        
      default:
        throw new Error(`Unknown processing step: ${step.type}`);
    }
  }

  // Content analysis
  private async analyzeContent(data: any, config?: Record<string, any>): Promise<any> {
    const request: AIRequest = {
      prompt: `Analyze the following content: ${JSON.stringify(data)}`,
      context: config?.systemMessage || "Provide a comprehensive analysis of the content.",
      maxTokens: config?.maxTokens || 500
    };
    
    const response = await aiService.generateResponse(request);
    return response.content;
  }

  // Content generation
  private async generateContent(data: any, config?: Record<string, any>): Promise<any> {
    if (config?.type === 'image') {
      const imageRequest: ImageRequest = {
        prompt: data,
        size: config?.size || '1024x1024',
        quality: config?.quality || 'standard',
        style: config?.style || 'natural',
        n: config?.n || 1
      };
      const results = await aiService.generateImage(imageRequest);
      return results[0];
    }
    
    const request: AIRequest = {
      prompt: data,
      context: config?.context,
      maxTokens: config?.maxTokens,
      temperature: config?.temperature
    };
    
    const response = await aiService.generateResponse(request);
    return response.content;
  }

  // Content export
  private async exportContent(data: any, config?: Record<string, any>): Promise<any> {
    const exportData: ExportData = {
      title: config?.title || 'Multimodal Export',
      content: data,
      metadata: config?.metadata
    };
    
    const options: ExportOptions = {
      format: config?.format || 'pdf',
      includeMetadata: config?.includeMetadata !== false
    };
    
    await exportService.export(exportData, options);
    return exportData;
  }

  // Content enhancement
  private async enhanceContent(data: any, config?: Record<string, any>): Promise<any> {
    const request: AIRequest = {
      prompt: data,
      context: config?.enhancementPrompt || "Enhance this content to make it more engaging and effective.",
      maxTokens: config?.maxTokens || 1000,
      temperature: config?.temperature || 0.7
    };
    
    const response = await aiService.generateResponse(request);
    return response.content;
  }

  // Real-time processing with streaming support
  async processStream(
    inputStream: ReadableStream,
    options: MultimodalProcessingOptions,
    onChunk: (chunk: MultimodalOutput) => void
  ): Promise<void> {
    const reader = inputStream.getReader();
    const sessionId = this.createSession({ streaming: true });
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const input: MultimodalInput = {
          type: options.inputType,
          data: value,
          metadata: { streaming: true }
        };
        
        const output = await this.process(input, options, sessionId);
        onChunk(output);
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// Export singleton instance
export const multimodalService = MultimodalService.getInstance();