"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** メール/パスワードでログイン */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await apiFetch("/api/v1/sessions", {
        method: "POST",
        body: JSON.stringify({ email, password, remember_me: rememberMe ? "1" : "0" }),
      });
      router.push("/home");
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-6">
          ログイン
        </h2>

        {/* メール/パスワードフォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          {/* ログイン維持・パスワード忘れ */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
              />
              <span>ログインを維持する</span>
            </label>
            <a
              href={`${API_BASE}/users/password/new`}
              className="text-orange-500 hover:underline"
            >
              パスワードをお忘れですか？
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition active:scale-[0.98]"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        {/* 区切り線 */}
        <div className="flex items-center my-6">
          <div className="grow border-t border-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">または</span>
          <div className="grow border-t border-gray-200" />
        </div>

        {/* Google ログイン */}
        <a
          href={`${API_BASE}/users/auth/google_oauth2`}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-full shadow-sm transition active:scale-[0.98]"
        >
          <Image src="/images/google_icon4.png" alt="Google" width={28} height={28} />
          <span>Googleでログイン</span>
        </a>

        {/* LINE ログイン */}
        <a
          href={`${API_BASE}/users/auth/line`}
          className="mt-3 w-full flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold py-2.5 rounded-full shadow-sm transition active:scale-[0.98]"
        >
          <Image src="/images/line_logo.png" alt="LINE" width={32} height={32} />
          <span>LINEでログイン</span>
        </a>

        {/* Apple ログイン */}
        <a
          href={`${API_BASE}/users/auth/apple`}
          className="mt-3 w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-full shadow-sm transition active:scale-[0.98]"
        >
          <Image src="/images/apple_logo.png" alt="Apple" width={20} height={20} />
          <span>Appleでログイン</span>
        </a>

        {/* 新規登録リンク */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-2">まだアカウントをお持ちでない方</p>
          <a
            href={`${API_BASE}/users/sign_up`}
            className="inline-block text-orange-500 font-semibold hover:underline"
          >
            新規登録はこちら
          </a>
        </div>
      </div>
    </div>
  );
}
