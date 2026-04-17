# okaimonote - Rails バックエンド

## 概要

おかいもノートは**家族で共有できる価格記録・買い物リスト管理アプリ**。  
Rails がバックエンド（JSON API + iOS 認証）を担当し、`frontend/` 配下の Next.js がフロントエンドを担当するモノレポ構成。

iOSアプリ（`okaimonote-ios/`）は Capacitor WebView ラッパーで、同一ドメインの URL をそのまま表示する。

---

## 技術スタック

| カテゴリ | 技術 |
|---|---|
| 言語 | Ruby 3.x |
| フレームワーク | Rails 8.0 |
| データベース | PostgreSQL |
| 認証 | Devise + OmniAuth（Google / LINE / Apple） |
| 画像保存 | Active Storage + AWS S3 |
| 検索 | Ransack |
| ページネーション | Kaminari |
| セキュリティ | Rack::Attack |
| デプロイ | Kamal（Docker） |
| テスト | RSpec + FactoryBot + Capybara |
| Lint | RuboCop（rubocop-rails-omakase） |
| CI | GitHub Actions |
| フロントエンド | `frontend/`（Next.js） ← 別規約参照 |

---

## ディレクトリ構造

```
okaimonote/
├── app/
│   ├── controllers/
│   │   ├── api/
│   │   │   └── v1/              # JSON API（Next.js フロントエンド向け）
│   │   ├── admin/               # 管理画面
│   │   ├── users/               # Devise カスタムコントローラー
│   │   ├── ios_auth_controller.rb  # iOS 認証（変更禁止）
│   │   └── application_controller.rb
│   ├── models/
│   │   ├── user.rb              # role: general/admin, family_role: personal/family_admin/family_member
│   │   ├── family.rb            # 最大3メンバー
│   │   ├── product.rb           # カテゴリ・ユーザー所有
│   │   ├── price_record.rb      # 商品×店舗×価格×日付
│   │   ├── shopping_list.rb     # ファミリー共有
│   │   ├── shopping_item.rb     # purchased フラグ
│   │   ├── category.rb
│   │   ├── shop.rb
│   │   └── contact.rb
│   └── views/                   # 移行完了後は不要（段階的に削除）
├── config/
│   ├── routes.rb                # /api/v1/ 名前空間を追加していく
│   └── initializers/
│       └── cors.rb              # rack-cors 設定（frontend/ からのアクセス許可）
├── db/
│   ├── schema.rb
│   └── migrate/
├── spec/
│   ├── factories/
│   ├── models/
│   ├── requests/
│   │   └── api/v1/              # API テスト
│   └── system/                  # E2E テスト
└── frontend/                    # Next.js フロントエンド（別規約参照）
```

---

## コーディング方針

- Ruby / Rails の標準規約（RuboCop omakase）に従う
- コメントは **日本語** で記述する
- コントローラーは薄く保つ（ビジネスロジックはモデル・サービスに分離）
- JSON API は `/api/v1/` 名前空間で統一する
- **未認証時は HTTP 401** を返す（フロントがリダイレクト判断）

### iOS 認証フロー（変更禁止）

```
iOS → /users/auth/:provider（state=ios）
    → OmniAuth コールバックで signed token 生成
    → okaimonote://auth/callback?token=TOKEN（ディープリンク）
    → iOS が /ios/session?token=TOKEN にアクセス
    → Devise セッション確立 → /home へリダイレクト
```

`/ios/session`・OmniAuth コールバックの `state=ios` 判定は**絶対に変更・削除しない**。

---

## テスト方針

TDD（RED → GREEN → REFACTOR）で開発する。

```bash
bundle exec rspec                          # 全テスト
bundle exec rspec spec/requests/api/       # API テストのみ
bundle exec rspec spec/models/             # モデルテストのみ
```

---

## 開発コマンド

```bash
# サーバー起動
bin/dev

# DB リセット
bundle exec rails db:reset

# マイグレーション
bundle exec rails db:migrate

# Lint チェック
bundle exec rubocop

# Lint 自動修正
bundle exec rubocop -a
```

---

## GitHub 運用

- リポジトリ: `higudai1112/okaimonote`
- issue ベースで開発（`issue-N-説明` ブランチ）
- PR に `Closes #N` を含める
- **実装前に必ず GitHub Issue を作成し、ユーザー確認を取ること**
