import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]

  connect() {
    console.log("✅ Sidebar controller connected!")
    console.log("📍 Menu target:", this.menuTarget) // デバッグ用

    if (window.innerWidth >= 768) {
      // PCは常時表示
      this.menuTarget.classList.add("translate-x-0")
      this.menuTarget.classList.remove("-translate-x-full")
    } else {
      // モバイルは閉じた状態スタート
      this.menuTarget.classList.add("-translate-x-full")
      this.menuTarget.classList.remove("translate-x-0")
    }
  }

  toggle() {
    console.log("🔄 Toggle clicked!")
    this.menuTarget.classList.toggle("-translate-x-full")
    this.menuTarget.classList.toggle("translate-x-0")
  }
}
