"use client";

import Link from "next/link";

/** 登録リストページ - カテゴリー・お店へのナビゲーション */
export default function ListsPage() {
  return (
    <div className="min-h-screen bg-orange-50 py-10 pb-24 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          登録リスト
        </h1>

        <div className="bg-white rounded-2xl shadow border border-orange-100 overflow-hidden">
          <Link
            href="/categories"
            className="flex justify-between items-center px-5 py-4 border-b border-gray-100 hover:bg-orange-50 transition"
          >
            <span className="text-gray-800 font-semibold">📂 カテゴリーリスト</span>
            <span className="text-gray-400">›</span>
          </Link>
          <Link
            href="/shops"
            className="flex justify-between items-center px-5 py-4 hover:bg-orange-50 transition"
          >
            <span className="text-gray-800 font-semibold">🏪 お店リスト</span>
            <span className="text-gray-400">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
