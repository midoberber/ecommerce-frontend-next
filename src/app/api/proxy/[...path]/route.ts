import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function forward(request: Request, path: string[]) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(`${API_URL}/${path.join("/")}`);
  url.search = new URL(request.url).search;

  const body = request.method === "GET" ? undefined : await request.text();

  const res = await fetch(url, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body || undefined,
    cache: "no-store",
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

type Context = { params: Promise<{ path: string[] }> };

export async function GET(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function POST(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function PATCH(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}

export async function DELETE(request: Request, { params }: Context) {
  return forward(request, (await params).path);
}
