// 確認モーダルをアレンジ
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="confirm"
export default class extends Controller {
  static targets = ["modal", "message"]

  connect() {
    console.log("[confirm] connected ✅")
  }

  // ボタンを押した時（confirmアクション）
  confirm(event) {
    event.preventDefault()
    this.event = event
    // メッセージを動的に変更できるように
    const msg = event.target.dataset.confirmMessage
    if (msg && this.hasMessageTarget) {
      this.messageTarget.textContent = msg
    }
    this.modalTarget.classList.remove("hidden")
  }

  // 実行
  proceed() {
    this.modalTarget.classList.add("hidden")
    const form = this.event.target.closest("form")
    if (form) form.requestSubmit()
  }

  // キャンセル
  cancel() {
    this.modalTarget.classList.add("hidden")
  }
}
