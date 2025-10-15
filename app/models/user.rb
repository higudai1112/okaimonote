class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :nickname, presence: true, length: { maximum: 20 }
  has_one_attached :avatar

  has_many :categories, dependent: :destroy
  has_many :price_records, dependent: :destroy
  has_many :shops, dependent: :destroy
  has_many :products, dependent: :destroy
  belongs_to :shopping_list, dependent: :destroy

  after_create :setup_default_categories
  after_create :setup_default_shopping_list

  def self.guest
    create!(
      email: "guest_#{ SecureRandom.hex(10) }@example.com",
      password: SecureRandom.urlsafe_base64,
      nickname: "ゲストユーザー"
    )
  end

  def guest?
    email.present? && email.start_with?("guest_")
  end

  private

  def setup_default_categories
    %w[日用品 食料品].each do |name|
      categories.create!(name: name)
    end
  end

  def setup_default_shopping_list
    shopping_lists.create!(name: "マイリスト")
  end
end
