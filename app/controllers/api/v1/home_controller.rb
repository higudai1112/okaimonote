module Api
  module V1
    class HomeController < BaseController
      # GET /api/v1/home
      # 最新5件の価格登録履歴と直近商品のサマリーを返す
      def index
        owner = current_user.family_owner

        price_records = owner.price_records
                             .includes(:product, :shop)
                             .order(created_at: :desc)
                             .limit(5)

        render json: {
          price_records: price_records.map { |r| price_record_json(r) }
        }
      end

      # GET /api/v1/home/summary/:product_id
      # 指定商品の価格サマリーを返す
      def summary
        owner = current_user.family_owner
        product = owner.products.find_by(id: params[:product_id])

        unless product
          render json: { error: "商品が見つかりません" }, status: :not_found
          return
        end

        histories = product.price_records

        render json: {
          product_id: product.id,
          product_name: product.name,
          min_price: histories.minimum(:price),
          max_price: histories.maximum(:price),
          average_price: histories.average(:price)&.round,
          last_price: histories.order(purchased_at: :desc).first&.price,
          last_purchased_at: histories.order(purchased_at: :desc).first&.purchased_at
        }
      end

      private

      def price_record_json(record)
        {
          id: record.id,
          price: record.price,
          memo: record.memo,
          purchased_at: record.purchased_at,
          product_id: record.product.id,
          product_name: record.product.name,
          product_public_id: record.product.public_id,
          shop_name: record.shop&.name
        }
      end
    end
  end
end
