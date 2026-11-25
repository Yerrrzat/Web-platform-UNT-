/** Builds CSV text; values with commas, quotes or line breaks are quoted. */
export function toCsv(header: string[], rows: string[][]): string {
  const escape = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return [header, ...rows].map((r) => r.map(escape).join(",")).join("\n") + "\n";
}
