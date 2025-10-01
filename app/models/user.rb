class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :nickname, presence: true, length: { maximum: 20 }
  has_one_attached :avatar

  has_many :categories, dependent: :destroy
  has_many :price_records, dependent: :destroy

  after_create :setup_default_categories

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
end
