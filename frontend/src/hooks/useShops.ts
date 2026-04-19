import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type Shop = { id: number; name: string; memo: string | null };

/** 店舗の取得・追加・更新・削除フック */
export function useShops() {
  const { data, error, isLoading, mutate } = useSWR<Shop[]>(
    "/api/v1/shops",
    (path: string) => apiFetch<Shop[]>(path),
    { shouldRetryOnError: false }
  );

  async function createShop(params: { name: string; memo: string | null }) {
    await apiFetch("/api/v1/shops", {
      method: "POST",
      body: JSON.stringify({ shop: params }),
    });
    mutate();
  }

  async function updateShop(id: number, params: { name: string; memo: string | null }) {
    await apiFetch(`/api/v1/shops/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ shop: params }),
    });
    mutate();
  }

  async function deleteShop(id: number) {
    await apiFetch(`/api/v1/shops/${id}`, { method: "DELETE" });
    mutate();
  }

  return {
    shops: data ?? [],
    isLoading,
    error,
    createShop,
    updateShop,
    deleteShop,
  };
}
