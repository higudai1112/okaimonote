// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import "./turbo/redirect"

// Google Analytics 用 Turbo 対応 page_view
document.addEventListener("turbo:load", () => {
  if (typeof gtag === "function") {
    gtag("event", "page_view", {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title
    });
  }
});