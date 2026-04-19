"use client";

import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

export default function ProfilePage() {
  const { user, isLoading, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setNickname(user?.nickname ?? "");
    setPrefecture(user?.prefecture ?? "");
    setEditing(true);
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({
        nickname: nickname.trim(),
        prefecture: prefecture || null,
      });
      setEditing(false);
      setSaved(true);
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
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          👤 プロフィール設定
        </h1>

        {saved && (
          <p className="mb-4 text-center text-green-600 text-sm font-semibold">
            プロフィールを更新しました
          </p>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ニックネーム
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                都道府県
              </label>
              <select
                value={prefecture}
                onChange={(e) => setPrefecture(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
              >
                <option value="">未設定</option>
                {PREFECTURES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-full shadow-md transition"
              >
                保存
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2.5 rounded-full transition"
              >
                キャンセル
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-5">
            <Row label="ニックネーム" value={user?.nickname ?? "未設定"} />
            <Row label="メールアドレス" value={user?.email ?? ""} />
            <Row label="都道府県" value={user?.prefecture ?? "未設定"} />
            <button
              type="button"
              onClick={startEdit}
              className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-full shadow-md transition"
            >
              編集する
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}
