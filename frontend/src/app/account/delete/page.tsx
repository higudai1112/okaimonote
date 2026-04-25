"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useFlash } from "@/contexts/FlashContext";

/** アカウント削除確認ページ */
export default function AccountDeletePage() {
  const router = useRouter();
  const { flash } = useFlash();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  async function handleDelete() {
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await apiFetch("/api/v1/account", { method: "DELETE" });
      flash("notice", "アカウントを削除しました。ご利用ありがとうございました。");
      router.replace("/login");
    } catch {
      flash("alert", "削除に失敗しました。もう一度お試しください。");
      setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center text-red-500 mb-8">
          ⚠ アカウント削除
        </h1>

        <div className="bg-white rounded-2xl shadow border border-red-100 p-6 space-y-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            アカウントを削除すると、登録した
            <span className="font-semibold text-gray-900">商品・価格履歴・家族情報</span>
            などのデータはすべて削除され、元に戻すことはできません。
          </p>

          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-semibold text-red-600">おかいもノートのアカウントを削除</span>
            してもよろしいですか？
          </p>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded accent-red-500"
            />
            上記の内容を理解した上で削除します
          </label>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!confirmed || isDeleting}
              className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-md transition active:scale-[0.98]"
            >
              {isDeleting ? "削除中..." : "削除する"}
            </button>

            <Link
              href="/settings"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-full transition"
            >
              キャンセルして設定に戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
