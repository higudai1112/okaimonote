import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { Family } from "@/types";

/** ファミリー情報の取得・操作フック */
export function useFamily() {
  const { data, error, isLoading, mutate } = useSWR<Family>(
    "/api/v1/family",
    (path: string) => apiFetch<Family>(path),
    { shouldRetryOnError: false }
  );

  /** ファミリー作成 */
  async function createFamily(name: string): Promise<Family> {
    const created = await apiFetch<Family>("/api/v1/family", {
      method: "POST",
      body: JSON.stringify({ family: { name } }),
    });
    mutate(created, false);
    return created;
  }

  /** ファミリー名更新 */
  async function updateFamily(name: string): Promise<Family> {
    const updated = await apiFetch<Family>("/api/v1/family", {
      method: "PATCH",
      body: JSON.stringify({ family: { name } }),
    });
    mutate(updated, false);
    return updated;
  }

  /** ファミリー解散 */
  async function destroyFamily(): Promise<void> {
    await apiFetch("/api/v1/family", { method: "DELETE" });
    mutate(undefined, false);
  }

  /** ファミリー脱退 */
  async function leaveFamily(): Promise<void> {
    await apiFetch("/api/v1/family/leave", { method: "DELETE" });
    mutate(undefined, false);
  }

  /** 管理者権限を別メンバーに譲渡 */
  async function transferOwner(memberId: number): Promise<Family> {
    const updated = await apiFetch<Family>("/api/v1/family/transfer_owner", {
      method: "PATCH",
      body: JSON.stringify({ member_id: memberId }),
    });
    mutate(updated, false);
    return updated;
  }

  /** 招待トークン再発行 */
  async function regenerateInvite(): Promise<Family> {
    const updated = await apiFetch<Family>("/api/v1/family/regenerate_invite", {
      method: "POST",
    });
    mutate(updated, false);
    return updated;
  }

  return {
    family: data,
    isLoading,
    error,
    createFamily,
    updateFamily,
    destroyFamily,
    leaveFamily,
    transferOwner,
    regenerateInvite,
  };
}
