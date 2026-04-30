"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { FamilyInviteInfo } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function FamilyInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [inviteInfo, setInviteInfo] = useState<FamilyInviteInfo | null>(null);
  const [infoLoading, setInfoLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/family_invites/${token}`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        setInviteInfo(await res.json());
      })
      .catch(() => setNotFound(true))
      .finally(() => setInfoLoading(false));
  }, [token]);

  async function handleJoin() {
    if (!user) {
      /* 未ログインならログイン後に戻ってくるよう誘導 */
      window.location.href = `${API_BASE}/users/sign_in`;
      return;
    }
    setJoining(true);
    setError(null);
    try {
      await apiFetch(`/api/v1/family_invites/${token}/join`, { method: "POST" });
      router.push("/family");
    } catch {
      setError("参加できませんでした。すでに別のファミリーに所属しているか、上限に達している可能性があります。");
    } finally {
      setJoining(false);
    }
  }

  if (authLoading || infoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-8 text-center max-w-sm w-full">
          <p className="text-gray-700 mb-4">招待リンクが無効です。</p>
          <Link href="/" className="text-orange-500 hover:underline text-sm">
            ホームへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow border border-orange-100 p-8 text-center max-w-sm w-full">
        <h1 className="text-xl font-bold text-gray-800 mb-2">ファミリーへの招待</h1>
        <p className="text-2xl font-bold text-orange-500 mb-1">{inviteInfo?.name}</p>
        <p className="text-sm text-gray-500 mb-6">
          現在 {inviteInfo?.members_count} 人 / 残り {inviteInfo?.remaining_slots} 人参加可能
        </p>

        {error && (
          <p className="mb-4 text-red-500 text-sm font-semibold">{error}</p>
        )}

        {inviteInfo && inviteInfo.remaining_slots > 0 ? (
          <button
            type="button"
            onClick={handleJoin}
            disabled={joining}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            {joining ? "参加中..." : user ? "ファミリーに参加する" : "ログインして参加する"}
          </button>
        ) : (
          <p className="text-gray-500 text-sm">このファミリーは満員です。</p>
        )}
      </div>
    </div>
  );
}
