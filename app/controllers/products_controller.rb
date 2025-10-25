class ProductsController < ApplicationController
  before_action :set_product, only: [ :show, :edit, :update, :destroy ]
  def index
    @products = current_user.products.includes(:category).order(created_at: :desc).page(params[:page]).per(20)
  end

  def new
    @product = current_user.products.new
    @product.category_id = params[:category_id] if params[:category_id].present?
    @categories = current_user.categories.order(created_at: :desc)
  end

  def create
    @product = current_user.products.new(product_params)
    if @product.save
      redirect_to category_path(@product.category), notice: "商品を登録しました"
    else
      @categories = current_user.categories.order(created_at: :desc)
      render :new, status: 422
    end
  end

  def show
    @price_records = @product.price_records.order(purchased_at: :desc).page(params[:page]).per(10)
  end

  def edit
    @categories = current_user.categories.order(created_at: :desc)
  end

  def update
    if @product.update(product_params)
      redirect_to products_path, notice: "更新しました"
    else
      @categories = current_user.categories.order(created_at: :desc)
      render :edit, status: 422
    end
  end

  def destroy
    category = @product.category
    @product.destroy!
    if category.present?
      redirect_to category_products_path(category), notice: "削除しました", status: :see_other
    else
      redirect_to products_path, notice: "削除しました", status: :see_other
    end
  end

  private

  def set_product
    @product = current_user.products.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :category_id, :memo)
  end
end
