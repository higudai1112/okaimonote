require "rails_helper"

RSpec.describe Contact, type: :model do
  describe "バリデーション" do
    it "有効なファクトリを持つこと" do
      expect(build(:contact)).to be_valid
    end

    it "nicknameが空では無効であること" do
      contact = build(:contact, nickname: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:nickname]).to be_present
    end

    it "emailが空では無効であること" do
      contact = build(:contact, email: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:email]).to be_present
    end

    it "bodyが空では無効であること" do
      contact = build(:contact, body: nil)
      expect(contact).not_to be_valid
      expect(contact.errors[:body]).to be_present
    end
  end

  describe "enum status" do
    it "デフォルトのstatusはunread" do
      contact = build(:contact)
      expect(contact.status).to eq("unread")
    end

    it "pending に変更できる" do
      contact = create(:contact)
      contact.pending!
      expect(contact.reload.status).to eq("pending")
    end

    it "resolved に変更できる" do
      contact = create(:contact)
      contact.resolved!
      expect(contact.reload.status).to eq("resolved")
    end
  end

  describe ".ransackable_attributes" do
    it "検索可能な属性を返す" do
      attrs = Contact.ransackable_attributes
      expect(attrs).to include("nickname", "email", "body", "status", "created_at")
    end
  end
end
