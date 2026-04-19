/** 認証済みユーザー情報 (/api/v1/me) */
export type User = {
  id: number;
  email: string;
  nickname: string | null;
  role: "general" | "admin";
  family_role: "personal" | "family_admin" | "family_member";
  prefecture: string | null;
  avatar_url: string | null;
};

/** ショッピングアイテム */
export type ShoppingItem = {
  id: number;
  name: string;
  memo: string | null;
  purchased: boolean;
};

/** ショッピングリスト */
export type ShoppingList = {
  id: number;
  public_id: string;
  name: string;
  items: ShoppingItem[];
};

/** 価格登録履歴（ホーム画面用） */
export type PriceRecord = {
  id: number;
  price: number;
  memo: string | null;
  purchased_at: string;
  product_id: number;
  product_name: string;
  product_public_id: string;
  shop_name: string | null;
};

/** 価格サマリー（ホーム画面用） */
export type PriceSummary = {
  product_id: number;
  product_name: string;
  min_price: number | null;
  max_price: number | null;
  average_price: number | null;
  last_price: number | null;
  last_purchased_at: string | null;
};

/** 価格記録フォームデータ */
export type PriceRecordFormData = {
  shops: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  products: { id: number; public_id: string; name: string; category_id: number | null }[];
};

/** ファミリーメンバー */
export type FamilyMember = {
  id: number;
  nickname: string | null;
  family_role: "family_admin" | "family_member";
};

/** ファミリー情報 */
export type Family = {
  id: number;
  name: string;
  invite_token: string;
  members_count: number;
  members: FamilyMember[];
};

/** 招待情報（未ログインでも取得可能） */
export type FamilyInviteInfo = {
  name: string;
  members_count: number;
  remaining_slots: number;
};

/** 商品 */
export type Product = {
  id: number;
  public_id: string;
  name: string;
  memo: string | null;
  category: { id: number; name: string } | null;
};

/** 管理画面: ユーザー */
export type AdminUser = {
  id: number;
  email: string;
  nickname: string | null;
  role: string;
  status: string;
  banned_reason: string | null;
  family_role: string;
  prefecture: string | null;
  admin_memo: string | null;
  last_sign_in_at: string | null;
  created_at: string;
  recent_price_records?: {
    id: number;
    price: number;
    product_name: string | null;
    shop_name: string | null;
    purchased_at: string;
  }[];
  recent_products?: { id: number; name: string }[];
};

/** 管理画面: お問い合わせ */
export type AdminContact = {
  id: number;
  nickname: string;
  email: string;
  body: string;
  status: "unread" | "pending" | "resolved";
  admin_memo: string | null;
  created_at: string;
};

/** 管理画面: ファミリー */
export type AdminFamily = {
  id: number;
  name: string;
  invite_token?: string;
  members_count: number;
  created_at: string;
  members?: {
    id: number;
    nickname: string | null;
    email: string;
    family_role: string;
    created_at: string;
  }[];
};

/** 管理画面: ダッシュボード */
export type AdminDashboard = {
  new_users_today: number;
  new_users_yesterday: number;
  new_users_diff: number;
  active_users: number;
  new_users_30d: number;
  new_users_30d_diff: number;
  total_families: number;
  unresolved_contacts: number;
  top_products: { name: string; records_count: number }[];
  top_shops: { name: string; records_count: number }[];
};

/** 管理画面: サービス概要 */
export type AdminServices = {
  users_count: number;
  products_count: number;
  price_records_count: number;
  shops_count: number;
  families_count: number;
  active_users_count: number;
  avg_records_per_user: number;
  rails_version: string;
  ruby_version: string;
  env: string;
  db_connected: boolean;
};
