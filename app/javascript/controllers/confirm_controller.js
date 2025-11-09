// 確認モーダルをアレンジ
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="confirm"
export default class extends Controller {
  static targets = ["modal", "message", "proceedButton"]

  connect() {
    console.log("[confirm] connected ✅")
  }

  // ボタンを押した時（confirmアクション）
  confirm(event) {
    console.log("✅ confirm() fired");
    console.log("event.target:", event.target);

    event.preventDefault()
    this.event = event
    // メッセージを動的に変更できるように
    const msg = event.currentTarget.dataset.confirmMessage
    if (msg && this.hasMessageTarget) {
      this.messageTarget.textContent = msg
    }
    console.log("✅ opening modal...");
    this.modalTarget.classList.remove("hidden")
  }

  // 実行
  proceed() {
    this.modalTarget.classList.add("hidden")
    const form = this.event.target.closest("form")
    if (form) {
      form.requestSubmit()
    } else {

      const url = this.event.target.href
      if (url) {
        window.location.href = url
      }
    }
  }

  // キャンセル
  cancel() {
    this.modalTarget.classList.add("hidden")
  }
}
