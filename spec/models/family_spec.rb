require "rails_helper"

RSpec.describe Family, type: :model do
  let(:owner) { create(:user, :without_callbacks) }
  let(:family) { create(:family, owner: owner) }

  describe "バリデーション" do
    it "有効なファクトリを持つこと" do
      expect(family).to be_valid
    end

    it "名前が未設定の場合はデフォルト名が設定される" do
      f = create(:family, name: nil, owner: owner)
      expect(f.name).to eq("ファミリー")
    end

    it "invite_tokenが自動生成される" do
      f = build(:family, invite_token: nil, owner: owner)
      f.valid?
      expect(f.invite_token).to be_present
    end
  end

  describe "アソシエーション" do
    it "作成時にファミリーショッピングリストが自動作成される" do
      expect { create(:family, owner: owner) }.to change(ShoppingList, :count).by(1)
    end
  end

  describe "#full?" do
    it "メンバーが上限（3人）の場合trueを返す" do
      family.users << owner
      2.times { family.users << create(:user, :without_callbacks) }
      expect(family.full?).to be true
    end

    it "メンバーが上限未満の場合falseを返す" do
      family.users << owner
      expect(family.full?).to be false
    end
  end

  describe "#remaining_slots" do
    it "残り枠数を返す" do
      family.users << owner
      expect(family.remaining_slots).to eq(Family::MAX_MEMBERS - 1)
    end

    it "メンバーが上限に達している場合は0を返す" do
      family.users << owner
      2.times { family.users << create(:user, :without_callbacks) }
      expect(family.remaining_slots).to eq(0)
    end
  end

  describe "#regenerate_invite_token!" do
    it "invite_tokenが更新される" do
      old_token = family.invite_token
      family.regenerate_invite_token!
      expect(family.reload.invite_token).not_to eq(old_token)
    end
  end
end
