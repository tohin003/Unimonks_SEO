import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const leadsFilePath = path.join(process.cwd(), "data", "leads.ndjson");

function getField(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function buildRedirectUrl(request: NextRequest, redirectPath: string, status: string, source: string) {
  const safePath = redirectPath.startsWith("/") ? redirectPath : "/thank-you";
  const url = new URL(safePath, request.url);

  url.searchParams.set("status", status);
  url.searchParams.set("source", source || "website");

  return url;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const fullName = getField(formData, "fullName");
  const phone = getField(formData, "phone");
  const email = getField(formData, "email");
  const examYear = getField(formData, "examYear");
  const targetCourse = getField(formData, "targetCourse");
  const message = getField(formData, "message");
  const consent = getField(formData, "consent");
  const source = getField(formData, "source");
  const redirectTo = getField(formData, "redirectTo") || "/thank-you";

  if (!fullName || !phone || !email || !consent) {
    return NextResponse.redirect(
      buildRedirectUrl(request, redirectTo, "invalid", source),
      303,
    );
  }

  try {
    await fs.mkdir(path.dirname(leadsFilePath), { recursive: true });

    const lead = {
      fullName,
      phone,
      email,
      examYear,
      targetCourse,
      message,
      source: source || "website",
      createdAt: new Date().toISOString(),
    };

    await fs.appendFile(leadsFilePath, `${JSON.stringify(lead)}\n`, "utf8");

    return NextResponse.redirect(
      buildRedirectUrl(request, redirectTo, "success", source),
      303,
    );
  } catch {
    return NextResponse.redirect(
      buildRedirectUrl(request, redirectTo, "error", source),
      303,
    );
  }
}
