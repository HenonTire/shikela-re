import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// Map front-end mode/role values to exact backend endpoint paths
const ENDPOINT_MAP: Record<string, string> = {
  login: "/auth/login/",
  "register-customer": "/auth/register/",
  "register-shop-owner": "/auth/register-shop-owner/",
  "register-supplier": "/auth/register-supplier/",
  "register-courier": "/auth/register-courier/",
};

export async function POST(req: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { error: "BACKEND_BASE_URL environment variable is not set" },
      { status: 500 }
    );
  }

  try {
    const url = new URL(req.url);
    const mode = url.searchParams.get("mode") || "login";

    // Fallback support if mode is simply "register" -> default to shop owner or customer
    const targetEndpointKey = mode === "register" ? "register-shop-owner" : mode;
    const endpoint = ENDPOINT_MAP[targetEndpointKey];

    if (!endpoint) {
      return NextResponse.json(
        { error: `Invalid auth mode: '${mode}'` },
        { status: 400 }
      );
    }

    const body = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => null);
      return NextResponse.json(
        { error: errorData?.detail || errorData?.message || "Backend authentication failed" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();

    
const response = NextResponse.json(data, {
  status: backendRes.status,
});


const cookies = backendRes.headers.getSetCookie 
  ? backendRes.headers.getSetCookie() 
  : [backendRes.headers.get("set-cookie")].filter(Boolean) as string[];

cookies.forEach((cookie) => {
  response.headers.append("set-cookie", cookie);
});

return response;
  } catch (error) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}