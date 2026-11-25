"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/modules/auth/session";
import { cancelSubscription, startTestCheckout } from "./service";

const planSchema = z.enum(["monthly", "until_unt"]);

export async function checkoutAction(form: FormData) {
  const user = await requireUser("/account/subscription");
  const plan = planSchema.parse(form.get("plan"));
  await startTestCheckout(user.id, plan);
  revalidatePath("/account/subscription");
}

export async function cancelAction() {
  const user = await requireUser("/account/subscription");
  await cancelSubscription(user.id);
  revalidatePath("/account/subscription");
}
