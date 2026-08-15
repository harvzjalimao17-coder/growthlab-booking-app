"use client";

import { formatCurrency, formatDisplayDate, formatDisplayTime } from "@/lib/utils";
import { formatTimezoneLabel } from "@/lib/timezones";
import { AUTOMATION_CAPABILITIES } from "@/types/booking";
import type { BookingFormValues, Service } from "@/types/booking";

interface ReviewStepProps {
  values: BookingFormValues;
  service: Service;
}

export function ReviewStep({ values, service }: ReviewStepProps) {
  const [y, m, d] = values.date.split("-").map(Number) as [number, number, number];
  const date = new Date(y, m - 1, d);

  const interestNames = values.automationInterests
    .map((slug) => AUTOMATION_CAPABILITIES.find((c) => c.slug === slug)?.name)
    .filter(Boolean);

  const rows: { label: string; value: string }[] = [
    { label: "Service", value: service.name },
    { label: "Date", value: formatDisplayDate(date) },
    { label: "Time", value: formatDisplayTime(values.time) },
    { label: "Timezone", value: formatTimezoneLabel(values.timezone) },
    { label: "Duration", value: `${service.durationMinutes} min` },
    {
      label: "Price",
      value: service.priceCents > 0 ? formatCurrency(service.priceCents, service.currency) : "Free",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="bg-gl-charcoal px-6 py-5 text-paper">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
          Booking summary
        </p>
        <h3 className="mt-1 font-display text-2xl leading-tight">{service.name}</h3>
      </div>

      <div className="space-y-3 px-6 py-5">
        {rows.slice(1).map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="relative mx-6 stub-divider" />

      {interestNames.length > 0 && (
        <div className="space-y-2 px-6 py-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            What you want to automate
          </p>
          <div className="flex flex-wrap gap-1.5">
            {interestNames.map((name) => (
              <span
                key={name}
                className="rounded-full border border-amber/40 bg-amber/10 px-2.5 py-1 text-xs font-medium text-paper"
              >
                {name}
              </span>
            ))}
          </div>
          {values.automationDescription && (
            <p className="pt-1 text-sm text-muted-foreground">{values.automationDescription}</p>
          )}
        </div>
      )}

      <div className="relative mx-6 stub-divider" />

      <div className="space-y-3 px-6 py-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Your details
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Name</span>
          <span className="font-medium">{values.fullName}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Email</span>
          <span className="font-medium">{values.email}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Phone</span>
          <span className="font-medium">{values.phone}</span>
        </div>
        {values.notes && (
          <div className="pt-1 text-sm">
            <span className="text-muted-foreground">Notes: </span>
            <span>{values.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
