import { supabase } from "@/lib/supabase/client";
import type { Service } from "@/types/booking";
import type { BusinessSettingsRow, ServiceRow } from "@/types/database";

/**
 * Fetches active services for display in the booking form.
 * Read-only: the frontend never writes to this table.
 */
export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, duration_minutes, price_cents, currency")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .returns<ServiceRow[]>();

  if (error) {
    throw new Error(`Failed to load services: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    durationMinutes: row.duration_minutes,
    priceCents: row.price_cents,
    currency: row.currency,
  }));
}

/**
 * Fetches the single business settings row used to render contact info,
 * timezone, and whether the business is currently accepting bookings.
 * Availability (open days/hours) is still authoritative in n8n — this is
 * only used for display and the earliest client-side sanity checks.
 */
export async function getBusinessSettings(): Promise<BusinessSettingsRow | null> {
  const { data, error } = await supabase
    .from("business_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load business settings: ${error.message}`);
  }

  return data;
}
