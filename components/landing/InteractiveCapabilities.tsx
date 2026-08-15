"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Users,
  MessageCircle,
  CalendarCheck,
  Database,
  Mail,
  Workflow,
  BarChart3,
  Bot,
  Puzzle,
  LayoutDashboard,
  Check,
} from "lucide-react";
import styles from "@/app/growthlab.module.css";
import { AUTOMATION_CAPABILITIES, type AutomationCapabilitySlug } from "@/types/booking";
import { CAPABILITY_DETAILS } from "@/lib/capabilityDetails";

const ICONS: Record<AutomationCapabilitySlug, typeof Users> = {
  "lead-management": Users,
  "ai-customer-support": MessageCircle,
  "bookings-scheduling": CalendarCheck,
  "crm-automation": Database,
  "automated-follow-up": Mail,
  "business-operations": Workflow,
  "reporting-insights": BarChart3,
  "ai-agents": Bot,
  "custom-workflows": Puzzle,
  "business-dashboard": LayoutDashboard,
};

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(" ");

// Must match the exact breakpoint in growthlab.module.css's .featureGrid
// media query, so row-chunking always matches what actually renders. If
// that CSS breakpoint ever changes, change this value to match it.
const MOBILE_BREAKPOINT = "(max-width: 860px)";

function useGridColumns(): 1 | 2 {
  // Defaults to 2 (desktop) for the very first render; corrected
  // synchronously on mount before paint via useEffect, and kept in sync
  // on resize/orientation change.
  const [columns, setColumns] = useState<1 | 2>(2);

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_BREAKPOINT);
    const update = () => setColumns(mql.matches ? 1 : 2);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return columns;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

interface CapabilityCardProps {
  slug: AutomationCapabilitySlug;
  isActive: boolean;
  onToggle: () => void;
}

function CapabilityCard({ slug, isActive, onToggle }: CapabilityCardProps) {
  const cap = AUTOMATION_CAPABILITIES.find((c) => c.slug === slug)!;
  const Icon = ICONS[slug];
  const detail = CAPABILITY_DETAILS[slug];
  return (
    <button
      type="button"
      aria-expanded={isActive}
      aria-controls={`cap-detail-${slug}`}
      className={cx(styles.capCardBtn, isActive && styles.capCardActive)}
      onClick={onToggle}
    >
      <div className={styles.featureIcon}>
        <Icon size={18} />
      </div>
      <h3>{cap.name}</h3>
      <p className={styles.featureDesc}>{detail.flow.join(" → ")}</p>
      <p className={styles.featureOutcome}>
        <strong>Business outcome:</strong> {detail.outcome}
      </p>
    </button>
  );
}

function CapabilityDetailPanel({ slug }: { slug: AutomationCapabilitySlug }) {
  const detail = CAPABILITY_DETAILS[slug];
  const name = AUTOMATION_CAPABILITIES.find((c) => c.slug === slug)?.name;

  return (
    <motion.div
      key={slug}
      id={`cap-detail-${slug}`}
      className={styles.capDetail}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div className={styles.capDetailHead}>
        <h3>{name}</h3>
        <p>{detail.headline}</p>
      </div>

      <div className={styles.capDetailCols}>
        <div className={cx(styles.capDetailCol, "before")}>
          <span className={styles.capDetailLabel}>Before</span>
          <ul>
            {detail.before.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.capFlowCol}>
          {detail.flow.map((step, i) => (
            <div key={step} style={{ width: "100%" }}>
              <div className={styles.capFlowStep}>{step}</div>
              {i < detail.flow.length - 1 && (
                <div
                  style={{ textAlign: "center", "--arrow-i": i } as CSSProperties}
                  className={styles.capFlowArrow}
                  aria-hidden="true"
                >
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={cx(styles.capDetailCol, "after")}>
          <span className={styles.capDetailLabel}>After</span>
          <ul>
            {detail.after.map((item) => (
              <li key={item} style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>
                <Check size={13} style={{ marginTop: 2, flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.capDetailFooter}>
        <p>
          Business outcome: <strong>{detail.outcome}</strong>
        </p>
        <Link href={`/book?automation=${slug}`} className={styles.btnPrimary}>
          See How We&apos;d Automate This
        </Link>
      </div>
    </motion.div>
  );
}

export function InteractiveCapabilities() {
  const [selected, setSelected] = useState<AutomationCapabilitySlug | null>(null);
  const columns = useGridColumns();
  const rows = chunk(AUTOMATION_CAPABILITIES, columns);

  return (
    <section className={styles.sec} id="capabilities">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>What we can automate</span>
          <h2>Ten places automation quietly takes work off your plate</h2>
          <p>
            Not features. Outcomes. Select one to see exactly what changes, before and
            after.
          </p>
        </div>

        {rows.map((row, rowIndex) => {
          const rowHasSelected = selected !== null && row.some((c) => c.slug === selected);
          return (
            <div key={row.map((c) => c.slug).join("-") || rowIndex} className={styles.capRowWrap}>
              <div className={styles.featureGrid}>
                {row.map((cap) => (
                  <CapabilityCard
                    key={cap.slug}
                    slug={cap.slug}
                    isActive={selected === cap.slug}
                    onToggle={() => setSelected(selected === cap.slug ? null : cap.slug)}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {rowHasSelected && selected && <CapabilityDetailPanel slug={selected} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
