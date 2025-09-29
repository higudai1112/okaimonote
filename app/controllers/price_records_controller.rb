class PriceRecordsController < ApplicationController
  before_action :set_price_record, only: [:edit, :update, :destroy]
  before_action :set_product, only: [:new, :create]

  def new
    @mode = params[:mode].presence_in(%w[new existing]) || 'new'
    @price_record = PriceRecord.new
    @price_record.product = @product if @product.present?

    if @mode == 'existing'
      @products = current_user.products.order(:name)
      @shops = current_user.shops.order(:name)
      @categories = current_user.categories.order(:name)
    else
      @categories = current_user.categories.order(:name)
      @shops = current_user.shops.order(created_at: :desc)
    end
  end

  def create @mode = params[:mode].presence_in(%w[new existing]) || 'new'
    @price_record = current_user.price_records.new(price_record_params)
    @price_record.product = @product if @product.present?
    if @price_record.save
      redirect_to home_path, notice: "価格を登録しました"
    else
      @products = current_user.products
      @shops = current_user.shops
      @categories = current_user.categories
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @products = current_user.products
    @shops = current_user.shops
  end

  def update
    if @price_record.update(price_record_params)
      redirect_to product_path(@price_record.product), notice: "更新しました"
    else
      @products = current_user.products
      @shops = current_user.shops
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @price_record.destroy!
    redirect_to product_path(@price_record.product), notice: "削除しました", status: :see_other
  end

  private

  def set_price_record
    @price_record = current_user.price_records.find(params[:id])
  end

  def set_product
    @product = current_user.products.find(params[:product_id]) if params[:product_id].present?
  end

  def price_record_params
    params.require(:price_record).permit(:price, :memo, :purchased_at, :shop_id)
  end
end
