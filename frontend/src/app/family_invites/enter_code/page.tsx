"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default function EnterCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiFetch<{ invite_token: string }>(
        "/api/v1/family_invites/apply_code",
        {
          method: "POST",
          body: JSON.stringify({ invite_token: code.trim() }),
        }
      );
      router.push(`/family_invites/${result.invite_token}`);
    } catch {
      setError("招待コードが無効です。もう一度確認してください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 pb-24 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          招待コードで参加
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          招待リンクまたは招待コードを貼り付けてください
        </p>

        {error && (
          <p className="mb-4 text-center text-red-500 text-sm font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              招待コード / 招待リンク
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="招待コードまたはURLを入力"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !code.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            {submitting ? "確認中..." : "確認する"}
          </button>
        </form>

        <Link
          href="/family"
          className="block text-center text-gray-500 text-sm hover:underline mt-5"
        >
          ← キャンセル
        </Link>
      </div>
    </div>
  );
}
