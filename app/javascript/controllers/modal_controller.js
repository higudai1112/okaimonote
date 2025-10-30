// 買い物カート編集
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("[modal] connected ✅")
  }

  disconnect() {
    console.log("[modal] disconnected 🧹")
  }

  // 背景クリック時
  closeBackground(e) {
    if (e.target === this.element) {
      this.close()
    }
  }

  // Escキーで閉じる
  closeByEsc(e) {
    if (e.key === "Escape") this.close()
  }

  // 閉じる処理
  close() {
    console.log("[modal] close() 実行")
    this.element.remove()
  }

  // モーダル内部のクリックは伝播を止める
  stop(e) {
    e.stopPropagation()
  }
}