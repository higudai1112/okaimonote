# Next.jsフロントエンドからのAPIリクエストを許可するCORS設定
# credentials: true を指定することでDeviseのセッションCookieを送受信できる

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境: Next.js dev server
    # 本番環境: 同一ドメイン（nginx でルーティングするため実質不要だが念のため設定）
    origins(
      "http://localhost:3001",
      "http://127.0.0.1:3001",
      "http://localhost:3003",
      "http://127.0.0.1:3003",
      "https://okaimonote.vercel.app",
      ENV.fetch("FRONTEND_URL", "https://www.okaimonote.com")
    )

    resource "/api/*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ],
      credentials: true,
      expose: [ "X-CSRF-Token" ]
  end
end
