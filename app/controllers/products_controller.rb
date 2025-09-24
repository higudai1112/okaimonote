class ProductsController < ApplicationController
  before_action :set_product, only: [ :show, :edit, :update, :destroy ]
  def index
    @products = Product.includes(:category).order(created_at: :desc).page(params[:page]).per(20)
  end

  def new
    @product = Product.new
    @product.category_id = params[:category_id] if params[:category_id].present?
    @categories = Category.order(created_at: :desc)
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to category_path(@product.category), notice: "商品を登録しました"
    else
      @categories = Category.order(created_at: :desc)
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @price_records = @product.price_records.order(purchased_on: :desc).page(params[:page]).per(10)
  end

  def edit
    @categories = Category.order(created_at: :desc)
  end

  def update
    if @product.update(product_params)
      redirect_to products_path, notice: "更新しました"
    else
      @categories = Category.order(created_at: :desc)
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy!
    redirect_to products_path, notice: "削除しました", status: :see_other
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(:name, :category_id, :memo)
  end
end
