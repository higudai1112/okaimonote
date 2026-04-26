"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useFlash } from "@/contexts/FlashContext";
import { apiFetch } from "@/lib/api";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/profile", label: "👤 プロフィール設定" },
  { href: "/categories", label: "📂 カテゴリー管理" },
  { href: "/shops", label: "🏪 店舗管理" },
  { href: "/family", label: "👨‍👩‍👧 ファミリー設定" },
];

const INFO_ITEMS: NavItem[] = [
  { href: "/terms", label: "利用規約" },
  { href: "/privacy", label: "プライバシーポリシー" },
  { href: "/contact", label: "お問い合わせ" },
];

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const { flash } = useFlash();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await apiFetch("/api/v1/sessions", { method: "DELETE" });
      // フルリロードで SWR キャッシュをクリアし AuthProvider の誤リダイレクトを防ぐ
      window.location.href = "/";
    } catch {
      flash("alert", "ログアウトに失敗しました");
      setLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          ⚙ 設定
        </h1>

        {/* ユーザー情報 */}
        {user && (
          <div className="bg-white rounded-2xl shadow border border-orange-100 p-5 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200 shrink-0 flex items-center justify-center">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt="アバター"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-gray-800 truncate">
                {user.nickname ?? "ゲスト"}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
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

        {/* 利用規約・プライバシー・お問い合わせ */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden mb-4">
          {INFO_ITEMS.map((item) => (
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

        {/* ログアウト */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="block w-full text-center text-red-500 hover:text-red-600 disabled:opacity-50 font-semibold py-3 rounded-2xl border border-red-200 hover:bg-red-50 transition mb-3"
        >
          {loggingOut ? "ログアウト中..." : "ログアウト"}
        </button>

        {/* アカウント削除 */}
        <Link
          href="/account/delete"
          className="block w-full text-center text-gray-400 hover:text-gray-500 text-sm py-2 transition"
        >
          アカウントを削除する
        </Link>
      </div>
    </div>
  );
}
