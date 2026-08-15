"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "@/app/growthlab.module.css";

const SAVINGS_RATE = 0.6; // Illustrative assumption, shown explicitly in the UI.

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function RoiCalculator() {
  const [employees, setEmployees] = useState(2);
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [hourlyCost, setHourlyCost] = useState(30);

  const { weekly, monthly, annual, potentialMonthly } = useMemo(() => {
    const weeklyCost = employees * hoursPerWeek * hourlyCost;
    const monthlyCost = weeklyCost * 4.33;
    const annualCost = weeklyCost * 52;
    const potential = monthlyCost * (1 - SAVINGS_RATE);
    return { weekly: weeklyCost, monthly: monthlyCost, annual: annualCost, potentialMonthly: potential };
  }, [employees, hoursPerWeek, hourlyCost]);

  return (
    <section className={styles.sec} id="roi-calculator">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>ROI calculator</span>
          <h2>What is repetitive work actually costing you?</h2>
          <p>Estimate the cost of manual, repeatable tasks across your team.</p>
        </div>

        <div className={styles.roiWrap}>
          <div className={styles.roiInputs}>
            <div className={styles.roiField}>
              <label htmlFor="roi-employees">
                <span>People doing repetitive tasks</span>
                <span>{employees}</span>
              </label>
              <input
                id="roi-employees"
                type="range"
                min={1}
                max={30}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                aria-valuetext={`${employees} people`}
              />
            </div>

            <div className={styles.roiField}>
              <label htmlFor="roi-hours">
                <span>Hours per week on those tasks (per person)</span>
                <span>{hoursPerWeek} hrs</span>
              </label>
              <input
                id="roi-hours"
                type="range"
                min={1}
                max={40}
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                aria-valuetext={`${hoursPerWeek} hours per week`}
              />
            </div>

            <div className={styles.roiField}>
              <label htmlFor="roi-cost">
                <span>Estimated hourly cost</span>
                <span>${hourlyCost}/hr</span>
              </label>
              <input
                id="roi-cost"
                type="range"
                min={10}
                max={150}
                step={5}
                value={hourlyCost}
                onChange={(e) => setHourlyCost(Number(e.target.value))}
                aria-valuetext={`${hourlyCost} dollars per hour`}
              />
            </div>

            <p className={styles.roiAssumption}>
              Illustrative automation savings: {Math.round(SAVINGS_RATE * 100)}%. Not a guaranteed
              outcome, results vary by business.
            </p>
          </div>

          <div className={styles.roiResults}>
            <div className={styles.roiResultRow}>
              <span className={styles.roiResultLabel}>Current manual cost / week</span>
              <div className={`${styles.roiResultValue} ${styles.current}`}>
                {formatMoney(weekly)}
              </div>
            </div>
            <div className={styles.roiResultRow}>
              <span className={styles.roiResultLabel}>Current manual cost / month</span>
              <div className={`${styles.roiResultValue} ${styles.current}`}>
                {formatMoney(monthly)}
              </div>
            </div>
            <div className={styles.roiResultRow}>
              <span className={styles.roiResultLabel}>Current manual cost / year</span>
              <div className={`${styles.roiResultValue} ${styles.current}`}>
                {formatMoney(annual)}
              </div>
            </div>
            <div className={styles.roiResultRow}>
              <span className={styles.roiResultLabel}>Potential automation impact / month</span>
              <div className={`${styles.roiResultValue} ${styles.potential}`}>
                ~{formatMoney(potentialMonthly)}
              </div>
            </div>
            <p className={styles.roiNote}>
              Your biggest opportunity may be automating repetitive operational work.
            </p>
            <Link href="/book" className={styles.btnPrimary}>
              Explore My Automation Opportunities
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
