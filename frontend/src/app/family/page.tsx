"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useFamily } from "@/hooks/useFamily";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function FamilyPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { family, isLoading, destroyFamily, leaveFamily, transferOwner, regenerateInvite } =
    useFamily();

  const [transferTargetId, setTransferTargetId] = useState<number | null>(null);
  const [showInviteUrl, setShowInviteUrl] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-orange-50 py-10 px-4">
        <div className="max-w-md mx-auto text-center">
          <p className="text-gray-500 mb-6">ファミリーに所属していません</p>
          <Link
            href="/family/new"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition"
          >
            ファミリーを作成する
          </Link>
        </div>
      </div>
    );
  }

  const isAdmin = user?.family_role === "family_admin";
  const inviteUrl = `${API_BASE}/family_invites/${family.invite_token}`;

  async function handleRegenerate() {
    try {
      await regenerateInvite();
      setActionMessage("招待リンクを再発行しました");
      setShowInviteUrl(true);
    } catch {
      setErrorMessage("再発行できませんでした");
    }
  }

  async function handleTransfer() {
    if (!transferTargetId) return;
    if (!confirm("管理者権限を譲渡しますか？")) return;
    try {
      await transferOwner(transferTargetId);
      setActionMessage("管理者権限を譲渡しました");
      setTransferTargetId(null);
    } catch {
      setErrorMessage("権限を譲渡できませんでした");
    }
  }

  async function handleLeave() {
    if (!confirm("ファミリーから脱退しますか？")) return;
    try {
      await leaveFamily();
      router.push("/settings");
    } catch {
      setErrorMessage("脱退できませんでした");
    }
  }

  async function handleDestroy() {
    if (!confirm("ファミリーを解散しますか？この操作は取り消せません。")) return;
    try {
      await destroyFamily();
      router.push("/settings");
    } catch {
      setErrorMessage("解散できませんでした");
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-2">
          👨‍👩‍👧 ファミリー設定
        </h1>

        {actionMessage && (
          <p className="text-center text-green-600 text-sm font-semibold">{actionMessage}</p>
        )}
        {errorMessage && (
          <p className="text-center text-red-500 text-sm font-semibold">{errorMessage}</p>
        )}

        {/* ファミリー情報 */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-5">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-gray-500">グループ名</p>
            {isAdmin && (
              <Link href="/family/edit" className="text-xs text-orange-500 hover:underline">
                編集
              </Link>
            )}
          </div>
          <p className="font-bold text-gray-800 text-lg">{family.name}</p>
          <p className="text-sm text-gray-500 mt-3">
            メンバー {family.members_count} 人 / 最大 3 人
          </p>
        </div>

        {/* メンバー一覧 */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-sm font-semibold text-gray-600">メンバー</p>
          {family.members.map((member) => (
            <div
              key={member.id}
              className="flex justify-between items-center px-5 py-3 border-t border-gray-100"
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-800">{member.nickname ?? "名前未設定"}</span>
                {member.family_role === "family_admin" && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                    管理者
                  </span>
                )}
              </div>
              {isAdmin && member.id !== user?.id && (
                <button
                  type="button"
                  onClick={() => setTransferTargetId(member.id)}
                  className="text-xs text-orange-500 hover:underline"
                >
                  権限を渡す
                </button>
              )}
            </div>
          ))}
        </div>

        {/* 権限譲渡確認 */}
        {transferTargetId && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center">
            <p className="text-sm text-gray-700 mb-3">
              {family.members.find((m) => m.id === transferTargetId)?.nickname} さんに管理者権限を譲渡しますか？
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={handleTransfer}
                className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-orange-600 transition"
              >
                譲渡する
              </button>
              <button
                type="button"
                onClick={() => setTransferTargetId(null)}
                className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* 招待リンク */}
        {isAdmin && (
          <div className="bg-white rounded-2xl shadow border border-orange-100 p-5">
            <p className="text-sm font-semibold text-gray-600 mb-3">招待リンク</p>
            <button
              type="button"
              onClick={() => setShowInviteUrl(!showInviteUrl)}
              className="text-sm text-orange-500 hover:underline mb-2 block"
            >
              {showInviteUrl ? "非表示" : "招待リンクを表示"}
            </button>
            {showInviteUrl && (
              <div className="bg-gray-50 rounded-xl p-3 break-all text-xs text-gray-600 mb-3">
                {inviteUrl}
              </div>
            )}
            <button
              type="button"
              onClick={handleRegenerate}
              className="text-xs text-gray-500 hover:underline"
            >
              招待リンクを再発行する
            </button>
          </div>
        )}

        {/* 招待コード入力で参加 */}
        {!isAdmin && (
          <Link
            href="/family_invites/enter_code"
            className="block w-full text-center bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold py-3 rounded-2xl border border-orange-200 transition text-sm"
          >
            招待コードで参加する
          </Link>
        )}

        {/* 脱退・解散 */}
        <div className="space-y-2 pt-2">
          {!isAdmin && (
            <button
              type="button"
              onClick={handleLeave}
              className="block w-full text-center text-red-500 hover:text-red-600 font-semibold py-3 rounded-2xl border border-red-200 hover:bg-red-50 transition text-sm"
            >
              ファミリーから脱退する
            </button>
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={handleDestroy}
              className="block w-full text-center text-red-500 hover:text-red-600 font-semibold py-3 rounded-2xl border border-red-200 hover:bg-red-50 transition text-sm"
            >
              ファミリーを解散する
            </button>
          )}
        </div>

        <Link
          href="/settings"
          className="block text-center text-gray-500 text-sm hover:underline pt-2"
        >
          ← 設定に戻る
        </Link>
      </div>
    </div>
  );
}
