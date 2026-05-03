"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import type { AdminServices } from "@/types";

export default function AdminServicesPage() {
  const { data, isLoading } = useSWR<AdminServices>(
    "/api/v1/admin/services",
    (path: string) => apiFetch<AdminServices>(path)
  );

  if (isLoading || !data) return <p className="text-gray-500">読み込み中...</p>;

  const stats = [
    { label: "総ユーザー数", value: data.users_count.toLocaleString() },
    { label: "総商品数", value: data.products_count.toLocaleString() },
    { label: "総価格記録数", value: data.price_records_count.toLocaleString() },
    { label: "総店舗数", value: data.shops_count.toLocaleString() },
    { label: "総ファミリー数", value: data.families_count.toLocaleString() },
    { label: "アクティブユーザー（30日）", value: data.active_users_count.toLocaleString() },
    { label: "平均記録数/アクティブユーザー", value: String(data.avg_records_per_user) },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">サービス概要</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-5 border border-orange-100">
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
        <p className="font-semibold text-gray-700 mb-3">システム情報</p>
        <dl className="space-y-2 text-sm">
          {[
            { label: "Rails バージョン", value: data.rails_version },
            { label: "Ruby バージョン", value: data.ruby_version },
            { label: "環境", value: data.env },
            { label: "DB接続", value: data.db_connected ? "正常" : "エラー" },
          ].map((item) => (
            <div key={item.label} className="flex gap-4">
              <dt className="text-gray-500 w-40">{item.label}</dt>
              <dd className="font-mono text-gray-700">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
