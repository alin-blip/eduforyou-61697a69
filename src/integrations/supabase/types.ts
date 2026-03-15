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
      deals: {
        Row: {
          id: string
          contact_id: string | null
          title: string
          stage: string
          value: number | null
          course_slug: string | null
          campus_id: string | null
          probability: number | null
          expected_close_date: string | null
          lost_reason: string | null
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          title: string
          stage?: string
          value?: number | null
          course_slug?: string | null
          campus_id?: string | null
          probability?: number | null
          expected_close_date?: string | null
          lost_reason?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          title?: string
          stage?: string
          value?: number | null
          course_slug?: string | null
          campus_id?: string | null
          probability?: number | null
          expected_close_date?: string | null
          lost_reason?: string | null
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      touchpoints: {
        Row: {
          id: string
          contact_id: string
          type: string
          title: string | null
          description: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          type: string
          title?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          type?: string
          title?: string | null
          description?: string | null
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      edu_applications: {
        Row: {
          id: string
          user_id: string
          current_phase: string
          current_step: number
          assigned_consultant: string | null
          university_choice: string | null
          course_choice: string | null
          application_status: string | null
          documents_status: string | null
          finance_status: string | null
          eligibility_status: string | null
          course_match_status: string | null
          test_prep_status: string | null
          cv_status: string | null
          university_response: string | null
          offer_status: string | null
          enrollment_confirmed: boolean
          edu_plan_status: string | null
          ikigai_top_domain: string | null
          ikigai_second_domain: string | null
          ikigai_recommended_courses: Json | null
          ikigai_completed_at: string | null
          started_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_phase?: string
          current_step?: number
          assigned_consultant?: string | null
          university_choice?: string | null
          course_choice?: string | null
          application_status?: string | null
          documents_status?: string | null
          finance_status?: string | null
          eligibility_status?: string | null
          course_match_status?: string | null
          test_prep_status?: string | null
          cv_status?: string | null
          university_response?: string | null
          offer_status?: string | null
          enrollment_confirmed?: boolean
          edu_plan_status?: string | null
          ikigai_top_domain?: string | null
          ikigai_second_domain?: string | null
          ikigai_recommended_courses?: Json | null
          ikigai_completed_at?: string | null
          started_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_phase?: string
          current_step?: number
          assigned_consultant?: string | null
          university_choice?: string | null
          course_choice?: string | null
          application_status?: string | null
          documents_status?: string | null
          finance_status?: string | null
          eligibility_status?: string | null
          course_match_status?: string | null
          test_prep_status?: string | null
          cv_status?: string | null
          university_response?: string | null
          offer_status?: string | null
          enrollment_confirmed?: boolean
          edu_plan_status?: string | null
          ikigai_top_domain?: string | null
          ikigai_second_domain?: string | null
          ikigai_recommended_courses?: Json | null
          ikigai_completed_at?: string | null
          started_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      edu_application_steps: {
        Row: {
          id: string
          application_id: string
          step_key: string
          step_label: string | null
          phase: string | null
          status: string
          completed_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          step_key: string
          step_label?: string | null
          phase?: string | null
          status?: string
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          step_key?: string
          step_label?: string | null
          phase?: string | null
          status?: string
          completed_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_key: string
          badge_name: string | null
          badge_description: string | null
          badge_icon: string | null
          badge_color: string | null
          points_reward: number
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_key: string
          badge_name?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_color?: string | null
          points_reward?: number
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_key?: string
          badge_name?: string | null
          badge_description?: string | null
          badge_icon?: string | null
          badge_color?: string | null
          points_reward?: number
          unlocked_at?: string
        }
        Relationships: []
      }
      eligibility_results: {
        Row: {
          id: string
          user_id: string | null
          email: string | null
          name: string | null
          phone: string | null
          years_of_financing: number | null
          qualification: string | null
          age: number | null
          residency_years: number | null
          immigration_status: string | null
          date_of_birth: string | null
          eligible: boolean | null
          eligibility_type: string | null
          eligible_levels: Json | null
          reason: string | null
          max_years: number | null
          email_sent: boolean
          ikigai_completed: boolean
          application_started: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          years_of_financing?: number | null
          qualification?: string | null
          age?: number | null
          residency_years?: number | null
          immigration_status?: string | null
          date_of_birth?: string | null
          eligible?: boolean | null
          eligibility_type?: string | null
          eligible_levels?: Json | null
          reason?: string | null
          max_years?: number | null
          email_sent?: boolean
          ikigai_completed?: boolean
          application_started?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string | null
          name?: string | null
          phone?: string | null
          years_of_financing?: number | null
          qualification?: string | null
          age?: number | null
          residency_years?: number | null
          immigration_status?: string | null
          date_of_birth?: string | null
          eligible?: boolean | null
          eligibility_type?: string | null
          eligible_levels?: Json | null
          reason?: string | null
          max_years?: number | null
          email_sent?: boolean
          ikigai_completed?: boolean
          application_started?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_agents: {
        Row: {
          id: string
          name: string
          type: string
          status: string
          description: string | null
          config: Json | null
          department: string | null
          system_prompt: string | null
          autonomy_level: string
          last_run_at: string | null
          next_run_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          status?: string
          description?: string | null
          config?: Json | null
          department?: string | null
          system_prompt?: string | null
          autonomy_level?: string
          last_run_at?: string | null
          next_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          status?: string
          description?: string | null
          config?: Json | null
          department?: string | null
          system_prompt?: string | null
          autonomy_level?: string
          last_run_at?: string | null
          next_run_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_agent_logs: {
        Row: {
          id: string
          agent_id: string | null
          action: string | null
          input: Json | null
          output: Json | null
          success: boolean | null
          duration_ms: number | null
          error: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          action?: string | null
          input?: Json | null
          output?: Json | null
          success?: boolean | null
          duration_ms?: number | null
          error?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string | null
          action?: string | null
          input?: Json | null
          output?: Json | null
          success?: boolean | null
          duration_ms?: number | null
          error?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ai_tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          assigned_to: string | null
          priority: string
          status: string
          due_date: string | null
          completed_at: string | null
          created_by: string | null
          agent_id: string | null
          contact_id: string | null
          deal_id: string | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          assigned_to?: string | null
          priority?: string
          status?: string
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          agent_id?: string | null
          contact_id?: string | null
          deal_id?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          assigned_to?: string | null
          priority?: string
          status?: string
          due_date?: string | null
          completed_at?: string | null
          created_by?: string | null
          agent_id?: string | null
          contact_id?: string | null
          deal_id?: string | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_alerts: {
        Row: {
          id: string
          agent_id: string | null
          type: string | null
          title: string | null
          message: string | null
          is_read: boolean
          is_dismissed: boolean
          action_url: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id?: string | null
          type?: string | null
          title?: string | null
          message?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          action_url?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string | null
          type?: string | null
          title?: string | null
          message?: string | null
          is_read?: boolean
          is_dismissed?: boolean
          action_url?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      ai_content: {
        Row: {
          id: string
          type: string
          title: string | null
          content: string | null
          meta_description: string | null
          tags: Json | null
          topic: string | null
          tone: string | null
          language: string
          status: string
          created_by_agent: string | null
          cmo_score: number | null
          publish_date: string | null
          published_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          title?: string | null
          content?: string | null
          meta_description?: string | null
          tags?: Json | null
          topic?: string | null
          tone?: string | null
          language?: string
          status?: string
          created_by_agent?: string | null
          cmo_score?: number | null
          publish_date?: string | null
          published_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string | null
          content?: string | null
          meta_description?: string | null
          tags?: Json | null
          topic?: string | null
          tone?: string | null
          language?: string
          status?: string
          created_by_agent?: string | null
          cmo_score?: number | null
          publish_date?: string | null
          published_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_content_calendar: {
        Row: {
          id: string
          week: number | null
          year: number | null
          plan: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          week?: number | null
          year?: number | null
          plan?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          week?: number | null
          year?: number | null
          plan?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      commissions: {
        Row: {
          id: string
          agent_id: string
          deal_id: string | null
          student_id: string | null
          amount: number
          type: string | null
          status: string
          paid_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          deal_id?: string | null
          student_id?: string | null
          amount: number
          type?: string | null
          status?: string
          paid_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          deal_id?: string | null
          student_id?: string | null
          amount?: number
          type?: string | null
          status?: string
          paid_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      agent_memberships: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_type: string
          status: string
          started_at: string
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          started_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          started_at?: string
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      written_questions: {
        Row: {
          id: string
          course_slug: string
          question_text: string
          model_answer: string | null
          min_words: number | null
          max_words: number | null
          max_score: number | null
          order_index: number | null
          evaluation_criteria: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          course_slug: string
          question_text: string
          model_answer?: string | null
          min_words?: number | null
          max_words?: number | null
          max_score?: number | null
          order_index?: number | null
          evaluation_criteria?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          course_slug?: string
          question_text?: string
          model_answer?: string | null
          min_words?: number | null
          max_words?: number | null
          max_score?: number | null
          order_index?: number | null
          evaluation_criteria?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          id: string
          user_id: string
          course_slug: string
          attempt_type: string | null
          answers: Json | null
          feedback: Json | null
          score: number | null
          max_score: number | null
          passed: boolean | null
          time_taken: number | null
          status: string
          created_at: string
          evaluated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_slug: string
          attempt_type?: string | null
          answers?: Json | null
          feedback?: Json | null
          score?: number | null
          max_score?: number | null
          passed?: boolean | null
          time_taken?: number | null
          status?: string
          created_at?: string
          evaluated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string
          attempt_type?: string | null
          answers?: Json | null
          feedback?: Json | null
          score?: number | null
          max_score?: number | null
          passed?: boolean | null
          time_taken?: number | null
          status?: string
          created_at?: string
          evaluated_at?: string | null
        }
        Relationships: []
      }
      personalized_tests: {
        Row: {
          id: string
          user_id: string
          course_slug: string
          personal_info: Json | null
          generated_content: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_slug: string
          personal_info?: Json | null
          generated_content?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string
          personal_info?: Json | null
          generated_content?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      edu_plans: {
        Row: {
          id: string
          user_id: string
          course_slug: string | null
          course_name: string | null
          eligibility_data: Json | null
          generated_content: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_slug?: string | null
          course_name?: string | null
          eligibility_data?: Json | null
          generated_content?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string | null
          course_name?: string | null
          eligibility_data?: Json | null
          generated_content?: string | null
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      agent_workflows: {
        Row: {
          id: string
          name: string
          slug: string | null
          description: string | null
          department: string | null
          steps: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string | null
          description?: string | null
          department?: string | null
          steps?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string | null
          description?: string | null
          department?: string | null
          steps?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_workflow_runs: {
        Row: {
          id: string
          workflow_id: string | null
          workflow_name: string | null
          current_step: number
          total_steps: number | null
          status: string
          input: Json | null
          output: Json | null
          error: string | null
          started_at: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workflow_id?: string | null
          workflow_name?: string | null
          current_step?: number
          total_steps?: number | null
          status?: string
          input?: Json | null
          output?: Json | null
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workflow_id?: string | null
          workflow_name?: string | null
          current_step?: number
          total_steps?: number | null
          status?: string
          input?: Json | null
          output?: Json | null
          error?: string | null
          started_at?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      agent_approvals: {
        Row: {
          id: string
          workflow_run_id: string | null
          agent_type: string | null
          type: string | null
          title: string | null
          description: string | null
          preview_data: Json | null
          status: string
          reviewer_notes: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workflow_run_id?: string | null
          agent_type?: string | null
          type?: string | null
          title?: string | null
          description?: string | null
          preview_data?: Json | null
          status?: string
          reviewer_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          workflow_run_id?: string | null
          agent_type?: string | null
          type?: string | null
          title?: string | null
          description?: string | null
          preview_data?: Json | null
          status?: string
          reviewer_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      finance_estimates: {
        Row: {
          id: string
          contact_id: string | null
          user_id: string | null
          email: string | null
          course_id: string | null
          tuition_fee: number | null
          maintenance_loan: number | null
          total_estimate: number | null
          living_location: string | null
          household_income: number | null
          inputs: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          contact_id?: string | null
          user_id?: string | null
          email?: string | null
          course_id?: string | null
          tuition_fee?: number | null
          maintenance_loan?: number | null
          total_estimate?: number | null
          living_location?: string | null
          household_income?: number | null
          inputs?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          contact_id?: string | null
          user_id?: string | null
          email?: string | null
          course_id?: string | null
          tuition_fee?: number | null
          maintenance_loan?: number | null
          total_estimate?: number | null
          living_location?: string | null
          household_income?: number | null
          inputs?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      ceo_agent_messages: {
        Row: {
          id: string
          role: string | null
          content: string | null
          source: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          role?: string | null
          content?: string | null
          source?: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          role?: string | null
          content?: string | null
          source?: string
          metadata?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      job_positions: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          type: string
          status: string
          requirements: string | null
          questions: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          type?: string
          status?: string
          requirements?: string | null
          questions?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          type?: string
          status?: string
          requirements?: string | null
          questions?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          id: string
          position_id: string | null
          full_name: string
          email: string
          phone: string | null
          linkedin_url: string | null
          years_experience: number | null
          cv_file_url: string | null
          answers: Json | null
          score: number | null
          status: string
          ai_analysis_summary: string | null
          ai_analysis_match_percent: number | null
          created_at: string
        }
        Insert: {
          id?: string
          position_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          linkedin_url?: string | null
          years_experience?: number | null
          cv_file_url?: string | null
          answers?: Json | null
          score?: number | null
          status?: string
          ai_analysis_summary?: string | null
          ai_analysis_match_percent?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          position_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          linkedin_url?: string | null
          years_experience?: number | null
          cv_file_url?: string | null
          answers?: Json | null
          score?: number | null
          status?: string
          ai_analysis_summary?: string | null
          ai_analysis_match_percent?: number | null
          created_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          source: string | null
          lead_magnet: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          gdpr_consent: boolean
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          phone?: string | null
          source?: string | null
          lead_magnet?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          gdpr_consent?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          source?: string | null
          lead_magnet?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          gdpr_consent?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      email_sequences: {
        Row: {
          id: string
          name: string
          trigger_event: string
          is_active: boolean
          steps: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          trigger_event: string
          is_active?: boolean
          steps?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          trigger_event?: string
          is_active?: boolean
          steps?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      test_prep_attempts: {
        Row: {
          id: string
          user_id: string
          course_slug: string
          test_type: string
          score: number | null
          total_questions: number | null
          answers: Json | null
          feedback: Json | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_slug: string
          test_type: string
          score?: number | null
          total_questions?: number | null
          answers?: Json | null
          feedback?: Json | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_slug?: string
          test_type?: string
          score?: number | null
          total_questions?: number | null
          answers?: Json | null
          feedback?: Json | null
          completed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          agent_id: string
          contract_type: string
          status: string
          signed_at: string | null
          terms: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          contract_type: string
          status?: string
          signed_at?: string | null
          terms?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          contract_type?: string
          status?: string
          signed_at?: string | null
          terms?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          id: string
          title: string
          slug: string
          department: string | null
          location: string | null
          type: string
          description: string | null
          requirements: Json | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          department?: string | null
          location?: string | null
          type?: string
          description?: string | null
          requirements?: Json | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          department?: string | null
          location?: string | null
          type?: string
          description?: string | null
          requirements?: Json | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      career_applications: {
        Row: {
          id: string
          career_id: string | null
          full_name: string
          email: string
          phone: string | null
          cv_url: string | null
          cover_letter: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          career_id?: string | null
          full_name: string
          email: string
          phone?: string | null
          cv_url?: string | null
          cover_letter?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          career_id?: string | null
          full_name?: string
          email?: string
          phone?: string | null
          cv_url?: string | null
          cover_letter?: string | null
          status?: string
          created_at?: string
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
