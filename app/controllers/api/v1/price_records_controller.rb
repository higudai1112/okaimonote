module Api
  module V1
    class PriceRecordsController < BaseController
      before_action :set_price_record, only: [ :update, :destroy ]

      # GET /api/v1/price_records/form_data
      # フォームで使うshops・categories・productsを返す
      def form_data
        owner = current_user.family_owner

        render json: {
          shops: owner.shops.order(:name).map { |s| { id: s.id, name: s.name } },
          categories: owner.categories.order(:name).map { |c| { id: c.id, name: c.name } },
          products: owner.products.order(:name).map { |p|
            { id: p.id, public_id: p.public_id, name: p.name,
              category_id: p.category_id }
          }
        }
      end

      # POST /api/v1/price_records
      def create
        owner = current_user.family_owner
        record = current_user.price_records.new(base_params)

        product = resolve_product(owner)
        unless product
          render json: { error: "商品情報が不正です" }, status: :unprocessable_entity
          return
        end

        record.product = product

        if record.save
          render json: price_record_json(record), status: :created
        else
          render json: { errors: record.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/price_records/:id
      def update
        if @price_record.update(update_params)
          render json: price_record_json(@price_record)
        else
          render json: { errors: @price_record.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/price_records/:id
      def destroy
        @price_record.destroy!
        head :no_content
      end

      private

      def set_price_record
        owner = current_user.family_owner
        @price_record = owner.price_records.find_by(public_id: params[:id])
        render json: { error: "見つかりません" }, status: :not_found unless @price_record
      end

      # 既存商品IDまたは新規商品名＋カテゴリーから商品を解決する
      def resolve_product(owner)
        product_id = params.dig(:price_record, :product_id)
        product_name = params.dig(:price_record, :product_name)
        category_id = params.dig(:price_record, :category_id)

        if product_id.present?
          owner.products.find_by(id: product_id)
        elsif product_name.present? && category_id.present?
          owner.products.find_or_create_by(name: product_name) do |p|
            p.category_id = category_id
          end
        end
      end

      def base_params
        params.require(:price_record).permit(:price, :memo, :purchased_at, :shop_id)
      end

      def update_params
        params.require(:price_record).permit(:price, :memo, :purchased_at, :shop_id)
      end

      def price_record_json(record)
        {
          id: record.id,
          public_id: record.public_id,
          price: record.price,
          memo: record.memo,
          purchased_at: record.purchased_at,
          product_id: record.product_id,
          product_name: record.product.name,
          shop_id: record.shop_id,
          shop_name: record.shop&.name
        }
      end
    end
  end
end
