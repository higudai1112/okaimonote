"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useProducts, type ProductSearchParams } from "@/hooks/useProducts";
import { apiFetch } from "@/lib/api";
import type { PriceRecordFormData } from "@/types";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useState<ProductSearchParams>({});
  const [nameInput, setNameInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products, meta, isLoading } = useProducts(page, searchParams);

  const { data: formData } = useSWR<PriceRecordFormData>(
    "/api/v1/price_records/form_data",
    (path: string) => apiFetch<PriceRecordFormData>(path),
    { shouldRetryOnError: false }
  );

  const handleSearch = () => {
    setPage(1);
    setSearchParams({
      name_cont: nameInput || undefined,
      category_id_eq: categoryInput || undefined,
    });
  };

  const handleClear = () => {
    setNameInput("");
    setCategoryInput("");
    setPage(1);
    setSearchParams({});
  };

  const hasFilter = nameInput !== "" || categoryInput !== "";

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-6 pb-24 px-4 sm:px-6 md:px-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-orange-500 mb-6 text-center">
          🛒 商品管理
        </h1>

        {/* 検索フィルター */}
        <div className="mb-6">
          <button
            onClick={() => setIsFilterOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-white border border-orange-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-orange-50 transition"
          >
            <span className="flex items-center gap-2">
              🔍 検索・絞り込み
              {hasFilter && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                  適用中
                </span>
              )}
            </span>
            <span className="text-gray-400">{isFilterOpen ? "▲" : "▼"}</span>
          </button>

          {isFilterOpen && (
            <div className="mt-2 bg-white border border-orange-100 rounded-2xl p-4 shadow-sm space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  商品名
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="例：牛乳"
                  className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  カテゴリ
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition bg-white"
                >
                  <option value="">すべて</option>
                  {formData?.categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSearch}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-full text-sm transition"
                >
                  検索
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-full text-sm transition"
                >
                  クリア
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 件数 */}
        {meta && (
          <p className="text-xs text-gray-500 mb-3 text-right">
            全 {meta.total} 件
          </p>
        )}

        {/* 商品一覧 */}
        {products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">
            商品が見つかりません
          </p>
        ) : (
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-orange-100 px-4 py-3 flex items-center gap-4"
              >
                {/* 商品画像 */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-orange-50 border border-orange-100 shrink-0 flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">🛍</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {product.name}
                  </p>
                  {product.category && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {product.category.name}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* ページネーション */}
        {meta && meta.total_pages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-orange-200 text-orange-500 disabled:opacity-40 hover:bg-orange-50 transition"
            >
              ← 前へ
            </button>
            <span className="text-sm text-gray-600">
              {page} / {meta.total_pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, meta.total_pages))}
              disabled={page === meta.total_pages}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-white border border-orange-200 text-orange-500 disabled:opacity-40 hover:bg-orange-50 transition"
            >
              次へ →
            </button>
          </div>
        )}
      </div>

      {/* FAB: 価格登録ボタン */}
      <Link
        href="/price_records/new"
        className="fixed bottom-20 right-5 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white text-2xl rounded-full shadow-lg flex items-center justify-center transition active:scale-95 z-40"
        aria-label="価格登録"
      >
        ＋
      </Link>
    </div>
  );
}
