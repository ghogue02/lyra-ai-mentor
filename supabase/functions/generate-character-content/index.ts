import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Character-specific model mapping for cost optimization
const CHARACTER_MODELS = {
  'lyra': 'anthropic/claude-3.5-sonnet',
  'rachel': 'google/gemini-2.0-flash-001',
  'sofia': 'google/gemini-2.0-flash-001',
  'david': 'google/gemini-2.0-flash-001',
  'alex': 'google/gemini-2.0-flash-001',
  'maya': 'google/gemini-2.0-flash-001',
  'carmen': 'google/gemini-2.0-flash-001',
  'default': 'google/gemini-2.0-flash-001' // Cost-effective default
};

const characterPersonalities = {
  maya: {
    name: "Maya",
    personality: "Expert email marketer with a focus on data-driven campaigns and personalization",
    tone: "Professional yet approachable, analytical, results-focused",
    expertise: "Email marketing, automation, A/B testing, customer segmentation"
  },
  sofia: {
    name: "Sofia",
    personality: "Creative voice and branding specialist who helps find authentic communication styles",
    tone: "Warm, encouraging, creative, empathetic",
    expertise: "Brand voice development, content strategy, storytelling, audience connection"
  },
  david: {
    name: "David",
    personality: "Data storytelling expert who transforms complex data into compelling narratives",
    tone: "Analytical yet accessible, methodical, insightful",
    expertise: "Data visualization, analytics, storytelling, business intelligence"
  },
  rachel: {
    name: "Rachel",
    personality: "Automation and systems expert focused on efficiency and scalability",
    tone: "Systematic, practical, solution-oriented, efficient",
    expertise: "Process automation, workflow optimization, system integration, efficiency"
  },
  alex: {
    name: "Alex",
    personality: "Change management specialist who guides smooth transitions and adaptations",
    tone: "Supportive, strategic, calm, forward-thinking",
    expertise: "Change management, team leadership, organizational development, adaptation strategies"
  },
  lyra: {
    name: "Lyra",
    personality: "AI learning and foundational concepts expert who makes complex technology accessible",
    tone: "Clear, educational, encouraging, patient",
    expertise: "AI fundamentals, machine learning concepts, technology education, beginner-friendly explanations"
  },
  carmen: {
    name: "Carmen",
    personality: "Compassionate people management expert who balances AI efficiency with human empathy in HR processes",
    tone: "Warm, empathetic, professional, growth-focused",
    expertise: "HR strategy, talent acquisition, performance management, employee engagement, diversity and inclusion"
  }
};

