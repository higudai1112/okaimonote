"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/types";

type Response = { users: AdminUser[]; meta: { total: number; page: number; per: number } };

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");

  const { data, isLoading } = useSWR<Response>(
    `/api/v1/admin/users?q=${query}&page=${page}`,
    (path: string) => apiFetch<Response>(path)
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input);
    setPage(1);
  }

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.per) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">ユーザー管理</h1>

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メール・ニックネームで検索"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 max-w-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
          検索
        </button>
      </form>

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
                  <th className="px-4 py-3 text-left">メール</th>
                  <th className="px-4 py-3 text-left">ニックネーム</th>
                  <th className="px-4 py-3 text-left">ステータス</th>
                  <th className="px-4 py-3 text-left">登録日</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">{user.id}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.nickname ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.status === "banned" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      }`}>
                        {user.status === "banned" ? "BAN" : "正常"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/users/${user.id}`} className="text-orange-500 hover:underline text-xs">
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ページネーション */}
          {totalPages > 1 && (
            <div className="flex gap-2 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                ←
              </button>
              <span className="px-3 py-1.5 text-gray-600">{page} / {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
