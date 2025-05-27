
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Define the mapping from current names to new descriptive names
const RENAME_MAPPING: Record<string, string> = {
  'lyra1.png': 'lyra-avatar.png',
  'lyra2.png': 'hero-main.png', 
  'lyra3.png': 'learning-target.png',
  'lyra4.png': 'mission-heart.png',
  'lyra5.png': 'achievement-trophy.png',
  'lyra6.png': 'network-connection.png',
  'lyra7.png': 'workflow-process.png',
  'lyra8.png': 'data-analytics.png',
  'lyra9.png': 'communication.png',
  'lyra10.png': 'growth-plant.png',
  'lyra11.png': 'profile-completion.png',
  'lyra12.png': 'dashboard-meditation.png',
  'lyra13.png': 'onboarding-welcome.png',
  'lyra14.png': 'chapter-progress.png',
  'lyra15.png': 'success-celebration.png'
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting bulk rename operation...')

    // List all files in the app-icons bucket
    const { data: files, error: listError } = await supabase.storage
      .from('app-icons')
      .list()

    if (listError) {
      console.error('Error listing files:', listError)
      return new Response(
        JSON.stringify({ error: 'Failed to list files', details: listError }),
        { status: 500, headers: corsHeaders }
      )
    }

    console.log('Found files:', files?.map(f => f.name))

    const results = []
    
    // Process each file that needs renaming
    for (const file of files || []) {
      const currentName = file.name
      const newName = RENAME_MAPPING[currentName]
      
      if (!newName) {
        console.log(`Skipping ${currentName} - no mapping found`)
        continue
      }

      console.log(`Renaming ${currentName} to ${newName}`)

      try {
        // Download the file
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('app-icons')
          .download(currentName)

        if (downloadError) {
          console.error(`Error downloading ${currentName}:`, downloadError)
          results.push({ 
            file: currentName, 
            status: 'failed', 
            error: `Download failed: ${downloadError.message}` 
          })
          continue
        }

        // Upload with new name
        const { error: uploadError } = await supabase.storage
          .from('app-icons')
          .upload(newName, fileData, { 
            contentType: 'image/png',
            upsert: false 
          })

        if (uploadError) {
          console.error(`Error uploading ${newName}:`, uploadError)
          results.push({ 
            file: currentName, 
            status: 'failed', 
            error: `Upload failed: ${uploadError.message}` 
          })
          continue
        }

        // Delete the old file
        const { error: deleteError } = await supabase.storage
          .from('app-icons')
          .remove([currentName])

        if (deleteError) {
          console.error(`Error deleting ${currentName}:`, deleteError)
          // Don't mark as failed since the new file was created successfully
        }

        results.push({ 
          file: currentName, 
          newName: newName, 
          status: 'success' 
        })
        
      } catch (error) {
        console.error(`Unexpected error processing ${currentName}:`, error)
        results.push({ 
          file: currentName, 
          status: 'failed', 
          error: `Unexpected error: ${error.message}` 
        })
      }
    }

    console.log('Bulk rename completed:', results)

    return new Response(
      JSON.stringify({ 
        message: 'Bulk rename completed', 
        results: results,
        summary: {
          total: results.length,
          successful: results.filter(r => r.status === 'success').length,
          failed: results.filter(r => r.status === 'failed').length
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in bulk rename function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
