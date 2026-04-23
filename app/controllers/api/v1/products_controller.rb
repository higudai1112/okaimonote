module Api
  module V1
    class ProductsController < BaseController
      PER_PAGE = 20

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

      private

      def ransack_params
        return {} unless params[:q].is_a?(ActionController::Parameters)

        params[:q].permit(:name_cont, :category_id_eq)
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
    end
  end
end
