import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/types";

type ProductsResponse = {
  data: Product[];
  meta: { total: number; current_page: number; total_pages: number };
};

export type ProductSearchParams = {
  name_cont?: string;
  category_id_eq?: string;
};

/** 商品一覧を取得するフック */
export function useProducts(page = 1, searchParams?: ProductSearchParams) {
  const query = [
    `page=${page}`,
    ...(searchParams
      ? Object.entries(searchParams)
          .filter(([, v]) => v !== "" && v != null)
          .map(([k, v]) => `q[${k}]=${encodeURIComponent(v!)}`)
      : []),
  ].join("&");

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    `/api/v1/products?${query}`,
    (path: string) => apiFetch<ProductsResponse>(path),
    { shouldRetryOnError: false }
  );

  return {
    products: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}
