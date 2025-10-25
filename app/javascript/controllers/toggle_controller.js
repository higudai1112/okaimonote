import { Controller } from "@hotwired/stimulus"

// data-controller="toggle" を持つ要素に対応
export default class extends Controller {
  static targets = ["content"]

  toggle() {
    this.contentTarget.classList.toggle("hidden")
  }
}