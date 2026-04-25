"use client";

import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type AbnormalRecord = {
  id: number;
  price: number;
  avg_price: number | null;
  deviation: number | null;
  product_name: string | null;
  shop_name: string | null;
  user_nickname: string | null;
  purchased_at: string;
};

export default function AdminAbnormalPricesPage() {
  const { data, isLoading } = useSWR<AbnormalRecord[]>(
    "/api/v1/admin/abnormal_prices",
    (path: string) => apiFetch<AbnormalRecord[]>(path)
  );

  if (isLoading) return <p className="text-gray-500">読み込み中...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">異常価格</h1>
      <p className="text-sm text-gray-500">統計的に外れ値とみなされる価格記録の一覧です。</p>

      {!data || data.length === 0 ? (
        <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center text-gray-500 text-sm">
          異常価格は検出されていません
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">商品名</th>
                <th className="px-4 py-3 text-left">価格</th>
                <th className="px-4 py-3 text-left">店舗</th>
                <th className="px-4 py-3 text-left">ユーザー</th>
                <th className="px-4 py-3 text-left">日付</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{r.product_name}</td>
                  <td className="px-4 py-3 text-red-600 font-semibold">¥{r.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{r.shop_name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{r.user_nickname ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">{r.purchased_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
