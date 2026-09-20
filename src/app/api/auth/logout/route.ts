import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth-cookie";

export async function POST() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
