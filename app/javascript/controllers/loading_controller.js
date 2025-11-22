// ローディング...
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay"]

  connect() {
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)

    document.addEventListener("turbo:before-visit", this.show) // ページ移動前
    document.addEventListener("turbo:submit-start", this.show) // フォーム送信時
    document.addEventListener("turbo:load", this.hide) // ページ読み込み完了
    document.addEventListener("turbo:submit-end", this.hide)  // フォーム送信完了
  }

  disconnect() {
    document.removeEventListener("turbo:before-visit", this.show)
    document.removeEventListener("turbo:submit-start", this.show)
    document.removeEventListener("turbo:load", this.hide)
    document.removeEventListener("turbo:submit-end", this.hide)
  }

  show() {
    if (this.hasOverlayTarget) {
      this.overlayTarget.classList.remove("hidden")
    }
  }

  hide() {
    if (this.hasOverlayTarget) {
      this.overlayTarget.classList.add("hidden")
    }
  }
}
