# okaimonote/frontend - Next.js フロントエンド

## 概要

Rails バックエンド（`../`）の JSON API を利用するフロントエンド。  
Next.js App Router + TailwindCSS + SWR で構築。

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイル | TailwindCSS |
| データ取得 | SWR |
| テスト | Vitest + React Testing Library |
| Lint | ESLint (flat config) |

---

## ディレクトリ構造

```
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── (auth)/              # 認証不要ルート
│   │   │   └── login/page.tsx
│   │   ├── home/page.tsx
│   │   ├── shopping_list/page.tsx
│   │   └── ...
│   ├── components/
│   │   ├── ui/                  # 共通 UI コンポーネント
│   │   └── layout/              # ヘッダー・フッター・ナビ
│   ├── hooks/
│   │   ├── useAuth.ts           # 認証状態 (/api/v1/me)
│   │   └── useShoppingList.ts
│   ├── lib/
│   │   └── api.ts               # fetch ラッパー
│   └── types/
│       └── index.ts             # 型定義
└── tests/
    ├── components/
    └── hooks/
```

---

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動 (port 3001)
npm test             # テスト実行
npm run test:watch   # ウォッチモード
npm run lint         # Lint チェック
npm run lint:fix     # Lint 自動修正
npm run build        # プロダクションビルド
```

---

## API アクセス規約

- `src/lib/api.ts` の `apiFetch` 経由でアクセスする
- `credentials: 'include'` で Devise セッション Cookie を送信する
- `NEXT_PUBLIC_API_URL` で Rails API URL を設定する（`.env.local`）

## 認証規約

- `useAuth` フックで認証状態を確認する
- 未認証時は `/login` にリダイレクトする
- OmniAuth ログインは Rails の `/users/auth/:provider` に遷移させる

---

## テスト方針

TDD（RED → GREEN → REFACTOR）で開発する。

- SWR / fetch は `vi.mock()` でモック化する
- コンポーネントは React Testing Library の `render` + `screen` で検証する
