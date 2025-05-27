
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.16.0";
import { decode } from "https://deno.land/std@0.177.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      throw new Error('GOOGLE_API_KEY is not set');
    }

    const { prompt, size = '1024x1024' } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating image with Gemini, prompt:', prompt);

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(googleApiKey);
    const modelId = "gemini-2.0-flash-preview-image-generation";
    const model = genAI.getGenerativeModel({ model: modelId });

    // Configure generation settings
    const generationConfig = {
      temperature: 0.4,
      responseModalities: ["TEXT", "IMAGE"]
    };

    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ];

    // Generate content with Gemini
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    console.log('Received response from Gemini');

    // Process Gemini response
    if (!response.candidates?.length || !response.candidates[0].content?.parts?.length) {
      console.error('Invalid response structure from Gemini:', JSON.stringify(response));
      throw new Error('Invalid response structure received from Gemini API');
    }

    const parts = response.candidates[0].content.parts;
    let altText: string | undefined;
    let imageDataBase64: string | undefined;

    // Extract text and image data from response parts
    for (const part of parts) {
      if (part.text) {
        altText = part.text;
      } else if (part.inlineData?.data && part.inlineData?.mimeType === 'image/png') {
        imageDataBase64 = part.inlineData.data;
      }
    }

    if (!imageDataBase64) {
      console.error('No image data found in Gemini response parts:', JSON.stringify(parts));
      throw new Error('No image data found in Gemini response');
    }

    if (!altText) {
      console.warn('No alt text found in Gemini response. Using default.');
      altText = `AI-generated illustration`;
    }

    // For this implementation, we'll return the base64 data directly
    // You could optionally store it in Supabase Storage like the reference code
    const imageUrl = `data:image/png;base64,${imageDataBase64}`;

    return new Response(
      JSON.stringify({ 
        imageUrl,
        revisedPrompt: altText
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in generate-lesson-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred while generating the image' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
