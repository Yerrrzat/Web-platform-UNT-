import { TestRunner } from "@/components/TestRunner";
import { requireUser } from "@/modules/auth/session";

export default async function TestPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  await requireUser(`/test/${attemptId}`);
  return <TestRunner attemptId={attemptId} />;
}
