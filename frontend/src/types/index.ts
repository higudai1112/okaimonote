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
