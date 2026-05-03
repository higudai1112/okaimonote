"use client";

import type { ShoppingItem } from "@/types";

type Props = {
  item: ShoppingItem;
  onToggle: (id: number, currentPurchased: boolean) => void;
  onDelete: (id: number) => void;
};

/** ショッピングリストの1行 */
export function ShoppingItemRow({ item, onToggle, onDelete }: Props) {
  return (
    <li className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition duration-150 ease-in-out w-full">
      {/* 左：円形チェックボタン（44px タッチターゲット確保） */}
      <button
        type="button"
        aria-label={item.purchased ? "未購入に戻す" : "購入済みにする"}
        onClick={() => onToggle(item.id, item.purchased)}
        className="shrink-0 w-11 h-11 flex items-center justify-center"
      >
        <span
          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
            item.purchased
              ? "bg-orange-500 border-orange-500 text-white"
              : "border-gray-300 hover:border-orange-400"
          }`}
        >
          {item.purchased && <span className="text-xs leading-none">✓</span>}
        </span>
      </button>

      {/* 中央：商品名・メモ（クリックでトグル） */}
      <button
        type="button"
        onClick={() => onToggle(item.id, item.purchased)}
        className="flex-1 flex flex-col text-left min-w-0 py-1"
      >
        <span
          className={`text-base font-semibold tracking-tight truncate ${
            item.purchased ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {item.name}
        </span>
        {item.memo && (
          <span
            className={`text-sm mt-0.5 truncate ${
              item.purchased ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.memo}
          </span>
        )}
      </button>

      {/* 右：削除ボタン（44px タッチターゲット確保） */}
      <button
        type="button"
        aria-label="削除"
        onClick={() => onDelete(item.id)}
        className="shrink-0 w-11 h-11 flex items-center justify-center text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition"
      >
        <span className="text-base">✕</span>
      </button>
    </li>
  );
}
