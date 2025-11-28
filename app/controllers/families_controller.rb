class FamiliesController < ApplicationController
  def new
    @family = Family.new
  end

  def create
    @family = Family.new(family_params)
    @family.owner = current_user

    ActiveRecord::Base.transaction do
      @family.save!

      # 作成したユーザーを管理者にする
      current_user.update!(
        family: @family,
        family_role: :family_admin
      )
    end

    redirect_to settings_path, notice: "ファミリーを作成しました！"
  rescue => e
    flash.now[:alert] = "作成できませんでした。もう一度お試しください。"
    render :new, status: :unprocessable_entity
  end

  def show
    # personalが入れないようにする
    if current_user.personal?
      redirect_to settings_path, alert: "ファミリーに所属していません。"
      return
    end
    @family = current_user.family
    @members = @family.users.order(:id)
  end

  def regenerate_invite
    unless current_user.family_admin?
      redirect_to settings_path, alert: "権限がありません。"
      return
    end

    family = current_user.family
    family.regenerate_invite_token!

    redirect_to family_path, notice: "招待リンクを再発行しました。"
  end

  def destroy
    unless current_user.family_admin?
      redirect_to settings_path, alert: "権限がありません。"
      return
    end

    family = current_user.family

    ActiveRecord::Base.transaction do
      # 全員 personal に戻す
      family.users.update_all(family_id: nil, family_role: User.family_roles[:personal])
      # ファミリー本体を削除
      family.destroy!
    end
    redirect_to settings_path, notice: "ファミリーを削除しました。", status: :see_other
  end

  # メンバーから抜ける
  def leave
    user = current_user

    # 管理者は権利譲渡が先
    if user.family_admin?
      redirect_to settings_path, alert: "メンバーに権限を渡してください。"
      return
    end

    user.update!(
      family_id: nil,
      family_role: :personal
    )
    redirect_to settings_path, notice: "ファミリーから脱退しました。"
  end

  private

  def family_params
    params.require(:family).permit(:name)
  end
end
