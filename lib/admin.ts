import { createHash, timingSafeEqual } from "node:crypto";

import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "unimonks-admin-session";

function readAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() ?? "";
}

export function isAdminProtected() {
  return Boolean(readAdminPassword());
}

function encode(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminPassword(input: string) {
  const password = readAdminPassword();

  if (!password) {
    return true;
  }

  return safeEqual(input, password);
}

export function createAdminSessionValue() {
  return encode(`unimonks:${readAdminPassword()}`);
}

export function isAdminSessionValue(value: string | undefined) {
  if (!isAdminProtected()) {
    // Dev convenience only — on Vercel / production, refuse to grant
    // access just because ADMIN_PASSWORD happens to be unset.
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      return false;
    }
    return true;
  }

  if (!value) {
    return false;
  }

  return safeEqual(value, createAdminSessionValue());
}

export function isAdminRequestAuthorized(request: NextRequest) {
  return isAdminSessionValue(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
