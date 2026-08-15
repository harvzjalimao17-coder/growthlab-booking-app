import type { OpeningHours } from "@/types/database";

const WEEKDAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number) as [number, number];
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/**
 * Generates candidate start times for a given date, based on the business's
 * opening hours and the selected service's duration. This is a display
 * convenience only — n8n performs the authoritative availability check
 * (existing bookings, buffers, calendar conflicts) after submission.
 */
export function generateTimeSlots(
  date: Date,
  openingHours: OpeningHours | null | undefined,
  durationMinutes: number,
  stepMinutes = 30
): string[] {
  if (!openingHours) return [];

  const dayKey = WEEKDAY_KEYS[date.getDay()];
  if (!dayKey) return [];
  const windows = openingHours[dayKey];
  if (!windows || windows.length === 0) return [];

  const slots: string[] = [];
  for (const window of windows) {
    const start = timeToMinutes(window.start);
    const end = timeToMinutes(window.end);
    for (let t = start; t + durationMinutes <= end; t += stepMinutes) {
      slots.push(minutesToTime(t));
    }
  }
  return slots;
}
