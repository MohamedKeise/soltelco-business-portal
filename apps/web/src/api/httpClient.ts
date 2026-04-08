import { getCurrentPortal, getPortalToken } from "../auth/portalToken";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

type RequestOptions = {
  auth?: boolean;
};

export async function postJson<T>(
  path: string,
  body: unknown,
  options?: RequestOptions
): Promise<T> {
  try {
    const token = options?.auth ? getPortalToken(getCurrentPortal()) : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Request failed");
    }

    return res.json() as Promise<T>;
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Please check your internet connection");
    }

    throw error;
  }
}