import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

// SWR をモック化してAPIコールをシミュレート
vi.mock("swr");

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("認証済みの場合、ユーザー情報を返す", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      nickname: "テストユーザー",
      role: "general" as const,
      family_role: "personal" as const,
      prefecture: null,
      avatar_url: null,
    };

    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: mockUser,
      error: undefined,
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("未認証の場合、isAuthenticatedがfalseになる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: new Error("Unauthorized"),
      isLoading: false,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toBeUndefined();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  it("ローディング中はisLoadingがtrueになる", async () => {
    const useSWR = (await import("swr")).default;
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: true,
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(true);
  });
});
