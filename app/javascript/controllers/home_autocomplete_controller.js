import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

export default class extends Controller {
  static targets = ["input", "results"]

  search() {
    const q = this.inputTarget.value.trim()

    if (q === "") {
      this.resultsTarget.innerHTML = ""
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
    this.resultsTarget.innerHTML = ""
  }
}