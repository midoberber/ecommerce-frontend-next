import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth-cookie";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  await setSessionCookie(data.accessToken);
  return NextResponse.json({ user: data.user });
}
