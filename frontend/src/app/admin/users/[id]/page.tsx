"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useConfirm } from "@/hooks/useConfirm";
import type { AdminUser } from "@/types";

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: user, isLoading, mutate } = useSWR<AdminUser>(
    `/api/v1/admin/users/${id}`,
    (path: string) => apiFetch<AdminUser>(path)
  );

  const { confirm, ConfirmModalElement } = useConfirm();
  const [memo, setMemo] = useState("");
  const [editingMemo, setEditingMemo] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showBanForm, setShowBanForm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (isLoading || !user) return <p className="text-gray-500">読み込み中...</p>;

  async function handleMemoSave() {
    await apiFetch(`/api/v1/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ user: { admin_memo: memo } }),
    });
    mutate();
    setEditingMemo(false);
    setMessage("メモを更新しました");
  }

  async function handleBan() {
    await apiFetch(`/api/v1/admin/users/${id}/ban`, {
      method: "PATCH",
      body: JSON.stringify({ reason: banReason }),
    });
    mutate();
    setShowBanForm(false);
    setMessage("BANしました");
  }

  async function handleUnban() {
    if (!await confirm({ message: "BANを解除しますか？", confirmLabel: "解除する" })) return;
    await apiFetch(`/api/v1/admin/users/${id}/unban`, { method: "PATCH" });
    mutate();
    setMessage("BAN解除しました");
  }

  return (
    <>
    {ConfirmModalElement}
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="text-gray-400 hover:text-gray-600 text-sm">← 一覧</Link>
        <h1 className="text-2xl font-bold text-gray-800">ユーザー詳細</h1>
      </div>

      {message && <p className="text-green-600 text-sm font-semibold">{message}</p>}

      {/* 基本情報 */}
      <div className="bg-white rounded-xl shadow border border-orange-100 p-5 space-y-2 text-sm">
        <Row label="ID" value={String(user.id)} />
        <Row label="メール" value={user.email} />
        <Row label="ニックネーム" value={user.nickname ?? "—"} />
        <Row label="都道府県" value={user.prefecture ?? "未設定"} />
        <Row label="ロール" value={user.role} />
        <Row label="ステータス" value={user.status} />
        <Row label="家族ロール" value={user.family_role} />
        <Row label="最終ログイン" value={user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString("ja-JP") : "—"} />
        <Row label="登録日" value={new Date(user.created_at).toLocaleString("ja-JP")} />
      </div>

      {/* 管理メモ */}
      <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-700 text-sm">管理者メモ</p>
          <button onClick={() => { setMemo(user.admin_memo ?? ""); setEditingMemo(true); }}
            className="text-xs text-orange-500 hover:underline">編集</button>
        </div>
        {editingMemo ? (
          <div className="space-y-2">
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none" rows={3} />
            <div className="flex gap-2">
              <button onClick={handleMemoSave} className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600">保存</button>
              <button onClick={() => setEditingMemo(false)} className="text-xs text-gray-500 hover:underline">キャンセル</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{user.admin_memo || "—"}</p>
        )}
      </div>

      {/* BAN 操作 */}
      <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
        <p className="font-semibold text-gray-700 text-sm mb-3">アカウント操作</p>
        {user.status === "banned" ? (
          <div className="space-y-2">
            <p className="text-sm text-red-600">BAN理由: {user.banned_reason ?? "—"}</p>
            <button onClick={handleUnban} className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition">
              BANを解除する
            </button>
          </div>
        ) : (
          showBanForm ? (
            <div className="space-y-2">
              <input type="text" value={banReason} onChange={(e) => setBanReason(e.target.value)}
                placeholder="BAN理由を入力"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full focus:ring-2 focus:ring-red-400 outline-none" />
              <div className="flex gap-2">
                <button onClick={handleBan} className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">BAN実行</button>
                <button onClick={() => setShowBanForm(false)} className="text-sm text-gray-500 hover:underline">キャンセル</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowBanForm(true)} className="text-sm text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition">
              BANする
            </button>
          )
        )}
      </div>

      {/* 最近の価格記録 */}
      {user.recent_price_records && user.recent_price_records.length > 0 && (
        <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
          <p className="font-semibold text-gray-700 text-sm mb-3">最近の価格記録</p>
          <table className="w-full text-xs">
            <thead className="text-gray-500"><tr>
              <th className="text-left pb-2">商品</th><th className="text-left pb-2">店舗</th>
              <th className="text-left pb-2">価格</th><th className="text-left pb-2">日付</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {user.recent_price_records.map((r) => (
                <tr key={r.id}>
                  <td className="py-1.5">{r.product_name ?? "—"}</td>
                  <td>{r.shop_name ?? "—"}</td>
                  <td>¥{r.price.toLocaleString()}</td>
                  <td className="text-gray-400">{r.purchased_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <span className="text-gray-500 w-32 shrink-0">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
