import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results", "categoryWrapper"]

  connect() {
    this.inputTarget.addEventListener("blur", () => {
      setTimeout(() => this.closeResults(), 150)
    })

    this.outsideClickHandler = (event) => {
      if (!this.element.contains(event.target)) {
        this.closeResults()
      }
    }
    document.addEventListener("click", this.outsideClickHandler)
  }

  disconnect() {
    document.removeEventListener("click", this.outsideClickHandler)
  }

  search() {
    const query = this.inputTarget.value.trim()

    this._setProductNew() // 新規と想定（入力中）

    if (query === "") {
      this.closeResults()
      return
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.fetchResults(query)
    }, 200)
  }

  fetchResults(query) {
    fetch(`/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => this.showResults(data))
      .catch(e => console.error("❌ FETCH ERROR:", e))
  }

  showResults(products) {
    this.resultsTarget.innerHTML = ""
    this.resultsTarget.classList.remove("hidden")

    // ▼ 見つからない → 新規商品
    if (products.length === 0) {
      this._setProductNew()
      return
    }

    const ul = document.createElement("ul")
    ul.className = "bg-white border border-orange-200 rounded-xl shadow-lg"

    products.slice(0, 8).forEach(product => {
      const li = document.createElement("li")
      li.className = "autocomplete-item px-4 py-2 hover:bg-orange-50 cursor-pointer flex flex-col"
      li.addEventListener("click", () => this.selectProduct(product))

      // 上段：商品名 + ⭐ よく使う
      const top = document.createElement("div")
      top.className = "flex items-center gap-2 text-gray-800 font-medium"

      if (product.frequent) {
        const badge = document.createElement("span")
        badge.className =
          "text-[10px] text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full"
        badge.textContent = "⭐️ よく使う"
        top.appendChild(badge)
      }

      const nameSpan = document.createElement("span")
      nameSpan.textContent = product.name
      top.appendChild(nameSpan)

      li.appendChild(top)

      // 下段：カテゴリー
      if (product.category) {
        const categorySpan = document.createElement("span")
        categorySpan.className = "text-xs text-gray-500 mt-0.5"
        categorySpan.textContent = product.category
        li.appendChild(categorySpan)
      }

      ul.appendChild(li)
    })

    this.resultsTarget.appendChild(ul)
  }

  selectProduct(product) {
    this.inputTarget.value = product.name
    this.closeResults()

    const hidden = document.getElementById("price_record_product_id")
    if (hidden) hidden.value = product.id

    this._setProductExisting()
  }

  closeResults() {
    this.resultsTarget.classList.add("hidden")
    this.resultsTarget.innerHTML = ""
  }

  // 新規商品扱い
  _setProductNew() {
    const hidden = document.getElementById("price_record_product_id")
    if (hidden) hidden.value = ""

    this.categoryWrapperTarget.classList.remove("hidden")
  }

  // 既存商品扱い
  _setProductExisting() {
    this.categoryWrapperTarget.classList.add("hidden")
  }
}
