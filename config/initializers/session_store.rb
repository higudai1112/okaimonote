# 本番環境では .okaimonote.com 配下のサブドメイン間でセッション Cookie を共有する
# www.okaimonote.com（Next.js）と api.okaimonote.com（Rails）が同一ルートドメインのため
# domain: '.okaimonote.com' を設定することでブラウザが Cookie を両方に送信する

if Rails.env.production?
  Rails.application.config.session_store :cookie_store,
    key: "_okaimonote_session",
    domain: ".okaimonote.com",
    secure: true,
    same_site: :lax
end
