import { redirect } from "next/navigation";

/** ルートアクセスはホーム画面へリダイレクト（未認証の場合は useAuth がログインへ誘導） */
export default function RootPage() {
  redirect("/home");
}
