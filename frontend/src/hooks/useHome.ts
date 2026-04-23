import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { PriceRecord, PriceSummary } from "@/types";

type HomeData = {
  price_records: PriceRecord[];
};

export type HomeSearchParams = {
  product_name_cont?: string;
  product_category_id_eq?: string;
  shop_id_eq?: string;
};

/** ホーム画面の価格登録履歴を取得するフック */
export function useHome(searchParams?: HomeSearchParams) {
  // 検索パラメータをクエリ文字列に変換
  const query = searchParams
    ? Object.entries(searchParams)
        .filter(([, v]) => v !== "" && v != null)
        .map(([k, v]) => `q[${k}]=${encodeURIComponent(v!)}`)
        .join("&")
    : "";

  const url = query ? `/api/v1/home?${query}` : "/api/v1/home";

  const { data, error, isLoading } = useSWR<HomeData>(
    url,
    (path: string) => apiFetch<HomeData>(path),
    { shouldRetryOnError: false }
  );

  return {
    priceRecords: data?.price_records ?? [],
    isLoading,
    error,
  };
}

/** 指定商品の価格サマリーを取得するフック */
export function usePriceSummary(productId: number | null) {
  const { data, error, isLoading } = useSWR<PriceSummary>(
    productId ? `/api/v1/home/summary/${productId}` : null,
    (path: string) => apiFetch<PriceSummary>(path),
    { shouldRetryOnError: false }
  );

  return { summary: data, isLoading, error };
}
