import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useShops } from "@/hooks/useShops";

vi.mock("swr");
vi.mock("@/lib/api");

const mockShops = [
  { id: 1, name: "スーパーA", memo: null },
  { id: 2, name: "スーパーB", memo: "安い" },
];

describe("useShops", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("店舗一覧を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockShops,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useShops());

    await waitFor(() => {
      expect(result.current.shops).toEqual(mockShops);
    });
  });

  it("データ取得中はisLoadingがtrueになる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useShops());
    expect(result.current.isLoading).toBe(true);
  });

  it("データがない場合は空配列を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useShops());
    expect(result.current.shops).toEqual([]);
  });

  it("createShop を呼ぶと POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockShops,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 3, name: "スーパーC", memo: null });

    const { result } = renderHook(() => useShops());

    await act(async () => {
      await result.current.createShop({ name: "スーパーC", memo: null });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shops", {
      method: "POST",
      body: JSON.stringify({ shop: { name: "スーパーC", memo: null } }),
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("updateShop を呼ぶと PATCH が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockShops,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 1, name: "更新済み", memo: null });

    const { result } = renderHook(() => useShops());

    await act(async () => {
      await result.current.updateShop(1, { name: "更新済み", memo: null });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shops/1", {
      method: "PATCH",
      body: JSON.stringify({ shop: { name: "更新済み", memo: null } }),
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("deleteShop を呼ぶと DELETE が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockShops,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue(undefined);

    const { result } = renderHook(() => useShops());

    await act(async () => {
      await result.current.deleteShop(1);
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shops/1", { method: "DELETE" });
    expect(mutate).toHaveBeenCalled();
  });
});
