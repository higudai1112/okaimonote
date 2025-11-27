class ShopsController < ApplicationController
  before_action :set_shops, only: [ :edit, :update, :destroy ]

  def index
    users = current_user.family_scope_users
    @shops = Shop.where(user: users).order(:name)
  end

  def new
    @shop = current_user.shops.new
  end

  def create
    @shop = current_user.shops.new(shop_params)
    if @shop.save
      redirect_to shops_path, notice: "お店を登録しました"
    else
      render :new, status: 422
    end
  end

  def edit; end

  def update
    if @shop.update(shop_params)
      redirect_to shops_path, notice: "更新しました"
    else
      render :edit, status: 422
    end
  end

  def destroy
    @shop.destroy!
    redirect_to shops_path, notice: "削除しました", status: :see_other
  end

  private

  def set_shops
    users = current_user.family_scope_users
    @shop = Shop.where(user: users).find(params[:id])
  end

  def shop_params
    params.require(:shop).permit(:name, :memo)
  end
end
