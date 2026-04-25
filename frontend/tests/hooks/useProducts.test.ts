import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProducts } from "@/hooks/useProducts";

vi.mock("swr");
vi.mock("@/lib/api");

const mockProduct = {
  id: 1,
  public_id: "abc123",
  name: "牛乳",
  category_id: null,
  category_name: null,
  default_unit: null,
  image_url: null,
};

const mockResponse = {
  data: [ mockProduct ],
  meta: { total: 1, current_page: 1, total_pages: 1 },
};

describe("useProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("商品一覧を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockResponse,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.products).toEqual([ mockProduct ]);
    });
  });

  it("metaを返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockResponse,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProducts());

    await waitFor(() => {
      expect(result.current.meta?.total).toBe(1);
    });
  });

  it("データがない場合は空配列を返す", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProducts());
    expect(result.current.products).toEqual([]);
  });

  it("データ取得中はisLoadingがtrueになる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useProducts());
    expect(result.current.isLoading).toBe(true);
  });

  it("ページパラメータがURLに含まれる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockResponse,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    renderHook(() => useProducts(2));

    const swrKey = vi.mocked(useSWR).mock.calls[0][0] as string;
    expect(swrKey).toContain("page=2");
  });

  it("検索パラメータがURLに含まれる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockResponse,
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    renderHook(() => useProducts(1, { name_cont: "牛乳" }));

    const swrKey = vi.mocked(useSWR).mock.calls[0][0] as string;
    expect(swrKey).toContain("name_cont");
  });
});
