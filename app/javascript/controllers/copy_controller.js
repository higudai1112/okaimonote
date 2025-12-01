// 招待URLのコピーボタン
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["feedback"]

  copy() {
    // dataset から正確なURLを取得（スペース混入ゼロ）
    const text = this.element.dataset.copyUrl

    navigator.clipboard.writeText(text)
      .then(() => this.showFeedback())
      .catch(() => alert("コピーできませんでした"))
  }

  showFeedback() {
    this.feedbackTarget.classList.remove("hidden")

    setTimeout(() => {
      this.feedbackTarget.classList.add("hidden")
    }, 1200)
  }
}

