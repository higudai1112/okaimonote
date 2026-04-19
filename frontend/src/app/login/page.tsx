"use client";

/** ログインページ。認証処理はすべて Rails（Devise）が担当する */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow border border-orange-100 p-8">
        <h1 className="text-2xl font-bold text-center text-orange-500 mb-8">
          おかいもノート
        </h1>

        {/* OmniAuth ログインボタン */}
        <div className="space-y-4 mb-6">
          <a
            href={`${API_BASE}/users/auth/google_oauth2`}
            className="flex items-center justify-center gap-3 w-full border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-semibold hover:bg-gray-50 transition shadow-sm"
          >
            <span>Google でログイン</span>
          </a>
          <a
            href={`${API_BASE}/users/auth/line`}
            className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 rounded-xl py-3 px-4 text-white font-semibold transition shadow-sm"
          >
            <span>LINE でログイン</span>
          </a>
        </div>

        {/* メール/パスワード ログインは Rails の form に直接送信 */}
        <form
          action={`${API_BASE}/users/sign_in`}
          method="post"
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              type="email"
              name="user[email]"
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              パスワード
            </label>
            <input
              type="password"
              name="user[password]"
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400 outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-full shadow-md transition"
          >
            ログイン
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          アカウントをお持ちでない方は{" "}
          <a
            href={`${API_BASE}/users/sign_up`}
            className="text-orange-500 hover:underline"
          >
            新規登録
          </a>
        </p>
      </div>
    </div>
  );
}
