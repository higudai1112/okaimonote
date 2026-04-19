module Api
  module V1
    class ShopsController < BaseController
      before_action :set_shop, only: [ :update, :destroy ]

      # GET /api/v1/shops
      def index
        shops = current_user.family_owner.shops.order(:name)
        render json: shops.map { |s| shop_json(s) }
      end

      # POST /api/v1/shops
      def create
        shop = current_user.family_owner.shops.new(shop_params)
        if shop.save
          render json: shop_json(shop), status: :created
        else
          render json: { errors: shop.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/shops/:id
      def update
        if @shop.update(shop_params)
          render json: shop_json(@shop)
        else
          render json: { errors: @shop.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/shops/:id
      def destroy
        @shop.destroy!
        head :no_content
      end

      private

      def set_shop
        @shop = current_user.family_owner.shops.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "見つかりません" }, status: :not_found
      end

      def shop_params
        params.require(:shop).permit(:name, :memo)
      end

      def shop_json(shop)
        { id: shop.id, name: shop.name, memo: shop.memo }
      end
    end
  end
end
