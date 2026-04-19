import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type Category = { id: number; public_id: string; name: string; memo: string | null };

/** カテゴリーの取得・追加・更新・削除フック */
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    "/api/v1/categories",
    (path: string) => apiFetch<Category[]>(path),
    { shouldRetryOnError: false }
  );

  async function createCategory(params: { name: string; memo: string | null }) {
    await apiFetch("/api/v1/categories", {
      method: "POST",
      body: JSON.stringify({ category: params }),
    });
    mutate();
  }

  async function updateCategory(id: number, params: { name: string; memo: string | null }) {
    await apiFetch(`/api/v1/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ category: params }),
    });
    mutate();
  }

  async function deleteCategory(id: number) {
    await apiFetch(`/api/v1/categories/${id}`, { method: "DELETE" });
    mutate();
  }

  return {
    categories: data ?? [],
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
