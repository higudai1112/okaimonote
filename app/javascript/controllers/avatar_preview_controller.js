// アイコンのプレビュー
import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="avatar-preview"
export default class extends Controller {
  static targets = ["input", "preview"]

  preview() {
    const file = this.inputTarget.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.previewTarget.src = e.target.result
        this.previewTarget.classList.remove("hidden", "opacity-0")
        this.previewTarget.classList.add("opacity-100")
      }
      reader.readAsDataURL(file)
    }
  }
}
