class Admin::FamiliesController < Admin::BaseController
  before_action :set_family, only: [ :show, :remove_member ]
  def index
    @families = Family
                  .includes(:users)
                  .order(created_at: :desc)
                  .page(params[:page]).per(20)
  end

  def show
    @members = @family.users.order(created_at: :asc)
  end

  def change_admin
    family = Family.find(params[:id])
    new_admin = family.users.find(params[:user_id])

    Family.transaction do
      # 既存管理者をメンバーに格下げ
      family.users.family_admin.update_all(family_role: :family_member)

      # 新しい管理者に昇格
      new_admin.update!(family_role: :family_admin)
    end
    redirect_to admin_family_path(family), notice: "管理者を変更しました。"
  end

  def remove_member
    user = User.find(params[:user_id])

    # family_id を外すだけ（データは保持）
    user.update!(family_id: nil, family_role: :personal)

    redirect_to admin_family_path(@family),
                notice: "#{user.nickname} さんを家族から削除しました。"
  end

  private

  def set_family
    @family = Family.find(params[:id])
  end
end
