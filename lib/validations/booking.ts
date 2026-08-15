import { z } from "zod";
import { AUTOMATION_CAPABILITIES } from "@/types/booking";

const capabilitySlugs = AUTOMATION_CAPABILITIES.map((c) => c.slug) as [string, ...string[]];

export const serviceStepSchema = z.object({
  serviceId: z.string().min(1, "Choose a service to continue."),
});

export const interestsStepSchema = z.object({
  automationInterests: z
    .array(z.enum(capabilitySlugs))
    .min(1, "Choose at least one thing you'd like to automate."),
  automationDescription: z
    .string()
    .trim()
    .max(500, "Keep this under 500 characters.")
    .optional(),
});

export const dateTimeStepSchema = z.object({
  date: z
    .string()
    .min(1, "Choose a date.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date."),
  time: z
    .string()
    .min(1, "Choose a time.")
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Choose a valid time."),
  timezone: z.string().min(1, "Choose your timezone."),
});

export const detailsStepSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "That name is too long."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(20, "That phone number is too long.")
    .regex(/^[0-9+()\-.\s]+$/, "Use numbers and phone symbols only."),
  notes: z.string().trim().max(500, "Keep notes under 500 characters.").optional(),
});

/**
 * Full booking form schema, the single source of truth for what a valid
 * booking looks like before it ever reaches the n8n webhook.
 */
export const bookingFormSchema = serviceStepSchema
  .merge(interestsStepSchema)
  .merge(dateTimeStepSchema)
  .merge(detailsStepSchema);

export type BookingFormSchema = z.infer<typeof bookingFormSchema>;
