require "open-uri"

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
       :recoverable, :rememberable, :validatable,
       :trackable,
       :omniauthable, omniauth_providers: %i[google_oauth2 line apple]

  validates :nickname, presence: true, length: { maximum: 20 }
  has_one_attached :avatar

  has_many :categories, dependent: :destroy
  has_many :price_records, dependent: :destroy
  has_many :shops, dependent: :destroy
  has_many :products, dependent: :destroy
  has_one :shopping_list, dependent: :destroy
  has_many :shopping_items, through: :shopping_list
  belongs_to :family, optional: true

  after_create :setup_default_categories

  enum :role, { general: 0, admin: 1 }

  enum :family_role, {
    personal: 0,
    family_admin: 1,
    family_member: 2
  }

  #==========================================
  # Google / LINE 共通の OmniAuth 処理
  #==========================================
  def self.from_omniauth(auth)
    # ① provider + uid で既存ユーザーを探す
    user = find_by(provider: auth.provider, uid: auth.uid)
    return user if user

    # ② email がある場合は既存ユーザーを紐付ける
    # Appleの場合、2回目以降は auth.info.email が取れない場合があるが
    # id_token には含まれていることが多い。
    # ここでは auth.info.email を信じる。
    email = auth.info.email
    if email.present?
      existing_user = find_by(email: email)
      if existing_user
        existing_user.update(provider: auth.provider, uid: auth.uid)
        return existing_user
      end
    end

    # ③ email がない場合のフォールバック
    if email.blank?
      email = "#{auth.provider}_#{auth.uid}@example.com"
    end

    # ④ 名前決定ロジック（Apple特化）
    # Appleは初回のみ user ハッシュ（name含む）を送ってくる仕様
    name = auth.info.name
    if auth.provider == "apple" && name.blank?
      # nameが取れない場合はデフォルト名
      name = "Apple User"
    end

    # 共通フォールバック & 文字数制限対応 (20文字以内)
    nickname = name.presence || "ユーザー#{SecureRandom.hex(2)}"
    nickname = nickname[0, 20] # 20文字でカット

    # ⑤ 新規作成
    user = create!(
      provider: auth.provider,
      uid: auth.uid,
      email: email,
      password: Devise.friendly_token[0, 20],
      nickname: nickname
    )

    # ⑥ プロフィール画像を provider 不問で保存
    if auth.info.image.present?
      begin
        user.avatar.attach(
          io: URI.open(auth.info.image),
          filename: "#{auth.provider}_avatar.jpg"
        )
      rescue => e
        Rails.logger.error("Avatar download failed: #{e.message}")
      end
    end

    user
  end

  def family_owner
    # 個人利用の場合は自分を返す
    return self if personal? || family.blank?

    # base_user が設定されていれば必ずそれを返す
    family.base_user || self
  end

  # 役割で設定画面切り替え
  def family_role_view
    if personal?
      "personal"
    elsif family_admin?
      "admin"
    else
      "member"
    end
  end

  def active_shopping_list
    if family.present?
      # 家族に属している場合はfamilyの共有リスト
      family.shopping_lists.first
    else
      # 個人なら自分の分
      shopping_list || create_shopping_list!(name: "マイリスト")
    end
  end

  STATUSES = %w[active banned].freeze

  # ステータス判定用ヘルパー
  def status_active?
    status == "active"
  end

  def status_banned?
    status == "banned"
  end

  # ステータスごとのスコープ
  scope :with_status, ->(value) { where(status: value) }
  scope :active_status, -> { where(status: "active") }
  scope :banned_status, -> { where(status: "banned") }

  def active_for_authentication?
    super && !status_banned?
  end

  def inactive_message
    status_banned? ? :banned : super
  end

  # Ransack 検索で許可する属性
  def self.ransackable_attributes(auth_object = nil)
    %w[
      nickname
      email
      status
      created_at
      last_sign_in_at
    ]
  end

  # ソートに使うカラム
  def self.ransackable_associations(auth_object = nil)
    []
  end

  private

  def setup_default_categories
    %w[日用品 食料品].each do |name|
      categories.create!(name: name)
    end
  end
end
