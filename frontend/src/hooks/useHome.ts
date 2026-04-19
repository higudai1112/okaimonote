import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { PriceRecord, PriceSummary } from "@/types";

type HomeData = {
  price_records: PriceRecord[];
};

/** ホーム画面の価格登録履歴を取得するフック */
export function useHome() {
  const { data, error, isLoading } = useSWR<HomeData>(
    "/api/v1/home",
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
