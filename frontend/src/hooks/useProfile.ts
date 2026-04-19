import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types";

/** プロフィール情報の取得・更新フック（/api/v1/me + PATCH /api/v1/profile） */
export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR<User>(
    "/api/v1/me",
    (path: string) => apiFetch<User>(path),
    { shouldRetryOnError: false }
  );

  async function updateProfile(params: {
    nickname: string;
    prefecture: string | null;
  }) {
    const updated = await apiFetch<User>("/api/v1/profile", {
      method: "PATCH",
      body: JSON.stringify({ user: params }),
    });
    mutate(updated, false);
  }

  return {
    user: data,
    isLoading,
    error,
    updateProfile,
  };
}
