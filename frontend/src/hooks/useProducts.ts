import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types";

/** 商品一覧を取得するフック */
export function useProducts() {
  const { data, error, isLoading } = useSWR<Product[]>(
    "/api/v1/products",
    (path: string) => apiFetch<Product[]>(path),
    { shouldRetryOnError: false }
  );

  return {
    products: data ?? [],
    isLoading,
    error,
  };
}
