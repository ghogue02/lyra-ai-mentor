# AI Generation Guidelines

## Overview

This document establishes mandatory guidelines for all AI generation features to ensure proper backend configuration and reliable operation.

## Mandatory Supabase Setup Check

### Pre-Generation Requirements

Before any AI generation feature is implemented or modified, the following Supabase setup must be verified:

#### 1. Database Schema Validation
- [ ] **Content Storage Table**: Verify `generated_content` table exists with proper schema
- [ ] **Content Type Constraints**: Ensure all required content types are allowed in check constraints
- [ ] **User Association**: Confirm proper user_id columns and RLS policies
- [ ] **Character Support**: Validate character_type constraints include all required characters

#### 2. Edge Function Configuration
- [ ] **Function Deployment**: Verify edge function exists and is properly deployed
- [ ] **Environment Variables**: Confirm all required secrets are configured:
  - `OPENAI_API_KEY` or `OPENROUTER_API_KEY`
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- [ ] **CORS Headers**: Ensure proper CORS configuration for web app integration
- [ ] **Authentication**: Verify JWT validation settings match requirements

#### 3. API Integration Validation
- [ ] **Model Availability**: Confirm AI model selection and availability
- [ ] **Rate Limiting**: Verify API quotas and rate limits are adequate
- [ ] **Error Handling**: Ensure comprehensive error handling for API failures
- [ ] **Response Validation**: Confirm proper response parsing and validation

#### 4. User Experience Requirements
- [ ] **Loading States**: Implement proper loading indicators during generation
- [ ] **Error Feedback**: Provide clear error messages for failed generations
- [ ] **Success Confirmation**: Display success states and next actions
- [ ] **Content Preview**: Allow users to review generated content before saving

## Implementation Checklist

### Before Adding New AI Generation Feature

1. **Database Preparation**
   ```sql
   -- Verify content type constraint includes new types
   SELECT conname, pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conrelid = 'generated_content'::regclass 
   AND contype = 'c';
   ```

2. **Edge Function Setup**
   - Create or update edge function with proper error handling
   - Test all required environment variables are accessible
   - Implement comprehensive logging for debugging

3. **Frontend Integration**
   - Add proper loading states and error handling
   - Implement user feedback mechanisms
   - Ensure responsive design for all screen sizes

4. **Testing Requirements**
   - Unit tests for edge function logic
   - Integration tests for database operations
   - E2E tests for complete user workflows
   - Error scenario testing (API failures, network issues)

### Content Type Management

When adding new content types:

1. **Update Database Constraint**
   ```sql
   ALTER TABLE generated_content 
   DROP CONSTRAINT IF EXISTS generated_content_content_type_check;
   
   ALTER TABLE generated_content 
   ADD CONSTRAINT generated_content_content_type_check 
   CHECK (content_type IN ('email', 'lesson', 'article', 'document', 'your_new_type'));
   ```

2. **Update Edge Function**
   - Add content type to validation logic
   - Implement type-specific generation prompts
   - Add appropriate title generation for new types

3. **Update Frontend**
   - Add UI components for new content type
   - Implement type-specific validation
   - Update success/error messaging

## Error Prevention

### Common Issues and Solutions

1. **503 Database Constraint Errors**
   - **Cause**: Content type not allowed in check constraint
   - **Solution**: Update constraint to include new content types
   - **Prevention**: Always update constraints before deploying new features

2. **API Key Missing Errors**
   - **Cause**: Environment variables not configured in Supabase
   - **Solution**: Use Supabase secrets management to add required keys
   - **Prevention**: Verify all secrets before feature development

3. **RLS Policy Violations**
   - **Cause**: Missing or incorrect Row Level Security policies
   - **Solution**: Ensure proper user_id association and RLS policies
   - **Prevention**: Test with authenticated and anonymous users

4. **CORS Issues**
   - **Cause**: Missing or incorrect CORS headers in edge functions
   - **Solution**: Add proper corsHeaders to all responses
   - **Prevention**: Use standardized CORS header configuration

## Quality Standards

### Code Requirements
- **Error Handling**: Comprehensive try-catch blocks with meaningful error messages
- **Logging**: Detailed logging for debugging and monitoring
- **Validation**: Input validation for all user-provided data
- **Performance**: Reasonable timeouts and resource usage

### User Experience Standards
- **Responsiveness**: Maximum 3-second initial response time
- **Feedback**: Clear progress indicators and status updates
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Mobile**: Fully responsive design for all screen sizes

## Maintenance

### Regular Checks
- Monthly review of error logs and performance metrics
- Quarterly validation of API quotas and rate limits
- Semi-annual review of security configurations
- Annual audit of content type constraints and schema

### Documentation Updates
- Update this guide when adding new AI generation features
- Document any new error patterns and solutions
- Maintain examples of proper implementation patterns

## Examples

### Proper Edge Function Structure
```typescript
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment variables
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Your generation logic here
    
  } catch (error) {
    console.error('Generation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

### Proper Frontend Integration
```tsx
const handleGeneration = async () => {
  setIsLoading(true);
  setError(null);
  
  try {
    const result = await supabase.functions.invoke('your-generation-function', {
      body: { contentType: 'document', /* other params */ }
    });
    
    if (result.error) throw result.error;
    
    // Handle success
    setGeneratedContent(result.data);
    toast.success('Content generated successfully!');
    
  } catch (error) {
    console.error('Generation failed:', error);
    setError('Failed to generate content. Please try again.');
    toast.error('Generation failed');
  } finally {
    setIsLoading(false);
  }
};
```

## Conclusion

Following these guidelines ensures reliable, maintainable AI generation features with proper error handling and user experience. All new AI generation implementations must pass the complete checklist before deployment.