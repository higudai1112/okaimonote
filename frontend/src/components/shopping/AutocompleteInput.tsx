"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/api";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** 商品名オートコンプリート入力欄 */
export function AutocompleteInput({ value, onChange, placeholder, className }: Props) {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 入力変化時に候補を取得（300ms デバウンス）
  const fetchCandidates = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setCandidates([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await apiFetch<string[]>(
          `/api/v1/shopping_list/autocomplete?q=${encodeURIComponent(q)}`
        );
        setCandidates(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch {
        setCandidates([]);
        setIsOpen(false);
      }
    }, 300);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    fetchCandidates(e.target.value);
  };

  const handleSelect = (name: string) => {
    onChange(name);
    setCandidates([]);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  // キーボード操作（↑↓で選択、Enter で確定、Escape で閉じる）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, candidates.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(candidates[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // コンテナ外タップ・クリックで候補を閉じる（iOS対応で pointerdown を使用）
  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        className={className}
      />
      {isOpen && candidates.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-orange-200 rounded-xl shadow-lg overflow-hidden">
          {candidates.map((name, i) => (
            <li
              key={name}
              onClick={() => handleSelect(name)}
              className={`px-4 py-3 text-sm cursor-pointer transition ${
                i === activeIndex
                  ? "bg-orange-100 text-orange-700 font-semibold"
                  : "hover:bg-orange-50 text-gray-700"
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
