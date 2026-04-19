module Api
  module V1
    class CategoriesController < BaseController
      before_action :set_category, only: [ :update, :destroy ]

      # GET /api/v1/categories
      def index
        categories = current_user.family_owner.categories.order(:name)
        render json: categories.map { |c| category_json(c) }
      end

      # POST /api/v1/categories
      def create
        category = current_user.family_owner.categories.new(category_params)
        if category.save
          render json: category_json(category), status: :created
        else
          render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH /api/v1/categories/:id
      def update
        if @category.update(category_params)
          render json: category_json(@category)
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/categories/:id
      def destroy
        @category.destroy!
        head :no_content
      end

      private

      def set_category
        @category = current_user.family_owner.categories.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "見つかりません" }, status: :not_found
      end

      def category_params
        params.require(:category).permit(:name, :memo)
      end

      def category_json(cat)
        { id: cat.id, public_id: cat.public_id, name: cat.name, memo: cat.memo }
      end
    end
  end
end
