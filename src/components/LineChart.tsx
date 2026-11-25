/** Small SVG line chart (no external chart library). Points with value null are skipped. */
export function LineChart({
  points,
  max = 100,
  height = 180,
}: {
  points: { label: string; value: number | null }[];
  max?: number;
  height?: number;
}) {
  const width = 640;
  const pad = 32;
  const n = points.length;
  const x = (i: number) => (n <= 1 ? width / 2 : pad + (i * (width - 2 * pad)) / (n - 1));
  const y = (v: number) => height - pad - (v / max) * (height - 2 * pad);
  const shown = points.map((p, i) => ({ ...p, i })).filter((p) => p.value !== null);
  const path = shown.map((p, k) => `${k === 0 ? "M" : "L"}${x(p.i)},${y(p.value!)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img">
      {[0, 25, 50, 75, 100].map((t) => (
        <g key={t}>
          <line x1={pad} x2={width - pad} y1={y((t / 100) * max)} y2={y((t / 100) * max)} className="grid-line" />
          <text x={4} y={y((t / 100) * max) + 4} className="axis">
            {Math.round((t / 100) * max)}
          </text>
        </g>
      ))}
      <path d={path} className="line" fill="none" />
      {shown.map((p) => (
        <g key={p.i}>
          <circle cx={x(p.i)} cy={y(p.value!)} r={4} className="dot" />
          <title>{`${p.label}: ${p.value}`}</title>
        </g>
      ))}
      {points.map((p, i) =>
        n <= 10 || i % Math.ceil(n / 8) === 0 ? (
          <text key={i} x={x(i)} y={height - 8} textAnchor="middle" className="axis">
            {p.label}
          </text>
        ) : null,
      )}
    </svg>
  );
}
