import { z } from "zod";

/** Input rules for registration, login and profile (FR-01, FR-02). Pure, no database. */

export const PASSWORD_MIN = 8;

const email = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email дұрыс емес");

const password = z
  .string()
  .min(PASSWORD_MIN, `Құпиясөз кемінде ${PASSWORD_MIN} таңба болуы керек`)
  .max(72, "Құпиясөз тым ұзын")
  .regex(/[A-Za-zА-Яа-яӘәҒғҚқҢңӨөҰұҮүҺһІі]/, "Құпиясөзде кемінде бір әріп болуы керек")
  .regex(/\d/, "Құпиясөзде кемінде бір сан болуы керек");

const displayName = z
  .string()
  .trim()
  .min(2, "Атыңызды жазыңыз (кемінде 2 таңба)")
  .max(60, "Аты тым ұзын");

/** Grade is optional: empty field = not set */
const grade = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().min(9, "Сынып 9–11 болуы керек").max(11, "Сынып 9–11 болуы керек").optional(),
);

export const registerSchema = z.object({
  displayName,
  email,
  password,
  grade,
  // consent to the privacy policy (minors: parent/guardian consent, NFR-05)
  consent: z.literal(true, { errorMap: () => ({ message: "Келісім қажет" }) }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Құпиясөзді жазыңыз"),
});

export const profileSchema = z.object({
  displayName,
  grade,
  locale: z.enum(["kk", "ru"]),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, "Қазіргі құпиясөзді жазыңыз"),
    next: password,
    repeat: z.string(),
  })
  .refine((d) => d.next === d.repeat, { message: "Құпиясөздер сәйкес емес", path: ["repeat"] });

export type FieldErrors = Record<string, string>;

/** Turns zod issues into { field: first message } for the form. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
