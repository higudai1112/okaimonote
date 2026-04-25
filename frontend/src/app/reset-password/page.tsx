"use client";

import { useState, type FormEvent, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

/** パスワード再設定ページ（メール内リンクから遷移・認証不要）
 *  URL: /reset-password?reset_password_token=xxx
 */
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("reset_password_token") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await apiFetch("/api/v1/passwords", {
        method: "PATCH",
        body: JSON.stringify({
          reset_password_token: token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      router.replace("/login?reset=success");
    } catch (err: unknown) {
      const apiErr = err as { errors?: string[]; message?: string };
      if (apiErr.errors && apiErr.errors.length > 0) {
        setErrors(apiErr.errors);
      } else {
        setErrors([apiErr.message ?? "パスワードの変更に失敗しました。リンクの有効期限が切れている可能性があります。"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-8 w-full max-w-md text-center">
          <p className="text-gray-600 mb-4">無効なリンクです。</p>
          <Link href="/forgot-password" className="text-orange-500 hover:underline text-sm">
            もう一度リセットメールを送る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-6 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-6">
          新しいパスワードを設定
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.length > 0 && (
            <ul className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2 space-y-1">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              新しいパスワード
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
              新しいパスワード（確認）
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
            {isSubmitting ? "変更中..." : "パスワードを変更する"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
