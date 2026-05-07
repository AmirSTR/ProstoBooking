export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      availability_rules: {
        Row: {
          id: string;
          business_id: string;
          staff_id: string | null;
          weekday: number;
          start_time: string;
          end_time: string;
          buffer_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          staff_id?: string | null;
          weekday: number;
          start_time: string;
          end_time: string;
          buffer_minutes?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["availability_rules"]["Insert"]>;
      };
      blocked_times: {
        Row: {
          id: string;
          business_id: string;
          staff_id: string | null;
          starts_at: string;
          ends_at: string;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          staff_id?: string | null;
          starts_at: string;
          ends_at: string;
          reason?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blocked_times"]["Insert"]>;
      };
      payment_events: {
        Row: {
          id: string;
          provider: Database["public"]["Enums"]["payment_provider"];
          provider_event_id: string;
          event_type: string;
          business_id: string | null;
          payload: Json;
          processed_at: string;
        };
        Insert: {
          id?: string;
          provider: Database["public"]["Enums"]["payment_provider"];
          provider_event_id: string;
          event_type: string;
          business_id?: string | null;
          payload: Json;
          processed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_events"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          business_id: string;
          service_id: string;
          staff_id: string | null;
          customer_id: string | null;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          starts_at: string;
          ends_at: string;
          status: Database["public"]["Enums"]["booking_status"];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          service_id: string;
          staff_id?: string | null;
          customer_id?: string | null;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          starts_at: string;
          ends_at: string;
          status?: Database["public"]["Enums"]["booking_status"];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      business_members: {
        Row: {
          id: string;
          business_id: string;
          profile_id: string;
          role: Database["public"]["Enums"]["business_member_role"];
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          profile_id: string;
          role?: Database["public"]["Enums"]["business_member_role"];
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["business_members"]["Insert"]>;
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          timezone: string;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          slug: string;
          timezone?: string;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price_cents: number;
          is_visible: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          duration_minutes: number;
          price_cents: number;
          is_visible?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      staff_profiles: {
        Row: {
          id: string;
          business_id: string;
          profile_id: string | null;
          display_name: string;
          bio: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          profile_id?: string | null;
          display_name: string;
          bio?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_profiles"]["Insert"]>;
      };
      staff_services: {
        Row: {
          staff_id: string;
          service_id: string;
        };
        Insert: {
          staff_id: string;
          service_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["staff_services"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          business_id: string;
          provider: Database["public"]["Enums"]["payment_provider"];
          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          provider_payment_id: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          price_cents: number;
          currency: string;
          trial_ends_at: string;
          current_period_ends_at: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          provider: Database["public"]["Enums"]["payment_provider"];
          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          provider_payment_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          price_cents?: number;
          currency?: string;
          trial_ends_at?: string;
          current_period_ends_at?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_business_admin: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      is_business_member: {
        Args: { target_business_id: string };
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      booking_status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
      business_member_role: "owner" | "admin" | "staff";
      payment_provider: "stripe" | "yookassa";
      subscription_status: "trialing" | "active" | "past_due" | "canceled" | "unpaid";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Inserts<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Updates<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
