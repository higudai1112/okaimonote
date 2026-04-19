"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AdminContact } from "@/types";

type Response = { contacts: AdminContact[]; meta: { total: number; page: number; per: number } };

const STATUS_LABELS: Record<string, string> = {
  unread: "未読",
  pending: "対応中",
  resolved: "解決済み",
};

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-red-100 text-red-600",
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-600",
};

export default function AdminContactsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR<Response>(
    `/api/v1/admin/contacts?status=${status}&page=${page}`,
    (path: string) => apiFetch<Response>(path)
  );

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.per) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">お問い合わせ管理</h1>

      <div className="flex gap-2">
        {["", "unread", "pending", "resolved"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1); }}
            className={`text-sm px-3 py-1.5 rounded-lg border transition ${
              status === s ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s === "" ? "すべて" : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">全 {data?.meta.total} 件</p>
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">ニックネーム</th>
                  <th className="px-4 py-3 text-left">メール</th>
                  <th className="px-4 py-3 text-left">ステータス</th>
                  <th className="px-4 py-3 text-left">日時</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{c.id}</td>
                    <td className="px-4 py-3">{c.nickname}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[c.status]}`}>
                        {STATUS_LABELS[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(c.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/contacts/${c.id}`} className="text-orange-500 hover:underline text-xs">
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2 text-sm">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">←</button>
              <span className="px-3 py-1.5 text-gray-600">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50">→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
