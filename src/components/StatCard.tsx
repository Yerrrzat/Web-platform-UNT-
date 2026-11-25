export function StatCard({
  title,
  value,
  hint,
  target,
}: {
  title: string;
  value: string;
  hint?: string;
  target?: string;
}) {
  return (
    <div className="card stat">
      <div className="muted">{title}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="muted small">{hint}</div>}
      {target && <div className="small target">{target}</div>}
    </div>
  );
}
