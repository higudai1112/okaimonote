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

/** 商品 */
export type Product = {
  id: number;
  public_id: string;
  name: string;
  memo: string | null;
  category: { id: number; name: string } | null;
};
