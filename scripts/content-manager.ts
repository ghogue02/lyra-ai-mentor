import { createClient } from '@supabase/supabase-js'
import { Database } from '../src/integrations/supabase/types'

const SUPABASE_URL = "https://hfkzwjnlxrwynactcmpe.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhma3p3am5seHJ3eW5hY3RjbXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyODM4NTAsImV4cCI6MjA2Mzg1OTg1MH0.WXPnn8e3_I7mAx_Qv4_2jX70nsTCxSbqMh3qo4_aEw0"

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

export class ContentManager {
  /**
   * Update a content block
   */
  static async updateContentBlock(lessonId: number, title: string, content: string) {
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'update-content-block',
        data: { lessonId, title, content }
      }
    })

    if (error) throw error
    return data
  }

  /**
   * Update an interactive element
   */
  static async updateInteractiveElement(elementId: number, updates: any) {
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'update-interactive-element',
        data: { elementId, updates }
      }
    })

    if (error) throw error
    return data
  }

  /**
   * Hide admin/debug elements
   */
  static async hideAdminElements(lessonIds: number[], elementTypes: string[]) {
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'hide-admin-elements',
        data: { lessonIds, elementTypes }
      }
    })

    if (error) throw error
    return data
  }

  /**
   * Create a new interactive element
   */
  static async createInteractiveElement(element: any) {
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'create-interactive-element',
        data: { element }
      }
    })

    if (error) throw error
    return data
  }

  /**
   * Batch update multiple items
   */
  static async batchUpdate(updates: any[]) {
    const { data, error } = await supabase.functions.invoke('content-manager', {
      body: {
        action: 'batch-update',
        data: { updates }
      }
    })

    if (error) throw error
    return data
  }
}

// Example usage:
// await ContentManager.updateContentBlock(5, 'Enter the AI Email Revolution', 'New content...')
// await ContentManager.hideAdminElements([5, 6, 7, 8], ['database_debugger', 'interactive_element_auditor'])