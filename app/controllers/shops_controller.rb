class ShopsController < ApplicationController
  before_action :set_shops, only: [ :edit, :update, :destroy ]

  def index
    @q = Shop.ransack(params[:id])
    @shops = @q.result.order(created_at: :desc)
  end

  def new
    @shop Shop.new
  end

  def create
    @shop = Shop.new(shop_params)
    if @shop.save
      redirect_to shops_path, notice: "お店を登録しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @shop.update(shop_params)
      redirect_to shops_path, notice: "更新しました"
    else
      render :edit, status: :processable_entity
    end
  end

  def destroy
    @shop.destroy!
    redirect_to shops_path, notice: "削除しました", status: :see_other
  end

  private

  def set_shops
    @shop = Shop.find(params[:id])
  end

  def shop_params
    params.require(:shop).permit(:name, :memo)
  end
end
