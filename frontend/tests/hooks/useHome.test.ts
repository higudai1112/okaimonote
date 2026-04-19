import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHome } from "@/hooks/useHome";
import type { PriceRecord } from "@/types";

vi.mock("swr");

const mockRecords: PriceRecord[] = [
  {
    id: 1,
    price: 198,
    memo: null,
    purchased_at: "2024-01-01",
    product_id: 10,
    product_name: "牛乳",
    product_public_id: "abc",
    shop_name: "イオン",
  },
];

describe("useHome", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("価格登録履歴を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: { price_records: mockRecords },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.priceRecords).toEqual(mockRecords);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("データがない場合は空配列を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: { price_records: [] },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useHome());

    await waitFor(() => {
      expect(result.current.priceRecords).toEqual([]);
    });
  });
});
