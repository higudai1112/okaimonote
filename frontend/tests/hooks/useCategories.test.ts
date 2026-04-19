import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCategories } from "@/hooks/useCategories";

vi.mock("swr");
vi.mock("@/lib/api");

const mockCategories = [
  { id: 1, public_id: "abc", name: "野菜", memo: null },
];

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("カテゴリー一覧を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockCategories,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
    });
  });

  it("createCategory を呼ぶと POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockCategories,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 2, name: "肉類" });

    const { result } = renderHook(() => useCategories());

    await act(async () => {
      await result.current.createCategory({ name: "肉類", memo: null });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/categories", {
      method: "POST",
      body: JSON.stringify({ category: { name: "肉類", memo: null } }),
    });
    expect(mutate).toHaveBeenCalled();
  });
});
