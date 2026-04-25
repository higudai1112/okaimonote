"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** タイトル画面。認証済みの場合はホームへリダイレクト */
export default function TitlePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3]">
        <p className="text-gray-400">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9F3] text-center px-4 sm:px-6">
      <div className="space-y-8 animate-fade-in">
        {/* ロゴ */}
        <div className="animate-slide-up mb-6">
          <Image
            src="/images/okaimonote_logo.png"
            alt="おかいもノート"
            width={256}
            height={256}
            className="mx-auto w-40 sm:w-52 md:w-64 drop-shadow-sm rounded-2xl"
            priority
          />
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4 mt-8 animate-slide-up">
          <Link
            href="/signup"
            className="w-56 sm:w-60 mx-auto text-white bg-orange-500 hover:bg-orange-600 font-bold py-2.5 rounded-full shadow transition text-center block"
          >
            新規登録
          </Link>
          <Link
            href="/login"
            className="w-56 sm:w-60 mx-auto text-orange-500 bg-white border border-orange-400 hover:bg-orange-50 font-bold py-2.5 rounded-full shadow transition text-center block"
          >
            ログイン
          </Link>
          <Link
            href="/guide"
            className="text-sm text-orange-500 hover:text-orange-600 underline underline-offset-2 transition mt-2"
          >
            使い方ガイドを見る
          </Link>
        </div>

        {/* フッターリンク */}
        <footer className="text-center text-xs text-gray-400 mt-6">
          <a href={`${API_BASE}/terms`} className="mx-2 hover:text-orange-600">
            利用規約
          </a>
          <a href={`${API_BASE}/privacy`} className="mx-2 hover:text-orange-600">
            プライバシーポリシー
          </a>
          <a href={`${API_BASE}/contact`} className="mx-2 hover:text-orange-600">
            お問い合わせ
          </a>
        </footer>
      </div>
    </div>
  );
}
