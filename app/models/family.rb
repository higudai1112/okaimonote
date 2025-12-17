class Family < ApplicationRecord
  MAX_MEMBERS = 3
  has_many :users, dependent: :nullify
  has_many :shopping_lists, dependent: :destroy
  belongs_to :owner, class_name: "User"
  belongs_to :base_user, class_name: "User", optional: true

  before_validation :set_default_name, on: :create
  before_validation :generate_invite_token, on: :create

  after_create :create_family_shopping_list

  def regenerate_invite_token!
    update!(invite_token: SecureRandom.urlsafe_base64(32))
  end

  def full?
    users.count >= MAX_MEMBERS
  end

  def remaining_slots
    [ MAX_MEMBERS - users.count, 0 ].max
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
