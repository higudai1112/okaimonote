module Api
  module V1
    class ProductsController < BaseController
      # GET /api/v1/products
      def index
        owner = current_user.family_owner
        products = owner.products.includes(:category).order(created_at: :desc)

        render json: products.map { |p| product_json(p) }
      end

      private

      def product_json(product)
        {
          id: product.id,
          public_id: product.public_id,
          name: product.name,
          memo: product.memo,
          category: product.category ? { id: product.category.id, name: product.category.name } : nil
        }
      end
    end
  end
end
