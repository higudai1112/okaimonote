"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/profile", label: "👤 プロフィール設定" },
  { href: "/categories", label: "📂 カテゴリー管理" },
  { href: "/shops", label: "🏪 店舗管理" },
  { href: "/family", label: "👨‍👩‍👧 ファミリー設定" },
];

const EXTERNAL_ITEMS: NavItem[] = [
  { href: `${API_BASE}/terms`, label: "利用規約", external: true },
  { href: `${API_BASE}/privacy`, label: "プライバシーポリシー", external: true },
  { href: `${API_BASE}/contact`, label: "お問い合わせ", external: true },
];

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          ⚙ 設定
        </h1>

        {/* ユーザー情報 */}
        {user && (
          <div className="bg-white rounded-2xl shadow border border-orange-100 p-5 mb-6 text-center">
            <p className="text-lg font-bold text-gray-800">
              {user.nickname ?? "ゲスト"}
            </p>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
        )}

        {/* 設定ナビ */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden mb-4">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex justify-between items-center px-5 py-4 border-b border-gray-100 last:border-none hover:bg-orange-50 transition"
            >
              <span className="text-gray-800">{item.label}</span>
              <span className="text-gray-400">›</span>
            </Link>
          ))}
        </div>

        {/* 外部リンク */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden mb-6">
          {EXTERNAL_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-between items-center px-5 py-4 border-b border-gray-100 last:border-none hover:bg-orange-50 transition"
            >
              <span className="text-gray-800">{item.label}</span>
              <span className="text-gray-400">↗</span>
            </a>
          ))}
        </div>

        {/* ログアウト */}
        <a
          href={`${API_BASE}/users/sign_out`}
          data-method="delete"
          className="block w-full text-center text-red-500 hover:text-red-600 font-semibold py-3 rounded-2xl border border-red-200 hover:bg-red-50 transition"
        >
          ログアウト
        </a>
      </div>
    </div>
  );
}
