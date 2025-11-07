class Rack::Attack
  # --- 基本設定（簡易版：Rails.cache のまま使用） ---
  # ※ 将来 Render で複数インスタンスになるなら Redis(強いver.) に切り替える

  # 全リクエスト制限（300回 / 5分）
  throttle('req/ip', limit: 300, period: 5.minutes) do |req|
    req.ip unless req.path.start_with?('/assets')
  end

  # ログイン（IPベース）制限
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    req.ip if req.path == '/users/sign_in' && req.post?
  end

  # ログイン（メールアドレスベース）制限
  throttle('logins/email', limit: 5, period: 20.seconds) do |req|
    if req.path == '/users/sign_in' && req.post?
      email = req.params.dig('user', 'email')
      email.to_s.downcase.gsub(/\s+/, '').presence
    end
  end

  # throttled レスポンス（簡易版）
  self.throttled_response = lambda do |_env|
    [429, { 'Content-Type' => 'application/json' }, [{ error: 'Too many requests' }.to_json]]
  end
end
