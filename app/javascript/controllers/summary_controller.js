import { Controller } from "@hotwired/stimulus"
import * as Turbo from "@hotwired/turbo"

export default class extends Controller {
  async fetch(event) {
    const productId = event.currentTarget.dataset.summaryProductId

    // クリックした要素をハイライトする
    document.querySelectorAll("[data-summary-product-id]").forEach(el => {
      el.classList.remove("ring-2", "ring-orange-300", "bg-orange-50/40")
    })
    event.currentTarget.classList.add("ring-2", "ring-orange-300", "bg-orange-50/40")

    try {
      const response = await fetch(`/home/summary/${productId}`, {
        headers: { "Accept": "text/vnd.turbo-stream.html" }
      })
      if (!response.ok) throw new Error("Failed to fetch summary")

      const turboStream = await response.text()
      console.log("📦 Turbo Stream response:", turboStream)
      Turbo.renderStreamMessage(turboStream)

    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }
}