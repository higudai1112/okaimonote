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
  has_one :shopping_list, dependent: :destroy
  has_many :shopping_items, through: :shopping_list

  after_create :setup_default_categories
  after_create :setup_default_shopping_list

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
