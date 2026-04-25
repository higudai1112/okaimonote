"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

/** 新規会員登録ページ（認証不要） */
export default function SignupPage() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await apiFetch("/api/v1/registrations", {
        method: "POST",
        body: JSON.stringify({ nickname, email, password, password_confirmation: passwordConfirmation }),
      });
      setDone(true);
    } catch (err: unknown) {
      const apiErr = err as { errors?: string[]; message?: string };
      if (apiErr.errors && apiErr.errors.length > 0) {
        setErrors(apiErr.errors);
      } else {
        setErrors([apiErr.message ?? "登録に失敗しました。もう一度お試しください。"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 w-full max-w-md text-center">
          <p className="text-4xl mb-4">✉️</p>
          <h2 className="text-xl font-bold text-orange-500 mb-3">確認メールを送信しました</h2>
          <p className="text-sm text-gray-600 mb-6">
            ご登録のメールアドレスに確認メールを送信しました。
            メール内のリンクをクリックして登録を完了してください。
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
        {/* ロゴ */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/okaimonote_logo.png"
            alt="おかいもノート"
            width={80}
            height={80}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-6">
          新規登録
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <ul className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2 space-y-1">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
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
              maxLength={20}
              placeholder="おかいも太郎"
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
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
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
              autoComplete="new-password"
              placeholder="8文字以上"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              パスワード（確認）
            </label>
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="もう一度入力してください"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition active:scale-[0.98]"
          >
            {isSubmitting ? "登録中..." : "登録する"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-1">すでにアカウントをお持ちの方</p>
          <Link href="/login" className="text-orange-500 font-semibold hover:underline text-sm">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
