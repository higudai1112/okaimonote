import { StreamActions } from "@hotwired/turbo"
import * as Turbo from "@hotwired/turbo"

// <turbo-stream action="redirect" target="/path"> に対応
StreamActions.redirect = function () {
  const url = this.target || this.getAttribute("url")
  if (url) {
    console.log("[Turbo Stream Redirect] visiting:", url)
    Turbo.visit(url)
  } else {
    console.warn("[Turbo Stream Redirect] missing URL in <turbo-stream>")
  }
}