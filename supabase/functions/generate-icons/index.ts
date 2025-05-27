
import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface IconRequest {
  iconName: string;
  description: string;
  style?: string;
  size?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { icons } = await req.json() as { icons: IconRequest[] }

    console.log(`Generating ${icons.length} icons...`)

    const results = []

    for (const iconRequest of icons) {
      try {
        console.log(`Generating icon: ${iconRequest.iconName}`)
        
        const prompt = `Create a clean, modern, professional ${iconRequest.description}. 
        Style: ${iconRequest.style || 'minimalist, friendly, approachable design with soft gradients'}
        Size: ${iconRequest.size || 512}x${iconRequest.size || 512} pixels
        Format: PNG with transparent background
        Color scheme: Use purple (#8B5CF6) and cyan (#06B6D4) gradients where appropriate
        Design: Simple, clear, suitable for a non-profit AI education platform`

        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
          }),
        })

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`)
        }

        const data = await response.json()
        const imageUrl = data.data[0].url

        // Download the image
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.statusText}`)
        }

        const imageBuffer = await imageResponse.arrayBuffer()
        const fileName = `${iconRequest.iconName}.png`

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('app-icons')
          .upload(fileName, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          })

        if (uploadError) {
          throw new Error(`Storage upload error: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabaseClient.storage
          .from('app-icons')
          .getPublicUrl(fileName)

        console.log(`Successfully generated and uploaded: ${fileName}`)
        
        results.push({
          iconName: iconRequest.iconName,
          success: true,
          url: urlData.publicUrl,
          fileName: fileName
        })

        // Add delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
        
      } catch (error) {
        console.error(`Error generating ${iconRequest.iconName}:`, error)
        results.push({
          iconName: iconRequest.iconName,
          success: false,
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        results: results,
        summary: {
          total: icons.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-icons function:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})
