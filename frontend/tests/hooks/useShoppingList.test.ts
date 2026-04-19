import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useShoppingList } from "@/hooks/useShoppingList";
import type { ShoppingList } from "@/types";

vi.mock("swr");
vi.mock("@/lib/api");

const mockList: ShoppingList = {
  id: 1,
  public_id: "abc-123",
  name: "買い物リスト",
  items: [
    { id: 1, name: "にんじん", memo: null, purchased: false },
    { id: 2, name: "牛乳", memo: "1L", purchased: true },
  ],
};

describe("useShoppingList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ショッピングリストデータを返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockList,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useShoppingList());

    await waitFor(() => {
      expect(result.current.list).toEqual(mockList);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("addItem を呼ぶと apiFetch POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockList,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({
      id: 3,
      name: "たまご",
      memo: null,
      purchased: false,
    });

    const { result } = renderHook(() => useShoppingList());

    await act(async () => {
      await result.current.addItem({ name: "たまご", memo: null });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shopping_list/items", {
      method: "POST",
      body: JSON.stringify({ shopping_item: { name: "たまご", memo: null } }),
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("togglePurchased を呼ぶと apiFetch PATCH が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockList,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({
      id: 1,
      name: "にんじん",
      memo: null,
      purchased: true,
    });

    const { result } = renderHook(() => useShoppingList());

    await act(async () => {
      await result.current.togglePurchased(1, false);
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shopping_list/items/1", {
      method: "PATCH",
      body: JSON.stringify({ shopping_item: { purchased: true } }),
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("deleteItem を呼ぶと apiFetch DELETE が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockList,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue(undefined);

    const { result } = renderHook(() => useShoppingList());

    await act(async () => {
      await result.current.deleteItem(1);
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/shopping_list/items/1", {
      method: "DELETE",
    });
    expect(mutate).toHaveBeenCalled();
  });

  it("deletePurchased を呼ぶと apiFetch DELETE /purchased が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: mockList,
      error: undefined,
      isLoading: false,
      mutate,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue(undefined);

    const { result } = renderHook(() => useShoppingList());

    await act(async () => {
      await result.current.deletePurchased();
    });

    expect(apiFetch).toHaveBeenCalledWith(
      "/api/v1/shopping_list/items/purchased",
      { method: "DELETE" }
    );
    expect(mutate).toHaveBeenCalled();
  });
});
