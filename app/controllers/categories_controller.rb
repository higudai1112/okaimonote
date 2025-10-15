class CategoriesController < ApplicationController
  before_action :set_category, only: [ :show, :edit, :update, :destroy ]

  def index
    @q = current_user.categories.ransack(params[:q])
    @categories = @q.result.order(created_at: :desc)
  end

  def new
    @category = current_user.categories.new
  end

  def create
    @category = current_user.categories.new(category_params)
    if @category.save
      redirect_to categories_path, notice: "カテゴリーを登録しました"
    else
      render :new, status: 422
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
      render :edit, status: 422
    end
  end

  def destroy
    @category.destroy!
    redirect_to categories_path, notice: "カテゴリーを削除しました", status: :see_other
  end

  private

  def set_category
    @category = current_user.categories.find(params[:id])
  end

  def category_params
    params.require(:category).permit(:name, :memo)
  end
end
