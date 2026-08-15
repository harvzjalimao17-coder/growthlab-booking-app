"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/app/growthlab.module.css";
import { AUTOMATION_CAPABILITIES, type AutomationCapabilitySlug } from "@/types/booking";

interface Option {
  label: string;
  slugs: AutomationCapabilitySlug[];
}

interface Question {
  prompt: string;
  options: Option[];
}

/**
 * Deterministic, client-side only. Each option adds one point to the
 * capability slug(s) it's associated with; the top-scoring slugs become
 * the result. No AI call, no external request, no randomness.
 */
const QUESTIONS: Question[] = [
  {
    prompt: "What takes the most repetitive manual work in your business?",
    options: [
      { label: "Following up with leads", slugs: ["automated-follow-up", "lead-management"] },
      { label: "Entering data into spreadsheets or a CRM", slugs: ["crm-automation"] },
      { label: "Answering the same customer questions", slugs: ["ai-customer-support"] },
      { label: "Scheduling and confirming appointments", slugs: ["bookings-scheduling"] },
      { label: "Pulling together reports", slugs: ["reporting-insights"] },
    ],
  },
  {
    prompt: "Where do new leads or customers come from?",
    options: [
      { label: "Website inquiries or forms", slugs: ["lead-management"] },
      { label: "Social media or direct messages", slugs: ["ai-customer-support"] },
      { label: "Referrals and word of mouth", slugs: ["crm-automation"] },
      { label: "Outreach we do ourselves", slugs: ["automated-follow-up"] },
      { label: "Honestly, we don't track this well", slugs: ["business-dashboard"] },
    ],
  },
  {
    prompt: "What would you most like to automate first?",
    options: [
      { label: "Handling and qualifying leads", slugs: ["lead-management"] },
      { label: "Customer support conversations", slugs: ["ai-customer-support"] },
      { label: "Bookings and scheduling", slugs: ["bookings-scheduling"] },
      { label: "Internal requests and approvals", slugs: ["business-operations"] },
      { label: "Reporting on what's happening", slugs: ["reporting-insights"] },
    ],
  },
  {
    prompt: "What's the biggest operational bottleneck right now?",
    options: [
      { label: "Things slip through the cracks", slugs: ["automated-follow-up"] },
      { label: "Too much manual admin work", slugs: ["business-operations"] },
      { label: "No visibility into what's happening", slugs: ["business-dashboard"] },
      { label: "Repetitive tasks nobody has time for", slugs: ["ai-agents"] },
      { label: "Our systems don't talk to each other", slugs: ["custom-workflows"] },
    ],
  },
  {
    prompt: "Which best describes your current tools?",
    options: [
      { label: "Mostly spreadsheets", slugs: ["crm-automation"] },
      { label: "A few SaaS tools that don't connect", slugs: ["custom-workflows"] },
      { label: "A CRM we already rely on", slugs: ["business-dashboard"] },
      { label: "We haven't really set anything up yet", slugs: ["lead-management"] },
    ],
  },
  {
    prompt: "How many people are on your team?",
    options: [
      { label: "Just me", slugs: ["ai-agents"] },
      { label: "2 to 5", slugs: ["business-operations"] },
      { label: "6 to 20", slugs: ["crm-automation"] },
      { label: "20+", slugs: ["business-dashboard"] },
    ],
  },
];

export function AutomationAssessment() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  function selectOption(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
  }

  function goNext() {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setShowResult(false);
  }

  const topSlugs = useMemo(() => {
    if (!showResult) return [];
    const scores: Partial<Record<AutomationCapabilitySlug, number>> = {};
    answers.forEach((optionIndex, qIndex) => {
      if (optionIndex === null) return;
      const option = QUESTIONS[qIndex]?.options[optionIndex];
      if (!option) return;
      option.slugs.forEach((slug) => {
        scores[slug] = (scores[slug] ?? 0) + 1;
      });
    });
    return (Object.entries(scores) as [AutomationCapabilitySlug, number][])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([slug]) => slug);
  }, [showResult, answers]);

  if (showResult) {
    return (
      <section className={styles.sec} id="assessment">
        <div className={styles.container}>
          <div className={styles.assessWrap}>
            <div className={styles.assessResultHead}>
              <span>Your automation opportunity</span>
              <h3>
                You may have {topSlugs.length} high-value automation
                {topSlugs.length === 1 ? " opportunity" : " opportunities"}
              </h3>
            </div>

            <div className={styles.assessResultList}>
              {topSlugs.map((slug, i) => {
                const cap = AUTOMATION_CAPABILITIES.find((c) => c.slug === slug);
                return (
                  <div className={styles.assessResultItem} key={slug}>
                    <span className={styles.assessResultNum}>{String(i + 1).padStart(2, "0")}</span>
                    <span>{cap?.name}</span>
                  </div>
                );
              })}
            </div>

            <p className={styles.assessResultWhy}>
              Why: your answers point to repeated manual work around{" "}
              {topSlugs.map((s) => AUTOMATION_CAPABILITIES.find((c) => c.slug === s)?.name.toLowerCase()).join(", ")}.
              This is an initial automation assessment based on your answers, not an AI-generated
              diagnosis.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href={topSlugs[0] ? `/book?automation=${topSlugs[0]}` : "/book"}
                className={styles.btnPrimary}
              >
                Book a GrowthLab Consultation
              </Link>
              <button type="button" onClick={restart} className={styles.btnGhost}>
                Retake assessment
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const question = QUESTIONS[step];
  const selectedOption = answers[step];

  if (!question) return null;

  return (
    <section className={styles.sec} id="assessment">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>Automation assessment</span>
          <h2>Find your automation opportunities in under a minute</h2>
          <p>Six quick questions. No account needed.</p>
        </div>

        <div className={styles.assessWrap}>
          <div className={styles.assessProgress}>
            Question {step + 1} of {QUESTIONS.length}
          </div>
          <div className={styles.assessQuestion}>
            <h3>{question.prompt}</h3>
            <div className={styles.assessOptions} role="radiogroup" aria-label={question.prompt}>
              {question.options.map((option, i) => (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={selectedOption === i}
                  className={`${styles.assessOption} ${selectedOption === i ? styles.assessSelected : ""}`}
                  onClick={() => selectOption(i)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.assessNav}>
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className={styles.btnGhost}
              style={step === 0 ? { visibility: "hidden" } : undefined}
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={selectedOption === null}
              className={styles.btnPrimary}
            >
              {step === QUESTIONS.length - 1 ? "See my results" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
