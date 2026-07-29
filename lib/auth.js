import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE_NAME = "abn_session";
export const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret() {
  const secret = process.env.ABN_TRACKER_SECRET;
  if (!secret) {
    throw new Error(
      "ABN_TRACKER_SECRET is not set. Add it to your environment variables."
    );
  }
  return secret;
}

function sign(payload) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken() {
  const expiry = Date.now() + MAX_AGE * 1000;
  const payload = String(expiry);
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload);
  if (expected.length !== signature.length) return false;
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  );
  if (!isValid) return false;
  return Date.now() < Number(payload);
}

export function isAuthed() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
