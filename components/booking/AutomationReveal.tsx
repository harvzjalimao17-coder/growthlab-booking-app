"use client";

import { formatDisplayDate, formatDisplayTime } from "@/lib/utils";
import styles from "@/app/growthlab.module.css";
import type { Service } from "@/types/booking";

/**
 * Condensed, business-facing stages derived directly from the real,
 * unmodified export at n8n/booking-workflow.json. Each stage groups one or
 * more actual node names from that workflow — nothing here is invented,
 * and the order matches the workflow's real `connections` graph exactly:
 *
 *   Webhook
 *     -> Retrieve Service Details -> Retrieve Business Settings
 *     -> Get Existing Bookings -> Check Availability -> IF: Is Available
 *     -> Save Customer -> Create Booking -> Create Google Calendar Event
 *     -> Update Booking -> Send Confirmation Email (+ Notify Business Owner)
 *     -> Respond: Confirmed
 *
 * IMPORTANT (honesty rule): the frontend only ever receives the *final*
 * webhook response — n8n does not currently stream per-node execution
 * state to the browser. So this component never claims a step is
 * "running now." It reveals the real, already-completed stages of the
 * workflow that just ran, as an explanation — not a live execution feed.
 */
const WORKFLOW_STAGES = [
  { label: "Booking request received", node: "Webhook \u2022 Receive Booking" },
  {
    label: "Availability checked",
    node: "Retrieve Service Details \u2192 Retrieve Business Settings \u2192 Get Existing Bookings \u2192 Check Availability",
  },
  { label: "Time slot confirmed available", node: "IF: Is Available" },
  { label: "Customer record saved", node: "Save Customer" },
  { label: "Booking saved", node: "Create Booking" },
  { label: "Calendar event created", node: "Create Google Calendar Event" },
  { label: "Booking marked confirmed", node: "Update Booking" },
  { label: "Confirmation email sent", node: "Send Confirmation Email" },
  { label: "Response returned to you", node: "Respond: Confirmed" },
];

interface AutomationRevealProps {
  service: Service;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  bookingReference?: string | null;
}

export function AutomationReveal({ service, date, time, bookingReference }: AutomationRevealProps) {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const displayDate = formatDisplayDate(new Date(y, m - 1, d));
  const displayTime = formatDisplayTime(time);

  return (
    <div className={styles.revealWrap}>
      <div className={styles.revealHead}>
        <span className={styles.revealEyebrow}>Here&apos;s what your booking just triggered</span>
        <h3>You just triggered an automation.</h3>
        <p>Your booking was processed through a multi-step business workflow.</p>
      </div>

      <div className={styles.revealSummary}>
        <div>
          <span>Service</span>
          {service.name}
        </div>
        <div>
          <span>Date</span>
          {displayDate}
        </div>
        <div>
          <span>Time</span>
          {displayTime}
        </div>
        <div>
          <span>Reference</span>
          {bookingReference ?? "\u2014"}
        </div>
      </div>

      <div className={styles.revealStages}>
        {WORKFLOW_STAGES.map((stage, i) => {
          const isFinal = i === WORKFLOW_STAGES.length - 1;
          return (
            <div
              key={stage.label}
              className={`${styles.revealStage} ${isFinal ? styles.revealFinal : ""}`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <span className={styles.revealDot} />
              <span className={styles.revealLabel}>{stage.label}</span>
              <span className={styles.revealNode}>{stage.node}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.revealFooter}>
        <p>Simple for your customer. Powerful behind the scenes.</p>
        <p>This is what GrowthLab builds for your business.</p>
      </div>
    </div>
  );
}
