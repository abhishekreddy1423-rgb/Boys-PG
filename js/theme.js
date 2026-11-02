/**
 * Dark / Light Mode Switcher
 * ==========================
 * Sri Mallikarjuna Swami The Boys PG
 */

window.ThemeManager = {
  theme: "light",

  init() {
    const saved = localStorage.getItem("pg_theme");
    if (saved === "dark" || saved === "light") {
      this.theme = saved;
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      this.theme = "dark";
    } else {
      this.theme = "light";
    }

    this.applyTheme(this.theme);

    // Watch system changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (!localStorage.getItem("pg_theme")) {
          this.applyTheme(e.matches ? "dark" : "light");
        }
      });
    }
  },

  toggle() {
    const newTheme = this.theme === "dark" ? "light" : "dark";
    this.theme = newTheme;
    localStorage.setItem("pg_theme", newTheme);
    this.applyTheme(newTheme);
  },

  applyTheme(theme) {
    this.theme = theme;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }

    // Update toggle icons
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
      const sunIcon = btn.querySelector(".icon-sun");
      const moonIcon = btn.querySelector(".icon-moon");
      if (sunIcon && moonIcon) {
        if (theme === "dark") {
          sunIcon.style.display = "block";
          moonIcon.style.display = "none";
        } else {
          sunIcon.style.display = "none";
          moonIcon.style.display = "block";
        }
      }
    });

    // Update browser theme-color meta tag
    let metaTheme = document.querySelector('meta[name="theme-color"]');
    if (!metaTheme) {
      metaTheme = document.createElement("meta");
      metaTheme.setAttribute("name", "theme-color");
      document.head.appendChild(metaTheme);
    }
    metaTheme.setAttribute("content", theme === "dark" ? "#0f172a" : "#0f2b48");
  }
};
