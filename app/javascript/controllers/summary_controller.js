import { Controller } from "@hotwired/stimulus"
import * as Turbo from "@hotwired/turbo"

export default class extends Controller {
  async fetch(event) {
    const productId = event.currentTarget.dataset.summaryProductId

    try {
      const response = await fetch(`/home/summary/${productId}`, {
        headers: { "Accept": "text/vnd.turbo-stream.html" }
      })
      if (!response.ok) throw new Error("Failed to fetch summary")

      const turboStream = await response.text()
      Turbo.renderStreamMessage(turboStream)

    } catch (error) {
      console.error("Error fetching summary:", error)
    }
  }
}