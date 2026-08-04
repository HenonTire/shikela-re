import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL ?? 'http://127.0.0.1:8000';

export type UserRole = 'store_owner' | 'supplier' | 'courier';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  /** HTTP method to use for the request. Defaults to 'GET'. */
  method?: HttpMethod;
  /** Request body payload. Formats automatically based on `isFormData`. */
  body?: unknown;
  /** Indicates whether the body is a `FormData` instance. Suppresses JSON headers when true. */
  isFormData?: boolean;
  /** Attach JWT Authorization Bearer token and manage auto-refreshes if true. */
  auth?: boolean;
}

interface LoginResponse {
  access: string;
}

interface ErrorPayload {
  detail?: string;
  message?: string;
  [key: string]: unknown;
}

// Global promise lock to prevent multiple concurrent token refresh requests (thundering herd problem)
let refreshPromise: Promise<boolean> | null = null;

/**
 * Retrieves the current access token from Zustand state, falling back to 
 * localStorage hydration if necessary.
 */
function getAccessToken(): string | null {
  // 1. Check memory store state first
  const memoryToken = useAuthStore.getState().accessToken;
  if (memoryToken) return memoryToken;

  // 2. Direct fallback to localStorage in case Zustand state is mid-hydration
  if (typeof window !== 'undefined') {
    try {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        const parsed = JSON.parse(storage);
        return parsed?.state?.accessToken || null;
      }
    } catch (e) {
      console.error('Error reading access token from localStorage:', e);
    }
  }

  return null;
}

/**
 * Updates the access token in Zustand memory state.
 */
function setAccessToken(token: string | null): void {
  useAuthStore.getState().setAccessToken(token);
}

/**
 * Clears user session tokens and state across Zustand and persistence layers.
 */
export function clearSession(): void {
  useAuthStore.getState().clearSession();
}

/**
 * Refreshes the access token via the Next.js API Proxy Route (`/api/auth/refresh`),
 * which forwards HttpOnly cookies containing the refresh token.
 * 
 * Uses a singleton promise to ensure concurrent requests share a single refresh attempt.
 */
async function refreshAccessToken(): Promise<boolean> {
  // If a refresh request is already pending, return the existing promise
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensures cookies are sent with request
      });

      if (!response.ok) {
        clearSession();
        return false;
      }

      const data = await response.json();
      if (!data?.access) {
        clearSession();
        return false;
      }

      setAccessToken(data.access);
      return true;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      clearSession();
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Wrapper for `fetch` supporting JSON/FormData requests, authorization headers, 
 * automatic error handling, and silent token refreshing.
 *
 * @template T - The expected JSON response type.
 * @param path - API path endpoint relative to `API_BASE_URL` (e.g., '/auth/login/').
 * @param options - Configurable HTTP options.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, isFormData = false, auth = false } = options;
  const headers: Record<string, string> = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (auth) {
    let token = getAccessToken();

    // 1. Attempt token refresh prior to dispatch if no access token exists
    if (!token) {
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        token = getAccessToken();
      }
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const executeFetch = (authHeaders: Record<string, string>) =>
    fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: authHeaders,
      credentials: 'include',
      body: body == null ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

  let response = await executeFetch(headers);

  // 2. Retry on 401 Unauthorized response for authenticated requests
  if (response.status === 401 && auth) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      const freshToken = getAccessToken();
      const updatedHeaders = { ...headers };
      if (freshToken) {
        updatedHeaders.Authorization = `Bearer ${freshToken}`;
      }
      response = await executeFetch(updatedHeaders);
    }
  }

  // Handle Non-2xx Responses
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
      parsed?.message ||
      (errText.startsWith('{') ? 'Request failed. Please check your input.' : errText) ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  if (response.status === 204) return {} as T;
  return (await response.json()) as T;
}

/* ==========================================================================
   Authentication Endpoints
   ========================================================================== */

/**
 * Log in directly against backend server and store token.
 */
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
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  phone_number?: string;
}) {
  return apiRequest('/auth/register-shop-owner/', { method: 'POST', body: payload });
}

export async function registerSupplier(payload: {
  company_name?: string;
  email: string;
  password: string;
  phone_number?: string;
  location?: string;
}) {
  return apiRequest('/auth/register-supplier/', { method: 'POST', body: payload });
}

export async function registerCourier(payload: {
  company_name?: string;
  email: string;
  password: string;
  phone_number?: string;
  location?: string;
  is_available?: boolean;
}) {
  return apiRequest('/auth/register-courier/', { method: 'POST', body: payload });
}

/* ==========================================================================
   Client-Side Proxy Auth Layer (Next.js Route Handler)
   ========================================================================== */

export async function clientLogin(email: string, password: string) {
  const res = await fetch('/api/auth?mode=login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Invalid credentials');
  }

  const data = await res.json();
  if (data.access) {
    setAccessToken(data.access);
  }
  return data;
}

export async function clientRegisterShopOwner(payload: unknown) {
  const res = await fetch('/api/auth?mode=register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Registration failed');
  }

  return await res.json();
}

export async function detectUserRole(): Promise<string> {
  const token = getAccessToken();
  if (!token) return 'shop_owner';

  try {
    const res = await apiRequest<{ role?: string }>('/auth/user/1/', { auth: true });
    return res.role?.toLowerCase() || 'shop_owner';
  } catch (e) {
    console.error('Error detecting user role:', e);
  }
  return 'shop_owner';
}

/* ==========================================================================
   Account Verification API Endpoints
   ========================================================================== */

export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/resend-verification/', {
    method: 'POST',
    body: { email },
  });
}

export async function verifyEmailAccount(token: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>('/auth/verify-email/', {
    method: 'POST',
    body: { token },
  });
}

/* ==========================================================================
   Shops & Theme Settings Endpoints
   ========================================================================== */

export async function createShop(payload: {
  name: string;
  description?: string;
  domain?: string;
  theme_id?: string;
}) {
  return apiRequest<{ id: string; name: string; domain?: string }>('/shops/', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function updateShopThemeSettings(formData: FormData) {
  return apiRequest('/shops/theme-settings/', {
    method: 'PATCH',
    body: formData,
    isFormData: true,
    auth: true,
  });
}

export async function getShopThemeSettings() {
  return apiRequest('/shops/theme-settings/', {
    method: 'GET',
    auth: true,
  });
}