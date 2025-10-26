require 'rails_helper'

RSpec.describe Category, type: :model do
  let(:category) { build(:category) }

  describe "バリデーション" do
    it "名前があれば有効であること" do
      expect(category).to be_valid
    end

    it "名前がなければ無効であること" do
      category.name = ""
      expect(category).not_to be_valid
      expect(category.errors[:name]).to include("を入力してください")
    end

    it "ユーザーが紐づいていなければ無効であること" do
      category.user = nil
      expect(category).not_to be_valid
      expect(category.errors[:user]).to include("を入力してください")
    end
  end

  describe 'アソシエーション' do
    it { should belong_to(:user) }
    it { should have_many(:products) }
  end
end
