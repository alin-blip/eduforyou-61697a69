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
      agent_approvals: {
        Row: {
          agent_id: string
          created_at: string
          details: Json | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          type: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          details?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          type: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          type?: string
        }
        Relationships: []
      }
      agent_memberships: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          started_at: string
          status: string
          tier: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          started_at?: string
          status?: string
          tier?: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          started_at?: string
          status?: string
          tier?: string
        }
        Relationships: []
      }
      agent_workflow_runs: {
        Row: {
          completed_at: string | null
          error: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          started_at: string
          status: string | null
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string
          status?: string | null
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string
          status?: string | null
          workflow_name?: string
        }
        Relationships: []
      }
      agent_workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          steps: Json | null
          trigger_type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json | null
          trigger_type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json | null
          trigger_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_alerts: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean | null
          severity: string | null
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          severity?: string | null
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          severity?: string | null
          title?: string
          type?: string | null
        }
        Relationships: []
      }
      ai_content: {
        Row: {
          content: string
          content_type: string | null
          created_at: string
          created_by: string | null
          id: string
          scheduled_for: string | null
          status: string | null
          title: string | null
          tone: string | null
          topic: string | null
          updated_at: string
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          status?: string | null
          title?: string | null
          tone?: string | null
          topic?: string | null
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          scheduled_for?: string | null
          status?: string | null
          title?: string | null
          tone?: string | null
          topic?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ai_content_calendar: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string
          id: string
          notes: string | null
          scheduled_date: string | null
          status: string | null
          title: string
          week: number | null
          year: number | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          title: string
          week?: number | null
          year?: number | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string | null
          title?: string
          week?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_content_calendar_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "ai_content"
            referencedColumns: ["id"]
          },
        ]
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
      career_applications: {
        Row: {
          career_id: string | null
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          status: string
        }
        Insert: {
          career_id?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          status?: string
        }
        Update: {
          career_id?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          status?: string
        }
        Relationships: []
      }
      ceo_agent_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string | null
          user_id?: string | null
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
      commissions: {
        Row: {
          agent_id: string
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          referral_id: string | null
          status: string | null
        }
        Insert: {
          agent_id: string
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_id?: string | null
          status?: string | null
        }
        Update: {
          agent_id?: string
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          referral_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commissions_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
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
      contracts: {
        Row: {
          agent_id: string
          contract_type: string | null
          created_at: string
          expires_at: string | null
          id: string
          notes: string | null
          signed_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_id: string
          contract_type?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_id?: string
          contract_type?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          notes?: string | null
          signed_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          campus: string | null
          category: string | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          level: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          campus?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          campus?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          agent_id: string | null
          contact_id: string | null
          created_at: string
          id: string
          notes: string | null
          stage: string | null
          status: string | null
          title: string | null
          updated_at: string
          value: number | null
        }
        Insert: {
          agent_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          stage?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          value?: number | null
        }
        Update: {
          agent_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          stage?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      edu_application_steps: {
        Row: {
          application_id: string
          completed_at: string | null
          created_at: string
          id: string
          status: string
          step_key: string
        }
        Insert: {
          application_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_key: string
        }
        Update: {
          application_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          step_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "edu_application_steps_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "edu_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      edu_applications: {
        Row: {
          course_name: string | null
          course_slug: string | null
          created_at: string
          eligibility_data: Json | null
          generated_content: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          eligibility_data?: Json | null
          generated_content?: string | null
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          eligibility_data?: Json | null
          generated_content?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      edu_plans: {
        Row: {
          course_name: string | null
          course_slug: string | null
          created_at: string
          id: string
          plan_items: Json | null
          status: string | null
          user_id: string
        }
        Insert: {
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          id?: string
          plan_items?: Json | null
          status?: string | null
          user_id: string
        }
        Update: {
          course_name?: string | null
          course_slug?: string | null
          created_at?: string
          id?: string
          plan_items?: Json | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      eligibility_results: {
        Row: {
          age: number | null
          answers: Json | null
          application_started: boolean | null
          created_at: string
          eligible: boolean | null
          email_sent: boolean | null
          id: string
          ikigai_completed: boolean | null
          qualification: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          answers?: Json | null
          application_started?: boolean | null
          created_at?: string
          eligible?: boolean | null
          email_sent?: boolean | null
          id?: string
          ikigai_completed?: boolean | null
          qualification?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          answers?: Json | null
          application_started?: boolean | null
          created_at?: string
          eligible?: boolean | null
          email_sent?: boolean | null
          id?: string
          ikigai_completed?: boolean | null
          qualification?: string | null
          user_id?: string | null
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
      email_sequences: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          steps: Json | null
          trigger_event: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          steps?: Json | null
          trigger_event?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          steps?: Json | null
          trigger_event?: string | null
          updated_at?: string
        }
        Relationships: []
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
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          position_id: string | null
          status: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          status?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "job_positions"
            referencedColumns: ["id"]
          },
        ]
      }
      job_positions: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          id: string
          is_active: boolean | null
          location: string | null
          requirements: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          requirements?: string | null
          title?: string
          type?: string | null
          updated_at?: string
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
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          gdpr_consent: boolean | null
          id: string
          lead_magnet: string | null
          name: string | null
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          gdpr_consent?: boolean | null
          id?: string
          lead_magnet?: string | null
          name?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          gdpr_consent?: boolean | null
          id?: string
          lead_magnet?: string | null
          name?: string | null
          source?: string | null
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
          notes: string | null
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
          notes?: string | null
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
          notes?: string | null
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
      test_attempts: {
        Row: {
          answers: Json | null
          attempt_type: string | null
          course_slug: string | null
          created_at: string
          duration_seconds: number | null
          evaluated_at: string | null
          feedback: Json | null
          id: string
          max_score: number | null
          passed: boolean | null
          questions_answered: number | null
          score: number | null
          status: string | null
          submitted_at: string | null
          test_type: string | null
          time_taken: number | null
          total_questions: number | null
          total_words: number | null
          user_id: string
        }
        Insert: {
          answers?: Json | null
          attempt_type?: string | null
          course_slug?: string | null
          created_at?: string
          duration_seconds?: number | null
          evaluated_at?: string | null
          feedback?: Json | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          questions_answered?: number | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          test_type?: string | null
          time_taken?: number | null
          total_questions?: number | null
          total_words?: number | null
          user_id: string
        }
        Update: {
          answers?: Json | null
          attempt_type?: string | null
          course_slug?: string | null
          created_at?: string
          duration_seconds?: number | null
          evaluated_at?: string | null
          feedback?: Json | null
          id?: string
          max_score?: number | null
          passed?: boolean | null
          questions_answered?: number | null
          score?: number | null
          status?: string | null
          submitted_at?: string | null
          test_type?: string | null
          time_taken?: number | null
          total_questions?: number | null
          total_words?: number | null
          user_id?: string
        }
        Relationships: []
      }
      touchpoints: {
        Row: {
          contact_id: string | null
          content: string | null
          created_at: string
          created_by: string | null
          deal_id: string | null
          id: string
          type: string
        }
        Insert: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          type: string
        }
        Update: {
          contact_id?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          deal_id?: string | null
          id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "touchpoints_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "touchpoints_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
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
      written_questions: {
        Row: {
          category: string | null
          course_slug: string | null
          created_at: string
          difficulty: string | null
          id: string
          is_active: boolean | null
          max_words: number | null
          question_text: string
        }
        Insert: {
          category?: string | null
          course_slug?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          max_words?: number | null
          question_text: string
        }
        Update: {
          category?: string | null
          course_slug?: string | null
          created_at?: string
          difficulty?: string | null
          id?: string
          is_active?: boolean | null
          max_words?: number | null
          question_text?: string
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
