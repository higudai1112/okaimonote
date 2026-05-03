"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { AdminDashboard } from "@/types";
import Link from "next/link";

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-orange-100">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useSWR<AdminDashboard>(
    "/api/v1/admin/dashboard",
    (path: string) => apiFetch<AdminDashboard>(path)
  );

  if (isLoading || !data) {
    return <p className="text-gray-500">読み込み中...</p>;
  }

  const diff = (n: number) => (n >= 0 ? `+${n}` : `${n}`);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">ダッシュボード</h1>

      {/* KPI カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="本日の新規ユーザー"
          value={data.new_users_today}
          sub={`前日比 ${diff(data.new_users_diff)}`}
        />
        <StatCard label="アクティブユーザー（30日）" value={data.active_users} />
        <StatCard
          label="新規ユーザー（30日）"
          value={data.new_users_30d}
          sub={`前月比 ${diff(data.new_users_30d_diff)}`}
        />
        <StatCard label="総ファミリー数" value={data.total_families} />
      </div>

      {/* アラート */}
      {data.unresolved_contacts > 0 && (
        <Link
          href="/admin/contacts"
          className="block bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-semibold hover:bg-red-100 transition"
        >
          未読お問い合わせが {data.unresolved_contacts} 件あります →
        </Link>
      )}

      {/* TOP 商品・店舗 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border border-orange-100">
          <p className="font-semibold text-gray-700 mb-3">価格記録の多い商品 TOP5</p>
          <ol className="space-y-1.5">
            {data.top_products.map((p, i) => (
              <li key={p.name} className="flex justify-between text-sm text-gray-700">
                <span>{i + 1}. {p.name}</span>
                <span className="text-gray-400">{p.records_count} 件</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-white rounded-xl shadow p-5 border border-orange-100">
          <p className="font-semibold text-gray-700 mb-3">価格記録の多い店舗 TOP5</p>
          <ol className="space-y-1.5">
            {data.top_shops.map((s, i) => (
              <li key={s.name} className="flex justify-between text-sm text-gray-700">
                <span>{i + 1}. {s.name}</span>
                <span className="text-gray-400">{s.records_count} 件</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
