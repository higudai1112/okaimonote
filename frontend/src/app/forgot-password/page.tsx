"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

/** パスワードリセットメール送信ページ（認証不要） */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    // iOS Safariのオートフィルは onChange を発火しないため、
    // FormData でフォーム要素から直接値を読み取る
    const formData = new FormData(e.currentTarget);
    const emailValue = (formData.get("email") as string) || email;
    try {
      await apiFetch("/api/v1/passwords", {
        method: "POST",
        body: JSON.stringify({ email: emailValue }),
      });
    } finally {
      // メールが存在しない場合も同じ画面を表示してメール存在確認を防ぐ
      setDone(true);
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 w-full max-w-md text-center">
          <p className="text-4xl mb-4">✉️</p>
          <h2 className="text-xl font-bold text-orange-500 mb-3">メールを送信しました</h2>
          <p className="text-sm text-gray-600 mb-6">
            登録済みのメールアドレスにパスワードリセット用のリンクを送信しました。
            メールをご確認ください。
          </p>
          <Link
            href="/login"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition"
          >
            ログイン画面へ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-2">
          パスワードをお忘れですか？
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          登録済みのメールアドレスを入力してください。
          パスワードリセット用のリンクをお送りします。
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition active:scale-[0.98]"
          >
            {isSubmitting ? "送信中..." : "リセットメールを送る"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-orange-500 hover:underline">
            ログイン画面に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
