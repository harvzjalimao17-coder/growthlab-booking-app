import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formats a Date as "Mon, Jan 12" for display in the UI. */
export function formatDisplayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** Formats "HH:mm" (24h, as stored/sent to n8n) into "9:00 AM". */
export function formatDisplayTime(time: string): string {
  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/** Converts a Date to "YYYY-MM-DD" using local time (avoids UTC day-shift bugs). */
export function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatCurrency(amountCents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amountCents / 100);
}
