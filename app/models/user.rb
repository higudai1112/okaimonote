class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :nickname, presence: true, length: { maximum: 20 }
  has_one_attached :avatar

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
end
