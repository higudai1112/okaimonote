module Api
  module V1
    class ProductsController < BaseController
      PER_PAGE = 20
      PRICE_RECORDS_PER_PAGE = 10

      before_action :set_product, only: [ :show, :update ]

      # GET /api/v1/products
      # q パラメータで Ransack 検索対応、Kaminari ページネーション対応
      def index
        owner = current_user.family_owner

        q = owner.products.includes(:category, image_attachment: :blob)
                 .ransack(ransack_params)

        products = q.result(distinct: true)
                    .order(created_at: :desc)
                    .page(params[:page])
                    .per(PER_PAGE)

        render json: {
          data: products.map { |p| product_json(p) },
          meta: {
            total: products.total_count,
            current_page: products.current_page,
            total_pages: products.total_pages
          }
        }
      end

      # GET /api/v1/products/:id
      # 商品詳細と価格履歴（最新順・ページネーション）を返す
      def show
        price_records = @product.price_records
                                .includes(:shop)
                                .order(purchased_at: :desc)
                                .page(params[:page])
                                .per(PRICE_RECORDS_PER_PAGE)

        render json: {
          product: product_json(@product),
          price_records: price_records.map { |r| price_record_json(r) },
          meta: {
            total: price_records.total_count,
            current_page: price_records.current_page,
            total_pages: price_records.total_pages
          }
        }
      end

      # PATCH /api/v1/products/:id
      # 商品の名前・カテゴリ・メモを更新する（画像は対象外）
      def update
        if @product.update(product_update_params)
          render json: product_json(@product)
        else
          render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      # public_id で商品を検索し、見つからなければ 404 を返す
      def set_product
        owner = current_user.family_owner
        @product = owner.products.includes(:category, image_attachment: :blob)
                        .find_by(public_id: params[:id])
        @product ||= owner.products.includes(:category, image_attachment: :blob)
                          .find_by(id: params[:id])
        render json: { error: "見つかりません" }, status: :not_found unless @product
      end

      def ransack_params
        return {} unless params[:q].is_a?(ActionController::Parameters)

        params[:q].permit(:name_cont, :category_id_eq)
      end

      def product_update_params
        params.require(:product).permit(:name, :category_id, :memo)
      end

      def product_json(product)
        {
          id: product.id,
          public_id: product.public_id,
          name: product.name,
          memo: product.memo,
          category: product.category ? { id: product.category.id, name: product.category.name } : nil,
          image_url: product.image.attached? ? url_for(product.image) : nil
        }
      end

      def price_record_json(record)
        {
          id: record.id,
          public_id: record.public_id,
          price: record.price,
          memo: record.memo,
          purchased_at: record.purchased_at,
          shop_id: record.shop_id,
          shop_name: record.shop&.name
        }
      end
    end
  end
end
