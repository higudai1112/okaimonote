class CategoriesController < ApplicationController
  before_action :set_category, only: [ :show, :edit, :update, :destroy ]

  def index
    @q = Category.ransack(params[:q])
    @categories = @q.result.order(created_at: :desc)
  end

  def new
    @category = Category.new
  end

  def create
    @category = Category.new(category_params)
    if @category.save
      redirect_to categories_path, notice: "カテゴリーを登録しました"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @products = @category.products.order(created_at: :desc)
  end

  def edit; end

  def update
    if @category.update(category_params)
      redirect_to categories_path, notice: "カテゴリーを更新しました"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @category.destroy!
    redirect_to categories_path, notice: "カテゴリーを削除しました", status: :see_other
  end

  private

  def set_category
    @category = Category.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name, :memo)
  end
end
