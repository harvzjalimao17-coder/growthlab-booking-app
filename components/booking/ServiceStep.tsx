"use client";

import { Check } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import type { Service } from "@/types/booking";

interface ServiceStepProps {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  selectedId: string | undefined;
  onSelect: (service: Service) => void;
}

export function ServiceStep({ services, isLoading, error, selectedId, onSelect }: ServiceStepProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
        <Spinner /> Loading services…
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        Couldn&apos;t load services right now. Refresh the page to try again.
      </Alert>
    );
  }

  if (services.length === 0) {
    return (
      <Alert>No services are available to book at the moment. Please check back soon.</Alert>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {services.map((service) => {
        const isSelected = service.id === selectedId;
        return (
          <button
            type="button"
            key={service.id}
            onClick={() => onSelect(service)}
            aria-pressed={isSelected}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
              isSelected
                ? "border-amber bg-amber/10 text-paper"
                : "border-border bg-card hover:border-amber/40"
            )}
          >
            <div className="flex w-full items-start justify-between gap-3">
              <span className="font-display text-base font-medium leading-snug">{service.name}</span>
              {isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" />}
            </div>
            {service.description && (
              <p
                className={cn(
                  "text-sm leading-snug",
                  isSelected ? "text-paper/80" : "text-muted-foreground"
                )}
              >
                {service.description}
              </p>
            )}
            <div
              className={cn(
                "mt-auto flex items-center gap-3 pt-1 font-mono text-xs",
                isSelected ? "text-amber" : "text-muted-foreground"
              )}
            >
              <span>{service.durationMinutes} min</span>
              <span aria-hidden="true">·</span>
              <span>
                {service.priceCents > 0 ? formatCurrency(service.priceCents, service.currency) : "Free"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
