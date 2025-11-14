require 'rails_helper'

RSpec.describe User, type: :model do
  describe "バリデーション" do
    context "有効な場合" do
      it "有効なファクトリを持つこと" do
        expect(build(:user)).to be_valid
      end
    end

    context "無効な場合" do
      it "ニックネームが空では無効であること" do
        user = build(:user, nickname: nil)
        user.validate
        expect(user.errors[:nickname]).to include("を入力してください")
      end
    end
  end
end
