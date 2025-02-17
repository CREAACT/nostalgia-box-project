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
      construction_estimates: {
        Row: {
          area: number
          conversation_id: string | null
          created_at: string
          estimated_cost: number
          id: string
          location: string
          status: string
          updated_at: string
          urgency: string
          user_id: string | null
          work_type: string
        }
        Insert: {
          area: number
          conversation_id?: string | null
          created_at?: string
          estimated_cost: number
          id?: string
          location: string
          status?: string
          updated_at?: string
          urgency: string
          user_id?: string | null
          work_type: string
        }
        Update: {
          area?: number
          conversation_id?: string | null
          created_at?: string
          estimated_cost?: number
          id?: string
          location?: string
          status?: string
          updated_at?: string
          urgency?: string
          user_id?: string | null
          work_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_estimates_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "construction_estimates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "direct_messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "direct_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string
          friend_id: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          friend_id: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          friend_id?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "friendships_friend_id_fkey"
            columns: ["friend_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "friendships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      olympiad_participations: {
        Row: {
          certificate_url: string | null
          date: string | null
          id: string
          olympiad_name: string
          position: number | null
          result: string | null
          user_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          date?: string | null
          id?: string
          olympiad_name: string
          position?: number | null
          result?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          date?: string | null
          id?: string
          olympiad_name?: string
          position?: number | null
          result?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "olympiad_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          achievements: Json[] | null
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          certificates: Json[] | null
          completed_stages: number | null
          created_at: string
          custom_id: string | null
          first_name: string | null
          friends: string[] | null
          id: string
          is_public: boolean | null
          last_name: string | null
          medals: Json[] | null
          notifications_enabled: boolean | null
          rank: string | null
          rating: number | null
          role: Database["public"]["Enums"]["user_role"]
          social_links: Json | null
          status: string | null
          total_olympiads: number | null
          username: string | null
        }
        Insert: {
          achievements?: Json[] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          certificates?: Json[] | null
          completed_stages?: number | null
          created_at?: string
          custom_id?: string | null
          first_name?: string | null
          friends?: string[] | null
          id: string
          is_public?: boolean | null
          last_name?: string | null
          medals?: Json[] | null
          notifications_enabled?: boolean | null
          rank?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          status?: string | null
          total_olympiads?: number | null
          username?: string | null
        }
        Update: {
          achievements?: Json[] | null
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          certificates?: Json[] | null
          completed_stages?: number | null
          created_at?: string
          custom_id?: string | null
          first_name?: string | null
          friends?: string[] | null
          id?: string
          is_public?: boolean | null
          last_name?: string | null
          medals?: Json[] | null
          notifications_enabled?: boolean | null
          rank?: string | null
          rating?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          social_links?: Json | null
          status?: string | null
          total_olympiads?: number | null
          username?: string | null
        }
        Relationships: []
      }
      time_capsules: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_favorite: boolean | null
          is_sealed: boolean | null
          message: string
          open_date: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          is_sealed?: boolean | null
          message: string
          open_date: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_favorite?: boolean | null
          is_sealed?: boolean | null
          message?: string
          open_date?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_capsules_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_posts: {
        Row: {
          created_at: string
          id: string
          user_id: string | null
          voice_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id?: string | null
          voice_url: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string | null
          voice_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "voice_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      user_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
