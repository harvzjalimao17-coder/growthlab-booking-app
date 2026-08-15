"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./growthlab.module.css";
import { InteractiveCapabilities } from "@/components/landing/InteractiveCapabilities";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { AutomationAssessment } from "@/components/landing/AutomationAssessment";
import { AutomationLab } from "@/components/landing/AutomationLab";
import { DashboardPreview } from "@/components/landing/DashboardPreview";

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function HomePage() {
  return (
    <div className={styles.page}>
      <Hero />
      <CompetitiveEdge />
      <InteractiveCapabilities />
      <BeforeAfter />
      <HowItWorks />
      <AutomationLab />
      <Demo />
      <RoiCalculator />
      <AutomationAssessment />
      <Ecosystem />
      <DashboardPreview />
      <TrustControl />
      <StackStrip />
      <About />
      <FinalCta />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Hero                                                                    */
/* ---------------------------------------------------------------------- */

const PIPELINE_STEPS = [
  { label: "New email received", status: "gmail" },
  { label: "Analyzed by Gemini", status: "intent + lead status" },
  { label: "Awaiting your approval", status: "requires_approval: true" },
  { label: "Approved by you", status: "1 click" },
  { label: "Sent + booked + logged", status: "gmail · calendar · crm" },
];

function Hero() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => (s + 1) % (PIPELINE_STEPS.length + 1));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.hero}>
      <div className={cx(styles.container, styles.heroGrid)}>
        <div>
          <span className={styles.eyebrow}>AI Operations · Human Approval Required</span>
          <h1>
            Work Less.
            <br />
            <span>Grow More.</span>
          </h1>
          <p className={styles.heroSub}>
            We build AI powered automation systems that handle the repetitive work slowing
            your business down. They only take real action once you say go.
          </p>
          <div className={styles.heroActions}>
            <a href="#capabilities" className={styles.btnPrimary}>
              See What We Can Automate
            </a>
            <Link href="/book" className={styles.btnGhost}>
              Book a Free Consultation
            </Link>
          </div>
          <span className={styles.heroNote}>
            Real systems. Real workflows. Built for your business.
          </span>
        </div>

        <div className={styles.pipelineCard}>
          <div className={styles.pipelineHead}>
            <span>AUTOMATION PREVIEW · inbox.growthlab</span>
          </div>
          <div className={styles.pipeline}>
            {PIPELINE_STEPS.map((node, i) => {
              const isLast = i === PIPELINE_STEPS.length - 1;
              let state: string | undefined;
              if (i < step) state = isLast ? styles.green : styles.neutral;
              else if (i === step) state = isLast ? styles.green : styles.gold;
              return (
                <div key={node.label}>
                  <div className={cx(styles.pNode, state)}>
                    <span className="dot" />
                    <span className="label">{node.label}</span>
                    <span className="status">{node.status}</span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && <div className={styles.pConnector} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Tech stack strip                                                        */
/* ---------------------------------------------------------------------- */

function StackStrip() {
  return (
    <div className={styles.stackStrip}>
      <div className={cx(styles.container, styles.stackInner)}>
        <span className={styles.stackLabel}>
          Built to connect with the tools your business already uses
        </span>
        <div className={styles.stackItems}>
          <span>Gmail</span>
          <span>Google Calendar</span>
          <span>Gemini</span>
          <span>Supabase</span>
          <span>n8n</span>
          <span>Next.js</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Competitive edge                                                        */
/* ---------------------------------------------------------------------- */

function CompetitiveEdge() {
  const rowsRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!rowsRef.current) return;
    const el = rowsRef.current;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className={styles.edgeSec} id="edge">
      <div className={styles.container}>
        <div className={styles.edgeHead}>
          <span className={styles.eyebrow}>The competitive edge</span>
          <h2>
            Your competitor is still <span className={styles.strike}>typing a reply</span>.
            Yours already <span className={styles.win}>sent it, booked it, and moved on.</span>
          </h2>
          <p>
            Deals don&apos;t go to the best business anymore. They go to the fastest one to
            say yes. AI automation is how a small team starts responding like it has fifty
            people watching the inbox, without hiring one of them.
          </p>
        </div>

        <div className={styles.compareBar} ref={rowsRef}>
          <div className={styles.compareRow}>
            <span className={styles.compareLabel}>Manual inbox</span>
            <div className={styles.compareTrack}>
              <div
                className={cx(styles.compareFill, styles.slow)}
                style={{ width: inView ? "94%" : "0%" }}
              />
            </div>
            <span className={styles.compareValue}>4 to 12 hrs to respond</span>
          </div>
          <div className={styles.compareRow}>
            <span className={styles.compareLabel}>GrowthLab</span>
            <div className={styles.compareTrack}>
              <div
                className={cx(styles.compareFill, styles.fast)}
                style={{ width: inView ? "6%" : "0%" }}
              />
            </div>
            <span className={styles.compareValue}>&lt; 60 sec to draft</span>
          </div>
        </div>

        <div className={styles.edgeGrid}>
          <div className={styles.edgeCard}>
            <span className="tag">Speed</span>
            <h3>First to respond usually wins</h3>
            <p>
              Most leads choose whoever replies first, not whoever&apos;s actually best.
              GrowthLab reads and drafts a response the second an email lands. You just
              approve it.
            </p>
          </div>
          <div className={styles.edgeCard}>
            <span className="tag">Consistency</span>
            <h3>No lead sits overnight</h3>
            <p>
              Weekends, holidays, 2am. A competitor&apos;s inbox goes quiet. Yours
              doesn&apos;t. Every inquiry gets read and queued for your approval the moment
              it arrives.
            </p>
          </div>
          <div className={styles.edgeCard}>
            <span className="tag">Focus</span>
            <h3>Your team closes, it doesn&apos;t sort</h3>
            <p>
              Instead of spending the morning triaging inboxes, your team spends it on the
              calls and decisions that actually need a human. That&apos;s where the real
              edge compounds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Before / After                                                          */
/* ---------------------------------------------------------------------- */

const BEFORE = [
  "Manual lead entry",
  "Slow responses",
  "Missed follow-ups",
  "Spreadsheet chaos",
  "Manual scheduling",
  "Hours spent reporting",
];

const AFTER = [
  "Leads captured automatically",
  "Faster responses",
  "Automated follow-ups",
  "CRM stays updated",
  "Customers book themselves",
  "Reports generated automatically",
];

function BeforeAfter() {
  return (
    <section className={styles.sec}>
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>Before vs after</span>
          <h2>What changes once the automation is running</h2>
        </div>
        <div className={styles.baGrid}>
          <div className={cx(styles.baCol, styles.baBefore)}>
            <span className={styles.baLabel}>Before</span>
            <ul className={styles.baList}>
              {BEFORE.map((item) => (
                <li key={item}>
                  <span>✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className={cx(styles.baCol, styles.baAfter)}>
            <span className={styles.baLabel}>After</span>
            <ul className={styles.baList}>
              {AFTER.map((item) => (
                <li key={item}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* How it works                                                            */
/* ---------------------------------------------------------------------- */

const HOW_IT_WORKS = [
  { title: "Discover", body: "We identify what's slowing your business down." },
  { title: "Design", body: "We map the process and automation opportunities." },
  { title: "Build", body: "We connect the systems and build the automation." },
  { title: "Grow", body: "We improve and expand the system as your business grows." },
];

function HowItWorks() {
  return (
    <section className={styles.sec} id="process">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>How it works</span>
          <h2>Four stages, every engagement</h2>
        </div>
        <div className={styles.processList}>
          {HOW_IT_WORKS.map((step, i) => (
            <div className={styles.processRow} key={step.title}>
              <span className={styles.processNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Live demo                                                                */
/* ---------------------------------------------------------------------- */

function Demo() {
  return (
    <section className={styles.sec} id="demo">
      <div className={styles.container}>
        <div className={styles.demoWrap}>
          <div className={styles.demoCopy}>
            <span className={styles.eyebrow}>Live demo</span>
            <h2>
              Don&apos;t take our word for it.
              <br />
              Test the automation yourself.
            </h2>
            <p>Choose a service, pick a time, and submit your details.</p>
            <div className={styles.demoStates}>
              <div className={cx(styles.demoState, styles.demoOk)}>
                ✓ confirmed. Slot booked, calendar updated.
              </div>
              <div className={cx(styles.demoState, styles.demoErr)}>
                ✕ unavailable. Fails at &quot;Check Availability,&quot; honestly.
              </div>
            </div>
            <div style={{ marginTop: 24 }}>
              <Link href="/book" className={styles.btnPrimary}>
                Try the Live Booking System
              </Link>
            </div>
          </div>
          <div className={styles.demoVisual}>
            <div className="line">$ workflow.run(booking)</div>
            <div className="line">
              → check_availability <span className="hi">ok</span>
            </div>
            <div className="line">
              → webhook.dispatch <span className="hi">200</span>
            </div>
            <div className="line">
              → status: <span className="hi">confirmed</span>
            </div>
            <div className="line">
              → calendar.write <span className="hi">ok</span>
            </div>
            <div className="line" style={{ marginTop: 14, color: "var(--gl-muted-2)" }}>
              {"// real response, not a mock"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Automation ecosystem                                                    */
/* ---------------------------------------------------------------------- */

const ECOSYSTEM_STEPS = ["LEADS", "AI", "CRM", "FOLLOW-UP", "BOOKING", "OPERATIONS", "REPORTING"];

function Ecosystem() {
  return (
    <section className={styles.sec}>
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>The bigger picture</span>
          <h2>GrowthLab builds connected systems, not isolated automations</h2>
          <p>Each piece feeds the next. One system your whole business runs on.</p>
        </div>
        <div className={styles.ecoFlow}>
          {ECOSYSTEM_STEPS.map((node, i) => (
            <span key={node} style={{ display: "inline-flex", alignItems: "center" }}>
              <span className={styles.ecoNode}>{node}</span>
              {i < ECOSYSTEM_STEPS.length - 1 && <span className={styles.ecoArrow}>→</span>}
            </span>
          ))}
        </div>
        <p className={styles.ecoMsg}>All connected. All automated.</p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Trust / human control                                                   */
/* ---------------------------------------------------------------------- */

const TRUST_ITEMS = [
  { title: "Human approval", body: "Nothing external happens without a person confirming it first." },
  { title: "Data validation", body: "Inputs are checked before they ever reach a real action." },
  { title: "Controlled automation", body: "Automation runs inside boundaries you define, not open-ended." },
  { title: "Secure integrations", body: "Connections to your tools use standard, credentialed access." },
  { title: "Error handling", body: "Uncertain outcomes are shown as uncertain, never quietly hidden." },
  { title: "Auditability", body: "Every automated action leaves a record of what happened and when." },
];

function TrustControl() {
  return (
    <section className={styles.sec}>
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>Human approval required</span>
          <h2>Automation should remove repetitive work, not remove control</h2>
        </div>
        <p className={styles.trustQuote}>
          &quot;Automation should remove repetitive work. Not remove control.&quot;
        </p>
        <div className={styles.trustGrid}>
          {TRUST_ITEMS.map((item) => (
            <div className={styles.trustItem} key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* About                                                                   */
/* ---------------------------------------------------------------------- */

function About() {
  return (
    <section className={styles.sec} id="about">
      <div className={cx(styles.container, styles.aboutGrid)}>
        <div className={styles.avatar}>
          <Image src="/growthlab-logo.png" alt="GrowthLab" width={80} height={80} />
        </div>
        <div className={styles.aboutCopy}>
          <span className={styles.aboutRole}>About GrowthLab</span>
          <h2>Your business. Your workflow. Automated.</h2>
          <p>
            The systems above are not templates. They are built around how your business
            actually works.
          </p>
          <p>
            GrowthLab designs and builds AI powered operations systems from the ground up.
            We connect your customer experience, CRM, communication, scheduling, and
            internal workflows into one automated system.
          </p>
          <div className={styles.aboutMeta}>
            <div>
              <span>FOCUS</span>AI Agents · CRM · Business Operations
            </div>
            <div>
              <span>FOUNDER</span>Jay Harvey Jalimao
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* Final CTA                                                               */
/* ---------------------------------------------------------------------- */

function FinalCta() {
  return (
    <section className={styles.ctaSection} id="cta">
      <div className={styles.container}>
        <span className={styles.eyebrow}>Get started</span>
        <h2>Ready to work smarter?</h2>
        <p>
          Tell us what&apos;s taking too much time. We&apos;ll show you what can be
          automated.
        </p>
        <div className={styles.ctaActions}>
          <Link href="/book" className={styles.btnPrimary}>
            Let&apos;s Build Yours
          </Link>
        </div>
      </div>
    </section>
  );
}
