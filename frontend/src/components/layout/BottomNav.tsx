"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "ホーム", icon: "🏠" },
  { href: "/products", label: "商品", icon: "📋" },
  { href: "/price_records/new", label: "追加", icon: "➕" },
  { href: "/shopping_list", label: "カート", icon: "🛒" },
  { href: "/settings", label: "設定", icon: "⚙️" },
];

/** BottomNav を非表示にするパス */
const HIDDEN_PATHS = ["/", "/login"];

/** 画面下部固定のナビゲーションバー。Rails 版 shared/_footer.html.erb を再現 */
export function BottomNav() {
  const pathname = usePathname();
  const isHidden = HIDDEN_PATHS.includes(pathname) || pathname.startsWith("/admin");
  // iOS WebView ではネイティブタブバーが代替するため表示しない
  const isIOSWebView =
    typeof navigator !== "undefined" && navigator.userAgent.includes("okaimonote-ios");
  // 非表示パス・iOS WebView では /api/v1/me を呼ばない
  const { user } = useAuth(!isHidden && !isIOSWebView);

  // ランディング・ログイン・admin 配下・iOS WebView では非表示
  if (isHidden || isIOSWebView) {
    return null;
  }

  const items = [
    ...NAV_ITEMS,
    ...(user?.role === "admin" ? [{ href: "/admin", label: "管理", icon: "📊" }] : []),
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-orange-100 shadow-inner flex justify-around items-center py-2 z-50 pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
        const isSettings = item.href === "/settings";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full text-center transition-colors duration-200 ${
              isActive ? "text-orange-500" : "text-gray-400 hover:text-orange-400"
            }`}
          >
            <div className="flex justify-center items-center mb-1 h-6">
              {/* 設定タブかつアバター画像がある場合はプロフィール画像を表示 */}
              {isSettings && user?.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt="アバター"
                  width={32}
                  height={32}
                  className={`w-7 h-7 rounded-full object-cover border-2 ${
                    isActive ? "border-orange-500" : "border-gray-300"
                  }`}
                />
              ) : (
                <span className="text-xl leading-none">{item.icon}</span>
              )}
            </div>
            {!(isSettings && user?.avatar_url) && (
              <span className="text-[11px] font-medium tracking-tight leading-none">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </footer>
  );
}
