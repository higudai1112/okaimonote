class Family < ApplicationRecord
  has_many :users, dependent: :nullify
  has_many :shopping_lists, dependent: :destroy
  belongs_to :owner, class_name: "User"

  before_validation :set_default_name, on: :create
  before_validation :generate_invite_token, on: :create

  after_create :create_family_shopping_list

  def regenerate_invite_token!
    update!(invite_token: SecureRandom.urlsafe_base64(32))
  end

  private

  def set_default_name
    self.name ||= "ファミリー"
  end

  def generate_invite_token
    self.invite_token ||= SecureRandom.urlsafe_base64(32)
  end

  def create_family_shopping_list
    ShoppingList.create!(family: self, user: owner, name: "ファミリーリスト")
  end
end
