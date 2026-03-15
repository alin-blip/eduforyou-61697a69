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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      abandoned_carts: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          page_url: string
          phone: string | null
          product_type: string | null
          recovered: boolean
          step_reached: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          page_url: string
          phone?: string | null
          product_type?: string | null
          recovered?: boolean
          step_reached?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          page_url?: string
          phone?: string | null
          product_type?: string | null
          recovered?: boolean
          step_reached?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          agent_id: string | null
          campus: string | null
          contact_id: string | null
          course_slug: string
          created_at: string
          documents: Json | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          campus?: string | null
          contact_id?: string | null
          course_slug: string
          created_at?: string
          documents?: Json | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          campus?: string | null
          contact_id?: string | null
          course_slug?: string
          created_at?: string
          documents?: Json | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          campus_id: string | null
          contact_id: string | null
          course_interest: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          campus_id?: string | null
          contact_id?: string | null
          course_interest?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          campus_id?: string | null
          contact_id?: string | null
          course_interest?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_campus_id_fkey"
            columns: ["campus_id"]
            isOneToOne: false
            referencedRelation: "campuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campuses: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string
          country: string
          created_at: string
          email: string | null
          google_maps_url: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          phone: string | null
          postcode: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          email?: string | null
          google_maps_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          phone?: string | null
          postcode?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          email?: string | null
          google_maps_url?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          phone?: string | null
          postcode?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      ceo_okrs: {
        Row: {
          created_at: string
          id: string
          key_results: Json
          objective: string
          progress: number
          quarter: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          key_results?: Json
          objective: string
          progress?: number
          quarter: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          key_results?: Json
          objective?: string
          progress?: number
          quarter?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ceo_tasks: {
        Row: {
          ai_generated: boolean
          assigned_to: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean
          assigned_to?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          course_interest: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          residence_status: string | null
          source: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          course_interest?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          residence_status?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          course_interest?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          residence_status?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_sends: {
        Row: {
          id: string
          recipient_email: string
          sent_at: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          id?: string
          recipient_email: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          id?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "email_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          category: string | null
          created_at: string | null
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      ikigai_results: {
        Row: {
          created_at: string
          id: string
          ikigai_statements: Json
          service_angles: Json
          updated_at: string
          user_id: string
          what_world_needs: Json
          what_you_can_be_paid_for: Json
          what_you_love: Json
          what_youre_good_at: Json
        }
        Insert: {
          created_at?: string
          id?: string
          ikigai_statements?: Json
          service_angles?: Json
          updated_at?: string
          user_id: string
          what_world_needs?: Json
          what_you_can_be_paid_for?: Json
          what_you_love?: Json
          what_youre_good_at?: Json
        }
        Update: {
          created_at?: string
          id?: string
          ikigai_statements?: Json
          service_angles?: Json
          updated_at?: string
          user_id?: string
          what_world_needs?: Json
          what_you_can_be_paid_for?: Json
          what_you_love?: Json
          what_youre_good_at?: Json
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      offers: {
        Row: {
          created_at: string
          id: string
          premium_package: Json | null
          pricing_justification: string | null
          smv: string | null
          standard_package: Json | null
          starter_package: Json | null
          target_market: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          premium_package?: Json | null
          pricing_justification?: string | null
          smv?: string | null
          standard_package?: Json | null
          starter_package?: Json | null
          target_market?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          premium_package?: Json | null
          pricing_justification?: string | null
          smv?: string | null
          standard_package?: Json | null
          starter_package?: Json | null
          target_market?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount_total: number
          created_at: string
          currency: string
          customer_email: string
          download_sent: boolean
          id: string
          price_id: string
          product_type: string
          status: string
          stripe_customer_id: string | null
          stripe_session_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_total?: number
          created_at?: string
          currency?: string
          customer_email: string
          download_sent?: boolean
          id?: string
          price_id: string
          product_type: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_total?: number
          created_at?: string
          currency?: string
          customer_email?: string
          download_sent?: boolean
          id?: string
          price_id?: string
          product_type?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_session_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      outreach_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          platform: string
          sequence_order: number | null
          subject: string | null
          template_type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          platform: string
          sequence_order?: number | null
          subject?: string | null
          template_type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          platform?: string
          sequence_order?: number | null
          subject?: string | null
          template_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          full_name: string | null
          id: string
          language: string | null
          nationality: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          nationality?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          nationality?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: Json
          contact_id: string | null
          created_at: string
          id: string
          quiz_type: string
          result: Json | null
          user_id: string | null
        }
        Insert: {
          answers?: Json
          contact_id?: string | null
          created_at?: string
          id?: string
          quiz_type: string
          result?: Json | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          contact_id?: string | null
          created_at?: string
          id?: string
          quiz_type?: string
          result?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          agent_id: string
          commission_amount: number | null
          commission_paid: boolean | null
          converted_at: string | null
          course_interest: string | null
          created_at: string
          id: string
          referred_email: string
          referred_name: string
          referred_phone: string | null
          status: string | null
        }
        Insert: {
          agent_id: string
          commission_amount?: number | null
          commission_paid?: boolean | null
          converted_at?: string | null
          course_interest?: string | null
          created_at?: string
          id?: string
          referred_email: string
          referred_name: string
          referred_phone?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string
          commission_amount?: number | null
          commission_paid?: boolean | null
          converted_at?: string | null
          course_interest?: string | null
          created_at?: string
          id?: string
          referred_email?: string
          referred_name?: string
          referred_phone?: string | null
          status?: string | null
        }
        Relationships: []
      }
      skill_entries: {
        Row: {
          category: string
          confidence: number
          created_at: string
          description: string | null
          id: string
          skill: string
          user_id: string
        }
        Insert: {
          category?: string
          confidence?: number
          created_at?: string
          description?: string | null
          id?: string
          skill: string
          user_id: string
        }
        Update: {
          category?: string
          confidence?: number
          created_at?: string
          description?: string | null
          id?: string
          skill?: string
          user_id?: string
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message: string
          provider_id: string | null
          recipient_name: string | null
          recipient_phone: string
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message: string
          provider_id?: string | null
          recipient_name?: string | null
          recipient_phone: string
          status?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message?: string
          provider_id?: string | null
          recipient_name?: string | null
          recipient_phone?: string
          status?: string
        }
        Relationships: []
      }
      social_profiles: {
        Row: {
          about: string | null
          bio: string | null
          content_pillars: Json | null
          created_at: string
          cta: string | null
          hashtags: Json | null
          headline: string | null
          id: string
          platform: string
          updated_at: string
          user_id: string
          username_suggestions: Json | null
        }
        Insert: {
          about?: string | null
          bio?: string | null
          content_pillars?: Json | null
          created_at?: string
          cta?: string | null
          hashtags?: Json | null
          headline?: string | null
          id?: string
          platform: string
          updated_at?: string
          user_id: string
          username_suggestions?: Json | null
        }
        Update: {
          about?: string | null
          bio?: string | null
          content_pillars?: Json | null
          created_at?: string
          cta?: string | null
          hashtags?: Json | null
          headline?: string | null
          id?: string
          platform?: string
          updated_at?: string
          user_id?: string
          username_suggestions?: Json | null
        }
        Relationships: []
      }
      student_cv: {
        Row: {
          certifications: Json
          created_at: string
          education: Json
          experience: Json
          id: string
          languages: Json
          personal_statement: string | null
          skills: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          certifications?: Json
          created_at?: string
          education?: Json
          experience?: Json
          id?: string
          languages?: Json
          personal_statement?: string | null
          skills?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          certifications?: Json
          created_at?: string
          education?: Json
          experience?: Json
          id?: string
          languages?: Json
          personal_statement?: string | null
          skills?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type?: string
          file_name: string
          file_path: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      student_gamification: {
        Row: {
          badges: Json
          created_at: string
          id: string
          last_activity_date: string | null
          level: number
          points: number
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          badges?: Json
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number
          points?: number
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          badges?: Json
          created_at?: string
          id?: string
          last_activity_date?: string | null
          level?: number
          points?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_agent_leaderboard: {
        Args: never
        Returns: {
          agent_display: string
          agent_rank: number
          converted: number
          total_commission: number
          total_referrals: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "agent" | "student"
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
    Enums: {
      app_role: ["admin", "agent", "student"],
    },
  },
} as const
