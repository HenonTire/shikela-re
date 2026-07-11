import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Backend endpoint is /auth/refresh/ according to API specification
    const backendURL = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/refresh/`;

    const res = await fetch(backendURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.get("cookie") || "",
      },
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const error = contentType.includes("application/json")
        ? (await res.json()).error || (await res.json()).detail || res.statusText
        : await res.text();
      return NextResponse.json({ error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ access: data.access });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}