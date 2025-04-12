
// This file contains database type definitions for use with supabase-js
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agent_templates: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          popularity: string
          icon: string
          system_prompt: string
          config: Json | null
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          popularity: string
          icon: string
          system_prompt: string
          config?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          popularity?: string
          icon?: string
          system_prompt?: string
          config?: Json | null
        }
      }
      user_agents: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          status: string
          icon: string | null
          system_prompt: string | null
          config: Json | null
          template_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category?: string | null
          status: string
          icon?: string | null
          system_prompt?: string | null
          config?: Json | null
          template_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          category?: string | null
          status?: string
          icon?: string | null
          system_prompt?: string | null
          config?: Json | null
          template_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_deployments: {
        Row: {
          id: string
          agent_id: string
          type: string
          status: string
          config: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          type: string
          status: string
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          type?: string
          status?: string
          config?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_tools: {
        Row: {
          id: string
          agent_id: string
          name: string
          description: string | null
          tool_type: string
          config: Json | null
        }
        Insert: {
          id?: string
          agent_id: string
          name: string
          description?: string | null
          tool_type: string
          config?: Json | null
        }
        Update: {
          id?: string
          agent_id?: string
          name?: string
          description?: string | null
          tool_type?: string
          config?: Json | null
        }
      }
      agent_knowledge_bases: {
        Row: {
          id: string
          agent_id: string
          name: string
          description: string | null
          vectorstore_type: string
          config: Json | null
        }
        Insert: {
          id?: string
          agent_id: string
          name: string
          description?: string | null
          vectorstore_type: string
          config?: Json | null
        }
        Update: {
          id?: string
          agent_id?: string
          name?: string
          description?: string | null
          vectorstore_type?: string
          config?: Json | null
        }
      }
      agent_documents: {
        Row: {
          id: string
          knowledge_base_id: string
          filename: string
          file_size: number
          file_type: string
          storage_path: string
          processed: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          knowledge_base_id: string
          filename: string
          file_size: number
          file_type: string
          storage_path: string
          processed: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          knowledge_base_id?: string
          filename?: string
          file_size?: number
          file_type?: string
          storage_path?: string
          processed?: boolean
          metadata?: Json | null
        }
      }
      user_subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          payment_provider: string | null
          payment_provider_subscription_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          payment_provider?: string | null
          payment_provider_subscription_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          cancel_at_period_end?: boolean
          payment_provider?: string | null
          payment_provider_subscription_id?: string | null
        }
      }
      subscription_plans: {
        Row: {
          id: string
          name: string
          description: string
          monthly_price: number
          annual_price: number
          features: Json
          limits: Json
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          monthly_price: number
          annual_price: number
          features: Json
          limits: Json
          is_active: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          monthly_price?: number
          annual_price?: number
          features?: Json
          limits?: Json
          is_active?: boolean
        }
      }
      ai_models: {
        Row: {
          id: string
          name: string
          provider: string
          model_id: string
          capabilities: string[]
          description: string
          max_tokens: number
          default_temperature: number
          is_available: boolean
          pricing_per_1k_tokens: Json
        }
        Insert: {
          id?: string
          name: string
          provider: string
          model_id: string
          capabilities: string[]
          description: string
          max_tokens: number
          default_temperature: number
          is_available: boolean
          pricing_per_1k_tokens: Json
        }
        Update: {
          id?: string
          name?: string
          provider?: string
          model_id?: string
          capabilities?: string[]
          description?: string
          max_tokens?: number
          default_temperature?: number
          is_available?: boolean
          pricing_per_1k_tokens?: Json
        }
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

// Helper types for Supabase
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
