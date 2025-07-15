export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chapters: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          icon: string | null
          id: number
          is_published: boolean | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: number
          is_published?: boolean | null
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          icon?: string | null
          id?: number
          is_published?: boolean | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          chapter_id: number
          created_at: string
          id: string
          last_message_at: string
          lesson_context: Json | null
          lesson_id: number
          message_count: number
          started_at: string
          title: string | null
          user_id: string
        }
        Insert: {
          chapter_id: number
          created_at?: string
          id?: string
          last_message_at?: string
          lesson_context?: Json | null
          lesson_id: number
          message_count?: number
          started_at?: string
          title?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: number
          created_at?: string
          id?: string
          last_message_at?: string
          lesson_context?: Json | null
          lesson_id?: number
          message_count?: number
          started_at?: string
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_user_message: boolean
          lesson_id: number
          message_order: number
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_user_message?: boolean
          lesson_id: number
          message_order?: number
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_user_message?: boolean
          lesson_id?: number
          message_order?: number
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_active: boolean | null
          is_visible: boolean | null
          lesson_id: number | null
          metadata: Json | null
          order_index: number
          title: string | null
          type: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_visible?: boolean | null
          lesson_id?: number | null
          metadata?: Json | null
          order_index: number
          title?: string | null
          type: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_visible?: boolean | null
          lesson_id?: number | null
          metadata?: Json | null
          order_index?: number
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      content_scaling_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          input_data: Json
          job_type: string
          output_data: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data: Json
          job_type: string
          output_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          input_data?: Json
          job_type?: string
          output_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_content: {
        Row: {
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          character_type: string
          content: string
          content_type: string
          created_at: string
          id: string
          metadata: Json | null
          source_lesson_id: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          character_type: string
          content: string
          content_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source_lesson_id?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          character_type?: string
          content?: string
          content_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          source_lesson_id?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactive_element_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          interactive_element_id: number
          lesson_id: number
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          interactive_element_id: number
          lesson_id: number
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          interactive_element_id?: number
          lesson_id?: number
          user_id?: string
        }
        Relationships: []
      }
      interactive_elements: {
        Row: {
          configuration: Json | null
          content: string
          created_at: string | null
          id: number
          is_active: boolean | null
          is_gated: boolean | null
          is_visible: boolean | null
          lesson_id: number | null
          order_index: number
          title: string | null
          type: string
        }
        Insert: {
          configuration?: Json | null
          content: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_gated?: boolean | null
          is_visible?: boolean | null
          lesson_id?: number | null
          order_index: number
          title?: string | null
          type: string
        }
        Update: {
          configuration?: Json | null
          content?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          is_gated?: boolean | null
          is_visible?: boolean | null
          lesson_id?: number | null
          order_index?: number
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactive_elements_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          chapter_completed: boolean | null
          chapter_completed_at: string | null
          completed: boolean | null
          created_at: string | null
          id: string
          last_accessed: string | null
          lesson_id: number
          progress_percentage: number | null
          user_id: string
        }
        Insert: {
          chapter_completed?: boolean | null
          chapter_completed_at?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id: number
          progress_percentage?: number | null
          user_id: string
        }
        Update: {
          chapter_completed?: boolean | null
          chapter_completed_at?: string | null
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id?: number
          progress_percentage?: number | null
          user_id?: string
        }
        Relationships: []
      }
      lesson_progress_detailed: {
        Row: {
          completed: boolean | null
          content_block_id: number | null
          created_at: string | null
          id: string
          last_accessed: string | null
          lesson_id: number | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          content_block_id?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id?: number | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          content_block_id?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          lesson_id?: number | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_detailed_content_block_id_fkey"
            columns: ["content_block_id"]
            isOneToOne: false
            referencedRelation: "content_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_detailed_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          chapter_id: number | null
          created_at: string | null
          estimated_duration: number | null
          id: number
          is_published: boolean | null
          order_index: number
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_id?: number | null
          created_at?: string | null
          estimated_duration?: number | null
          id?: number
          is_published?: boolean | null
          order_index: number
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: number | null
          created_at?: string | null
          estimated_duration?: number | null
          id?: number
          is_published?: boolean | null
          order_index?: number
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      maya_analysis_results: {
        Row: {
          analysis_results: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string
          id: string
          recommendations: Json | null
          source_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_results: Json
          analysis_type: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          recommendations?: Json | null
          source_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_results?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          id?: string
          recommendations?: Json | null
          source_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_experience: string | null
          created_at: string | null
          email: string | null
          first_chapter_completed: boolean | null
          first_chapter_started: boolean | null
          first_name: string | null
          how_did_you_hear: string | null
          id: string
          job_title: string | null
          last_name: string | null
          learning_style: string | null
          location: string | null
          onboarding_step: number | null
          organization_name: string | null
          organization_size: string | null
          organization_type: string | null
          phone_number: string | null
          profile_completed: boolean | null
          role: string | null
          tech_comfort: string | null
          updated_at: string | null
          user_id: string
          years_experience: string | null
        }
        Insert: {
          ai_experience?: string | null
          created_at?: string | null
          email?: string | null
          first_chapter_completed?: boolean | null
          first_chapter_started?: boolean | null
          first_name?: string | null
          how_did_you_hear?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          learning_style?: string | null
          location?: string | null
          onboarding_step?: number | null
          organization_name?: string | null
          organization_size?: string | null
          organization_type?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          role?: string | null
          tech_comfort?: string | null
          updated_at?: string | null
          user_id: string
          years_experience?: string | null
        }
        Update: {
          ai_experience?: string | null
          created_at?: string | null
          email?: string | null
          first_chapter_completed?: boolean | null
          first_chapter_started?: boolean | null
          first_name?: string | null
          how_did_you_hear?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          learning_style?: string | null
          location?: string | null
          onboarding_step?: number | null
          organization_name?: string | null
          organization_size?: string | null
          organization_type?: string | null
          phone_number?: string | null
          profile_completed?: boolean | null
          role?: string | null
          tech_comfort?: string | null
          updated_at?: string | null
          user_id?: string
          years_experience?: string | null
        }
        Relationships: []
      }
      prototype_sessions: {
        Row: {
          ai_feedback: Json | null
          configuration: Json
          created_at: string
          id: string
          session_name: string
          status: string
          test_results: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          configuration: Json
          created_at?: string
          id?: string
          session_name: string
          status?: string
          test_results?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          configuration?: Json
          created_at?: string
          id?: string
          session_name?: string
          status?: string
          test_results?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      toolkit_achievements: {
        Row: {
          achievement_key: string
          achievement_tier: string | null
          color: string
          created_at: string
          criteria_metadata: Json | null
          criteria_type: string
          criteria_value: number | null
          description: string
          icon: string
          id: string
          name: string
          order_index: number | null
          updated_at: string
        }
        Insert: {
          achievement_key: string
          achievement_tier?: string | null
          color: string
          created_at?: string
          criteria_metadata?: Json | null
          criteria_type: string
          criteria_value?: number | null
          description: string
          icon: string
          id?: string
          name: string
          order_index?: number | null
          updated_at?: string
        }
        Update: {
          achievement_key?: string
          achievement_tier?: string | null
          color?: string
          created_at?: string
          criteria_metadata?: Json | null
          criteria_type?: string
          criteria_value?: number | null
          description?: string
          icon?: string
          id?: string
          name?: string
          order_index?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      toolkit_categories: {
        Row: {
          category_key: string
          created_at: string
          description: string
          gradient: string
          icon: string
          id: string
          is_active: boolean | null
          name: string
          order_index: number
          updated_at: string
        }
        Insert: {
          category_key: string
          created_at?: string
          description: string
          gradient: string
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          category_key?: string
          created_at?: string
          description?: string
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      toolkit_items: {
        Row: {
          average_rating: number | null
          category_id: string
          created_at: string
          description: string | null
          download_count: number | null
          download_url: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          is_premium: boolean | null
          metadata: Json | null
          name: string
          preview_url: string | null
          rating_count: number | null
          rating_sum: number | null
          required_achievements: string[] | null
          required_level: number | null
          unlock_count: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          category_id: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          download_url?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_premium?: boolean | null
          metadata?: Json | null
          name: string
          preview_url?: string | null
          rating_count?: number | null
          rating_sum?: number | null
          required_achievements?: string[] | null
          required_level?: number | null
          unlock_count?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          category_id?: string
          created_at?: string
          description?: string | null
          download_count?: number | null
          download_url?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          is_premium?: boolean | null
          metadata?: Json | null
          name?: string
          preview_url?: string | null
          rating_count?: number | null
          rating_sum?: number | null
          required_achievements?: string[] | null
          required_level?: number | null
          unlock_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "toolkit_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "toolkit_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          interaction_type: string
          interactive_element_id: number | null
          lesson_id: number | null
          metadata: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          interaction_type: string
          interactive_element_id?: number | null
          lesson_id?: number | null
          metadata?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          interaction_type?: string
          interactive_element_id?: number | null
          lesson_id?: number | null
          metadata?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_interactive_element_id_fkey"
            columns: ["interactive_element_id"]
            isOneToOne: false
            referencedRelation: "interactive_elements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_interactions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_toolkit_achievements: {
        Row: {
          achievement_id: string
          current_value: number | null
          id: string
          is_unlocked: boolean | null
          notification_shown: boolean | null
          target_value: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          current_value?: number | null
          id?: string
          is_unlocked?: boolean | null
          notification_shown?: boolean | null
          target_value?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          current_value?: number | null
          id?: string
          is_unlocked?: boolean | null
          notification_shown?: boolean | null
          target_value?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_toolkit_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "toolkit_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_toolkit_unlocks: {
        Row: {
          download_count: number | null
          id: string
          last_downloaded_at: string | null
          rated_at: string | null
          rating: number | null
          toolkit_item_id: string
          unlocked_at: string
          user_id: string
          user_notes: string | null
        }
        Insert: {
          download_count?: number | null
          id?: string
          last_downloaded_at?: string | null
          rated_at?: string | null
          rating?: number | null
          toolkit_item_id: string
          unlocked_at?: string
          user_id: string
          user_notes?: string | null
        }
        Update: {
          download_count?: number | null
          id?: string
          last_downloaded_at?: string | null
          rated_at?: string | null
          rating?: number | null
          toolkit_item_id?: string
          unlocked_at?: string
          user_id?: string
          user_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_toolkit_unlocks_toolkit_item_id_fkey"
            columns: ["toolkit_item_id"]
            isOneToOne: false
            referencedRelation: "toolkit_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
