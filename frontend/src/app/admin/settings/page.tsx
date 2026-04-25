"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type AdminSettings = {
  max_family_members: number;
};

const PLANNED_FEATURES = [
  "無料プランの利用制限",
  "統計表示期間の変更",
  "エリア統計の表示制御",
  "機能の一時停止（メンテナンス）",
  "広告表示",
  "課金設定(iOS対応後)",
];

/** 管理画面：設定ページ */
export default function AdminSettingsPage() {
  const { data, isLoading } = useSWR<AdminSettings>("/api/v1/admin/settings", (url: string) =>
    apiFetch<AdminSettings>(url)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-orange-100 text-orange-500">
            ⚙
          </span>
          設定
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          okaimonote の動作ルールを確認できます。現在は一部の設定のみ有効。
        </p>
      </div>

      {/* 利用制限 */}
      <section className="bg-white rounded-2xl shadow border border-orange-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          👥 利用制限
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">家族メンバーの上限</p>
            <p className="text-xs text-gray-500 mt-1">1つのファミリーに参加できる最大人数</p>
          </div>
          <div className="text-right">
            {isLoading ? (
              <p className="text-xl font-bold text-gray-400">--</p>
            ) : (
              <p className="text-xl font-bold text-gray-800">{data?.max_family_members} 人</p>
            )}
            <p className="text-xs text-gray-400">※ 現在変更できません</p>
          </div>
        </div>
      </section>

      {/* 今後追加予定 */}
      <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          ⏳ 今後追加予定
        </h2>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          {PLANNED_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <p className="text-xs text-gray-400 mt-2">
          ※ これらの設定は今後のアップデートで順次追加予定。
        </p>
      </section>
    </div>
  );
}
