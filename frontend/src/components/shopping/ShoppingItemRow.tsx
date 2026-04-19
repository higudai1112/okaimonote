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
    <li className="flex justify-between items-center bg-white px-4 py-4 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition duration-150 ease-in-out w-full">
      {/* 商品情報 */}
      <div className="flex flex-col text-left">
        <span
          className={`text-base font-semibold tracking-tight ${
            item.purchased ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {item.name}
        </span>
        {item.memo && (
          <span
            className={`text-sm flex items-center gap-1 mt-1 ${
              item.purchased ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {item.memo}
          </span>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={item.purchased ? "未購入に戻す" : "購入済みにする"}
          onClick={() => onToggle(item.id, item.purchased)}
          className="text-orange-500 hover:text-orange-600 transition"
        >
          {item.purchased ? "↩" : "✓"}
        </button>
        <button
          type="button"
          aria-label="削除"
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-600 transition"
        >
          ✕
        </button>
      </div>
    </li>
  );
}
