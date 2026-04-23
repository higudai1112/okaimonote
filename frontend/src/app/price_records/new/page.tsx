"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePriceRecordForm } from "@/hooks/usePriceRecordForm";
import { useFlash } from "@/contexts/FlashContext";

export default function NewPriceRecordPage() {
  const router = useRouter();
  const { formData, isLoading, createPriceRecord } = usePriceRecordForm();
  const { flash } = useFlash();

  const [productId, setProductId] = useState<number | null>(null);
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [shopId, setShopId] = useState<number | null>(null);
  const [price, setPrice] = useState("");
  const [purchasedAt, setPurchasedAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [memo, setMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // 商品名入力で既存商品を選択する
  const matchedProduct = formData?.products.find(
    (p) => p.name === productName.trim()
  );
  const isNewProduct = productName.trim() !== "" && !matchedProduct;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);

    if (!price || Number(price) <= 0) {
      setErrors(["価格を入力してください"]);
      return;
    }

    if (!productId && !matchedProduct && !productName.trim()) {
      setErrors(["商品名を入力してください"]);
      return;
    }

    if (isNewProduct && !categoryId) {
      setErrors(["新規商品の場合はカテゴリーを選択してください"]);
      return;
    }

    setSubmitting(true);
    try {
      const resolvedProductId = productId ?? matchedProduct?.id;
      await createPriceRecord({
        ...(resolvedProductId
          ? { product_id: resolvedProductId }
          : { product_name: productName.trim(), category_id: categoryId! }),
        shop_id: shopId,
        price: Number(price),
        purchased_at: purchasedAt,
        memo: memo.trim() || null,
      });
      flash("notice", "価格を登録しました");
      router.push("/home");
    } catch {
      flash("alert", "登録に失敗しました");
      setErrors(["登録に失敗しました"]);
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-6 pb-24 px-4 sm:px-6 md:px-10">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6 sm:p-8 border border-orange-100">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-orange-500 mb-8">
          🏷 価格登録
        </h1>

        {errors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {errors.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 商品名 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              商品名
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                setProductId(null);
              }}
              placeholder="例：牛乳"
              list="product-list"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
            <datalist id="product-list">
              {formData?.products.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>

          {/* カテゴリー（新規商品のときのみ表示） */}
          {isNewProduct && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                カテゴリー（新規商品）
              </label>
              <select
                value={categoryId ?? ""}
                onChange={(e) =>
                  setCategoryId(e.target.value ? Number(e.target.value) : null)
                }
                className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
              >
                <option value="">選択してください</option>
                {formData?.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 店舗 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              店舗
            </label>
            <select
              value={shopId ?? ""}
              onChange={(e) =>
                setShopId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            >
              <option value="">選択してください</option>
              {formData?.shops.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 価格 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              価格
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min={1}
              step={1}
              placeholder="例：198"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          {/* 日付 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              日付
            </label>
            <input
              type="date"
              value={purchasedAt}
              onChange={(e) => setPurchasedAt(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          {/* メモ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              メモ
            </label>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              placeholder="例：広告の品、まとめ買いなど"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  );
}
