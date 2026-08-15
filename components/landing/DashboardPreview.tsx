import styles from "@/app/growthlab.module.css";

const METRICS = [
  { value: "42", label: "Leads today" },
  { value: "18", label: "Qualified" },
  { value: "7", label: "Bookings" },
  { value: "13", label: "Follow-ups" },
  { value: "3", label: "Pending tasks" },
];

export function DashboardPreview() {
  return (
    <section className={styles.sec} id="dashboard-preview">
      <div className={styles.container}>
        <div className={styles.secHead}>
          <span className={styles.eyebrow}>Business dashboard preview</span>
          <h2>One place to see what your business is actually doing</h2>
          <p>What a GrowthLab client portal could look like, built around your operations.</p>
        </div>

        <div className={styles.dashWrap}>
          <div className={styles.dashBar}>
            <span>Today&apos;s activity</span>
            <span className={styles.dashTag}>Example dashboard</span>
          </div>

          <div className={styles.dashGrid}>
            {METRICS.map((m) => (
              <div className={styles.dashMetric} key={m.label}>
                <div className={styles.dashMetricValue}>{m.value}</div>
                <div className={styles.dashMetricLabel}>{m.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.dashFooter}>
            <span>
              Automation health: <strong>98%</strong>
            </span>
            <span>
              Revenue pipeline: <strong>$48,200</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
