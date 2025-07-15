# Multimodal AI Features Documentation

## Overview

The Lyra AI Mentor platform now includes comprehensive multimodal AI capabilities that integrate voice, document, and image processing with intelligent AI enhancement. These features enable rich, interactive experiences across different content types.

## Core Components

### 1. MultimodalService (`src/services/multimodalService.ts`)

The central service that orchestrates all multimodal operations:

```typescript
import { multimodalService } from '@/services/multimodalService';

// Create a session
const sessionId = multimodalService.createSession();

// Process multimodal input
const result = await multimodalService.process(
  { type: 'voice', data: audioBlob },
  { inputType: 'voice', outputType: 'text' }
);
```

### 2. useMultimodal Hook (`src/hooks/useMultimodal.ts`)

React hook for easy integration in components:

```typescript
const {
  transcribeAudio,
  synthesizeSpeech,
  generateImage,
  exportDocument,
  isProcessing
} = useMultimodal();
```

## Feature Components

### MultimodalVoiceChat

Interactive voice chat with AI characters:

```tsx
<MultimodalVoiceChat 
  character="sofia"
  systemPrompt="You are Sofia, focusing on authentic storytelling"
/>
```

Features:
- Real-time speech-to-text transcription
- Text-to-speech synthesis with character voices
- Voice activity detection
- Conversation export to PDF

### MultimodalDocumentBuilder

Create rich documents with multiple content types:

```tsx
<MultimodalDocumentBuilder 
  defaultTitle="My Document"
  onDocumentCreated={(doc) => console.log(doc)}
/>
```

Features:
- Text, voice, image, and table sections
- AI content enhancement
- Export to PDF, DOCX, or TXT
- Real-time preview

### MultimodalImageStudio

Generate and analyze images with AI:

```tsx
<MultimodalImageStudio 
  character="david"
  onImageGenerated={(img) => console.log(img)}
/>
```

Features:
- DALL-E 3 image generation
- Image analysis and description
- Style selection (natural, artistic, professional, nonprofit)
- Gallery management

## API Reference

### MultimodalInput

```typescript
interface MultimodalInput {
  type: 'text' | 'voice' | 'image' | 'document';
  data: string | File | Blob;
  metadata?: Record<string, any>;
}
```

### MultimodalProcessingOptions

```typescript
interface MultimodalProcessingOptions {
  inputType: MultimodalInput['type'];
  outputType: MultimodalOutput['type'];
  processingSteps?: ProcessingStep[];
  aiEnhancement?: boolean;
  voiceSettings?: VoiceSettings;
  exportOptions?: ExportOptions;
}
```

### Processing Pipeline

Create complex processing pipelines:

```typescript
const pipeline: ProcessingStep[] = [
  { type: 'transcribe' },
  { type: 'enhance', config: { temperature: 0.7 } },
  { type: 'synthesize', config: { voice: 'nova' } }
];

const result = await multimodalService.processPipeline(input, pipeline);
```

## Voice Integration

### Supported Voices

- **alloy**: Neutral, clear voice
- **echo**: Warm, conversational voice
- **fable**: Storytelling voice
- **onyx**: Professional, authoritative voice
- **nova**: Friendly, engaging voice
- **shimmer**: Energetic, upbeat voice

### Voice Settings

```typescript
interface VoiceSettings {
  autoPlayResponses: boolean;
  voiceSpeed: number; // 0.5 to 2.0
  voiceVolume: number; // 0 to 1
  selectedVoice: string;
  inputMode: 'text' | 'voice';
}
```

## Document Export

### Export Formats

- **PDF**: Full formatting, images, and metadata
- **DOCX**: Word-compatible with styles
- **TXT**: Plain text with structure
- **JSON**: Structured data export
- **CSV**: Table data export

### Export Options

```typescript
interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'json' | 'csv';
  includeMetadata?: boolean;
  templateId?: string;
  batchExport?: boolean;
  filters?: Record<string, any>;
}
```

## Image Processing

### Generation Options

```typescript
interface ImageRequest {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  quality?: 'standard' | 'hd';
  style?: 'vivid' | 'natural';
  n?: number; // Number of images
}
```

### Image Analysis

Analyze uploaded images for:
- Object detection
- Text extraction
- Scene description
- Context understanding

## Best Practices

### 1. Session Management

Always create sessions for related operations:

```typescript
const sessionId = multimodalService.createSession({
  user: userId,
  purpose: 'document_creation'
});

// Use session for all related operations
await multimodalService.process(input, options, sessionId);
```

### 2. Error Handling

```typescript
try {
  const result = await transcribeAudio(audioBlob);
} catch (error) {
  if (error.code === 'microphone_denied') {
    // Handle permission error
  }
}
```

### 3. Performance Optimization

- Use batch processing for multiple inputs
- Enable caching for repeated operations
- Implement progressive loading for large documents

### 4. Accessibility

- Provide alternative text for generated images
- Include transcripts for all audio content
- Support keyboard navigation in all components

## Integration Examples

### Voice-to-Document Workflow

```typescript
// 1. Record audio
const audioBlob = await recordAudio();

// 2. Transcribe to text
const transcript = await transcribeAudio(audioBlob);

// 3. Enhance with AI
const enhanced = await process(
  { type: 'text', data: transcript },
  { inputType: 'text', outputType: 'text', aiEnhancement: true }
);

// 4. Export as document
await exportDocument(enhanced, 'pdf', 'Meeting Notes');
```

### Image Generation Pipeline

```typescript
// 1. Generate image from prompt
const imageUrl = await generateImage(
  "A diverse team collaborating in a nonprofit office",
  "nonprofit"
);

// 2. Analyze the generated image
const analysis = await process(
  { type: 'image', data: imageUrl },
  { inputType: 'image', outputType: 'text' }
);

// 3. Create document with image and analysis
const doc = {
  title: 'Team Collaboration Visual',
  sections: [
    { type: 'image', content: imageUrl },
    { type: 'text', content: analysis }
  ]
};

await exportDocument(doc, 'pdf');
```

## Configuration

### Environment Variables

```env
VITE_OPENAI_API_KEY=your_api_key
VITE_VOICE_MODEL=tts-1
VITE_TRANSCRIPTION_MODEL=whisper-1
VITE_IMAGE_MODEL=dall-e-3
```

### Service Configuration

```typescript
// Configure voice service
voiceService.setApiKey(apiKey);
voiceService.setLanguage('en');

// Configure export templates
exportService.createTemplate({
  name: 'Nonprofit Report',
  format: 'pdf',
  layout: { /* custom layout */ }
});
```

## Troubleshooting

### Common Issues

1. **Microphone Access Denied**
   - Check browser permissions
   - Ensure HTTPS connection
   - Try different browser

2. **API Rate Limits**
   - Implement request queuing
   - Add retry logic
   - Monitor usage

3. **Large File Processing**
   - Use streaming for audio
   - Compress images before upload
   - Implement chunked processing

### Debug Mode

Enable debug logging:

```typescript
if (process.env.NODE_ENV === 'development') {
  multimodalService.enableDebugMode();
}
```

## Future Enhancements

- Video processing capabilities
- Real-time collaboration features
- Advanced AI models integration
- Offline mode support
- Multi-language support

## Support

For questions or issues:
- Check the [API Reference](#api-reference)
- View [Integration Examples](#integration-examples)
- Submit issues on GitHub
- Contact the development team