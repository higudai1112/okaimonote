import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  search() {
    const q = this.inputTarget.value.trim()

    if (q === "") {
      this.resultsTarget.innerHTML = ""
      return
    }

    // Turbo Stream を受け取る
    fetch(`/products/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { Accept: "text/vnd.turbo-stream.html" }
    })
      .then(response => response.text())
      .then(html => Turbo.renderStreamMessage(html))
  }

  select(event) {
    const value = event.currentTarget.dataset.value
    this.inputTarget.value = value

    // 候補表示を消す
    this.resultsTarget.innerHTML = ""
  }
}
