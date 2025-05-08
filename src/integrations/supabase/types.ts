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
      api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          key: string
          last_used_at: string | null
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          key: string
          last_used_at?: string | null
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          key?: string
          last_used_at?: string | null
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      api_usage_tracking: {
        Row: {
          api_key_id: string | null
          batch_call: boolean | null
          batch_call_cost: number | null
          branded_call: boolean | null
          branded_call_cost: number | null
          call_id: string | null
          client_info: string | null
          concurrency: boolean | null
          concurrency_cost: number | null
          extra_knowledge_base: number | null
          extra_knowledge_base_cost: number | null
          id: string
          knowledge_base_cost: number | null
          knowledge_base_queries: number | null
          llm_cost: number | null
          llm_model: string | null
          llm_tokens: number | null
          phone_numbers: number | null
          phone_numbers_cost: number | null
          request_method: string | null
          request_path: string | null
          request_status: number | null
          response_time_ms: number | null
          telephony_cost: number | null
          telephony_minutes: number | null
          timestamp: string | null
          total_cost: number | null
          user_id: string | null
          verified_phone_number: boolean | null
          verified_phone_number_cost: number | null
          voice_engine_cost: number | null
          voice_engine_minutes: number | null
          voice_engine_type: string | null
        }
        Insert: {
          api_key_id?: string | null
          batch_call?: boolean | null
          batch_call_cost?: number | null
          branded_call?: boolean | null
          branded_call_cost?: number | null
          call_id?: string | null
          client_info?: string | null
          concurrency?: boolean | null
          concurrency_cost?: number | null
          extra_knowledge_base?: number | null
          extra_knowledge_base_cost?: number | null
          id?: string
          knowledge_base_cost?: number | null
          knowledge_base_queries?: number | null
          llm_cost?: number | null
          llm_model?: string | null
          llm_tokens?: number | null
          phone_numbers?: number | null
          phone_numbers_cost?: number | null
          request_method?: string | null
          request_path?: string | null
          request_status?: number | null
          response_time_ms?: number | null
          telephony_cost?: number | null
          telephony_minutes?: number | null
          timestamp?: string | null
          total_cost?: number | null
          user_id?: string | null
          verified_phone_number?: boolean | null
          verified_phone_number_cost?: number | null
          voice_engine_cost?: number | null
          voice_engine_minutes?: number | null
          voice_engine_type?: string | null
        }
        Update: {
          api_key_id?: string | null
          batch_call?: boolean | null
          batch_call_cost?: number | null
          branded_call?: boolean | null
          branded_call_cost?: number | null
          call_id?: string | null
          client_info?: string | null
          concurrency?: boolean | null
          concurrency_cost?: number | null
          extra_knowledge_base?: number | null
          extra_knowledge_base_cost?: number | null
          id?: string
          knowledge_base_cost?: number | null
          knowledge_base_queries?: number | null
          llm_cost?: number | null
          llm_model?: string | null
          llm_tokens?: number | null
          phone_numbers?: number | null
          phone_numbers_cost?: number | null
          request_method?: string | null
          request_path?: string | null
          request_status?: number | null
          response_time_ms?: number | null
          telephony_cost?: number | null
          telephony_minutes?: number | null
          timestamp?: string | null
          total_cost?: number | null
          user_id?: string | null
          verified_phone_number?: boolean | null
          verified_phone_number_cost?: number | null
          voice_engine_cost?: number | null
          voice_engine_minutes?: number | null
          voice_engine_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_usage_tracking_api_key_id_fkey"
            columns: ["api_key_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
        ]
      }
      call_log: {
        Row: {
          agent_id: string | null
          call_id: string
          call_status: string | null
          call_successful: boolean | null
          call_summary: string | null
          call_type: string | null
          campaing_name: string | null
          collected_dynamic_variables: Json | null
          combined_cost: number | null
          created_at: string | null
          direction: string | null
          disconnection_reason: string | null
          duration_ms: number | null
          end_timestamp: string | null
          from_number: string | null
          id: string
          in_voicemail: boolean | null
          llm_cost: number | null
          llm_model: string | null
          llm_unit_price: number | null
          opt_out_sensitive_data_storage: boolean | null
          public_log_url: string | null
          recording_url: string | null
          retell_llm_dynamic_variables: Json | null
          retell_platform_cost: number | null
          retell_platform_unit_price: number | null
          send: boolean | null
          start_timestamp: string | null
          telephony_cost: number | null
          telephony_identifier: Json | null
          telephony_type: string | null
          to_number: string | null
          total_duration_seconds: number | null
          total_duration_unit_price: number | null
          transcript: string | null
          user: string | null
          user_id: string | null
          user_sentiment: string | null
          voice_engine_type: string | null
          voice_platform_tts_cost: number | null
          voice_platform_unit_price: number | null
        }
        Insert: {
          agent_id?: string | null
          call_id: string
          call_status?: string | null
          call_successful?: boolean | null
          call_summary?: string | null
          call_type?: string | null
          campaing_name?: string | null
          collected_dynamic_variables?: Json | null
          combined_cost?: number | null
          created_at?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: string | null
          from_number?: string | null
          id?: string
          in_voicemail?: boolean | null
          llm_cost?: number | null
          llm_model?: string | null
          llm_unit_price?: number | null
          opt_out_sensitive_data_storage?: boolean | null
          public_log_url?: string | null
          recording_url?: string | null
          retell_llm_dynamic_variables?: Json | null
          retell_platform_cost?: number | null
          retell_platform_unit_price?: number | null
          send?: boolean | null
          start_timestamp?: string | null
          telephony_cost?: number | null
          telephony_identifier?: Json | null
          telephony_type?: string | null
          to_number?: string | null
          total_duration_seconds?: number | null
          total_duration_unit_price?: number | null
          transcript?: string | null
          user?: string | null
          user_id?: string | null
          user_sentiment?: string | null
          voice_engine_type?: string | null
          voice_platform_tts_cost?: number | null
          voice_platform_unit_price?: number | null
        }
        Update: {
          agent_id?: string | null
          call_id?: string
          call_status?: string | null
          call_successful?: boolean | null
          call_summary?: string | null
          call_type?: string | null
          campaing_name?: string | null
          collected_dynamic_variables?: Json | null
          combined_cost?: number | null
          created_at?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: string | null
          from_number?: string | null
          id?: string
          in_voicemail?: boolean | null
          llm_cost?: number | null
          llm_model?: string | null
          llm_unit_price?: number | null
          opt_out_sensitive_data_storage?: boolean | null
          public_log_url?: string | null
          recording_url?: string | null
          retell_llm_dynamic_variables?: Json | null
          retell_platform_cost?: number | null
          retell_platform_unit_price?: number | null
          send?: boolean | null
          start_timestamp?: string | null
          telephony_cost?: number | null
          telephony_identifier?: Json | null
          telephony_type?: string | null
          to_number?: string | null
          total_duration_seconds?: number | null
          total_duration_unit_price?: number | null
          transcript?: string | null
          user?: string | null
          user_id?: string | null
          user_sentiment?: string | null
          voice_engine_type?: string | null
          voice_platform_tts_cost?: number | null
          voice_platform_unit_price?: number | null
        }
        Relationships: []
      }
      knowledge_base_sources: {
        Row: {
          content_url: string | null
          created_at: string | null
          file_size: number | null
          file_url: string | null
          filename: string | null
          id: string
          knowledge_base_id: string
          title: string | null
          type: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url?: string | null
          filename?: string | null
          id?: string
          knowledge_base_id: string
          title?: string | null
          type: string
        }
        Update: {
          content_url?: string | null
          created_at?: string | null
          file_size?: number | null
          file_url?: string | null
          filename?: string | null
          id?: string
          knowledge_base_id?: string
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_sources_knowledge_base_id_fkey"
            columns: ["knowledge_base_id"]
            isOneToOne: false
            referencedRelation: "knowledge_bases"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_bases: {
        Row: {
          created_at: string | null
          enable_auto_refresh: boolean | null
          id: string
          knowledge_base_name: string
          status: string | null
          user_id: string | null
          user_kb: string
          user_modified_timestamp: number | null
        }
        Insert: {
          created_at?: string | null
          enable_auto_refresh?: boolean | null
          id?: string
          knowledge_base_name: string
          status?: string | null
          user_id?: string | null
          user_kb: string
          user_modified_timestamp?: number | null
        }
        Update: {
          created_at?: string | null
          enable_auto_refresh?: boolean | null
          id?: string
          knowledge_base_name?: string
          status?: string | null
          user_id?: string | null
          user_kb?: string
          user_modified_timestamp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      cost_calculation_view: {
        Row: {
          agent_id: string | null
          call_id: string | null
          call_status: string | null
          call_type: string | null
          created_at: string | null
          direction: string | null
          duration_ms: number | null
          extra_kb_cost: number | null
          from_number: string | null
          knowledge_base_count: number | null
          llm_cost: number | null
          telephony_cost: number | null
          to_number: string | null
          total_cost: number | null
          user: string | null
          voice_cost: number | null
        }
        Relationships: []
      }
      user_costs_summary: {
        Row: {
          call_count: number | null
          grand_total: number | null
          kb_count: number | null
          kb_extra_total: number | null
          llm_total: number | null
          telephony_total: number | null
          user_id: string | null
          voice_total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_costs: {
        Args: { p_user: string }
        Returns: {
          user_id: string
          telephony_total: number
          voice_total: number
          llm_total: number
          kb_extra_total: number
          grand_total: number
          call_count: number
          kb_count: number
        }[]
      }
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
