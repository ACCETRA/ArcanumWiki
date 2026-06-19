export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      pages: {
        Row: {
          category: string
          content: string
          created_at: string
          creator_id: string
          id: string
          slug: string
          summary: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          creator_id: string
          id?: string
          slug: string
          summary?: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          creator_id?: string
          id?: string
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "pages_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "contributor_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_assets: {
        Row: {
          asset_type: string
          campaign_id: string
          created_at: string
          description: string
          id: string
          public_url: string
          storage_path: string
          title: string
          uploaded_by: string
        }
        Insert: {
          asset_type?: string
          campaign_id: string
          created_at?: string
          description?: string
          id?: string
          public_url: string
          storage_path: string
          title: string
          uploaded_by: string
        }
        Update: {
          asset_type?: string
          campaign_id?: string
          created_at?: string
          description?: string
          id?: string
          public_url?: string
          storage_path?: string
          title?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      campaign_characters: {
        Row: {
          background: string
          campaign_id: string
          class_name: string
          created_at: string
          id: string
          is_active: boolean
          level: number
          name: string
          portrait_url: string | null
          profile_id: string | null
          race: string
          sheet_data: Json
          sheet_file_path: string | null
          sheet_url: string | null
          summary: string
          updated_at: string
        }
        Insert: {
          background?: string
          campaign_id: string
          class_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          level?: number
          name: string
          portrait_url?: string | null
          profile_id?: string | null
          race?: string
          sheet_data?: Json
          sheet_file_path?: string | null
          sheet_url?: string | null
          summary?: string
          updated_at?: string
        }
        Update: {
          background?: string
          campaign_id?: string
          class_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          level?: number
          name?: string
          portrait_url?: string | null
          profile_id?: string | null
          race?: string
          sheet_data?: Json
          sheet_file_path?: string | null
          sheet_url?: string | null
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_homebrew_spells: {
        Row: {
          campaign_id: string | null
          casting_time: string
          components: string
          content: string
          created_at: string
          created_by: string
          duration: string
          id: string
          level: string
          name: string
          range: string
          school: string
          summary: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          casting_time?: string
          components?: string
          content?: string
          created_at?: string
          created_by: string
          duration?: string
          id?: string
          level?: string
          name: string
          range?: string
          school?: string
          summary?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          casting_time?: string
          components?: string
          content?: string
          created_at?: string
          created_by?: string
          duration?: string
          id?: string
          level?: string
          name?: string
          range?: string
          school?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_members: {
        Row: {
          campaign_id: string
          character_name: string
          display_name: string
          id: string
          joined_at: string
          profile_id: string
          role: string
        }
        Insert: {
          campaign_id: string
          character_name?: string
          display_name?: string
          id?: string
          joined_at?: string
          profile_id: string
          role?: string
        }
        Update: {
          campaign_id?: string
          character_name?: string
          display_name?: string
          id?: string
          joined_at?: string
          profile_id?: string
          role?: string
        }
        Relationships: []
      }
      campaign_notes: {
        Row: {
          campaign_id: string
          content: string
          created_at: string
          created_by: string
          id: string
          note_type: string
          pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          content?: string
          created_at?: string
          created_by: string
          id?: string
          note_type?: string
          pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          note_type?: string
          pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaign_recaps: {
        Row: {
          campaign_id: string
          created_at: string
          created_by: string
          id: string
          important_points: Json
          recap: string
          session_number: number
        }
        Insert: {
          campaign_id: string
          created_at?: string
          created_by: string
          id?: string
          important_points?: Json
          recap?: string
          session_number?: number
        }
        Update: {
          campaign_id?: string
          created_at?: string
          created_by?: string
          id?: string
          important_points?: Json
          recap?: string
          session_number?: number
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_public: boolean
          last_recap: string
          last_recap_at: string | null
          name: string
          session_count: number
          slug: string
          summary: string
          system: string
          updated_at: string
          world_name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_public?: boolean
          last_recap?: string
          last_recap_at?: string | null
          name: string
          session_count?: number
          slug: string
          summary?: string
          system?: string
          updated_at?: string
          world_name?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_public?: boolean
          last_recap?: string
          last_recap_at?: string | null
          name?: string
          session_count?: number
          slug?: string
          summary?: string
          system?: string
          updated_at?: string
          world_name?: string
        }
        Relationships: []
      }
      commission_listings: {
        Row: {
          active: boolean
          contact_url: string
          created_at: string
          description: string
          id: string
          listing_type: string
          portfolio_url: string
          profile_id: string
          starting_price_usd: number
          summary: string
          turnaround_days: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          contact_url?: string
          created_at?: string
          description?: string
          id?: string
          listing_type?: string
          portfolio_url?: string
          profile_id: string
          starting_price_usd?: number
          summary?: string
          turnaround_days?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          contact_url?: string
          created_at?: string
          description?: string
          id?: string
          listing_type?: string
          portfolio_url?: string
          profile_id?: string
          starting_price_usd?: number
          summary?: string
          turnaround_days?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      commission_requests: {
        Row: {
          brief: string
          budget_max: number | null
          budget_min: number | null
          campaign_id: string | null
          commission_type: string
          contact_email: string
          created_at: string
          due_date: string | null
          id: string
          listing_id: string | null
          requester_id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          brief: string
          budget_max?: number | null
          budget_min?: number | null
          campaign_id?: string | null
          commission_type?: string
          contact_email?: string
          created_at?: string
          due_date?: string | null
          id?: string
          listing_id?: string | null
          requester_id: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          brief?: string
          budget_max?: number | null
          budget_min?: number | null
          campaign_id?: string | null
          commission_type?: string
          contact_email?: string
          created_at?: string
          due_date?: string | null
          id?: string
          listing_id?: string | null
          requester_id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string
          id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name: string
          id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      revisions: {
        Row: {
          change_note: string
          char_delta: number
          content: string
          created_at: string
          editor_id: string
          id: string
          page_id: string
          summary: string
          title: string
        }
        Insert: {
          change_note?: string
          char_delta?: number
          content?: string
          created_at?: string
          editor_id: string
          id?: string
          page_id: string
          summary?: string
          title: string
        }
        Update: {
          change_note?: string
          char_delta?: number
          content?: string
          created_at?: string
          editor_id?: string
          id?: string
          page_id?: string
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "revisions_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "contributor_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisions_editor_id_fkey"
            columns: ["editor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revisions_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      contributor_stats: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          edit_count: number | null
          id: string | null
          pages_created: number | null
          username: string | null
        }
        Relationships: []
      }
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

