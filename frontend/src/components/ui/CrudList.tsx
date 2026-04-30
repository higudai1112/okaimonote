"use client";

import { useState } from "react";

type Item = { id: number; name: string; memo?: string | null };

type Props<T extends Item> = {
  title: string;
  items: T[];
  isLoading: boolean;
  onAdd: (name: string, memo: string) => Promise<void>;
  onUpdate: (id: number, name: string, memo: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

/**
 * カテゴリー・店舗など名前とメモを持つリソースの汎用 CRUD リスト
 */
export function CrudList<T extends Item>({
  title,
  items,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
}: Props<T>) {
  const [name, setName] = useState("");
  const [memo, setMemo] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd(name.trim(), memo.trim());
      setName("");
      setMemo("");
    } catch {
      setError("追加できませんでした。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(id: number) {
    setSubmitting(true);
    setError(null);
    try {
      await onUpdate(id, editName.trim(), editMemo.trim());
      setEditId(null);
    } catch {
      setError("更新できませんでした。もう一度お試しください。");
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
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          {title}
        </h1>

        {/* エラーメッセージ */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {/* 追加フォーム */}
        <form
          onSubmit={handleAdd}
          className="bg-white rounded-2xl shadow border border-orange-100 p-5 mb-6 space-y-3"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
          />
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモ（任意）"
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
          />
          <button
            type="submit"
            disabled={submitting || !name.trim()}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            追加
          </button>
        </form>

        {/* 一覧 */}
        <ul className="space-y-3">
          {items.length === 0 && (
            <li className="text-gray-400 text-sm text-center py-6">
              まだ登録がありません
            </li>
          )}
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-orange-100 px-5 py-4"
            >
              {editId === item.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                  <input
                    type="text"
                    value={editMemo}
                    onChange={(e) => setEditMemo(e.target.value)}
                    placeholder="メモ（任意）"
                    className="w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate(item.id)}
                      disabled={submitting}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-semibold py-1.5 rounded-xl"
                    >
                      保存
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-1.5 rounded-xl"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    {item.memo && (
                      <p className="text-sm text-gray-500 mt-0.5">{item.memo}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEditId(item.id);
                        setEditName(item.name);
                        setEditMemo(item.memo ?? "");
                      }}
                      className="text-gray-400 hover:text-orange-500 transition text-sm"
                    >
                      編集
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="text-red-400 hover:text-red-600 transition text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
