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

    // フォーカスが外れたら閉じる（ただし選択クリックを守るために少し遅延）
    this.inputTarget.addEventListener("blur", () => {
      setTimeout(() => this.closeResults(), 150)
    })
  }

  disconnect() {
    document.removeEventListener("click", this.outsideClickHandler)
  }

  // 入力時
  search() {
    const q = this.inputTarget.value.trim()

    if (q === "") {
      this.closeResults()
      return
    }

    fetch(`/shopping_items/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    })
      .then(res => res.text())
      .then(html => Turbo.renderStreamMessage(html))
  }

  // 候補クリック時
  select(event) {
    const value = event.currentTarget.dataset.value
    this.inputTarget.value = value
    this.closeResults()
  }

  // 共通：候補を閉じる関数（全てここに集約）
  closeResults() {
    this.resultsTarget.innerHTML = ""
  }
}

