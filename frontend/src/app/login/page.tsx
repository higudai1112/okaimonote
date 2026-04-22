"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ email, password }),
      });
      router.push("/home");
    } catch {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          おかいもノート
        </h1>

        {/* OmniAuth ログインボタン */}
        <div className="space-y-4 mb-6">
          <a
            href={`${API_BASE}/users/auth/google_oauth2`}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <span>Google でログイン</span>
          </a>
          <a
            href={`${API_BASE}/users/auth/line`}
            className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 rounded-xl py-3 px-4 text-white font-semibold transition shadow-sm"
          >
            <span>LINE でログイン</span>
          </a>
          <a
            href={`${API_BASE}/users/auth/apple`}
            className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-900 rounded-xl py-3 px-4 text-white font-semibold transition shadow-sm"
          >
            <span>Apple でログイン</span>
          </a>
        </div>

        {/* メール/パスワードログイン（fetch で JSON API に送信） */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 text-center bg-red-50 rounded-lg py-2">
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
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
              placeholder="example@mail.com"
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
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            {isSubmitting ? "ログイン中..." : "ログイン"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          アカウントをお持ちでない方は{" "}
          <a
            href={`${API_BASE}/users/sign_up`}
            className="text-orange-500 hover:underline"
          >
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
