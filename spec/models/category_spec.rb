require 'rails_helper'

RSpec.describe Category, type: :model do
  let(:category) { build(:category) }

  describe "バリデーション" do
    context "有効な場合" do
      it "名前があれば有効であること" do
        expect(category).to be_valid
      end
    end

    context "無効な場合" do
      it "名前がなければ無効であること" do
        category.name = nil
        category.validate
        expect(category.errors[:name]).to include("を入力してください")
      end

      it "ユーザーが紐づいていなければ無効であること" do
        category.user = nil
        category.validate
        expect(category.errors[:user]).to include("を入力してください")
      end
    end
  end

  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:products) }
  end
end
