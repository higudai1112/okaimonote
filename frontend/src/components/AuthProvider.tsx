"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/** 認証不要のパス一覧 */
const PUBLIC_PATHS = ["/", "/login", "/guide", "/signup", "/forgot-password", "/reset-password", "/contact", "/terms", "/privacy"];

/** 認証状態を監視し、未認証時はログイン画面へリダイレクトする共通プロバイダー */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // パブリックページでは /api/v1/me を呼ばない（401 エラーを防ぐ）
  const { isAuthenticated, isLoading } = useAuth(!isPublic);

  useEffect(() => {
    if (!isPublic && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, isPublic, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
