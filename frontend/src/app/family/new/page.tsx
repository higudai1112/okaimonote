"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFamily } from "@/hooks/useFamily";

export default function FamilyNewPage() {
  const router = useRouter();
  const { createFamily } = useFamily();
  const [name, setName] = useState("ファミリー");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createFamily(name.trim());
      router.push("/family");
    } catch {
      setError("作成できませんでした。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          👨‍👩‍👧 ファミリーを作成する
        </h1>

        {error && (
          <p className="mb-4 text-center text-red-500 text-sm font-semibold">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              グループ名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            {submitting ? "作成中..." : "作成する"}
          </button>
        </form>

        <Link
          href="/settings"
          className="block text-center text-gray-500 text-sm hover:underline mt-5"
        >
          ← キャンセル
        </Link>
      </div>
    </div>
  );
}
