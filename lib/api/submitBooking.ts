import { z } from "zod";
import type {
  BookingFormValues,
  BookingWebhookPayload,
  BookingWebhookResponse,
} from "@/types/booking";
import type { Service } from "@/types/booking";

const webhookResponseSchema = z.object({
  // "conflict" is the real status the 409 branch returns; "unavailable" is
  // kept as a synonym so earlier workflow versions still validate.
  status: z.enum(["confirmed", "pending_review", "unavailable", "conflict"]),
  message: z.string().optional(),
  // The conflict branch sends bookingReference explicitly as null (not
  // omitted), which z.string().optional() rejects -- that mismatch was the
  // actual cause of the reported ZodError. .nullable() accepts null;
  // .optional() still allows the key to be absent entirely.
  bookingReference: z.string().nullable().optional(),
});

export class BookingSubmissionError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "BookingSubmissionError";
  }
}

function buildPayload(
  values: BookingFormValues,
  service: Service
): BookingWebhookPayload {
  return {
    service: {
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
    },
    customer: {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
    },
    automationInterests: values.automationInterests,
    automationDescription: values.automationDescription?.trim() || null,
    booking: {
      date: values.date,
      time: values.time,
      notes: values.notes?.trim() || null,
      timezone: values.timezone,
      source: "website",
    },
    submittedAt: new Date().toISOString(),
  };
}

export async function submitBooking(
  values: BookingFormValues,
  service: Service
): Promise<BookingWebhookResponse> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK;

  if (!webhookUrl) {
    throw new BookingSubmissionError(
      "Booking is not configured yet. Set NEXT_PUBLIC_N8N_WEBHOOK and try again."
    );
  }

  const payload = buildPayload(values, service);

  let response: Response;

  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new BookingSubmissionError(
      "Couldn't reach the booking service. Check your connection and try again.",
      error
    );
  }

  if (!response.ok && response.status !== 409) {
    // 409 is the real workflow's expected "slot no longer available" response —
    // it still carries a valid { status: "unavailable", ... } body below, so we
    // don't treat it as a generic failure. Every other non-2xx status is.
    throw new BookingSubmissionError(
      `Booking request failed (${response.status}). Please try again in a moment.`
    );
  }

  const responseText = await response.text();

  let json: unknown;

  try {
    json = JSON.parse(responseText);
  } catch (error) {
    console.error("Booking webhook returned non-JSON response:", error);

    throw new BookingSubmissionError(
      "Received an unexpected response from the booking service.",
      error
    );
  }

  const parsed = webhookResponseSchema.safeParse(json);

  if (!parsed.success) {
    console.error("Booking webhook response failed schema validation:", parsed.error);

    throw new BookingSubmissionError(
      "Received an unexpected response from the booking service.",
      parsed.error
    );
  }

  return parsed.data;
}