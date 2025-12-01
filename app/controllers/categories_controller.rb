class CategoriesController < ApplicationController
  before_action :set_category, only: [ :show, :edit, :update, :destroy ]

  def index
    owner = current_user.family_owner
    @categories = owner.categories.order(:name)
  end

  def new
    owner = current_user.family_owner
    @category = owner.categories.new
  end

  def create
    owner = current_user.family_owner
    @category = owner.categories.new(category_params)
    if @category.save
      redirect_to categories_path, notice: "カテゴリーを登録しました"
    else
      render :new, status: 422
    end
  end

  def show
    @products = @category.products.order(created_at: :desc).page(params[:page]).per(10)
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
    owner = current_user.family_owner
    @category = owner.categories.find_by(public_id: params[:id])
    @category ||= owner.categories.find_by(id: params[:id])
    raise ActiveRecord::RecordNotFound unless @category
  end

  def category_params
    params.require(:category).permit(:name, :memo)
  end
end
