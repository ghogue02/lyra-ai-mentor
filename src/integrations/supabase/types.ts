export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      content_blocks: {
        Row: {
          content: string
          created_at: string | null
          id: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
