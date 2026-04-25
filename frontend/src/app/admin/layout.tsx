"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/users", label: "ユーザー" },
  { href: "/admin/contacts", label: "お問い合わせ" },
  { href: "/admin/families", label: "ファミリー" },
  { href: "/admin/stats", label: "価格統計" },
  { href: "/admin/abnormal_prices", label: "異常価格" },
  { href: "/admin/services", label: "サービス概要" },
  { href: "/admin/settings", label: "設定" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!user?.role || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">権限がありません</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* サイドバー + コンテンツ */}
      <div className="flex">
        <aside className="w-56 min-h-screen bg-gray-900 text-white flex-shrink-0">
          <div className="px-4 py-5 text-lg font-bold border-b border-gray-700">
            管理画面
          </div>
          <nav className="mt-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-4 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-orange-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
