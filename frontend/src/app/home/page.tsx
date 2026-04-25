"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useHome, type HomeSearchParams } from "@/hooks/useHome";
import { usePriceSummary } from "@/hooks/useHome";
import { apiFetch } from "@/lib/api";
import type { PriceRecord, PriceSummary, PriceRecordFormData } from "@/types";

/** 価格サマリーカード */
function PriceSummaryCard({ summary }: { summary: PriceSummary | undefined }) {
  if (!summary) return null;

  const hasData = summary.min_price !== null || summary.max_price !== null;

  return (
    <div className="bg-white rounded-2xl shadow border border-orange-100 p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-5">
        📈 価格サマリー
        {summary.product_name && (
          <span className="text-base font-normal text-gray-500 ml-2">
            — {summary.product_name}
          </span>
        )}
      </h2>
      {!hasData ? (
        <p className="text-center text-gray-500 py-4">
          まだ価格の登録がありません。
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-orange-50 border border-orange-100 rounded-xl py-3">
              <p className="text-sm text-gray-600">最安値</p>
              <p className="text-lg font-bold text-orange-600 mt-1">
                {summary.min_price != null
                  ? `¥${summary.min_price.toLocaleString()}`
                  : "---"}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl py-3">
              <p className="text-sm text-gray-600">最高値</p>
              <p className="text-lg font-bold text-gray-700 mt-1">
                {summary.max_price != null
                  ? `¥${summary.max_price.toLocaleString()}`
                  : "---"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-between items-center border-t border-orange-100 pt-4">
            <p className="text-sm text-gray-600">⚖ 平均価格</p>
            <p className="text-lg font-semibold text-gray-700">
              {summary.average_price != null
                ? `¥${summary.average_price.toLocaleString()}`
                : "---"}
            </p>
          </div>
          <div className="mt-3 flex justify-between items-center">
            <p className="text-sm text-gray-600">🕐 前回購入</p>
            <p className="text-base text-gray-700 font-medium">
              {summary.last_price != null
                ? `¥${summary.last_price.toLocaleString()}`
                : "---"}
              <span className="text-sm text-gray-500 ml-1">
                ({summary.last_purchased_at ?? "----/--/--"})
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** 価格履歴の1件 */
function PriceRecordCard({
  record,
  onSelect,
}: {
  record: PriceRecord;
  onSelect: (id: number) => void;
}) {
  return (
    <div
      className="bg-white border border-orange-100 shadow-sm hover:shadow-md transition rounded-2xl p-5 cursor-pointer"
      onClick={() => onSelect(record.product_id)}
    >
      <div className="flex justify-between items-start mb-2 gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {record.product_name}
        </h3>
        <p className="text-lg font-bold text-orange-500 whitespace-nowrap">
          ¥{record.price.toLocaleString()}
        </p>
      </div>
      <p className="text-sm text-gray-600 mb-1">
        店舗：{record.shop_name ?? "未登録"} ／ 日付：{record.purchased_at}
      </p>
      {record.memo && (
        <p className="text-xs text-gray-500 mt-1 bg-orange-50 p-2 rounded-md border border-orange-100">
          {record.memo}
        </p>
      )}
    </div>
  );
}

/** 折りたたみ式検索フィルターパネル */
function SearchFilterPanel({
  onSearch,
}: {
  onSearch: (params: HomeSearchParams) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shopId, setShopId] = useState("");

  const { data: formData } = useSWR<PriceRecordFormData>(
    "/api/v1/price_records/form_data",
    (path: string) => apiFetch<PriceRecordFormData>(path),
    { shouldRetryOnError: false }
  );

  const handleSearch = () => {
    onSearch({
      product_name_cont: productName || undefined,
      product_category_id_eq: categoryId || undefined,
      shop_id_eq: shopId || undefined,
    });
  };

  const handleClear = () => {
    setProductName("");
    setCategoryId("");
    setShopId("");
    onSearch({});
  };

  const hasFilter = productName !== "" || categoryId !== "" || shopId !== "";

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen((v) => !v)}
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
        <span className="text-gray-400">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border border-orange-100 rounded-2xl p-4 shadow-sm space-y-3">
          {/* 商品名 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              商品名
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="例：牛乳"
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition placeholder-gray-400"
            />
          </div>

          {/* カテゴリ */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              カテゴリ
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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

          {/* 店舗 */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              店舗
            </label>
            <select
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 px-3 py-2 text-sm outline-none transition bg-white"
            >
              <option value="">すべて</option>
              {formData?.shops.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* ボタン */}
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
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useState<HomeSearchParams>({});
  const { priceRecords, isLoading } = useHome(searchParams);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { summary } = usePriceSummary(selectedProductId);

  // 初回データ取得後、先頭レコードの商品を自動選択してサマリーを表示する
  useEffect(() => {
    if (selectedProductId === null && priceRecords.length > 0) {
      setSelectedProductId(priceRecords[0].product_id);
    }
  }, [priceRecords, selectedProductId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 pb-24 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-orange-500 mb-10">
          🏠 ホーム
        </h1>

        {/* 検索フィルター */}
        <SearchFilterPanel onSearch={setSearchParams} />

        {/* 価格サマリー */}
        <PriceSummaryCard summary={summary} />

        {/* 価格登録履歴 */}
        <h2 className="text-xl font-bold text-gray-700 mt-10 mb-5">
          🕐 価格登録履歴（新着5件）
        </h2>
        <div className="space-y-4">
          {priceRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              該当する価格登録がありません。
            </p>
          ) : (
            priceRecords.map((record) => (
              <PriceRecordCard
                key={record.id}
                record={record}
                onSelect={setSelectedProductId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
