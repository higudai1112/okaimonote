class FamilyInvitesController < ApplicationController
  before_action :set_family_by_token, only: [ :show, :join ]

  def show
    # ログイン前ならログイン後に遷移するように誘導
    store_location_for(:user, request.fullpath)
  end

  def join
    # 管理者は別ファミリーに参加できない
    if current_user.family_admin?
      redirect_to settings_path, alert: "管理者は他のファミリーに参加できません。"
      return
    end

    # メンバーも脱退が先に必要
    if current_user.family_member?
      redirect_to settings_path, alert: "すでに別のファミリーに所属しています。"
      return
    end

    # 2人同時に押してもok
    Family.transaction do
      @family.lock!
      # 家族メンバー上限チェック
      if @family.full?
        redirect_to settings_path,
          alert: "このファミリーは参加できる人数の上限(#{Family :MAX_MEMBERS}人)に達しています。"
        return
      end

      # personalはok
      current_user.update!(
        family: @family,
        family_role: :family_member
      )
    end

    redirect_to family_path, notice: "ファミリーに加わりました!"
  rescue => e
    redirect_to settings_path, alert: "参加できませんでした。"
  end

  def enter_code; end

  def apply_code
    raw = params[:invite_token].to_s.strip

    # URL全体添付でもok 最後の部分だけ抽出
    token = raw.split("/").last
    if token.blank?
      redirect_to enter_family_code_path, alert: "招待コードを入力してください。"
      return
    end

    family = Family.find_by(invite_token: token)
    unless family
      redirect_to enter_family_code_path, alert: "招待コードが無効です。"
      return
    end

    # 有効ならURL招待リンクページへ
    redirect_to family_invite_path(token)
  end

  private

  def set_family_by_token
    @family = Family.find_by(invite_token: params[:token])
    redirect_to settings_path, alert: "無効な招待リンクです。" unless @family
  end
end
