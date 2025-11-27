import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results", "categoryWrapper", "productId"]

  connect() {
    // 入力欄からフォーカスが外れたら閉じる（クリック選択保護）
    this.inputTarget.addEventListener("blur", () => {
      setTimeout(() => this.closeResults(), 150)
    })

    // 外側クリックで閉じる
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

  // 入力時の検索
  search() {
    const query = this.inputTarget.value.trim()

    // 入力開始＝新規の可能性 → product_id をクリア
    this._setProductNew()

    if (query === "") {
      this.closeResults()
      return
    }

    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.fetchResults(query)
    }, 200)
  }

  // API 呼び出し
  fetchResults(query) {
    fetch(`/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => this.showResults(data))
      .catch(e => console.error("❌ FETCH ERROR:", e))
  }

  // 候補表示
  showResults(products) {
    this.resultsTarget.innerHTML = ""
    this.resultsTarget.classList.remove("hidden")

    // ▼ 候補なし → 新規商品
    if (products.length === 0) {
      this._setProductNew()
      return
    }

    const ul = document.createElement("ul")
    ul.className = "bg-white border border-orange-200 rounded-xl shadow-lg"

    products.slice(0, 8).forEach(product => {
      const li = document.createElement("li")
      li.className =
        "autocomplete-item px-4 py-2 hover:bg-orange-50 cursor-pointer flex flex-col"
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

  // 候補選択
  selectProduct(product) {
    // 商品名セット
    this.inputTarget.value = product.name

    // hidden_field に ID をセット
    this.productIdTarget.value = product.id

    // 新規商品 UI を非表示にする
    this._setProductExisting()

    this.closeResults()
  }

  // 候補欄を閉じる
  closeResults() {
    this.resultsTarget.classList.add("hidden")
    this.resultsTarget.innerHTML = ""
  }

  // 新規商品扱い
  _setProductNew() {
    if (this.hasProductIdTarget) {
      this.productIdTarget.value = ""
    }
    this.categoryWrapperTarget.classList.remove("hidden")
  }

  // 既存商品扱い
  _setProductExisting() {
    this.categoryWrapperTarget.classList.add("hidden")
  }

  clearProductId() {
    if (this.hasProductIdTarget) {
      this.productIdTarget.value = ""
    }
    console.log("Product ID cleared")
  }
}
