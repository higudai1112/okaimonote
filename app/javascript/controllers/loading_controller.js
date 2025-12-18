// ローディング...
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay"]

  connect() {
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)

    this.delayTimer = null
    this.DELAY = 600

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
    if (!this.hasOverlayTarget) return

    // 一定時間後に表示
    this.delayTimer = setTimeout(() => {
      this.overlayTarget.classList.remove("hidden")
    }, this.DELAY)
  }

  hide() {
    if (!this.hasOverlayTarget) return

    // 表示前ならキャンセル
    if (this.delayTimer) {
      clearTimeout(this.delayTimer)
      this.delayTimer = null
    }

    this.overlayTarget.classList.add("hidden")
  }
}
