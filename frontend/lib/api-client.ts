const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const ACCESS_TOKEN_KEY = 'accessToken';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  isFormData?: boolean;
  auth?: boolean;
}

interface LoginResponse {
  access: string;
}

interface ErrorPayload {
  detail?: string;
  [key: string]: unknown;
}

export type UserRole = 'store_owner' | 'supplier' | 'courier';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('supplierId');
  localStorage.removeItem('courierId');
}

async function refreshAccessToken(): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) return false;
  const data = await response.json();
  if (!data?.access) return false;
  setAccessToken(data.access);
  return true;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isFormData = false, auth = false } = options;
  const headers: Record<string, string> = {};

  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const makeRequest = async () =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body == null ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

  let response = await makeRequest();

  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const token = getAccessToken();
      if (token) headers.Authorization = `Bearer ${token}`;
      response = await makeRequest();
    }
  }

  if (!response.ok) {
    const errText = await response.text();
    let parsed: ErrorPayload | null = null;
    try {
      parsed = errText ? (JSON.parse(errText) as ErrorPayload) : null;
    } catch {
      parsed = null;
    }

    const message =
      parsed?.detail ||
      (errText.startsWith('{') ? 'Request failed. Please check your input.' : errText) ||
      `Request failed: ${response.status}`;

    throw new Error(message);
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
}

export async function login(email: string, password: string): Promise<void> {
  const data = await apiRequest<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: { email, password },
  });

  if (!data?.access) {
    throw new Error('Login did not return access token.');
  }
  setAccessToken(data.access);
}

export async function registerShopOwner(payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}) {
  return apiRequest('/auth/register-shop-owner/', { method: 'POST', body: payload });
}

export async function registerSupplier(payload: {
  company_name: string;
  email: string;
  password: string;
  phone_number?: string;
  location?: string;
}) {
  return apiRequest('/auth/register-supplier/', { method: 'POST', body: payload });
}

export async function registerCourier(payload: {
  company_name: string;
  email: string;
  password: string;
  phone_number?: string;
  location?: string;
  is_available?: boolean;
}) {
  return apiRequest('/auth/register-courier/', { method: 'POST', body: payload });
}

export async function detectUserRole(): Promise<UserRole> {
  try {
    await apiRequest('/analytics/shop/dashboard/', { auth: true });
    return 'store_owner';
  } catch {
    // continue
  }

  try {
    await apiRequest('/analytics/supplier/dashboard/', { auth: true });
    return 'supplier';
  } catch {
    // continue
  }

  return 'courier';
}

export async function createShop(payload: {
  name: string;
  description?: string;
  domain?: string;
}) {
  return apiRequest('/shops/', { method: 'POST', body: payload, auth: true });
}
