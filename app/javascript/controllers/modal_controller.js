// 現在未使用

import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    console.log("[modal] connected ✅")
    // Escキーでも閉じられるようにする
    this._onKeydown = (e) => {
      if (e.key === "Escape") this.close()
    }
    document.addEventListener("keydown", this._onKeydown)
  }

  disconnect() {
    document.removeEventListener("keydown", this._onKeydown)
  }

  // 背景クリック時
  closeBackground(e) {
    console.log("[modal] 背景クリック検知:", e.target === this.element)
    // 背景（=モーダル外側）をクリックした場合のみ閉じる
    if (e.target === this.element) {
      this.close()
    }
  }

  // 閉じる処理
  close() {
    console.log("[modal] close() 実行")
    this.element.remove()
  }

  // モーダル内クリックはイベントを止める
  stop(e) {
    e.stopPropagation()
  }
}