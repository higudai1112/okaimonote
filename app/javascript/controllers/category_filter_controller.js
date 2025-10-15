import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  change(event) {
    console.log("Change event fired!")
    
    // 現在のページのURLを基に新しいURLを構築
    const url = new URL(window.location.href)
    url.searchParams.set("mode", "existing")
    url.searchParams.set("category_filter", event.target.value)

    //  Turbo Frame で部分更新
    fetch(url, {
      headers: { "Accept": "text/vnd.turbo-stream.html" }
    }).then(response => response.text())
      .then(html => {
        // ここを追加
        console.log("=== TURBO STREAM RESPONSE ===")
        console.log(html)
        console.log("=== RESPONSE LENGTH ===", html.length)

        if (html.length === 0) {
          console.warn("⚠️ Turbo Stream response is empty! Controller側でformat.turbo_streamが発火していない可能性があります。")
        }

        // Turbo Streamを実行
        Turbo.renderStreamMessage(html)

        // --- 念のため fallback: 自力でDOM書き換え ---
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, "text/html")
        const turboStream = doc.querySelector("turbo-stream")

        if (turboStream) {
          const targetId = turboStream.getAttribute("target")
          const newContent = turboStream.querySelector("template").innerHTML.trim()
          const targetElement = document.getElementById(targetId)

          if (targetElement) {
            console.log(`✅ Fallback: replacing content of #${targetId}`)
            targetElement.innerHTML = newContent
          } else {
            console.warn(`⚠️ Fallback: target #${targetId} not found in DOM`)
          }
        }
      })
      .catch(error => console.error("Error:", error))
  }
}