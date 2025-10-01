class ApplicationController < ActionController::Base
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern
  before_action :authenticate_user!, unless: :devise_controller?
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def after_sign_in_path_for(resource)
    home_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end

  # ログイン不要の公開ページを許可する
  def devise_controller_or_public_page?
    devise_controller? || public_page?
  end

  # タイトルページを公開ページとして許可
  def public_page?
    controller_name == "pages" && action_name == "title"
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :nickname, :avatar ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :nickname, :avatar ])
  end
end
