require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # lib配下の不要な読み込みを除外（必要なら調整）
    config.autoload_lib(ignore: %w[assets tasks])

    # --- 🌏 タイムゾーンとロケール設定 ---
    config.time_zone = "Asia/Tokyo"
    config.active_record.default_timezone = :local
    config.i18n.default_locale = :ja

    # --- ⚙️ ジェネレーター設定（不要ファイルの生成を防ぐ）---
    config.generators do |g|
      g.skip_routes true         # ルーティング自動追加を無効化
      g.helper false             # helperファイルの生成を無効化
      g.assets false             # CSS/JS自動生成を無効化
      g.view_specs false         # ビューテストファイルを生成しない（RSpec使用時）
      g.helper_specs false       # helperテストファイルも不要
      g.test_framework nil       # テストを使わない or 手動で設定したい場合
    end

    # --- 🖼 ActiveStorageで画像操作するなら必須 ---
    config.active_storage.variant_processor = :mini_magick

    # --- 🚀 RenderやHerokuでのデプロイ対策（プリコンパイル時のエラー防止）---
    config.assets.initialize_on_precompile = false

    # --- 💾 Cableなどで複数DB構成を使うときの自動切り替え（必要であれば有効化）---
    # config.active_record.database_selector = { delay: 2.seconds }
    # config.active_record.database_resolver = ActiveRecord::Middleware::DatabaseSelector::Resolver
    # config.active_record.database_resolver_context = ActiveRecord::Middleware::DatabaseSelector::Resolver::Session

    # --- 📂 カスタムローダーを追加したい場合（例：services/以下など）---
    # config.eager_load_paths << Rails.root.join("app", "services")
  end
end
