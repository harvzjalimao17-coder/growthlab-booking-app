export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceCents: number;
  currency: string;
}

/**
 * The exact GrowthLab capability taxonomy. Used identically across the
 * landing page's "What We Automate" section, the booking form's interest
 * selector, the webhook payload, and the Supabase bookings.automation_interests
 * column. Do not rename or add entries without updating all four.
 */
export const AUTOMATION_CAPABILITIES = [
  { slug: "lead-management", name: "Lead Management" },
  { slug: "ai-customer-support", name: "AI Customer Support" },
  { slug: "bookings-scheduling", name: "Bookings & Scheduling" },
  { slug: "crm-automation", name: "CRM Automation" },
  { slug: "automated-follow-up", name: "Automated Follow-Up" },
  { slug: "business-operations", name: "Business Operations" },
  { slug: "reporting-insights", name: "Reporting & Insights" },
  { slug: "ai-agents", name: "AI Agents" },
  { slug: "custom-workflows", name: "Custom Workflows" },
  { slug: "business-dashboard", name: "Business Dashboard / Client Portal" },
] as const;

export type AutomationCapabilitySlug = (typeof AUTOMATION_CAPABILITIES)[number]["slug"];

export type BookingStep = "service" | "interests" | "datetime" | "details" | "review" | "success";

export interface BookingFormValues {
  serviceId: string;
  automationInterests: AutomationCapabilitySlug[];
  automationDescription?: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm", 24h
  timezone: string; // IANA, e.g. "America/New_York"
  fullName: string;
  email: string;
  phone: string;
  notes?: string;
}

/**
 * Exact payload shape sent to the n8n webhook. Keep this contract stable,
 * it is the interface between the site and every downstream automation
 * step (Supabase writes, availability check, calendar event, emails).
 *
 * automationInterests/automationDescription/booking.timezone are additive
 * fields for this milestone. The n8n workflow must be updated to read and
 * persist them; the existing fields and their meaning are unchanged.
 */
export interface BookingWebhookPayload {
  service: {
    id: string;
    name: string;
    durationMinutes: number;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  automationInterests: string[];
  automationDescription: string | null;
  booking: {
    date: string; // "YYYY-MM-DD", in the prospect's selected timezone
    time: string; // "HH:mm", in the prospect's selected timezone
    notes: string | null;
    timezone: string; // IANA
    source: "website";
  };
  submittedAt: string; // ISO 8601
}

export type WebhookResultStatus = "confirmed" | "pending_review" | "unavailable" | "conflict";

/**
 * Expected shape of the n8n webhook's response. n8n does the real
 * availability check; the frontend just relays the outcome to the user.
 *
 * "conflict" is the real status the workflow's HTTP 409 branch returns
 * (bookingReference is explicitly null in that case, not omitted).
 * "unavailable" is kept as a synonym for backward compatibility with
 * earlier workflow versions/tests that used that status string; the
 * frontend treats both identically.
 */
export interface BookingWebhookResponse {
  status: WebhookResultStatus;
  message?: string;
  bookingReference?: string | null;
}
