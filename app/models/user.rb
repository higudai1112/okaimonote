require "open-uri"

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [ :google_oauth2 ]

  validates :nickname, presence: true, length: { maximum: 20 }
  has_one_attached :avatar

  has_many :categories, dependent: :destroy
  has_many :price_records, dependent: :destroy
  has_many :shops, dependent: :destroy
  has_many :products, dependent: :destroy
  has_one :shopping_list, dependent: :destroy
  has_many :shopping_items, through: :shopping_list

  after_create :setup_default_categories
  after_create :setup_default_shopping_list

  def self.from_omniauth(auth)
    # ① provider + uid で既存ユーザーを探す
    user = find_by(provider: auth.provider, uid: auth.uid)
    return user if user

    # ② 同じメールのユーザーを発見したら紐付けて返す
    existing_user = find_by(email: auth.info.email)
    if existing_user
      existing_user.update(provider: auth.provider, uid: auth.uid)
      return existing_user
    end

    # ③ なければ新規作成
    user = create!(
      provider: auth.provider,
      uid: auth.uid,
      email: auth.info.email,
      password: Devise.friendly_token[0, 20],
      nickname: auth.info.name.presence || "ゲストユーザー"
    )

    # Googleのプロフィール画像を保存
    if auth.info.image.present?
      user.avatar.attach(
        io: URI.open(auth.info.image),
        filename: "google_avatar.jpg"
      )
    end

    user
  end

  private

  def setup_default_categories
    %w[日用品 食料品].each do |name|
      categories.create!(name: name)
    end
  end

  def setup_default_shopping_list
    create_shopping_list!(name: "マイリスト")
  end
end
