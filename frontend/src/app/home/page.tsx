"use client";

import { useState } from "react";
import { useHome, usePriceSummary } from "@/hooks/useHome";
import type { PriceRecord, PriceSummary } from "@/types";

/** 価格サマリーカード */
function PriceSummaryCard({ summary }: { summary: PriceSummary | undefined }) {
  if (!summary) return null;

  const hasData =
    summary.min_price !== null || summary.max_price !== null;

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

export default function HomePage() {
  const { priceRecords, isLoading } = useHome();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const { summary } = usePriceSummary(selectedProductId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4 sm:px-6 md:px-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-orange-500 mb-10">
          🏠 ホーム
        </h1>

        {/* 価格サマリー */}
        <PriceSummaryCard summary={summary} />

        {/* 価格登録履歴 */}
        <h2 className="text-xl font-bold text-gray-700 mt-10 mb-5">
          🕐 価格登録履歴（新着順）
        </h2>
        <div className="space-y-4">
          {priceRecords.length === 0 ? (
            <p className="text-gray-500 text-center">
              まだ価格の登録がありません。
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
