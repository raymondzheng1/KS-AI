/**
 * Facilitator-mode gate (passcode). Answer keys, schedules, and run guides are
 * revealed only after a shared passcode is entered — kept away from students.
 */
import "server-only";
import { cookies } from "next/headers";

export const FAC_COOKIE = "ksai_fac";

/** True if the supplied passcode matches the configured one (non-empty). */
export function checkPasscode(passcode: string): boolean {
  const expected = process.env.FACILITATOR_PASSCODE;
  return !!expected && passcode === expected;
}

/** Whether the current request is in facilitator mode (cookie set by the gate). */
export async function isFacilitator(): Promise<boolean> {
  const store = await cookies();
  return store.get(FAC_COOKIE)?.value === "1";
}
