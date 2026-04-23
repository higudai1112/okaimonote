"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const { products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-6 pb-24 px-4 sm:px-6 md:px-10">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-orange-500">🛒 商品管理</h1>
          <Link
            href="/price_records/new"
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md transition"
          >
            + 価格登録
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-10">
            まだ商品がありません
          </p>
        ) : (
          <ul className="space-y-3">
            {products.map((product) => (
              <li
                key={product.id}
                className="bg-white rounded-2xl shadow-sm border border-orange-100 px-5 py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-800">{product.name}</p>
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
      </div>
    </div>
  );
}
