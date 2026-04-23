"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { useFlash } from "@/contexts/FlashContext";

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
  const { user, isLoading, updateProfile, uploadAvatar } = useProfile();
  const { flash } = useFlash();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [prefecture, setPrefecture] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setNickname(user?.nickname ?? "");
    setPrefecture(user?.prefecture ?? "");
    setAvatarPreview(null);
    setEditing(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProfile({ nickname: nickname.trim(), prefecture: prefecture || null });
      setEditing(false);
      flash("notice", "プロフィールを更新しました");
    } catch {
      flash("alert", "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // リアルタイムプレビュー
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    // アップロード
    try {
      await uploadAvatar(file);
      flash("notice", "アバター画像を更新しました");
    } catch {
      flash("alert", "画像のアップロードに失敗しました");
      setAvatarPreview(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  const avatarSrc = avatarPreview ?? user?.avatar_url;

  return (
    <div className="min-h-screen bg-orange-50 py-10 pb-24 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          👤 プロフィール設定
        </h1>

        {/* アバター画像 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200 mb-3">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="アバター"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl">
                👤
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition"
          >
            画像を変更
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

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
