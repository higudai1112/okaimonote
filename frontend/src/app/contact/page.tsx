"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

/** お問い合わせページ（認証不要） */
export default function ContactPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await apiFetch("/api/v1/contacts", {
        method: "POST",
        body: JSON.stringify({ nickname, email, message }),
      });
      setDone(true);
    } catch {
      setError("送信に失敗しました。入力内容をご確認ください。");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 w-full max-w-md text-center">
          <p className="text-4xl mb-4">✉️</p>
          <h2 className="text-xl font-bold text-orange-500 mb-3">お問い合わせを送信しました</h2>
          <p className="text-sm text-gray-600 mb-6">
            お問い合わせありがとうございます。内容を確認の上、ご連絡いたします。
          </p>
          <Link
            href="/settings"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition"
          >
            設定に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-6">
          お問い合わせ
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ニックネーム
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="例：おかいも太郎"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="例：sample@email.com"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              お問い合わせ内容
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
              placeholder="内容を入力してください"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition active:scale-[0.98]"
          >
            {isSubmitting ? "送信中..." : "送信する"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/settings" className="text-sm text-orange-500 hover:underline">
            設定に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
