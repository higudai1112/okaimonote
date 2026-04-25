require "rails_helper"

RSpec.describe ShoppingList, type: :model do
  describe "バリデーション" do
    it "有効なファクトリを持つこと" do
      expect(build(:shopping_list)).to be_valid
    end

    it "nameが空では無効であること" do
      list = build(:shopping_list, name: nil)
      expect(list).not_to be_valid
      expect(list.errors[:name]).to be_present
    end
  end

  describe "アソシエーション" do
    it "shopping_itemsを持てる" do
      list = create(:shopping_list)
      item = create(:shopping_item, shopping_list: list)
      expect(list.shopping_items).to include(item)
    end

    it "shopping_list削除時にshopping_itemsも削除される" do
      list = create(:shopping_list)
      create(:shopping_item, shopping_list: list)
      expect { list.destroy }.to change(ShoppingItem, :count).by(-1)
    end
  end

  describe "#to_param" do
    it "public_idを返す" do
      list = create(:shopping_list)
      expect(list.to_param).to eq(list.public_id)
    end
  end
end
