"use client";

import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AUTOMATION_CAPABILITIES, type AutomationCapabilitySlug } from "@/types/booking";

interface InterestsStepProps {
  selected: AutomationCapabilitySlug[];
  description?: string;
  onToggle: (slug: AutomationCapabilitySlug) => void;
  onDescriptionChange: (value: string) => void;
  error?: string;
}

export function InterestsStep({
  selected,
  description,
  onToggle,
  onDescriptionChange,
  error,
}: InterestsStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label>What would you like to automate?</Label>
        <p className="mt-1 text-xs text-muted-foreground">Choose everything that applies.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
        {AUTOMATION_CAPABILITIES.map((cap) => {
          const isSelected = selected.includes(cap.slug);
          return (
            <button
              key={cap.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onToggle(cap.slug)}
              className={cn(
                "flex items-start justify-between gap-2 rounded-xl border p-3.5 text-left text-sm transition-colors",
                isSelected
                  ? "border-amber bg-amber/10 text-paper"
                  : "border-border bg-card hover:border-amber/40"
              )}
            >
              <span className="font-medium leading-snug">{cap.name}</span>
              {isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber" />}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <div className="flex flex-col gap-2">
        <Label htmlFor="automation-description">
          Tell us a little about what you want to automate.
        </Label>
        <textarea
          id="automation-description"
          value={description ?? ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="e.g. New leads should be captured and followed up with automatically."
          className="flex w-full rounded-md border border-input bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
      </div>
    </div>
  );
}
