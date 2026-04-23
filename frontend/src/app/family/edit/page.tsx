"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFamily } from "@/hooks/useFamily";

export default function FamilyEditPage() {
  const router = useRouter();
  const { family, isLoading, updateFamily } = useFamily();
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (family) setName(family.name);
  }, [family]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await updateFamily(name.trim());
      router.push("/family");
    } catch {
      setError("更新できませんでした。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 pb-24 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          グループ名を編集
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

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
            >
              {submitting ? "保存中..." : "保存"}
            </button>
            <Link
              href="/family"
              className="flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-full transition"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
