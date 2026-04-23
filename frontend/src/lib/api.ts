/** Rails API への fetch ラッパー。全リクエストで credentials: include を付けて Devise セッション Cookie を送る */
// multipart/form-data 用（Content-Type を自動設定させる）
export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PATCH" = "PATCH"
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(error.error ?? res.statusText), {
      status: res.status,
    });
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(error.error ?? res.statusText), {
      status: res.status,
    });
  }

  // 204 No Content は body なし
  if (res.status === 204) return undefined as T;

  return res.json();
}
