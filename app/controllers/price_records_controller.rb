class PriceRecordsController < ApplicationController
  before_action :set_price_record, only: [ :edit, :update, :destroy ]
  before_action :set_product, only: [ :new, :create, :edit, :update, :destroy ]
  before_action :set_collections, only: [ :new, :create ]

  def new
    Rails.logger.debug "=== params[:category_filter]: #{params[:category_filter]} ==="
    Rails.logger.debug "=== params[:mode]: #{params[:mode]} ==="
    # モードを最初に設定
    @mode = params[:mode].presence_in(%w[new existing]) || "new"

    # モデル準備
    @price_record = current_user.price_records.new
    @price_record.product = @product if @product.present?

    # カテゴリー・ショップは共通して必要
    @categories = current_user.categories.order(:name)
    @shops = current_user.shops.order(:name)

    # 商品リストをモード別に設定
    if @mode == "existing"
      if params[:category_filter].present?
        @products = current_user.products
                                .where(category_id: params[:category_filter])
                                .order(:name)
      else
        @products = current_user.products.order(:name)
      end
    else
      # 新規登録モードではまだ商品リストは空
      @products = []
    end

    # Turbo対応
    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def create
    puts "=== MODE DEBUG ==="
    puts "params[:mode]: #{params[:mode]}"
    puts "presence_in result: #{params[:mode].presence_in(%w[new existing])}"
    @mode = params[:mode].presence_in(%w[new existing]) ||
            params.dig(:price_record, :mode) || "new"
    success = false
    puts "Final @mode: #{@mode}"
    puts "==================="

    # 一貫したインスタンス生成（ここで生成して以降使いまわす）
    @price_record = current_user.price_records.new(price_record_params.except(:product_name, :category_id))

    ActiveRecord::Base.transaction do
      if @mode == "new"
        # --- 新規商品モード ---
        product_name = params[:price_record][:product_name]
        category_id  = params[:price_record][:category_id]

        if product_name.blank? || category_id.blank?
          @price_record.errors.add(:base, "商品名とカテゴリーを入力してください")
          raise ActiveRecord::Rollback
        end

        # 商品を作成または再利用
        @product = current_user.products.find_or_create_by!(
          name: product_name,
          category_id: category_id
        )

        # 商品を紐づけ
        @price_record.product = @product

      elsif @mode == "existing"
        # --- 既存商品モード ---
        product_id = params[:price_record][:product_id]

        if product_id.present?
          @product = current_user.products.find_by(id: product_id)
          if @product.nil?
            @price_record.errors.add(:product, "を選択してください")
            raise ActiveRecord::Rollback
          end
        else
          @price_record.errors.add(:product, "を選択してください")
          raise ActiveRecord::Rollback
        end

        @price_record.product = @product
      end

      # 保存試行
      success = @price_record.save
      raise ActiveRecord::Rollback unless success
    end

    # --- トランザクション後 ---
    respond_to do |format|
      if success
        puts "=== SUCCESS DEBUG ==="
        flash[:notice] = "価格を登録しました"
        puts "Flash設定完了: #{flash[:notice]}"
        format.html { redirect_to home_path, notice: "価格を登録しました" }
        format.turbo_stream do
          render turbo_stream: turbo_stream.action(:redirect, home_path)# ← 成功時: create.turbo_stream.erb を探す
        end
        puts "=== Turbo Stream実行 ==="
      else
        puts "=== VALIDATION DEBUG ==="
        puts "Price param: #{params[:price_record][:price]}"
        puts "@price_record.price: #{@price_record.price}"
        puts "@price_record.valid?: #{@price_record.valid?}"
        puts "@price_record.errors.full_messages: #{@price_record.errors.full_messages}"
        puts "Success: #{success}"

        set_collections
        format.html { render :new, status: :unprocessable_entity }
        format.turbo_stream { render :create, status: :unprocessable_entity } # ← 失敗時: create.turbo_stream.erb を探す
      end
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
    if params[:product_id].present?
      @product = current_user.products.find(params[:product_id])
    elsif defined?(@price_record) && @price_record.present?
      @product = @price_record.product
    end
  end

  def price_record_params
    params.require(:price_record).permit(:price, :memo, :purchased_at, :shop_id, :product_id)
  end

  def set_collections
    Rails.logger.debug "params[:category_filter]: #{params[:category_filter]}"
    Rails.logger.debug "params[:mode]: #{params[:mode]}"
    @categories = current_user.categories.order(:name)
    @shops = current_user.shops.order(:name)

    case @mode
    when "new"
      @products = []
    when "existing"
      if params[:category_filter].present?
        @products = current_user.products
                                .where(category_id: params[:category_filter])
                                .order(:name)
      else
        @products = current_user.products.order(:name)
      end
    else
      @products = current_user.products.order(:name)
    end
  end
end
