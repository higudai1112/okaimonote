"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useProfile } from "@/hooks/useProfile";
import { useFlash } from "@/contexts/FlashContext";
import { apiFetch } from "@/lib/api";

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

  // メールアドレス変更
  const [emailForm, setEmailForm] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailErrors, setEmailErrors] = useState<string[]>([]);
  const [emailSubmitting, setEmailSubmitting] = useState(false);

  // パスワード変更
  const [passwordForm, setPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

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
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    try {
      await uploadAvatar(file);
      flash("notice", "アバター画像を更新しました");
    } catch {
      flash("alert", "画像のアップロードに失敗しました");
      setAvatarPreview(null);
    }
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailErrors([]);
    setEmailSubmitting(true);
    try {
      await apiFetch("/api/v1/profile/email", {
        method: "PATCH",
        body: JSON.stringify({ email: newEmail, current_password: emailPassword }),
      });
      flash("notice", "メールアドレスを更新しました");
      setEmailForm(false);
      setNewEmail("");
      setEmailPassword("");
    } catch (err: unknown) {
      const apiErr = err as { errors?: string[]; message?: string };
      setEmailErrors(apiErr.errors?.length ? apiErr.errors : [apiErr.message ?? "更新に失敗しました"]);
    } finally {
      setEmailSubmitting(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordErrors([]);
    setPasswordSubmitting(true);
    try {
      await apiFetch("/api/v1/profile/password", {
        method: "PATCH",
        body: JSON.stringify({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: passwordConfirmation,
        }),
      });
      flash("notice", "パスワードを変更しました");
      setPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setPasswordConfirmation("");
    } catch (err: unknown) {
      const apiErr = err as { errors?: string[]; message?: string };
      setPasswordErrors(apiErr.errors?.length ? apiErr.errors : [apiErr.message ?? "変更に失敗しました"]);
    } finally {
      setPasswordSubmitting(false);
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
      <div className="max-w-md mx-auto space-y-4">

        {/* プロフィールカード */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-8">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            👤 プロフィール設定
          </h1>

          {/* アバター画像 */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200 mb-3">
              {avatarSrc ? (
                <Image src={avatarSrc} alt="アバター" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">👤</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-orange-500 hover:text-orange-600 font-semibold transition"
            >
              画像を変更
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ニックネーム</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">都道府県</label>
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

        {/* メールアドレス変更 */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">メールアドレス変更</h2>
            {!emailForm && (
              <button
                type="button"
                onClick={() => setEmailForm(true)}
                className="text-sm text-orange-500 hover:underline font-semibold"
              >
                変更する
              </button>
            )}
          </div>
          {emailForm && (
            <form onSubmit={handleEmailChange} className="space-y-4">
              {emailErrors.length > 0 && (
                <ul className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2 space-y-1">
                  {emailErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">新しいメールアドレス</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">現在のパスワード</label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={emailSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2 rounded-full shadow-md transition"
                >
                  {emailSubmitting ? "更新中..." : "更新する"}
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailForm(false); setEmailErrors([]); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-full transition"
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>

        {/* パスワード変更 */}
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">パスワード変更</h2>
            {!passwordForm && (
              <button
                type="button"
                onClick={() => setPasswordForm(true)}
                className="text-sm text-orange-500 hover:underline font-semibold"
              >
                変更する
              </button>
            )}
          </div>
          {passwordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {passwordErrors.length > 0 && (
                <ul className="text-sm text-red-600 bg-red-50 border-l-4 border-red-400 rounded-xl px-3 py-2 space-y-1">
                  {passwordErrors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">現在のパスワード</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">新しいパスワード</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="8文字以上"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">新しいパスワード（確認）</label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2 rounded-full shadow-md transition"
                >
                  {passwordSubmitting ? "変更中..." : "変更する"}
                </button>
                <button
                  type="button"
                  onClick={() => { setPasswordForm(false); setPasswordErrors([]); }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-2 rounded-full transition"
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>

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
