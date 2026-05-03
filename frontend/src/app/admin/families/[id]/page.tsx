"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import type { AdminFamily } from "@/types";

export default function AdminFamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: family, isLoading, mutate } = useSWR<AdminFamily>(
    `/api/v1/admin/families/${id}`,
    (path: string) => apiFetch<AdminFamily>(path)
  );

  if (isLoading || !family) return <p className="text-gray-500">読み込み中...</p>;

  async function handleChangeAdmin(userId: number) {
    const target = family!.members?.find((m) => m.id === userId);
    if (!confirm(`${target?.nickname ?? "このユーザー"} を管理者にしますか？`)) return;
    await apiFetch(`/api/v1/admin/families/${id}/change_admin`, {
      method: "PATCH",
      body: JSON.stringify({ user_id: userId }),
    });
    mutate();
  }

  async function handleRemoveMember(userId: number) {
    const target = family!.members?.find((m) => m.id === userId);
    if (!confirm(`${target?.nickname ?? "このユーザー"} を除名しますか？`)) return;
    await apiFetch(`/api/v1/admin/families/${id}/members/${userId}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/families" className="text-gray-400 hover:text-gray-600 text-sm">← 一覧</Link>
        <h1 className="text-2xl font-bold text-gray-800">ファミリー詳細</h1>
      </div>

      <div className="bg-white rounded-xl shadow border border-orange-100 p-5 text-sm space-y-2">
        <div className="flex gap-4"><span className="text-gray-500 w-28">ID</span><span>{family.id}</span></div>
        <div className="flex gap-4"><span className="text-gray-500 w-28">名前</span><span className="font-medium">{family.name}</span></div>
        <div className="flex gap-4"><span className="text-gray-500 w-28">メンバー数</span><span>{family.members_count} 人</span></div>
        <div className="flex gap-4"><span className="text-gray-500 w-28">作成日</span><span>{new Date(family.created_at).toLocaleString("ja-JP")}</span></div>
      </div>

      <div className="bg-white rounded-xl shadow border border-orange-100 overflow-hidden">
        <p className="px-5 py-3 font-semibold text-gray-700 text-sm border-b border-orange-100">メンバー一覧</p>
        <table className="w-full text-sm">
          <thead className="bg-orange-50 text-orange-700">
            <tr>
              <th className="px-4 py-3 text-left">ニックネーム</th>
              <th className="px-4 py-3 text-left">メール</th>
              <th className="px-4 py-3 text-left">ロール</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {family.members?.map((member) => (
              <tr key={member.id} className="hover:bg-orange-50">
                <td className="px-4 py-3">{member.nickname ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{member.email}</td>
                <td className="px-4 py-3">
                  {member.family_role === "family_admin" ? (
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">管理者</span>
                  ) : (
                    <span className="text-xs text-gray-500">メンバー</span>
                  )}
                </td>
                <td className="px-4 py-3 space-x-3">
                  {member.family_role !== "family_admin" && (
                    <button onClick={() => handleChangeAdmin(member.id)}
                      className="text-xs text-orange-500 hover:underline">管理者に変更</button>
                  )}
                  <button onClick={() => handleRemoveMember(member.id)}
                    className="text-xs text-red-500 hover:underline">除名</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
