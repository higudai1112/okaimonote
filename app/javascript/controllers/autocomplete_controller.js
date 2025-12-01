import { Controller } from "@hotwired/stimulus"
import { Turbo } from "@hotwired/turbo-rails"

export default class extends Controller {
  static targets = ["input", "results", "productId", "categoryWrapper"]

  connect() {
    // 枠外クリックで候補を閉じる
    this.outsideClickHandler = (event) => {
      if (!this.element.contains(event.target)) {
        this.closeResults()
      }
    }
    document.addEventListener("click", this.outsideClickHandler)

    // blur（入力欄からフォーカスが外れたら閉じる）
    this.inputTarget.addEventListener("blur", () => {
      setTimeout(() => this.closeResults(), 120) // 選択クリックを守るため少し遅延
    })
  }

  disconnect() {
    document.removeEventListener("click", this.outsideClickHandler)
  }

  clearProductId() {
    if (this.hasProductIdTarget) {
      this.productIdTarget.value = ""
    }
  }

  search() {
    const q = this.inputTarget.value.trim()

    if (q === "") {
      this.closeResults()
      return
    }

    fetch(`/products/autocomplete?q=${encodeURIComponent(q)}`, {
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    })
      .then(res => res.text())
      .then(html => Turbo.renderStreamMessage(html))
  }

  select(event) {
    const el = event.currentTarget;

    // 商品名を入力欄へ
    this.inputTarget.value = el.dataset.value || "";

    // product_id を hidden_field に反映（既存商品）
    if (this.hasProductIdTarget) {
      this.productIdTarget.value = el.dataset.productId || "";
    }

    // カテゴリー欄の表示制御
    if (this.hasCategoryWrapperTarget) {
      if (el.dataset.productId) {
        // 既存商品 → カテゴリー欄は隠す
        this.categoryWrapperTarget.classList.add("hidden");
      } else {
        // 新規商品 → カテゴリー欄は表示する
        this.categoryWrapperTarget.classList.remove("hidden");
      }
    }

    this.closeResults();
  }

  // 共通：候補を閉じる処理
  closeResults() {
    this.resultsTarget.classList.add("hidden")
    this.resultsTarget.innerHTML = ""
  }
}

