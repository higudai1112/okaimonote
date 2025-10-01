require 'rails_helper'

RSpec.describe User, type: :model do
  it "有効なファクトリを持つこと" do
    user = create(:user)
    expect(user).to be_valid
  end

  it "ニックネームが空では無効であること" do
    user = build(:user, nickname: nil)
    expect(user).not_to be_valid
  end
end
