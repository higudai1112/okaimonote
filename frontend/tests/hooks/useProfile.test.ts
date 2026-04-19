import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProfile } from "@/hooks/useProfile";

vi.mock("swr");
vi.mock("@/lib/api");

describe("useProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updateProfile を呼ぶと PATCH が実行される", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: { id: 1, nickname: "元の名前", prefecture: "東京都" },
      error: undefined,
      isLoading: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({
      id: 1,
      nickname: "新しい名前",
      prefecture: "大阪府",
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile({
        nickname: "新しい名前",
        prefecture: "大阪府",
      });
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/profile", {
      method: "PATCH",
      body: JSON.stringify({
        user: { nickname: "新しい名前", prefecture: "大阪府" },
      }),
    });
  });
});
