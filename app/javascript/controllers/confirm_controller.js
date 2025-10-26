// 現在未使用
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="confirm"
export default class extends Controller {
  static targets = ["modal"]

  confirm(event) {
    event.preventDefault()
    this.event = event
    this.showModal()
  }

  showModal() {
    this.modalTarget.classList.remove("hidden")
  }

  hideModal() {
    this.modalTarget.classList.add("hidden")
  }

  proceed() {
    // 削除するを押せば、フォーム送信
    this.hideModal()
    const form = this.event.target.closest("form")
    if (form) form.requestSubmit()
  }

  cancel() {
    this.hideModal()
  }
}
