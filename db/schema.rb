# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_12_13_032202) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "categories", force: :cascade do |t|
    t.string "name", null: false
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.uuid "public_id", default: -> { "gen_random_uuid()" }, null: false
    t.index ["public_id"], name: "index_categories_on_public_id", unique: true
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "contacts", force: :cascade do |t|
    t.string "nickname"
    t.string "email"
    t.text "body"
    t.integer "status"
    t.text "admin_memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "families", force: :cascade do |t|
    t.string "name", null: false
    t.string "invite_token", null: false
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "base_user_id"
    t.index ["invite_token"], name: "index_families_on_invite_token", unique: true
    t.index ["owner_id"], name: "index_families_on_owner_id"
  end

  create_table "price_records", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "product_id", null: false
    t.bigint "shop_id"
    t.integer "price", null: false
    t.text "memo"
    t.date "purchased_at", default: -> { "CURRENT_DATE" }, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "public_id", default: -> { "gen_random_uuid()" }, null: false
    t.index ["product_id"], name: "index_price_records_on_product_id"
    t.index ["public_id"], name: "index_price_records_on_public_id", unique: true
    t.index ["shop_id"], name: "index_price_records_on_shop_id"
    t.index ["user_id"], name: "index_price_records_on_user_id"
  end

  create_table "products", force: :cascade do |t|
    t.string "name", null: false
    t.text "memo"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.uuid "public_id", default: -> { "gen_random_uuid()" }, null: false
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["public_id"], name: "index_products_on_public_id", unique: true
    t.index ["user_id"], name: "index_products_on_user_id"
  end

  create_table "shopping_items", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "purchased", default: false
    t.string "memo"
    t.bigint "shopping_list_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["shopping_list_id"], name: "index_shopping_items_on_shopping_list_id"
  end

  create_table "shopping_lists", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id", null: false
    t.string "shared_token"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "public_id", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "family_id"
    t.index ["family_id"], name: "index_shopping_lists_on_family_id"
    t.index ["public_id"], name: "index_shopping_lists_on_public_id", unique: true
    t.index ["shared_token"], name: "index_shopping_lists_on_shared_token", unique: true
    t.index ["user_id"], name: "index_shopping_lists_on_user_id"
  end

  create_table "shops", force: :cascade do |t|
    t.string "name"
    t.text "memo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_shops_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "nickname"
    t.string "provider"
    t.string "uid"
    t.bigint "family_id"
    t.integer "family_role", default: 0, null: false
    t.string "prefecture"
    t.integer "role", default: 0, null: false
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.integer "products_count", default: 0, null: false
    t.integer "price_records_count", default: 0, null: false
    t.boolean "banned", default: false, null: false
    t.text "banned_reason"
    t.text "admin_memo"
    t.string "status", default: "active"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["family_id"], name: "index_users_on_family_id"
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "categories", "users"
  add_foreign_key "families", "users", column: "owner_id"
  add_foreign_key "price_records", "products"
  add_foreign_key "price_records", "shops"
  add_foreign_key "price_records", "users"
  add_foreign_key "products", "categories"
  add_foreign_key "products", "users"
  add_foreign_key "shopping_items", "shopping_lists"
  add_foreign_key "shopping_lists", "families"
  add_foreign_key "shopping_lists", "users"
  add_foreign_key "shops", "users"
  add_foreign_key "users", "families"
end
