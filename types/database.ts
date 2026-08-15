/**
 * Hand-written mirror of supabase/schema.sql.
 *
 * Once the project is linked to a real Supabase instance, replace this file
 * with the generated types for full drift-safety:
 *
 *   npx supabase gen types typescript --project-id <id> > types/database.ts
 */

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";

export interface OpeningHoursWindow {
  start: string; // "HH:mm", 24h
  end: string; // "HH:mm", 24h
}

export type OpeningHours = Partial<
  Record<"mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun", OpeningHoursWindow[]>
>;

export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price_cents: number;
          currency: string;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          name: string;
          duration_minutes: number;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      business_settings: {
        Row: {
          id: string;
          business_name: string;
          timezone: string;
          contact_email: string;
          contact_phone: string | null;
          address: string | null;
          opening_hours: OpeningHours;
          buffer_minutes: number;
          booking_lead_time_minutes: number;
          booking_horizon_days: number;
          google_calendar_id: string | null;
          is_accepting_bookings: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["business_settings"]["Row"]> & {
          business_name: string;
          contact_email: string;
        };
        Update: Partial<Database["public"]["Tables"]["business_settings"]["Row"]>;
      };
      customers: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          notes: string | null;
          auth_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["customers"]["Row"]> & {
          full_name: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          service_id: string;
          start_time: string;
          end_time: string;
          status: BookingStatus;
          customer_notes: string | null;
          internal_notes: string | null;
          google_calendar_event_id: string | null;
          confirmation_email_sent_at: string | null;
          source: string;
          automation_interests: string[] | null;
          automation_description: string | null;
          timezone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["bookings"]["Row"]> & {
          customer_id: string;
          service_id: string;
          start_time: string;
          end_time: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Row"]>;
      };
    };
  };
}

export type ServiceRow = Database["public"]["Tables"]["services"]["Row"];
export type BusinessSettingsRow = Database["public"]["Tables"]["business_settings"]["Row"];
export type CustomerRow = Database["public"]["Tables"]["customers"]["Row"];
export type BookingRow = Database["public"]["Tables"]["bookings"]["Row"];
