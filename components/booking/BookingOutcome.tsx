"use client";

import { Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AutomationReveal } from "@/components/booking/AutomationReveal";
import type { Service, WebhookResultStatus } from "@/types/booking";

interface SuccessProps {
  status: Extract<WebhookResultStatus, "confirmed" | "pending_review">;
  message?: string;
  bookingReference?: string | null;
  service: Service;
  date: string;
  time: string;
  onBookAnother: () => void;
}

export function BookingSuccess({
  status,
  message,
  bookingReference,
  service,
  date,
  time,
  onBookAnother,
}: SuccessProps) {
  const isConfirmed = status === "confirmed";

  // The full automation reveal only applies to a confirmed booking — the
  // real workflow ran end to end. "pending_review" means a human still
  // needs to confirm, so we don't claim the automation already finished.
  if (isConfirmed) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <AutomationReveal
          service={service}
          date={date}
          time={time}
          bookingReference={bookingReference}
        />
        <Button variant="outline" onClick={onBookAnother}>
          Book another appointment
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning">
        <Clock className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl">Request received</h3>
      <p className="text-sm text-muted-foreground">
        {message ?? "We're checking availability and will confirm by email shortly."}
      </p>
      {bookingReference && (
        <p className="font-mono text-xs text-muted-foreground">
          Reference: <span className="text-foreground">{bookingReference}</span>
        </p>
      )}
      <Button variant="outline" onClick={onBookAnother} className="mt-2">
        Book another appointment
      </Button>
    </div>
  );
}

interface UnavailableProps {
  message?: string;
  onChooseAnotherTime: () => void;
}

/**
 * Shown when the webhook returns status "unavailable" (including the real
 * HTTP 409 case for a slot taken between selection and submission). This is
 * an expected outcome, not a system failure — styled with the warning
 * token, not destructive/error red.
 */
export function BookingUnavailable({ message, onChooseAnotherTime }: UnavailableProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/15 text-warning">
        <Clock className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl">That time is no longer available</h3>
      <p className="text-sm text-muted-foreground">
        {message ?? "Someone has already booked this time. Please choose another available time."}
      </p>
      <Button variant="accent" onClick={onChooseAnotherTime} className="mt-2">
        Choose another time
      </Button>
    </div>
  );
}

interface FailureProps {
  message: string;
  onRetry: () => void;
}

export function BookingFailure({ message, onRetry }: FailureProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="h-7 w-7" />
      </div>
      <h3 className="font-display text-2xl">That didn&apos;t go through</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button variant="accent" onClick={onRetry} className="mt-2">
        Try again
      </Button>
    </div>
  );
}
