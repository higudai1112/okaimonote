class ProductsController < ApplicationController
  before_action :set_product, only: [ :show, :edit, :update, :destroy ]
  def index
    owner = current_user.family_owner

    @q = owner.products.ransack(params[:q])
    @products = @q.result.includes(:category).order(created_at: :desc).page(params[:page]).per(10)
  end

  def new
    owner = current_user.family_owner
    @product = owner.products.new
    @product.category_id = params[:category_id] if params[:category_id].present?
    @categories = owner.categories.order(created_at: :desc)
  end

  def create
    owner = current_user.family_owner
    @product = owner.products.new(product_params)
    if @product.save
      redirect_to category_path(@product.category), notice: "商品を登録しました"
    else
      @categories = owner.categories.order(created_at: :desc)
      render :new, status: 422
    end
  end

  def show
    @price_records = @product.price_records.order(purchased_at: :desc).page(params[:page]).per(10)
  end

  def edit
    owner = current_user.family_owner
    @categories = owner.categories.order(created_at: :desc)
  end

  def update
    # チェックボックスが押されたら画像を削除
    @product.image.purge if params[:product][:remove_image] == "1"

    if @product.update(product_params)
      redirect_to category_path(@product.category), notice: "更新しました"
    else
      owner = current_user.family_owner
      @categories = owner.categories.order(created_at: :desc)
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

  def autocomplete
    owner = current_user.family_owner
    query = params[:q].to_s.strip

    # よく使う候補（上位3件）
    frequent_items =
      owner.products
           .left_joins(:price_records)
           .where("price_records.created_at > ?", 30.days.ago)
           .group(:id)
           .order("COUNT(price_records.id) DESC")
           .limit(3)

    if frequent_items.empty?
      frequent_items =
        owner.products
             .left_joins(:price_records)
             .group(:id)
             .order("COUNT(price_records.id) DESC")
             .limit(3)
    end

    @frequent_ids = frequent_items.pluck(:id)

    # 前方一致検索（優先的に表示）
    starts_with = owner.products.where("name LIKE ?", "#{query}%")

    # 部分一致検索（その他を補完）
    contains = owner.products.where("name LIKE ?", "%#{query}%")

    # 全て結合して uniq ＋ 上限つける
    @suggestions = (frequent_items + starts_with + contains)
                     .uniq
                     .first(8)

    respond_to do |format|
      format.turbo_stream
    end
  end

  def search
    owner = current_user.family_owner
    keyword = params[:q].to_s.strip

    # よく使う（上位3件）
    frequent_items =
      owner.products
           .left_joins(:price_records)
           .where("price_records.created_at > ?", 30.days.ago)
           .group(:id)
           .order("COUNT(price_records.id) DESC")
           .limit(3)

    # fallback（データが少ないユーザー用）
    if frequent_items.empty?
      frequent_items =
        owner.products
             .left_joins(:price_records)
             .group(:id)
             .order("COUNT(price_records.id) DESC")
             .limit(3)
    end

    # 前方一致（優先表示）
    starts_with =
      owner.products.where("name LIKE ?", "#{keyword}%")

    # 部分一致（補完）
    contains =
      owner.products.where("name LIKE ?", "%#{keyword}%")

    # 結合 → uniq → 8件まで
    merged = (frequent_items + starts_with + contains)
               .uniq
               .first(8)

    frequent_ids = frequent_items.pluck(:id)

    # shopping_items の Turbo Stream と同じ構造を JSON に変換
    render json: merged.map { |item|
      {
        id: item.id,
        name: item.name,
        category: item.category&.name,
        frequent: frequent_ids.include?(item.id)
      }
    }
  end

  private

  def set_product
    owner = current_user.family_owner

    @product = owner.products.find_by(public_id: params[:id])

    # 念の為に整数idも救済で入れとく
    @product ||= owner.products.find_by(id: params[:id])

    raise ActiveRecord::RecordNotFound unless @product
  end

  def product_params
    params.require(:product).permit(:name, :category_id, :memo, :image)
  end
end
