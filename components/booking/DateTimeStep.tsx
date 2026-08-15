"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn, formatDisplayTime, toISODateString } from "@/lib/utils";
import { generateTimeSlots } from "@/lib/availability";
import { COMMON_TIMEZONES, formatTimezoneLabel } from "@/lib/timezones";
import type { BusinessSettingsRow } from "@/types/database";

interface DateTimeStepProps {
  durationMinutes: number;
  settings: BusinessSettingsRow | null;
  isLoadingSettings: boolean;
  date: string;
  time: string;
  timezone: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onTimezoneChange: (timezone: string) => void;
  errors?: { date?: string; time?: string; timezone?: string };
}

export function DateTimeStep({
  durationMinutes,
  settings,
  isLoadingSettings,
  date,
  time,
  timezone,
  onDateChange,
  onTimeChange,
  onTimezoneChange,
  errors,
}: DateTimeStepProps) {
  const [isChangingTimezone, setIsChangingTimezone] = useState(false);
  const today = useMemo(() => new Date(), []);
  const minDate = toISODateString(today);
  const maxDate = useMemo(() => {
    const horizon = settings?.booking_horizon_days ?? 60;
    const d = new Date(today);
    d.setDate(d.getDate() + horizon);
    return toISODateString(d);
  }, [settings, today]);

  const slots = useMemo(() => {
    if (!date || !settings) return [];
    const [y, m, d] = date.split("-").map(Number) as [number, number, number];
    const selectedDate = new Date(y, m - 1, d);
    return generateTimeSlots(selectedDate, settings.opening_hours, durationMinutes);
  }, [date, settings, durationMinutes]);

  // Ensure the visitor's own detected zone is always selectable, even if
  // it isn't in the curated list.
  const timezoneOptions = useMemo(() => {
    return COMMON_TIMEZONES.includes(timezone) ? COMMON_TIMEZONES : [timezone, ...COMMON_TIMEZONES];
  }, [timezone]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label>Your timezone</Label>
        {isChangingTimezone ? (
          <Select
            value={timezone}
            onValueChange={(tz) => {
              onTimezoneChange(tz);
              setIsChangingTimezone(false);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timezoneOptions.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {formatTimezoneLabel(tz)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-input bg-card px-3.5 py-2.5">
            <div>
              <p className="text-sm text-foreground">{formatTimezoneLabel(timezone)}</p>
              <p className="text-xs text-muted-foreground">Automatically detected</p>
            </div>
            <button
              type="button"
              onClick={() => setIsChangingTimezone(true)}
              className="text-xs font-medium text-amber hover:underline"
            >
              Change timezone
            </button>
          </div>
        )}
        {errors?.timezone && <p className="text-xs text-destructive">{errors.timezone}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="booking-date">Date</Label>
        <Input
          id="booking-date"
          type="date"
          min={minDate}
          max={maxDate}
          value={date}
          onChange={(e) => {
            onDateChange(e.target.value);
            onTimeChange("");
          }}
          aria-invalid={Boolean(errors?.date)}
        />
        {errors?.date && <p className="text-xs text-destructive">{errors.date}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <Label>Time</Label>
        {isLoadingSettings ? (
          <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
            <Spinner /> Loading availability…
          </div>
        ) : !date ? (
          <p className="py-2 text-sm text-muted-foreground">Choose a date to see available times.</p>
        ) : slots.length === 0 ? (
          <Alert>We&apos;re closed on this date. Please choose another day.</Alert>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => {
              const isSelected = slot === time;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onTimeChange(slot)}
                  aria-pressed={isSelected}
                  className={cn(
                    "rounded-md border px-2 py-2 font-mono text-xs transition-colors",
                    isSelected
                      ? "border-amber bg-amber/10 text-paper"
                      : "border-border bg-card hover:border-amber/40"
                  )}
                >
                  {formatDisplayTime(slot)}
                </button>
              );
            })}
          </div>
        )}
        {errors?.time && <p className="text-xs text-destructive">{errors.time}</p>}
        <p className="text-xs text-muted-foreground">
          Times shown are in {formatTimezoneLabel(timezone)}. We&apos;ll confirm availability right
          after you submit.
        </p>
      </div>
    </div>
  );
}
