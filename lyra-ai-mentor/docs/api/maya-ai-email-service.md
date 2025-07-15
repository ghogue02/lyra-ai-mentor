# Maya AI Email Service API Documentation

## Overview

The Maya AI Email Service provides intelligent email generation capabilities using the PACE Framework (Purpose, Audience, Context, Execute) integrated with OpenAI's GPT-4o-mini model. This service enables personalized, context-aware email generation specifically tailored for nonprofit organizations.

## Architecture

### Service Pattern
- **Singleton Pattern**: Ensures single instance across application
- **Error Handling**: Graceful fallbacks for offline/error scenarios
- **Type Safety**: Full TypeScript interfaces for request/response

### Integration Points
- **AI Service**: Core integration with OpenAI API
- **Model**: GPT-4o-mini (optimized for fast, quality responses)
- **Temperature**: 0.7 (balanced creativity and consistency)

## API Reference

### Interfaces

#### MayaEmailPrompt
```typescript
interface MayaEmailPrompt {
  purpose: string;           // Email purpose/goal
  audience: string;          // Target recipient type
  audienceContext: string;   // Specific audience details
  situationDetails: string;  // Context and situation
  tone: string;             // Desired tone
  aiPrompt: string;         // Full constructed prompt
}
```

#### AIEmailResponse
```typescript
interface AIEmailResponse {
  email: string;                            // Generated email content
  explanation: string;                      // Why email works for audience
  promptQuality: 'poor' | 'good' | 'excellent';  // Quality assessment
  suggestions?: string[];                   // Optional improvement tips
}
```

### Core Methods

#### generateEmailWithPACE()
Generates emails using the PACE framework with Maya's persona.

```typescript
async generateEmailWithPACE(prompt: MayaEmailPrompt): Promise<AIEmailResponse>
```

**Features:**
- Context-aware email generation
- Maya's authentic nonprofit voice
- Quality assessment of prompts
- Improvement suggestions

**Example Usage:**
```typescript
const response = await mayaAIEmailService.generateEmailWithPACE({
  purpose: "Thank a volunteer parent",
  audience: "Busy parent who helped at art event",
  audienceContext: "Single mom, works full-time, first-time volunteer",
  situationDetails: "Helped with art station for 3 hours, great with kids",
  tone: "Warm and appreciative",
  aiPrompt: "Write a heartfelt thank you to Sarah..."
});
```

#### demonstratePromptComparison()
Shows the difference between generic and PACE-optimized prompts.

```typescript
async demonstratePromptComparison(
  basicPrompt: string, 
  improvedPrompt: MayaEmailPrompt
): Promise<{
  badExample: AIEmailResponse;
  goodExample: AIEmailResponse;
}>
```

**Purpose:**
- Educational demonstration
- Shows impact of context and specificity
- Contrasts corporate vs. community voice

### Configuration

#### Environment Variables
```env
VITE_OPENAI_API_KEY=your-api-key-here
```

#### System Persona
Maya Rodriguez - Program Director at Hope Gardens Community Center
- Warm, community-focused voice
- Professional but approachable
- Emphasis on personal connection

### Error Handling

#### Fallback System
When API calls fail, the service provides:
1. **Contextual Fallbacks**: Pre-written templates for common scenarios
2. **Graceful Degradation**: Users can still learn with offline examples
3. **Error Logging**: Console logging for debugging

#### Fallback Scenarios
- "Thank a volunteer parent"
- "Request program feedback"  
- Default template for other cases

### Performance Optimization

#### Token Usage
- Max tokens: 800 (balances quality with speed)
- Temperature: 0.7 (optimal for varied but coherent responses)
- Model: GPT-4o-mini (cost-effective, fast, quality output)

#### Response Caching
- Not implemented (real-time generation prioritized)
- Consider for future optimization if needed

### Security Considerations

1. **API Key Protection**: Use environment variables
2. **Input Sanitization**: Handled by AI service layer
3. **Rate Limiting**: Implement at application level
4. **Content Filtering**: AI service includes safety measures

### Integration Examples

#### React Component Integration
```typescript
const [loading, setLoading] = useState(false);
const [response, setResponse] = useState<AIEmailResponse>();

const generateEmail = async () => {
  setLoading(true);
  try {
    const result = await mayaAIEmailService.generateEmailWithPACE({
      purpose: selectedPurpose,
      audience: selectedAudience,
      // ... other fields
    });
    setResponse(result);
  } catch (error) {
    console.error('Email generation failed:', error);
  } finally {
    setLoading(false);
  }
};
```

#### Quality Assessment Usage
```typescript
if (response.promptQuality === 'poor') {
  // Show improvement suggestions
  response.suggestions?.forEach(tip => {
    console.log('Tip:', tip);
  });
} else if (response.promptQuality === 'excellent') {
  // Celebrate success
  showSuccessAnimation();
}
```

## Best Practices

### Prompt Engineering
1. **Be Specific**: Include context about audience and situation
2. **Set Clear Purpose**: Define what the email should achieve
3. **Include Tone**: Specify emotional approach
4. **Add Details**: More context = better output

### User Experience
1. **Show Loading States**: Use Lyra's expressions during generation
2. **Handle Errors Gracefully**: Always provide fallback content
3. **Educate Users**: Explain why prompts work or need improvement
4. **Progressive Disclosure**: Start simple, add complexity

### Performance
1. **Debounce Requests**: Prevent rapid API calls
2. **Cache Common Scenarios**: Consider caching frequent requests
3. **Monitor Usage**: Track API usage for cost management
4. **Optimize Prompts**: Shorter prompts when appropriate

## Testing

### Unit Testing
```typescript
describe('MayaAIEmailService', () => {
  it('should generate email with PACE framework', async () => {
    const response = await service.generateEmailWithPACE(mockPrompt);
    expect(response.email).toBeDefined();
    expect(response.promptQuality).toBe('good');
  });
  
  it('should handle API errors with fallback', async () => {
    // Mock API failure
    const response = await service.generateEmailWithPACE(mockPrompt);
    expect(response.email).toContain('Hope Gardens');
  });
});
```

### Integration Testing
- Test with actual API key in development
- Verify fallback behavior with network disabled
- Test various prompt quality scenarios
- Validate JSON parsing and error handling

## Troubleshooting

### Common Issues

1. **Empty Responses**
   - Check API key configuration
   - Verify network connectivity
   - Review console for errors

2. **Poor Quality Output**
   - Ensure all PACE fields are populated
   - Add more specific context
   - Check prompt construction

3. **Slow Generation**
   - Normal response time: 1-3 seconds
   - Consider implementing loading indicators
   - Check network latency

### Debug Mode
Enable verbose logging:
```typescript
console.log('Final prompt:', this.buildComprehensivePrompt(prompt));
console.log('API response:', response);
```

## Future Enhancements

1. **Response Caching**: Cache frequent scenarios
2. **Multi-language Support**: Spanish/other languages
3. **Template Expansion**: More fallback scenarios
4. **Analytics Integration**: Track usage patterns
5. **Fine-tuning**: Custom model for nonprofit context

## Version History

- **v1.0.0** - Initial release with PACE framework
- **v1.1.0** - Added prompt comparison feature
- **v1.2.0** - Enhanced fallback system
- **v1.3.0** - Integration with Maya journey UI

---

Last Updated: January 2025