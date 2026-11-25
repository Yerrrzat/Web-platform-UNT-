/** Labelled input with an error message under it. */
export function Field({
  label,
  name,
  type = "text",
  error,
  defaultValue,
  hint,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  defaultValue?: string;
  hint?: string;
  autoComplete?: string;
}) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
      />
      {hint && !error && <span className="muted small">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export function GradeSelect({ error, defaultValue }: { error?: string; defaultValue?: string }) {
  return (
    <div className="field">
      <label htmlFor="grade">Сынып</label>
      <select id="grade" name="grade" defaultValue={defaultValue ?? ""}>
        <option value="">— көрсетпеу —</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
      </select>
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
