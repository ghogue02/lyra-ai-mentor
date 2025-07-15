// Multimodal AI Components
export { MultimodalVoiceChat } from '../MultimodalVoiceChat';
export { MultimodalDocumentBuilder } from '../MultimodalDocumentBuilder';
export { MultimodalImageStudio } from '../MultimodalImageStudio';

// Re-export types and hooks
export { useMultimodal } from '@/hooks/useMultimodal';
export type { 
  MultimodalInput, 
  MultimodalOutput, 
  MultimodalProcessingOptions,
  ProcessingStep,
  MultimodalSession 
} from '@/services/multimodalService';
export type {
  UseMultimodalOptions,
  MultimodalState,
  UseMultimodalReturn
} from '@/hooks/useMultimodal';