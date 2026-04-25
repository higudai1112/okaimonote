class Users::RegistrationsController < Devise::RegistrationsController
  def create
    super
  end

  protected

  # パスワード変更後の遷移先
  def after_update_path_for(resource)
    if user_signed_in?
      # Next.js プロフィールページへリダイレクト（Rails ビューではなくフロントエンドへ）
      "#{ENV.fetch('FRONTEND_URL', 'https://www.okaimonote.com')}/profile"
    else
      new_user_session_path    # 未ログイン（メール経由）→ ログイン画面へ
    end
  end
end
