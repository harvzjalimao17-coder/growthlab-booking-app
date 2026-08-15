"use client";

import { useState } from "react";
import styles from "@/app/growthlab.module.css";

const STAGES = [
  {
    label: "Incoming Lead",
    explain: "A new inquiry arrives, from a web form, email, or booking request. Nothing happens yet without the next step.",
  },
  {
    label: "AI Analysis",
    explain: "AI classifies the request, extracts important information, and determines the next workflow step.",
  },
  {
    label: "Qualification",
    explain: "The request is scored against your criteria so your team knows what actually deserves attention first.",
  },
  {
    label: "CRM Update",
    explain: "The record is created or updated automatically, no one has to type it in by hand.",
  },
  {
    label: "Follow-Up",
    explain: "A personalized follow-up is prepared and queued, timed the way your business actually works.",
  },
  {
    label: "Human Approval",
    explain: "Before anything external happens, a real person reviews and approves it. This step is never skipped.",
  },
  {
    label: "Action Executed",
    explain: "Once approved, the action actually happens, an email sends, a calendar updates, a record is saved.",
  },
];

export function AutomationLab() {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.sec} id="automation-lab">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>Live automation lab</span>
          <h2>See how a workflow actually moves through AI and human control</h2>
          <p>Select a stage to see what happens there. This is a demonstration, not a live external workflow.</p>
        </div>

        <div className={styles.labWrap}>
          <div className={styles.labStages}>
            {STAGES.map((stage, i) => (
              <div key={stage.label}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  className={`${styles.labStage} ${active === i ? styles.labActive : ""}`}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.labStageDot} />
                  {stage.label}
                </button>
                {i < STAGES.length - 1 && <div className={styles.labConnector} />}
              </div>
            ))}
          </div>

          <div className={styles.labExplain}>
            <span>{STAGES[active]?.label}</span>
            <h4>What happens at this stage</h4>
            <p>{STAGES[active]?.explain}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
