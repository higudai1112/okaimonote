import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { usePriceRecordForm } from "@/hooks/usePriceRecordForm";

vi.mock("swr");
vi.mock("@/lib/api");

const mockFormData = {
  shops: [{ id: 1, name: "イオン" }],
  categories: [{ id: 1, name: "野菜" }],
  products: [{ id: 10, public_id: "abc", name: "牛乳", category_id: null }],
};

describe("usePriceRecordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("フォーム用データ（shops・categories・products）を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockFormData,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => usePriceRecordForm());

    await waitFor(() => {
      expect(result.current.formData?.shops[0].name).toBe("イオン");
      expect(result.current.formData?.categories[0].name).toBe("野菜");
      expect(result.current.formData?.products[0].name).toBe("牛乳");
    });
  });

  it("createPriceRecord を呼ぶと POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockFormData,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 1, price: 198 });

    const { result } = renderHook(() => usePriceRecordForm());

    await act(async () => {
      await result.current.createPriceRecord({
        product_id: 10,
        shop_id: 1,
        price: 198,
        purchased_at: "2024-01-15",
        memo: null,
      });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/price_records", {
      method: "POST",
      body: expect.stringContaining('"price":198'),
    });
  });
});
