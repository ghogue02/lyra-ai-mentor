// Mock AI Service for testing and development
export class MockAIService {
  async generateResponse(options: any) {
    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `Mock AI response for: ${options.prompt?.substring(0, 100)}...`;
  }
}

export const aiService = new MockAIService();

// Mock the AI service export
export default {
  generateResponse: async (options: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      content: `Generated content for ${options.prompt}`,
      quality: 0.92,
      metadata: {
        model: 'mock-model',
        tokens: 150,
        processingTime: 500
      }
    };
  }
};