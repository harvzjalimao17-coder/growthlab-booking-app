"use client";

import { cn } from "@/lib/utils";
import type { BookingStep } from "@/types/booking";

const STEPS: { key: BookingStep; label: string }[] = [
  { key: "service", label: "Service" },
  { key: "interests", label: "Interests" },
  { key: "datetime", label: "Time" },
  { key: "details", label: "Details" },
  { key: "review", label: "Confirm" },
];

export function BookingStepper({ current }: { current: BookingStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex w-full items-center" aria-label="Booking progress">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-colors",
                  isCurrent && "border-amber bg-amber text-ink",
                  isComplete && "border-sage bg-sage text-white",
                  !isCurrent && !isComplete && "border-border bg-transparent text-muted-foreground"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1 sm:mx-3",
                  isComplete ? "bg-sage" : "bg-border"
                )}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
