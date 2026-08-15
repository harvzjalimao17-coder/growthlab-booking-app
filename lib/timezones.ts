/**
 * Timezone detection and display helpers. Uses only the built-in Intl API,
 * no new dependency, per the "avoid unnecessary dependencies" requirement.
 */

/** Detects the visitor's IANA timezone from the browser. Falls back to UTC
 * if detection fails (very old browsers, or a non-browser environment). */
export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/** Formats an IANA zone as "America/New_York (UTC-04:00)" for display,
 * since abbreviations like "ET"/"PT" shift with daylight saving and would
 * require a name-mapping table to render correctly, this is the accurate,
 * dependency-free alternative. */
export function formatTimezoneLabel(timeZone: string, at: Date = new Date()): string {
  try {
    const offsetPart = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName")?.value;
    const readable = timeZone.replace(/_/g, " ").replace("/", " / ");
    return offsetPart ? `${readable} (${offsetPart})` : readable;
  } catch {
    return timeZone;
  }
}

/** A curated, globally-spread list of common IANA zones for the manual
 * selector. The visitor's auto-detected zone is always available even if
 * it isn't in this list (see TimezoneSelect). */
export const COMMON_TIMEZONES: string[] = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "Atlantic/Reykjavik",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Athens",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Manila",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Sydney",
  "Pacific/Auckland",
];
