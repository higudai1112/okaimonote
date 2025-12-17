import { Controller } from "@hotwired/stimulus"
import Chart from "chart.js/auto"

export default class extends Controller {
  static targets = ["canvas"]
  static values = {
    prices: Array,
    dates: Array,
    label: String
  }

  connect() {
    if (!this.hasCanvasTarget) return
    if (!this.pricesValue?.length) return

    this.chart = new Chart(this.canvasTarget, {
      type: "line",
      data: {
        labels: this.datesValue,
        datasets: [{
          label: this.labelValue || "中央値",
          data: this.pricesValue,
          borderColor: "rgb(249 115 22)",
          backgroundColor: "rgba(249,115,22,0.2)",
          tension: 0.3,
          fill: true,
          pointRadius: 3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            ticks: {
              callback: value => `¥${value}`
            }
          }
        }
      }
    })
  }

  disconnect() {
    if (this.chart) {
      this.chart.destroy()
    }
  }
}
