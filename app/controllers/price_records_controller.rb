class PriceRecordsController < ApplicationController
  before_action :set_price_record, only: [ :edit, :update, :destroy ]
  before_action :set_product,      only: [ :edit, :update, :destroy ]
  before_action :set_collections,  only: [ :new, :create ]

  def new
    owner = current_user.family_owner
    if params[:product_id].present?
      @product = owner.products.find_by(public_id: params[:product_id])
    end

    @price_record = current_user.price_records.new
  end

  def create
    owner = current_user.family_owner

    @price_record = owner.price_records.new(
      price: params[:price_record][:price],
      memo: params[:price_record][:memo],
      purchased_at: params[:price_record][:purchased_at],
      shop_id: params[:price_record][:shop_id]
    )

    product_id   = params[:price_record][:product_id]
    product_name = params[:price_record][:product_name]
    category_id  = params[:price_record][:category_id]

    # ----------- ① 既存商品 ID 指定 ----------- #
    if product_id.present?
      owner = current_user.family_owner
      existing = owner.products.find_by(id: product_id)

      unless existing
        @price_record.errors.add(:base, "選択した商品が存在しません")
        return render_error
      end

      @price_record.product = existing

    # ----------- ② 新規商品作成 ----------- #
    else
      if product_name.blank? || category_id.blank?
        @price_record.errors.add(:base, "商品名とカテゴリーを入力してください")
        return render_error
      end

      new_product = owner.products.create(
        name: product_name,
        category_id: category_id
      )

      unless new_product.persisted?
        @price_record.errors.add(:base, "商品名またはカテゴリーが不正です")
        return render_error
      end

      @price_record.product = new_product
    end

    # ----------- 保存 ----------- #
    if @price_record.save
      redirect_to home_path, notice: "価格を登録しました", status: :see_other
    else
      Rails.logger.debug "❌ SAVE FAILED - #{@price_record.errors.full_messages}"
      render_error
    end
  end


  def render_error
    Rails.logger.debug "🔥🔥 render_error CALLED"
    Rails.logger.debug "🔥 errors = #{@price_record.errors.full_messages}"
    set_collections

    @product_name = params[:price_record][:product_name]
    @category_id  = params[:price_record][:category_id]

    @price_record.assign_attributes(
      price: params[:price_record][:price],
      memo: params[:price_record][:memo],
      purchased_at: params[:price_record][:purchased_at],
      shop_id: params[:price_record][:shop_id]
    )

    Rails.logger.debug "📡 RENDERING TURBO STREAM ERROR RESPONSE"
    respond_to do |format|
      format.html { render :new, status: :unprocessable_entity }
      format.turbo_stream {
        render turbo_stream: turbo_stream.replace(
          "price_record_form",
          partial: "price_records/form_price_record",
          locals: {
            price_record: @price_record,
            url: price_records_path
          }
        )
      }
    end
  end


  def edit
    owner = current_user.family_owner
    @shops = owner.shops
  end

  def update
    if @price_record.update(price_record_params)
      redirect_to product_path(@price_record.product), notice: "更新しました"
    else
      @shops = current_user.shops
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    product = @price_record.product
    @price_record.destroy!
    redirect_to product_path(product), notice: "削除しました", status: :see_other
  end


  private

  def set_price_record
    owner = current_user.family_owner
    @price_record = owner.price_records.find_by(public_id: params[:id])
    @price_record ||= owner.price_records.find_by(id: params[:id])

    raise ActiveRecord::RecordNotFound if @price_record unless @price_record
  end

  def set_product
    owner = current_user.family_owner
    if params[:product_id].present?
      # public_idで検索
      @product = owner.products.find_by(public_id: params[:product_id])
      # 念の為 通常idでも検索
      @product ||= owner.products.find_by(id: params[:product_id])
    end

    # price_recordから取り出すパターン
    if @product.blank? && defined?(@price_record) && @price_record.present?
      @product = @price_record.product
    end

    raise ActiveRecord::RecordNotFound unless @product
  end

  def price_record_params
    params.require(:price_record).permit(
      :price, :memo, :purchased_at, :shop_id,
      :product_id, :product_name, :category_id
    )
  end

  def set_collections
    owner = current_user.family_owner
    @categories = owner.categories.order(:name)
    @shops      = owner.shops.order(:name)
  end
end
