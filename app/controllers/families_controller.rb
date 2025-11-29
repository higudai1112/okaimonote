class FamiliesController < ApplicationController
  def new
    @family = Family.new
  end

  def create
    @family = Family.new(family_params)
    @family.owner = current_user
    @family.base_user = current_user

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

  # 管理者権限の譲渡
  def transfer_owner
    # 1. 管理者のみ実行可能
    unless current_user.family_admin? && current_user.family.present?
      redirect_to settings_path, alert: "権限がありません。"
      return
    end

    family = current_user.family

    # 2. 譲渡先のメンバーを取得
    new_owner = family.users.find_by(id: params[:member_id])

    unless new_owner
      redirect_to family_path, alert: "メンバーが見つかりません。"
      return
    end

    # 自分自身には渡せない
    if new_owner == current_user
      redirect_to family_path, alert: "自分自身に権限を譲渡することはできません。"
      return
    end

    # すでに管理者なら譲渡できない
    if new_owner.family_admin?
      redirect_to family_path, alert: "すでに管理者です。"
      return
    end

    ActiveRecord::Base.transaction do
      # 3. family.owner を入れ替える
      family.update!(owner: new_owner)

      # 4. ロールを変更
      current_user.update!(family_role: :family_member)
      new_owner.update!(family_role: :family_admin)
    end

    redirect_to family_path, notice: "#{new_owner.nickname}さんに権限を譲渡しました。"

  rescue => e
    Rails.logger.error("[Family transfer_owner] #{e.class}: #{e.message}")
    redirect_to family_path, alert: "権限を譲渡できませんでした。もう一度お試しください。"
  end

  private

  def family_params
    params.require(:family).permit(:name)
  end
end
