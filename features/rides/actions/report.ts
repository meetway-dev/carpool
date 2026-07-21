"use server";

import { headers } from "next/headers";
import { connectToDatabase } from "@/lib/db/connect";
import { Report } from "@/models/report.model";
import { createReportSchema } from "@/validators/driver.schema";
import { rateLimiters } from "@/lib/rate-limit";
import type { ActionResult } from "@/types";

/**
 * Submit a report against a ride, driver or request. Rate-limited per client to
 * curb abuse. Device key is passed from the client for v1 ownership tracking.
 */
export async function submitReport(
  input: unknown,
  reporterKey: string,
): Promise<ActionResult> {
  const parsed = createReportSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please choose a valid reason.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const headerList = await headers();
  const identifier =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    reporterKey ??
    "anonymous";

  const limited = rateLimiters.report(identifier);
  if (!limited.success) {
    return { success: false, error: "You've reported too many items. Try again later." };
  }

  try {
    await connectToDatabase();
    await Report.create({
      ...parsed.data,
      reporterKey: reporterKey || undefined,
      status: "open",
    });
    return { success: true, data: undefined };
  } catch (error) {
    console.error("submitReport failed:", error);
    return { success: false, error: "Could not submit report. Please try again." };
  }
}
