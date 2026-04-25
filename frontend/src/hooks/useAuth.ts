import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

/** 現在の認証済みユーザー情報を取得するフック */
export function useAuth(enabled = true) {
  const { data, error, isLoading } = useSWR<User>(
    // enabled=false（パブリックページ）の場合は API を呼ばない
    enabled ? "/api/v1/me" : null,
    (path: string) => apiFetch<User>(path),
    {
      // 未認証エラーはリトライしない
      shouldRetryOnError: false,
    }
  );

  return {
    user: data,
    isLoading,
    isAuthenticated: !!data && !error,
    error,
  };
}
