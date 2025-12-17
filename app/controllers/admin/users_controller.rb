class Admin::UsersController < Admin::BaseController
  def index
    @q = User.ransack(params[:q])
    @users = @q.result
               .includes(:products, :price_records, :family)
               .order(created_at: :desc)
               .page(params[:page]).per(20)
  end

  def show
    @user = User.find(params[:id])
    @recent_price_records = @user.price_records.includes(:product, :shop).order(created_at: :desc).limit(5)
    @recent_products = @user.products.order(created_at: :desc).limit(5)
  end

  def update
    @user = User.find(params[:id])
    @user.update(params.require(:user).permit(:admin_memo))
    redirect_to admin_user_path(@user), notice: "更新しました"
  end

  def ban
    @user = User.find(params[:id])
    @user.update(
      status: "banned",
      banned_reason: params[:reason]
    )
    redirect_to admin_user_path(@user), notice: "ユーザーをBANしました。"
  end

  def unban
    @user = User.find(params[:id])
    @user.update(
      status: "active",
      banned_reason: nil
    )
    redirect_to admin_user_path(@user), notice: "BANを解除しました。"
  end
end
