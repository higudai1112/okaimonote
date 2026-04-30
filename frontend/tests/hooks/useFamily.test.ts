import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFamily } from "@/hooks/useFamily";

vi.mock("swr");
vi.mock("@/lib/api");

describe("useFamily", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ファミリー情報を返す", async () => {
    const useSWR = (await import("swr")).default;
    const mockFamily = {
      id: 1,
      name: "テストファミリー",
      invite_token: "abc123",
      members_count: 2,
      members: [
        { id: 1, nickname: "管理者", family_role: "family_admin" },
        { id: 2, nickname: "メンバー", family_role: "family_member" },
      ],
    };
    vi.mocked(useSWR).mockReturnValue({
      data: mockFamily,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: vi.fn(),
    } as ReturnType<typeof useSWR>);

    const { result } = renderHook(() => useFamily());
    expect(result.current.family).toEqual(mockFamily);
    expect(result.current.isLoading).toBe(false);
  });

  it("createFamily を呼ぶと POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutateMock = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: undefined,
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: mutateMock,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 1, name: "新ファミリー" });

    const { result } = renderHook(() => useFamily());

    await act(async () => {
      await result.current.createFamily("新ファミリー");
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/family", {
      method: "POST",
      body: JSON.stringify({ family: { name: "新ファミリー" } }),
    });
  });

  it("updateFamily を呼ぶと PATCH が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutateMock = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: { id: 1, name: "旧名前" },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: mutateMock,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 1, name: "新名前" });

    const { result } = renderHook(() => useFamily());

    await act(async () => {
      await result.current.updateFamily("新名前");
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/family", {
      method: "PATCH",
      body: JSON.stringify({ family: { name: "新名前" } }),
    });
  });

  it("regenerateInvite を呼ぶと POST が実行される", async () => {
    const useSWR = (await import("swr")).default;
    const mutateMock = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      data: { id: 1, invite_token: "old_token" },
      error: undefined,
      isLoading: false,
      isValidating: false,
      mutate: mutateMock,
    } as ReturnType<typeof useSWR>);

    const { apiFetch } = await import("@/lib/api");
    vi.mocked(apiFetch).mockResolvedValue({ id: 1, invite_token: "new_token" });

    const { result } = renderHook(() => useFamily());

    await act(async () => {
      await result.current.regenerateInvite();
    });

    expect(apiFetch).toHaveBeenCalledWith("/api/v1/family/regenerate_invite", {
      method: "POST",
    });
  });
});
