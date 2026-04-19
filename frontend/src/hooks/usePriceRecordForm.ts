import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { PriceRecordFormData } from "@/types";

type CreateParams = {
  product_id?: number;
  product_name?: string;
  category_id?: number;
  shop_id?: number | null;
  price: number;
  purchased_at: string;
  memo: string | null;
};

/** 価格記録フォームのデータ取得・送信フック */
export function usePriceRecordForm() {
  const { data, error, isLoading } = useSWR<PriceRecordFormData>(
    "/api/v1/price_records/form_data",
    (path: string) => apiFetch<PriceRecordFormData>(path),
    { shouldRetryOnError: false }
  );

  /** 価格記録を新規登録する */
  async function createPriceRecord(params: CreateParams) {
    return apiFetch("/api/v1/price_records", {
      method: "POST",
      body: JSON.stringify({ price_record: params }),
    });
  }

  /** 価格記録を更新する */
  async function updatePriceRecord(
    publicId: string,
    params: Partial<CreateParams>
  ) {
    return apiFetch(`/api/v1/price_records/${publicId}`, {
      method: "PATCH",
      body: JSON.stringify({ price_record: params }),
    });
  }

  /** 価格記録を削除する */
  async function deletePriceRecord(publicId: string) {
    return apiFetch(`/api/v1/price_records/${publicId}`, {
      method: "DELETE",
    });
  }

  return {
    formData: data,
    isLoading,
    error,
    createPriceRecord,
    updatePriceRecord,
    deletePriceRecord,
  };
}
