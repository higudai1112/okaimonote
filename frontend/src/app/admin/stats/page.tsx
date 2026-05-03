"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import useSWR from "swr";
import { apiFetch } from "@/lib/api";

type StatsData = {
  count: number;
  min_price: number | null;
  max_price: number | null;
  avg_price: number | null;
  top_products_by_records: { name: string; count: number }[];
  top_shops: { name: string; count: number }[];
};

/** テキスト入力 + オートコンプリートドロップダウン */
function AutocompleteInput({
  value,
  onChange,
  placeholder,
  autocompleteUrl,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autocompleteUrl: (q: string) => string;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 入力変化時にデバウンスして API を呼ぶ
  const handleChange = useCallback(
    (v: string) => {
      onChange(v);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!v.trim()) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      timerRef.current = setTimeout(async () => {
        try {
          const res = await apiFetch<string[]>(autocompleteUrl(v));
          setSuggestions(res);
          setOpen(res.length > 0);
        } catch {
          setSuggestions([]);
          setOpen(false);
        }
      }, 300);
    },
    [onChange, autocompleteUrl]
  );

  // ラッパー外クリックでドロップダウンを閉じる
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none w-full"
      />
      {open && (
        <ul className="absolute z-10 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s}
              onMouseDown={() => {
                onChange(s);
                setOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-orange-50"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AdminStatsPage() {
  const [keyword, setKeyword] = useState("");
  const [shopName, setShopName] = useState("");
  const [pref, setPref] = useState("");
  const [submitted, setSubmitted] = useState({ keyword: "", shopName: "", pref: "" });

  const params = new URLSearchParams();
  if (submitted.keyword) params.set("keyword", submitted.keyword);
  if (submitted.shopName) params.set("shop_name", submitted.shopName);
  if (submitted.pref) params.set("pref", submitted.pref);

  const { data, isLoading } = useSWR<StatsData>(
    `/api/v1/admin/stats?${params.toString()}`,
    (path: string) => apiFetch<StatsData>(path)
  );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted({ keyword, shopName, pref });
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">価格統計</h1>

      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow border border-orange-100 p-5 flex flex-wrap gap-3">
        <AutocompleteInput
          value={keyword}
          onChange={setKeyword}
          placeholder="商品名"
          autocompleteUrl={(q) => `/api/v1/admin/stats/autocomplete_products?q=${encodeURIComponent(q)}`}
        />
        <AutocompleteInput
          value={shopName}
          onChange={setShopName}
          placeholder="店舗名"
          autocompleteUrl={(q) => `/api/v1/admin/stats/autocomplete_shops?q=${encodeURIComponent(q)}`}
        />
        <input
          type="text"
          value={pref}
          onChange={(e) => setPref(e.target.value)}
          placeholder="都道府県"
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          検索
        </button>
      </form>

      {isLoading ? (
        <p className="text-gray-500 text-sm">読み込み中...</p>
      ) : data ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "対象件数", value: data.count.toLocaleString() + " 件" },
              { label: "最安値", value: data.min_price != null ? `¥${data.min_price.toLocaleString()}` : "—" },
              { label: "最高値", value: data.max_price != null ? `¥${data.max_price.toLocaleString()}` : "—" },
              { label: "平均価格", value: data.avg_price != null ? `¥${data.avg_price.toLocaleString()}` : "—" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl shadow p-4 border border-orange-100">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-xl font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
              <p className="font-semibold text-gray-700 text-sm mb-3">価格記録の多い商品 TOP5</p>
              <ol className="space-y-1.5 text-sm">
                {data.top_products_by_records.map((p, i) => (
                  <li key={p.name} className="flex justify-between">
                    <span>{i + 1}. {p.name}</span><span className="text-gray-400">{p.count} 件</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="bg-white rounded-xl shadow border border-orange-100 p-5">
              <p className="font-semibold text-gray-700 text-sm mb-3">登録の多い店舗 TOP5</p>
              <ol className="space-y-1.5 text-sm">
                {data.top_shops.map((s, i) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{i + 1}. {s.name}</span><span className="text-gray-400">{s.count} 件</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
