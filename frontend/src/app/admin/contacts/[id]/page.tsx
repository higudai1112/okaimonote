"use client";

import { use, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AdminContact } from "@/types";

const STATUS_OPTIONS = [
  { value: "unread", label: "未読" },
  { value: "pending", label: "対応中" },
  { value: "resolved", label: "解決済み" },
];

export default function AdminContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: contact, isLoading, mutate } = useSWR<AdminContact>(
    `/api/v1/admin/contacts/${id}`,
    (path: string) => apiFetch<AdminContact>(path)
  );

  const [status, setStatus] = useState<string>("");
  const [memo, setMemo] = useState("");
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (isLoading || !contact) return <p className="text-gray-500">読み込み中...</p>;

  function startEdit() {
    setStatus(contact!.status);
    setMemo(contact!.admin_memo ?? "");
    setEditing(true);
  }

  async function handleSave() {
    await apiFetch(`/api/v1/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ contact: { status, admin_memo: memo } }),
    });
    mutate();
    setEditing(false);
    setMessage("更新しました");
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/contacts" className="text-gray-400 hover:text-gray-600 text-sm">← 一覧</Link>
        <h1 className="text-2xl font-bold text-gray-800">お問い合わせ詳細</h1>
      </div>

      {message && <p className="text-green-600 text-sm font-semibold">{message}</p>}

      <div className="bg-white rounded-xl shadow border border-gray-100 p-5 space-y-3 text-sm">
        <div className="flex gap-4"><span className="text-gray-500 w-28">ニックネーム</span><span>{contact.nickname}</span></div>
        <div className="flex gap-4"><span className="text-gray-500 w-28">メール</span><span>{contact.email}</span></div>
        <div className="flex gap-4"><span className="text-gray-500 w-28">日時</span><span>{new Date(contact.created_at).toLocaleString("ja-JP")}</span></div>
        <div>
          <p className="text-gray-500 mb-1">お問い合わせ内容</p>
          <p className="bg-gray-50 rounded-lg p-3 whitespace-pre-wrap text-gray-700">{contact.body}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow border border-gray-100 p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-gray-700 text-sm">対応状況</p>
          {!editing && <button onClick={startEdit} className="text-xs text-orange-500 hover:underline">編集</button>}
        </div>
        {editing ? (
          <div className="space-y-3">
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full">
              {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)}
              placeholder="管理者メモ"
              className="border border-gray-300 rounded-lg p-2 text-sm w-full focus:ring-2 focus:ring-orange-400 outline-none" rows={3} />
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-orange-600">保存</button>
              <button onClick={() => setEditing(false)} className="text-xs text-gray-500 hover:underline">キャンセル</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <p>ステータス: <span className="font-semibold">{STATUS_OPTIONS.find((o) => o.value === contact.status)?.label}</span></p>
            <p className="text-gray-600 whitespace-pre-wrap">{contact.admin_memo || "メモなし"}</p>
          </div>
        )}
      </div>
    </div>
  );
}
