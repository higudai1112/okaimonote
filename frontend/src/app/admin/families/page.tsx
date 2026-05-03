"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AdminFamily } from "@/types";

type Response = { families: AdminFamily[]; meta: { total: number; page: number; per: number } };

export default function AdminFamiliesPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSWR<Response>(
    `/api/v1/admin/families?page=${page}`,
    (path: string) => apiFetch<Response>(path)
  );

  const totalPages = data ? Math.ceil(data.meta.total / data.meta.per) : 1;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">ファミリー管理</h1>

      {isLoading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : (
        <>
          <p className="text-sm text-gray-500">全 {data?.meta.total} 件</p>
          <div className="bg-white rounded-xl shadow border border-orange-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-orange-50 text-orange-700">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">ファミリー名</th>
                  <th className="px-4 py-3 text-left">メンバー数</th>
                  <th className="px-4 py-3 text-left">作成日</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {data?.families.map((f) => (
                  <tr key={f.id} className="hover:bg-orange-50">
                    <td className="px-4 py-3 text-gray-500">{f.id}</td>
                    <td className="px-4 py-3 font-medium">{f.name}</td>
                    <td className="px-4 py-3">{f.members_count} 人</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(f.created_at).toLocaleDateString("ja-JP")}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/families/${f.id}`} className="text-orange-500 hover:underline text-xs">
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
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-orange-50">←</button>
              <span className="px-3 py-1.5 text-gray-600">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-orange-50">→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
