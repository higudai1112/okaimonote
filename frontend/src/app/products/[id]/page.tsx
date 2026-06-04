"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";
import { useConfirm } from "@/hooks/useConfirm";
import type { ProductDetail, ProductPriceRecord } from "@/types";

/** 価格履歴の1件を表示・編集するコンポーネント */
function PriceRecordRow({
  record,
  shops,
  onUpdated,
  onDeleted,
}: {
  record: ProductPriceRecord;
  shops: { id: number; name: string }[];
  onUpdated: () => void;
  onDeleted: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(String(record.price));
  const [memo, setMemo] = useState(record.memo ?? "");
  const [shopId, setShopId] = useState(record.shop_id ? String(record.shop_id) : "");
  const [purchasedAt, setPurchasedAt] = useState(
    record.purchased_at ? record.purchased_at.slice(0, 10) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { confirm, ConfirmModalElement } = useConfirm();

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/v1/price_records/${record.public_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          price_record: {
            price: Number(price),
            memo: memo || null,
            shop_id: shopId ? Number(shopId) : null,
            purchased_at: purchasedAt,
          },
        }),
      });
      setIsEditing(false);
      onUpdated();
    } catch {
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!await confirm({ message: "この価格記録を削除しますか？", confirmLabel: "削除する", variant: "danger" })) return;
    try {
      await apiFetch(`/api/v1/price_records/${record.public_id}`, { method: "DELETE" });
      onDeleted();
    } catch {
      setError("削除に失敗しました");
    }
  }

  const dateLabel = record.purchased_at
    ? new Date(record.purchased_at).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })
    : "日付不明";

  if (isEditing) {
    return (
      <>
        {ConfirmModalElement}
        <li className="bg-white rounded-2xl border border-orange-200 px-4 py-4 shadow-sm space-y-3">
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">価格（円）</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">購入日</label>
              <input
                type="date"
                value={purchasedAt}
                onChange={(e) => setPurchasedAt(e.target.value)}
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">お店</label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition bg-white"
            >
              <option value="">未設定</option>
              {shops.map((s) => (
                <option key={s.id} value={String(s.id)}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">メモ</label>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="任意"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-full text-sm transition disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
            <button
              onClick={() => { setIsEditing(false); setError(null); }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-full text-sm transition"
            >
              キャンセル
            </button>
          </div>
        </li>
      </>
    );
  }

  return (
    <>
      {ConfirmModalElement}
      <li className="bg-white rounded-2xl border border-orange-100 px-4 py-3 shadow-sm">
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-orange-600">
                ¥{record.price.toLocaleString()}
              </span>
              {record.shop_name && (
                <span className="text-sm text-gray-500 truncate">{record.shop_name}</span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{dateLabel}</p>
            {record.memo && (
              <p className="text-xs text-gray-500 mt-0.5 truncate">{record.memo}</p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs text-orange-500 font-semibold border border-orange-300 rounded-full px-3 py-1 hover:bg-orange-50 transition"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="text-xs text-red-400 font-semibold border border-red-200 rounded-full px-3 py-1 hover:bg-red-50 transition"
            >
              削除
            </button>
          </div>
        </div>
      </li>
    </>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [page, setPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const { data, isLoading, mutate } = useSWR<ProductDetail>(
    `/api/v1/products/${id}?page=${page}`,
    (path: string) => apiFetch<ProductDetail>(path),
    { shouldRetryOnError: false }
  );

  // フォームデータ（カテゴリ・店舗一覧）をキャッシュ済みのエンドポイントから取得
  const { data: formData } = useSWR<{ shops: { id: number; name: string }[]; categories: { id: number; name: string }[] }>(
    "/api/v1/price_records/form_data",
    (path: string) => apiFetch(path),
    { shouldRetryOnError: false }
  );

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const { product, price_records, meta } = data;

  function openEdit() {
    setEditName(product.name);
    setEditCategoryId(product.category ? String(product.category.id) : "");
    setEditMemo(product.memo ?? "");
    setEditError(null);
    setIsEditing(true);
  }

  async function handleSaveProduct() {
    setSaving(true);
    setEditError(null);
    try {
      await apiFetch(`/api/v1/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          product: {
            name: editName,
            category_id: editCategoryId ? Number(editCategoryId) : null,
            memo: editMemo || null,
          },
        }),
      });
      setIsEditing(false);
      mutate();
    } catch {
      setEditError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-6 pb-24 px-4 sm:px-6 md:px-10">
      <div className="max-w-xl mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/products" className="text-gray-400 hover:text-gray-600 text-sm">
            ← 商品一覧
          </Link>
          <h1 className="text-xl font-bold text-orange-500 flex-1 truncate">
            {product.name}
          </h1>
        </div>

        {/* 商品情報カード */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          {!isEditing ? (
            <>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-orange-50 border border-orange-100 shrink-0 flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🛍</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-800">{product.name}</p>
                  {product.category && (
                    <p className="text-sm text-gray-500 mt-0.5">{product.category.name}</p>
                  )}
                  {product.memo && (
                    <p className="text-sm text-gray-400 mt-1">{product.memo}</p>
                  )}
                </div>
              </div>
              <button
                onClick={openEdit}
                className="mt-4 w-full border border-orange-300 text-orange-500 font-semibold rounded-full py-2 text-sm hover:bg-orange-50 transition"
              >
                商品情報を編集
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <h2 className="font-bold text-gray-700 text-sm">商品情報を編集</h2>
              {editError && <p className="text-red-500 text-xs">{editError}</p>}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">商品名</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">カテゴリ</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition bg-white"
                >
                  <option value="">未設定</option>
                  {formData?.categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">メモ</label>
                <input
                  type="text"
                  value={editMemo}
                  onChange={(e) => setEditMemo(e.target.value)}
                  placeholder="任意"
                  className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveProduct}
                  disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-full text-sm transition disabled:opacity-50"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditError(null); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-full text-sm transition"
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 価格履歴セクション */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-700">
              価格履歴
              {meta.total > 0 && (
                <span className="ml-2 text-xs font-normal text-gray-400">全 {meta.total} 件</span>
              )}
            </h2>
            <Link
              href="/price_records/new"
              className="text-sm text-orange-500 font-semibold border border-orange-300 rounded-full px-4 py-1.5 hover:bg-orange-50 transition"
            >
              ＋ 価格を登録
            </Link>
          </div>

          {price_records.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8 bg-white rounded-2xl border border-orange-100">
              まだ価格が登録されていません
            </p>
          ) : (
            <ul className="space-y-2">
              {price_records.map((record) => (
                <PriceRecordRow
                  key={record.id}
                  record={record}
                  shops={formData?.shops ?? []}
                  onUpdated={() => mutate()}
                  onDeleted={() => mutate()}
                />
              ))}
            </ul>
          )}

          {/* ページネーション */}
          {meta.total_pages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
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
        </section>

      </div>
    </div>
  );
}