serve(async (req) => {
  // 🟦 FUNCTION ENTRY LOGGING
  console.log('🚀 [FUNCTION START] Edge Function invoked');
  console.log('📥 [REQUEST] Method:', req.method);
  console.log('📥 [REQUEST] URL:', req.url);
  console.log('📥 [REQUEST] Headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    console.log('✅ [CORS] Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 🟦 ENVIRONMENT VARIABLES LOGGING
    console.log('🔧 [ENV] Checking environment variables...');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    
    console.log('🔧 [ENV] SUPABASE_URL present:', !!supabaseUrl);
    console.log('🔧 [ENV] SUPABASE_URL length:', supabaseUrl?.length || 0);
    console.log('🔧 [ENV] SUPABASE_SERVICE_ROLE_KEY present:', !!supabaseKey);
    console.log('🔧 [ENV] SUPABASE_SERVICE_ROLE_KEY length:', supabaseKey?.length || 0);
    console.log('🔧 [ENV] OPENROUTER_API_KEY present:', !!openRouterKey);
    console.log('🔧 [ENV] OPENROUTER_API_KEY length:', openRouterKey?.length || 0);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ [ENV] Missing required Supabase environment variables');
      throw new Error('Missing Supabase configuration');
    }
    
    if (!openRouterKey) {
      console.error('❌ [ENV] Missing OpenRouter API key');
      throw new Error('Missing OpenRouter configuration');
    }

    // 🟦 DATABASE CONNECTION LOGGING
    console.log('🗄️ [DB] Creating Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('🗄️ [DB] Supabase client created successfully');
    
    // Test database connection
    console.log('🗄️ [DB] Testing database connection...');
    try {
      const { data: connectionTest, error: connectionError } = await supabase
        .from('generated_content')
        .select('count')
        .limit(1);
      
      if (connectionError) {
        console.error('❌ [DB] Connection test failed:', connectionError);
        console.error('❌ [DB] Connection error details:', {
          code: connectionError.code,
          message: connectionError.message,
          details: connectionError.details,
          hint: connectionError.hint
        });
      } else {
        console.log('✅ [DB] Database connection successful');
        console.log('✅ [DB] Connection test result:', connectionTest);
      }
    } catch (dbTestError) {
      console.error('❌ [DB] Database connection test exception:', dbTestError);
      console.error('❌ [DB] Test error details:', {
        name: dbTestError.name,
        message: dbTestError.message,
        stack: dbTestError.stack
      });
    }

    // 🟦 REQUEST BODY PARSING LOGGING
    console.log('📝 [BODY] Parsing request body...');
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log('📝 [BODY] Raw body length:', rawBody.length);
      console.log('📝 [BODY] Raw body preview:', rawBody.substring(0, 200));
      
      requestBody = JSON.parse(rawBody);
      console.log('✅ [BODY] JSON parsing successful');
      console.log('📝 [BODY] Parsed body keys:', Object.keys(requestBody));
    } catch (parseError) {
      console.error('❌ [BODY] JSON parsing failed:', parseError);
      console.error('❌ [BODY] Parse error details:', {
        name: parseError.name,
        message: parseError.message,
        stack: parseError.stack
      });
      throw new Error('Invalid JSON in request body');
    }

    // 🟦 REQUEST VALIDATION LOGGING
    console.log('🔍 [VALIDATION] Extracting request parameters...');
    const { characterType, contentType, topic, context, mayaPatterns, targetAudience } = requestBody;
    
    console.log('🔍 [VALIDATION] Request parameters:', {
      characterType: typeof characterType + ' - ' + characterType,
      contentType: typeof contentType + ' - ' + contentType,
      topic: typeof topic + ' - ' + (topic?.substring(0, 50) || 'undefined'),
      context: typeof context + ' - ' + (context ? 'provided' : 'not provided'),
      mayaPatterns: typeof mayaPatterns + ' - ' + (mayaPatterns ? 'provided' : 'not provided'),
      targetAudience: typeof targetAudience + ' - ' + (targetAudience || 'not provided')
    });

    // Validate required fields
    console.log('🔍 [VALIDATION] Validating required fields...');
    if (!characterType || typeof characterType !== 'string') {
      console.error('❌ [VALIDATION] characterType validation failed:', { characterType, type: typeof characterType });
      throw new Error('characterType is required and must be a string');
    }
    if (!contentType || typeof contentType !== 'string') {
      console.error('❌ [VALIDATION] contentType validation failed:', { contentType, type: typeof contentType });
      throw new Error('contentType is required and must be a string');
    }
    if (!topic || typeof topic !== 'string') {
      console.error('❌ [VALIDATION] topic validation failed:', { topic, type: typeof topic });
      throw new Error('topic is required and must be a string');
    }
    
    console.log('✅ [VALIDATION] All required fields validated successfully');
    console.log('🎭 [CHARACTER] Generating content for:', { characterType, contentType, topic });

    // 🟦 CHARACTER VALIDATION LOGGING
    console.log('🎭 [CHARACTER] Looking up character personality...');
    console.log('🎭 [CHARACTER] Available characters:', Object.keys(characterPersonalities));
    console.log('🎭 [CHARACTER] Requested character:', characterType);
    
    const character = characterPersonalities[characterType as keyof typeof characterPersonalities];
    if (!character) {
      console.error('❌ [CHARACTER] Unknown character type:', characterType);
      console.error('❌ [CHARACTER] Available options:', Object.keys(characterPersonalities));
      throw new Error(`Unknown character type: ${characterType}`);
    }
    
    console.log('✅ [CHARACTER] Character found:', {
      name: character.name,
      personality: character.personality.substring(0, 50) + '...',
      tone: character.tone,
      expertise: character.expertise.substring(0, 50) + '...'
    });

    // 🟦 MAYA PATTERNS FETCHING LOGGING
    console.log('🧠 [MAYA] Processing Maya patterns...');
    let patterns = mayaPatterns;
    
    if (!patterns) {
      console.log('🧠 [MAYA] No patterns provided, fetching from database...');
      try {
        console.log('🧠 [MAYA] Querying maya_analysis_results table...');
        const { data: mayaData, error: mayaError } = await supabase
          .from('maya_analysis_results')
          .select('analysis_results, recommendations')
          .order('created_at', { ascending: false })
          .limit(1);
        
        console.log('🧠 [MAYA] Query completed. Error:', !!mayaError, 'Data count:', mayaData?.length || 0);
        
        if (mayaError) {
          console.warn('⚠️ [MAYA] Database query failed:', mayaError);
          console.warn('⚠️ [MAYA] Error details:', {
            code: mayaError.code,
            message: mayaError.message,
            details: mayaError.details,
            hint: mayaError.hint
          });
          patterns = "Focus on personalization and data-driven approaches";
        } else {
          console.log('✅ [MAYA] Query successful, data received:', !!mayaData?.[0]);
          if (mayaData?.[0]) {
            console.log('🧠 [MAYA] Analysis results preview:', mayaData[0].analysis_results?.substring(0, 100) || 'none');
            console.log('🧠 [MAYA] Recommendations preview:', mayaData[0].recommendations?.substring(0, 100) || 'none');
          }
          patterns = mayaData?.[0]?.analysis_results || "Focus on personalization and data-driven approaches";
        }
      } catch (mayaFetchError) {
        console.warn('⚠️ [MAYA] Exception during Maya patterns fetch:', mayaFetchError);
        console.warn('⚠️ [MAYA] Exception details:', {
          name: mayaFetchError.name,
          message: mayaFetchError.message,
          stack: mayaFetchError.stack
        });
        patterns = "Focus on personalization and data-driven approaches";
      }
    } else {
      console.log('✅ [MAYA] Using provided patterns:', patterns.substring(0, 100) + '...');
    }
    
    console.log('🧠 [MAYA] Final patterns length:', patterns.length);

    // 🟦 MODEL SELECTION LOGGING
    console.log('🤖 [MODEL] Selecting model for character...');
    const selectedModel = CHARACTER_MODELS[characterType] || CHARACTER_MODELS['default'];
    console.log('🤖 [MODEL] Selected model:', selectedModel);
    console.log('🤖 [MODEL] Character type:', characterType);
    console.log('🤖 [MODEL] Available models:', CHARACTER_MODELS);
    
    // 🟦 OPENROUTER API REQUEST LOGGING
    console.log('🌐 [OPENROUTER] Preparing API request...');
    
    const systemPrompt = `You are ${character.name}, a ${character.personality}. 
            Your communication style is ${character.tone}.
            Your expertise areas are: ${character.expertise}.
            
            Create ${contentType} content that:
            1. Maintains ${character.name}'s unique voice and personality
            2. Applies successful patterns from Maya's approach: ${patterns}
            3. Adapts Maya's data-driven methods to your specific expertise area
            4. Provides actionable, practical advice
            5. Engages the target audience effectively
            
            The content should feel authentically ${character.name} while leveraging proven engagement strategies.`;
    
    const userPrompt = context ? context : `Create ${contentType} content about "${topic}" for ${targetAudience}. 
            Apply Maya's successful patterns while maintaining ${character.name}'s unique voice and expertise.`;
    
    const requestPayload = {
      model: selectedModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    };
    
    console.log('🌐 [OPENROUTER] Request payload structure:', {
      model: requestPayload.model,
      messageCount: requestPayload.messages.length,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length,
      temperature: requestPayload.temperature,
      maxTokens: requestPayload.max_tokens
    });
    
    const requestHeaders = {
      'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://lovable.dev',
      'X-Title': 'Lyra AI Learning Platform'
    };
    
    console.log('🌐 [OPENROUTER] Request headers:', {
      authorization: requestHeaders.Authorization ? 'Bearer ***[REDACTED]***' : 'MISSING',
      contentType: requestHeaders['Content-Type'],
      referer: requestHeaders['HTTP-Referer'],
      title: requestHeaders['X-Title']
    });
    
    console.log('🌐 [OPENROUTER] Making API request to OpenRouter...');
    const requestStartTime = Date.now();
    
    // Generate content using OpenRouter
    const openAIResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestPayload),
    });
    
    const requestDuration = Date.now() - requestStartTime;
    console.log('🌐 [OPENROUTER] Request completed in', requestDuration, 'ms');
    console.log('🌐 [OPENROUTER] Response status:', openAIResponse.status);
    console.log('🌐 [OPENROUTER] Response headers:', Object.fromEntries(openAIResponse.headers.entries()));
    
    console.log('🌐 [OPENROUTER] Parsing response JSON...');
    const aiData = await openAIResponse.json();
    console.log('🌐 [OPENROUTER] Response JSON parsed successfully');
    console.log('🌐 [OPENROUTER] Response data structure:', {
      hasChoices: !!aiData.choices,
      choicesLength: aiData.choices?.length || 0,
      hasUsage: !!aiData.usage,
      hasModel: !!aiData.model,
      hasError: !!aiData.error
    });
    
    // 🟦 OPENROUTER RESPONSE VALIDATION LOGGING
    console.log('🔍 [RESPONSE] Validating OpenRouter response...');
    
    if (!openAIResponse.ok) {
      console.error('❌ [RESPONSE] OpenRouter API request failed');
      console.error('❌ [RESPONSE] Status code:', openAIResponse.status);
      console.error('❌ [RESPONSE] Status text:', openAIResponse.statusText);
      console.error('❌ [RESPONSE] Error data:', aiData);
      console.error('❌ [RESPONSE] Request details:', { 
        characterType, 
        selectedModel, 
        contentType,
        requestDuration: requestDuration + 'ms'
      });
      throw new Error(`OpenRouter API error: ${aiData.error?.message || 'Unknown error'} - Model: ${selectedModel}`);
    }
    
    console.log('✅ [RESPONSE] OpenRouter request successful');

    // Validate response structure before accessing nested properties
    console.log('🔍 [RESPONSE] Validating response structure...');
    if (!aiData || typeof aiData !== 'object') {
      console.error('❌ [RESPONSE] Invalid response structure - not an object');
      console.error('❌ [RESPONSE] Received data type:', typeof aiData);
      console.error('❌ [RESPONSE] Raw data:', aiData);
      throw new Error(`Invalid response from OpenRouter API - Expected object, got ${typeof aiData}`);
    }

    if (!aiData.choices || !Array.isArray(aiData.choices) || aiData.choices.length === 0) {
      console.error('❌ [RESPONSE] No choices in response');
      console.error('❌ [RESPONSE] Choices data:', aiData.choices);
      console.error('❌ [RESPONSE] Full response:', aiData);
      throw new Error('OpenRouter API returned no choices in response');
    }
    
    console.log('✅ [RESPONSE] Found', aiData.choices.length, 'choice(s)');

    if (!aiData.choices[0] || !aiData.choices[0].message) {
      console.error('❌ [RESPONSE] Invalid choice structure');
      console.error('❌ [RESPONSE] First choice:', aiData.choices[0]);
      throw new Error('OpenRouter API returned invalid choice structure');
    }
    
    console.log('✅ [RESPONSE] Choice structure valid');
    console.log('🔍 [RESPONSE] Message details:', {
      role: aiData.choices[0].message.role,
      hasContent: !!aiData.choices[0].message.content,
      contentLength: aiData.choices[0].message.content?.length || 0,
      contentPreview: aiData.choices[0].message.content?.substring(0, 100) || 'none'
    });

    const generatedContent = aiData.choices[0].message.content;
    
    if (!generatedContent || typeof generatedContent !== 'string') {
      console.error('❌ [RESPONSE] No content in message');
      console.error('❌ [RESPONSE] Content type:', typeof generatedContent);
      console.error('❌ [RESPONSE] Content value:', generatedContent);
      console.error('❌ [RESPONSE] Full message:', aiData.choices[0].message);
      throw new Error('OpenRouter API returned no content in message');
    }
    
    console.log('✅ [RESPONSE] Content generated successfully');
    console.log('📝 [CONTENT] Generated content length:', generatedContent.length);
    console.log('📝 [CONTENT] Content preview:', generatedContent.substring(0, 200) + '...');

    // 🟦 TITLE GENERATION LOGGING
    console.log('📝 [TITLE] Processing title generation...');
    let title = topic;
    
    if (contentType !== 'lesson') {
      console.log('📝 [TITLE] Content type is not lesson, generating custom title...');
      
      const titleRequestStartTime = Date.now();
      const titleRequestPayload = {
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: `Generate a compelling title for this ${contentType} content in ${character.name}'s voice.`
          },
          {
            role: 'user',
            content: `Content: ${generatedContent.substring(0, 200)}...`
          }
        ],
        temperature: 0.5,
        max_tokens: 50
      };
      
      console.log('📝 [TITLE] Making title generation request...');
      console.log('📝 [TITLE] Request payload:', {
        model: titleRequestPayload.model,
        messageCount: titleRequestPayload.messages.length,
        temperature: titleRequestPayload.temperature,
        maxTokens: titleRequestPayload.max_tokens
      });
      
      const titleResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lovable.dev',
          'X-Title': 'Lyra AI Learning Platform'
        },
        body: JSON.stringify(titleRequestPayload),
      });

      const titleRequestDuration = Date.now() - titleRequestStartTime;
      console.log('📝 [TITLE] Title request completed in', titleRequestDuration, 'ms');
      console.log('📝 [TITLE] Response status:', titleResponse.status);

      const titleData = await titleResponse.json();
      console.log('📝 [TITLE] Response parsed, validating...');
      
      // Validate title response structure
      if (!titleResponse.ok) {
        console.error('❌ [TITLE] Title generation API failed');
        console.error('❌ [TITLE] Status:', titleResponse.status);
        console.error('❌ [TITLE] Error data:', titleData);
        title = `${character.name}'s ${contentType} on ${topic}`; // Fallback title
        console.log('📝 [TITLE] Using fallback title:', title);
      } else if (!titleData || !titleData.choices || !Array.isArray(titleData.choices) || 
                 titleData.choices.length === 0 || !titleData.choices[0] || 
                 !titleData.choices[0].message || !titleData.choices[0].message.content) {
        console.error('❌ [TITLE] Invalid title response structure');
        console.error('❌ [TITLE] Response data:', titleData);
        title = `${character.name}'s ${contentType} on ${topic}`; // Fallback title
        console.log('📝 [TITLE] Using fallback title:', title);
      } else {
        const rawTitle = titleData.choices[0].message.content;
        title = rawTitle.replace(/['"]/g, '');
        console.log('✅ [TITLE] Title generated successfully');
        console.log('📝 [TITLE] Raw title:', rawTitle);
        console.log('📝 [TITLE] Cleaned title:', title);
      }
    } else {
      console.log('📝 [TITLE] Using topic as title for lesson content:', title);
    }

    // 🟦 DATABASE OPERATIONS LOGGING
    console.log('🗄️ [DB] Starting database insertion...');
    let result = null;
    let insertError = null;
    
    // Extract user ID from Authorization header
    let userId = null;
    const authHeader = req.headers.get('authorization');
    console.log('🔐 [AUTH] Authorization header present:', !!authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.replace('Bearer ', '');
        // Decode JWT to extract user ID (simple base64 decode for payload)
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub;
        console.log('🔐 [AUTH] Extracted user ID:', userId);
      } catch (authError) {
        console.warn('⚠️ [AUTH] Failed to extract user ID from token:', authError.message);
        // Continue with null user_id for anonymous requests
      }
    } else {
      console.log('🔐 [AUTH] No Bearer token found, using anonymous mode');
    }

    const insertData = {
      user_id: userId, // Use extracted user ID or null for anonymous
      character_type: characterType,
      content_type: contentType,
      title: title,
      content: generatedContent,
      metadata: {
        topic,
        targetAudience,
        mayaPatterns: patterns,
        character: character
      },
      approval_status: 'pending'
    };
    
    console.log('🗄️ [DB] Insert data structure:', {
      user_id: insertData.user_id,
      character_type: insertData.character_type,
      content_type: insertData.content_type,
      titleLength: insertData.title.length,
      contentLength: insertData.content.length,
      metadataKeys: Object.keys(insertData.metadata),
      approval_status: insertData.approval_status
    });
    
    console.log('🗄️ [DB] Metadata details:', {
      topicLength: insertData.metadata.topic?.length || 0,
      targetAudienceLength: insertData.metadata.targetAudience?.length || 0,
      mayaPatternsLength: insertData.metadata.mayaPatterns?.length || 0,
      characterName: insertData.metadata.character?.name || 'unknown'
    });
    
    try {
      console.log('🗄️ [DB] Executing insert query...');
      const dbStartTime = Date.now();
      
      const { data, error } = await supabase
        .from('generated_content')
        .insert(insertData)
        .select()
        .single();
      
      const dbDuration = Date.now() - dbStartTime;
      console.log('🗄️ [DB] Database operation completed in', dbDuration, 'ms');
      
      result = data;
      insertError = error;
      
      if (error) {
        console.error('❌ [DB] Database insert error detected');
        console.error('❌ [DB] Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
      } else {
        console.log('✅ [DB] Insert successful');
        console.log('🗄️ [DB] Returned data:', {
          id: data?.id,
          character_type: data?.character_type,
          content_type: data?.content_type,
          created_at: data?.created_at,
          approval_status: data?.approval_status
        });
      }
    } catch (dbError) {
      console.error('❌ [DB] Database operation exception:', dbError);
      console.error('❌ [DB] Exception details:', {
        name: dbError.name,
        message: dbError.message,
        stack: dbError.stack
      });
      
      // If table doesn't exist, create a fallback response
      if (dbError?.message?.includes('relation "generated_content" does not exist')) {
        console.warn('⚠️ [DB] Table does not exist, creating fallback response');
        result = {
          id: 'temp-' + Date.now(),
          character_type: characterType,
          content_type: contentType,
          title: title,
          content: generatedContent
        };
        insertError = null;
        console.log('✅ [DB] Fallback response created:', {
          id: result.id,
          character_type: result.character_type,
          content_type: result.content_type
        });
      } else {
        insertError = dbError;
      }
    }

    // 🟦 DATABASE ERROR VALIDATION LOGGING
    console.log('🔍 [DB] Validating database operation results...');
    
    if (insertError) {
      console.error('❌ [DB] Database insertion failed');
      console.error('❌ [DB] Error code:', insertError.code);
      console.error('❌ [DB] Error message:', insertError.message);
      console.error('❌ [DB] Error details:', insertError.details);
      console.error('❌ [DB] Error hint:', insertError.hint);
      console.error('❌ [DB] Insert data summary:', { 
        characterType, 
        contentType, 
        titlePreview: title?.substring(0, 50),
        contentPreview: generatedContent?.substring(0, 100)
      });
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to store generated content';
      let errorCategory = 'DATABASE_GENERIC_ERROR';
      
      if (insertError.code === '23505') {
        errorMessage = 'Duplicate content entry detected';
        errorCategory = 'DATABASE_DUPLICATE_ERROR';
      } else if (insertError.code === '42P01') {
        errorMessage = 'Database table not found';
        errorCategory = 'DATABASE_TABLE_ERROR';
      } else if (insertError.code === '23502') {
        errorMessage = 'Required field missing in content data';
        errorCategory = 'DATABASE_VALIDATION_ERROR';
      } else if (insertError.code === '42883') {
        errorMessage = 'Database function or column does not exist';
        errorCategory = 'DATABASE_SCHEMA_ERROR';
      }
      
      console.error('❌ [DB] Categorized error:', errorCategory);
      console.error('❌ [DB] Final error message:', errorMessage);
      
      throw new Error(`Database error: ${errorMessage} - ${insertError.message}`);
    }

    if (!result) {
      console.error('❌ [DB] No result returned despite no error');
      console.error('❌ [DB] Result value:', result);
      console.error('❌ [DB] Insert error value:', insertError);
      throw new Error('Database insertion succeeded but returned no data');
    }

    console.log('✅ [DB] Database operations completed successfully');
    console.log('🎉 [SUCCESS] Content generation pipeline completed');

    // 🟦 RESPONSE GENERATION LOGGING
    console.log('📤 [RESPONSE] Generating final response...');
    const responseData = {
      success: true,
      contentId: result.id,
      title,
      content: generatedContent,
      characterType,
      contentType,
      approvalStatus: 'pending'
    };
    
    console.log('📤 [RESPONSE] Response data structure:', {
      success: responseData.success,
      contentId: responseData.contentId,
      titleLength: responseData.title?.length || 0,
      contentLength: responseData.content?.length || 0,
      characterType: responseData.characterType,
      contentType: responseData.contentType,
      approvalStatus: responseData.approvalStatus
    });

    console.log('📤 [RESPONSE] Sending successful response');
    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 🟦 ERROR HANDLING LOGGING
    console.error('🚨 [ERROR] Exception caught in main function');
    console.error('🚨 [ERROR] Error type:', error.constructor.name);
    console.error('🚨 [ERROR] Error message:', error.message);
    console.error('🚨 [ERROR] Error stack:', error.stack);
    console.error('🚨 [ERROR] Error details:', {
      name: error.name,
      message: error.message,
      cause: error.cause,
      fileName: error.fileName,
      lineNumber: error.lineNumber,
      columnNumber: error.columnNumber
    });
    
    // Categorize errors for better client handling
    console.log('🔍 [ERROR] Categorizing error...');
    let statusCode = 500;
    let errorCategory = 'INTERNAL_ERROR';
    let errorMessage = error.message || 'Content generation failed';
    
    console.log('🔍 [ERROR] Analyzing error message:', errorMessage);
    
    if (errorMessage.includes('characterType is required') || 
        errorMessage.includes('contentType is required') || 
        errorMessage.includes('topic is required') ||
        errorMessage.includes('Invalid JSON')) {
      statusCode = 400;
      errorCategory = 'VALIDATION_ERROR';
      console.log('🔍 [ERROR] Categorized as validation error');
    } else if (errorMessage.includes('Unknown character type')) {
      statusCode = 400;
      errorCategory = 'INVALID_CHARACTER';
      console.log('🔍 [ERROR] Categorized as invalid character error');
    } else if (errorMessage.includes('OpenRouter API error')) {
      statusCode = 502;
      errorCategory = 'EXTERNAL_API_ERROR';
      console.log('🔍 [ERROR] Categorized as external API error');
    } else if (errorMessage.includes('Database error')) {
      statusCode = 503;
      errorCategory = 'DATABASE_ERROR';
      console.log('🔍 [ERROR] Categorized as database error - THIS IS THE 503!');
    } else if (errorMessage.includes('Missing Supabase configuration') ||
               errorMessage.includes('Missing OpenRouter configuration')) {
      statusCode = 500;
      errorCategory = 'CONFIGURATION_ERROR';
      console.log('🔍 [ERROR] Categorized as configuration error');
    } else {
      console.log('🔍 [ERROR] Categorized as internal error (default)');
    }
    
    console.log('🔍 [ERROR] Final categorization:', {
      statusCode,
      errorCategory,
      errorMessage: errorMessage.substring(0, 100)
    });
    
    const errorResponse = {
      success: false,
      error: errorMessage,
      category: errorCategory,
      timestamp: new Date().toISOString(),
      statusCode: statusCode,
      requestInfo: {
        method: 'POST',
        url: '/functions/v1/generate-character-content',
        userAgent: 'Edge Function'
      },
      ...(Deno.env.get('NODE_ENV') === 'development' && { 
        details: error.toString(),
        stack: error.stack,
        errorType: error.constructor.name
      })
    };
    
    console.log('📤 [ERROR] Error response structure:', {
      success: errorResponse.success,
      category: errorResponse.category,
      statusCode: errorResponse.statusCode,
      hasDetails: !!errorResponse.details,
      hasStack: !!errorResponse.stack
    });
    
    console.error('📤 [ERROR] Sending error response with status:', statusCode);
    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});