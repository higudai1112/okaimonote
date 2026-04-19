import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { ShoppingList } from "@/types";

/** ショッピングリストの取得・追加・更新・削除フック */
export function useShoppingList() {
  const { data, error, isLoading, mutate } = useSWR<ShoppingList>(
    "/api/v1/shopping_list",
    (path: string) => apiFetch<ShoppingList>(path),
    { shouldRetryOnError: false }
  );

  /** アイテムを追加する */
  async function addItem(params: { name: string; memo: string | null }) {
    await apiFetch("/api/v1/shopping_list/items", {
      method: "POST",
      body: JSON.stringify({ shopping_item: params }),
    });
    mutate();
  }

  /** 購入済みトグルを切り替える */
  async function togglePurchased(id: number, currentPurchased: boolean) {
    await apiFetch(`/api/v1/shopping_list/items/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        shopping_item: { purchased: !currentPurchased },
      }),
    });
    mutate();
  }

  /** アイテムを削除する */
  async function deleteItem(id: number) {
    await apiFetch(`/api/v1/shopping_list/items/${id}`, { method: "DELETE" });
    mutate();
  }

  /** 購入済みアイテムを一括削除する */
  async function deletePurchased() {
    await apiFetch("/api/v1/shopping_list/items/purchased", {
      method: "DELETE",
    });
    mutate();
  }

  return {
    list: data,
    isLoading,
    error,
    addItem,
    togglePurchased,
    deleteItem,
    deletePurchased,
  };
}
