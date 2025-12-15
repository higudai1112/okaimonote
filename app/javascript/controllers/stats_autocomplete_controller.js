import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  search() {
    const q = this.inputTarget.value.trim()
    const url = this.element.dataset.urlValue

    if (q === "") {
      this.resultsTarget.innerHTML = ""
      this.resultsTarget.classList.add("hidden")
      return
    }

    fetch(`${url}?q=${encodeURIComponent(q)}`)
      .then(res => res.json())
      .then(items => {
        this.renderResults(items)
      })
  }

  renderResults(items) {
    this.resultsTarget.innerHTML = ""

    if (items.length === 0) {
      this.resultsTarget.classList.add("hidden")
      return
    }

    items.forEach(name => {
      const div = document.createElement("div")
      div.textContent = name
      div.dataset.value = name
      div.className = "px-3 py-2 hover:bg-orange-100 cursor-pointer"
      div.addEventListener("click", () => {
        this.inputTarget.value = name
        this.resultsTarget.innerHTML = ""
        this.resultsTarget.classList.add("hidden")
      })
      this.resultsTarget.appendChild(div)
    })

    this.resultsTarget.classList.remove("hidden")
  }
}
