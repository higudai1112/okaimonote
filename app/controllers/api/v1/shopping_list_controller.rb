module Api
  module V1
    class ShoppingListController < BaseController
      before_action :set_shopping_list
      before_action :set_item, only: [ :update_item, :destroy_item ]

      # GET /api/v1/shopping_list/autocomplete?q=xxx
      # 商品名・過去のショッピングアイテム名から候補を返す
      def autocomplete
        q = params[:q].to_s.strip
        return render json: [] if q.blank?

        owner = current_user.family_owner

        # 商品名から候補を取得（部分一致・最大10件）
        product_names = owner.products
                             .where("name ILIKE ?", "%#{q}%")
                             .order(:name)
                             .limit(10)
                             .pluck(:name)

        render json: product_names.uniq
      end

      # GET /api/v1/shopping_list
      def show
        render json: shopping_list_json(@shopping_list)
      end

      # POST /api/v1/shopping_list/items
      def create_item
        item = @shopping_list.shopping_items.new(item_params)
        if item.save
          render json: item_json(item), status: :created
        else
          render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/shopping_list/items/:id
      def update_item
        if @item.update(item_params)
          render json: item_json(@item)
        else
          render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/shopping_list/items/:id
      def destroy_item
        @item.destroy
        head :no_content
      end

      # DELETE /api/v1/shopping_list/items/purchased
      def delete_purchased
        @shopping_list.shopping_items.where(purchased: true).destroy_all
        head :no_content
      end

      private

      def set_shopping_list
        @shopping_list = current_user.active_shopping_list
      end

      def set_item
        @item = @shopping_list.shopping_items.find(params[:id])
      end

      def item_params
        params.require(:shopping_item).permit(:name, :memo, :purchased)
      end

      def shopping_list_json(list)
        {
          id: list.id,
          public_id: list.public_id,
          name: list.name,
          items: list.shopping_items.order(created_at: :desc).map { |item| item_json(item) }
        }
      end

      def item_json(item)
        {
          id: item.id,
          name: item.name,
          memo: item.memo,
          purchased: item.purchased
        }
      end
    end
  end
end
