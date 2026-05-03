"use client";

import { useState } from "react";
import { useShoppingList } from "@/hooks/useShoppingList";
import { useFlash } from "@/contexts/FlashContext";
import { ShoppingItemRow } from "@/components/shopping/ShoppingItemRow";
import { AutocompleteInput } from "@/components/shopping/AutocompleteInput";

export default function ShoppingListPage() {
  const { list, isLoading, addItem, togglePurchased, deleteItem, deletePurchased } =
    useShoppingList();
  const { flash } = useFlash();
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      await addItem({ name: name.trim(), memo: memo.trim() || null });
      setName("");
      setMemo("");
    } catch {
      flash("alert", "追加に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggle(id: number, purchased: boolean) {
    try {
      await togglePurchased(id, purchased);
    } catch {
      flash("alert", "更新に失敗しました");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteItem(id);
    } catch {
      flash("alert", "削除に失敗しました");
    }
  }

  async function handleDeletePurchased() {
    if (!window.confirm("購入済みの商品をすべて削除しますか？")) return;
    try {
      await deletePurchased();
    } catch {
      flash("alert", "削除に失敗しました");
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const unpurchased = list?.items.filter((i) => !i.purchased) ?? [];
  const purchased = list?.items.filter((i) => i.purchased) ?? [];

  return (
    <div className="min-h-screen bg-orange-50 py-2 pb-24 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto bg-white rounded-2xl shadow p-6 md:p-8 border border-orange-100">
        {/* タイトル */}
        <h1 className="text-2xl md:text-3xl font-bold text-center text-orange-500 mb-8">
          🛒 買い物リスト
        </h1>

        {/* 追加フォーム */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-8">
          <AutocompleteInput
            value={name}
            onChange={setName}
            placeholder="商品名を入力（例：にんじん）"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm transition"
          />
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={2}
            placeholder="メモ（例：広告の品）"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none shadow-sm transition"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold shadow-sm transition"
          >
            追加
          </button>
        </form>

        {/* 未購入品 */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          🧺 買うもの
        </h2>
        <ul className="space-y-3">
          {unpurchased.length === 0 && (
            <li className="text-gray-400 text-sm text-center py-4">
              まだ商品がありません
            </li>
          )}
          {unpurchased.map((item) => (
            <ShoppingItemRow
              key={item.id}
              item={item}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>

        {/* 購入済み */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              ✅ 購入済み
            </h2>
            {purchased.length > 0 && (
              <button
                type="button"
                onClick={handleDeletePurchased}
                className="text-red-500 hover:text-red-600 text-sm font-medium transition"
              >
                🗑 購入済みを削除
              </button>
            )}
          </div>
          <ul className="space-y-3">
            {purchased.map((item) => (
              <ShoppingItemRow
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
