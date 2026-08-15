import type { AutomationCapabilitySlug } from "@/types/booking";

export interface CapabilityDetail {
  headline: string;
  before: string[];
  flow: string[];
  after: string[];
  outcome: string;
}

/**
 * Expanded content for the interactive capability cards. Keyed by the same
 * AutomationCapabilitySlug used everywhere else (landing cards, booking
 * form, Supabase automation_interests) so there is exactly one taxonomy in
 * the codebase, not a second copy.
 */
export const CAPABILITY_DETAILS: Record<AutomationCapabilitySlug, CapabilityDetail> = {
  "lead-management": {
    headline: "From new lead to sales-ready, without anyone typing it in.",
    before: ["Manual lead entry", "Manual qualification", "Delayed follow-up"],
    flow: ["New Lead", "AI Qualification", "Lead Scoring", "CRM Update", "Follow-Up", "Sales Notification"],
    after: ["Faster response", "Consistent follow-up", "Cleaner CRM"],
    outcome: "Never lose track of another lead.",
  },
  "ai-customer-support": {
    headline: "Answers around the clock, without a bigger support team.",
    before: ["Slow first response", "Repetitive questions eat staff time", "Support only during office hours"],
    flow: ["Customer Message", "AI Understands Intent", "Answer or Route", "Escalate If Needed", "Resolution Logged"],
    after: ["24/7 first response", "Staff handle only what needs a human", "Consistent answers"],
    outcome: "Give customers faster answers without adding more staff.",
  },
  "bookings-scheduling": {
    headline: "Appointment requests that book themselves, correctly.",
    before: ["Back-and-forth scheduling emails", "Double-bookings", "Manual calendar updates"],
    flow: ["Booking Request", "Check Availability", "Confirm or Flag Conflict", "Calendar Updated", "Confirmation Sent"],
    after: ["Customers book themselves", "Zero double-bookings", "Calendar always current"],
    outcome: "Turn appointment requests into confirmed bookings automatically.",
  },
  "crm-automation": {
    headline: "A CRM that updates itself as work happens.",
    before: ["CRM falls out of date within days", "Manual data entry after every call", "Duplicate records"],
    flow: ["Activity Happens", "Data Captured", "Record Matched or Created", "Pipeline Stage Updated", "Team Notified"],
    after: ["CRM stays current automatically", "No duplicate entry", "Pipeline reflects reality"],
    outcome: "Keep your CRM working without constantly updating it manually.",
  },
  "automated-follow-up": {
    headline: "Follow-up that happens on schedule, every time.",
    before: ["Follow-ups depend on someone remembering", "Inconsistent timing", "Leads go cold"],
    flow: ["Trigger Event", "Personalize Message", "Send on Schedule", "Track Response", "Remind If Silent"],
    after: ["Nothing falls through the cracks", "Consistent timing", "Warmer pipeline"],
    outcome: "Follow up consistently without someone having to remember.",
  },
  "business-operations": {
    headline: "Requests and approvals that route themselves.",
    before: ["Requests get lost in inboxes", "Manual approval chasing", "No visibility into status"],
    flow: ["Request Submitted", "Routed to Approver", "Approval or Escalation", "Action Triggered", "Status Logged"],
    after: ["Nothing sits waiting on an inbox", "Clear approval trail", "Less admin overhead"],
    outcome: "Remove repetitive operational work from your team's day.",
  },
  "reporting-insights": {
    headline: "Reports that build themselves from real activity.",
    before: ["Hours spent compiling spreadsheets", "Reports are already stale by the time they're read", "Inconsistent formatting"],
    flow: ["Activity Logged", "Data Collected", "Processed & Summarized", "Report Generated", "Delivered on Schedule"],
    after: ["Reports generated automatically", "Always current", "Consistent format"],
    outcome: "Turn business activity into useful visibility.",
  },
  "ai-agents": {
    headline: "AI that can actually take action, not just answer questions.",
    before: ["AI tools that only chat, never act", "Manual handoff for every task", "No access to real business data"],
    flow: ["Task Received", "AI Understands Goal", "Accesses Your Data", "Uses Tools to Act", "Human Reviews Result"],
    after: ["AI that gets things done", "Fewer manual handoffs", "Grounded in your real data"],
    outcome: "Give your business AI assistants that can actually work with your data.",
  },
  "custom-workflows": {
    headline: "Automation built around how you already work.",
    before: ["Generic tools that don't fit your process", "Workarounds and manual patches", "Systems that don't talk to each other"],
    flow: ["Your Process Mapped", "Systems Connected", "Rules Defined", "Automation Built", "Refined Over Time"],
    after: ["Tools that fit your actual process", "Systems connected, not siloed", "Fewer workarounds"],
    outcome: "Your business doesn't have to fit a template. We build around how you work.",
  },
  "business-dashboard": {
    headline: "One place to see what's actually happening.",
    before: ["Data scattered across five tools", "No single source of truth", "Hard to spot problems early"],
    flow: ["Data Sources Connected", "Activity Aggregated", "Dashboard Updated", "Alerts on Key Changes", "Reviewed by Your Team"],
    after: ["One place to check, not five", "Problems visible early", "Decisions backed by real data"],
    outcome: "See what's happening across your business in one place.",
  },
};
