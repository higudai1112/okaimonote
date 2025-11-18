import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

export default class extends Controller {
  static targets = ["input", "results"]

  connect() {
    // 枠外クリックで候補を閉じる
    this.outsideClickHandler = (event) => {
      if (!this.element.contains(event.target)) {
        this.closeResults()
      }
    }
    document.addEventListener("click", this.outsideClickHandler)

    // blur（フォーカスが外れたら閉じる）
    this.inputTarget.addEventListener("blur", () => {
      setTimeout(() => this.closeResults(), 120) // クリック選択を守るため少し遅延
    })
  }

  disconnect() {
    document.removeEventListener("click", this.outsideClickHandler)
  }

  search() {
    const q = this.inputTarget.value.trim()

    if (q === "") {
      this.closeResults()
      return
    }

    fetch(`/home/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    })
      .then(res => res.text())
      .then(html => Turbo.renderStreamMessage(html))
  }

  select(event) {
    const value = event.currentTarget.dataset.value
    this.inputTarget.value = value
    this.closeResults()
  }

  // 共通閉じる処理
  closeResults() {
    this.resultsTarget.innerHTML = ""
  }
}
