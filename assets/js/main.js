/* Amaal Abdou — bilingual, themeable, responsive portfolio */
(function () {
  "use strict";
  var LS = {
    THEME: "amaal-theme",
    LANG: "amaal-lang"
  };
  function detectLang() {
    var saved = null;
    try { saved = window.localStorage.getItem(LS.LANG); } catch (e) {}
    if (saved === "ar" || saved === "en") return saved;
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("ar") === 0 ? "ar" : "en";
  }
  function detectTheme() {
    var saved = null;
    try { saved = window.localStorage.getItem(LS.THEME); } catch (e) {}
    if (saved === "dark" || saved === "light") return saved;
    var m = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    return m && m.matches ? "dark" : "light";
  }
  var lang = detectLang();
  var isAr = lang === "ar";
  var theme = detectTheme();

  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function pick(obj, field, arField, fallback) {
    var v;
    if (obj) {
      if (isAr && arField && obj[arField] != null && obj[arField] !== "") v = obj[arField];
      else v = obj[field];
    }
    return v == null || v === "" ? (fallback == null ? "" : fallback) : v;
  }
  function setText(id, value) {
    var el = $(id);
    if (el && value != null) el.textContent = value;
  }
  function setLink(id, url) {
    var el = $(id);
    if (el && url) el.setAttribute("href", url);
  }

  var data = null;      /* site.json */
  var projects = [];    /* projects.json */

  function setRTL() {
    document.documentElement.setAttribute("lang", isAr ? "ar" : "en");
    document.documentElement.setAttribute("dir", isAr ? "rtl" : "ltr");
    document.body.classList.toggle("ar-mode", isAr);
  }
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    var btn = $("theme-toggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function toggleLang() {
    isAr = !isAr;
    lang = isAr ? "ar" : "en";
    try { window.localStorage.setItem(LS.LANG, lang); } catch (e) {}
    setRTL();
    renderAll();
  }
  function toggleTheme() {
    theme = theme === "dark" ? "light" : "dark";
    try { window.localStorage.setItem(LS.THEME, theme); } catch (e) {}
    applyTheme();
  }

  /* ---------- history ---------- */
  function history() {
    var items = data && data.experience || [];
    var el = $("exp-list");
    if (!el) return;
    var h = "";
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var role = pick(it, "role", "roleAr", it.role);
      var org = pick(it, "org", "orgAr", it.org);
      h += "<li><strong>" + esc(role) + "</strong><span>" + esc(org) + "</span></li>";
    }
    el.innerHTML = h;
  }
  function tools() {
    var list = data ? pick(data, "tools", "toolsAr", []) : [];
    if (typeof list === "string") list = list.split(",");
    var el = $("tools-list");
    if (!el) return;
    var h = "";
    for (var i = 0; i < list.length; i++) h += "<li>" + esc(list[i]) + "</li>";
    el.innerHTML = h;
  }

  /* ---------- hero ---------- */
  function hero() {
    setText("hero-kicker", pick(data, "heroKicker", "heroKickerAr", "Graphic Designer — Egypt"));
    setText("hero-lead", pick(data, "heroLead", "heroLeadAr", "I turn ideas into visual stories people remember."));

    var title = $("hero-title");
    if (title && data) {
      var lines = pick(data, "heroLines", "heroLinesAr", []);
      var accent = (data.heroAccentLine != null ? data.heroAccentLine : 惯性);
      var h = "";
      for (var i = 0; i < lines.length; i++) {
        h += (i === accent ? '<span class="accent">' + esc(lines[i]) + "</span>" : esc(lines[i]));
        if (i < lines.length - 1) h += "<br>";
      }
      title.innerHTML = h;
    }
    setText("hero-note", pick(data, "heroNote", "heroNoteAr", ""));
  }

  /* ---------- marquee ---------- */
  function marquee() {
    var track = $("marquee-track");
    if (!track || !data) return;
    var words = pick(data, "marquee", "marqueeAr", []);
    var h = "";
    for (var pass = 0; pass < 2; pass++)
      for (var i = 0; i < words.length; i++) h += "<span>" + esc(words[i]) + " &bull;</span>";
    track.innerHTML = h;
  }

  /* ---------- projects ---------- */
  function card(p) {
    var title = pick(p, "title", "titleAr", p.title);
    var cat = pick(p, "category", "categoryAr", p.category);
    var desc = pick(p, "description", "descriptionAr", p.description);
    var toolsList = pick(p, "tools", "toolsAr", []);
    var image = p.image || "assets/img/03.png";
    var link = p.link || "https://www.behance.net/amaalabdou";
    var badge = p.featured ? '<span class="card-badge">' + esc(isAr ? "Featured" : "Featured") + "</span>" : "";
    var t = "<ul class=\"card-tools\">";
    for (var i = 0; i < toolsList.length; i++) t += "<li>" + esc(toolsList[i]) + "</li>";
    t += "</ul>";
    return (
      '<article class="card' + (p.featured ? " featured" : "") + '">' +
        '<a class="card-media" href="' + esc(link) + '" target="_blank" rel="noopener">' +
          '<img src="' + esc(image) + '" alt="' + esc(title) + '" loading="lazy">' + badge +
        "</a>" +
        '<div class="card-body">' +
          '<h3 class="card-title">' + esc(title) + "</h3>" +
          '<p class="card-category">' + esc(cat) + "</p>" +
          "<p>" + esc(desc) + "</p>" + t +
        "</div>" +
      "</article>"
    );
  }
  function projectsGrid() {
    var grid = $("project-grid");
    if (!grid) return;
    if (!projects.length) { grid.innerHTML = '<p class="grid-empty">' + esc(isAr ? "جاري التحميل…" : "Loading work…") + "</p>"; return; }
    var h = "";
    for (var i = 0; i < projects.length; i++) h += card(projects[i]);
    grid.innerHTML = h;
  }

  /* ---------- about ---------- */
  function about() {
    setText("about-kicker", pick(data, "aboutKicker", "aboutKickerAr", "About"));
    setText("about-lead", pick(data, "aboutLead", "aboutLeadAr", "The person behind the pixels."));
    var text = $("about-text");
    if (text && data) {
      var paras = pick(data, "aboutParagraphs", "aboutParagraphsAr", []);
      var h = "";
      for (var i = 0; i < paras.length; i++) h += "<p>" + esc(paras[i]) + "</p>";
      text.innerHTML = h;
    }
  }

  /* ---------- contact ---------- */
  function contact() {
    setText("contact-title", pick(data, "contactTitle", "contactTitleAr", "Let's talk together."));
    setText("contact-sub", pick(data, "contactSub", "contactSubAr", ""));
    var email = pick(data, "email", "email", "abdouamaal85@gmail.com");
    setLink("contact-email", "mailto:" + email);
    var phone = pick(data, "phone", "phone", "+2 010 17 95 24 65");
    setLink("contact-phone", "tel:" + String(phone).replace(/[^+\d]/g, ""));
    setLink("contact-behance", pick(data, "behanceUrl", "behanceUrl", "https://www.behance.net/amaalabdou"));
    setLink("contact-linkedin", pick(data, "linkedinUrl", "linkedinUrl", "https://www.linkedin.com/in/amaal-abdou"));
  }

  /* ---------- footer ---------- */
  function footer() {
    setText("footer-name", pick(data, "name", "nameAr", "Amaal Abdou"));
    setText("footer-credit", pick(data, "footerCredit", "footerCreditAr", "Designed & built by Amaal"));
    var year = $("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- nav ---------- */
  function nav() {
    setText("nav-home", pick(data, "navHome", "navHomeAr", "Home"));
    setText("nav-work", pick(data, "navWork", "navWorkAr", "Work"));
    setText("nav-about", pick(data, "navAbout", "navAboutAr", "About"));
    setText("nav-contact", pick(data, "navContact", "navContactAr", "Contact"));
    var pill = $("nav-pill");
    if (pill) pill.textContent = pick(data, "navPill", "navPillAr", "Available for work");
  }

  /* ---------- hamburger ---------- */
  function hamburger() {
    var btn = $("nav-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- reveal ---------- */
  function reveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { for (var i = 0; i < els.length; i++) els[i].classList.add("is-in"); return; }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++)
        if (entries[i].isIntersecting) { entries[i].target.classList.add("is-in"); io.unobserve(entries[i].target); }
    }, { threshold: 0.12 });
    for (var i = 0; i < els.length; i++) io.observe(els[i]);
  }

  function renderChrome() {
    setText("site-wordmark", pick(data, "name", "nameAr", "Amaal Abdou"));
  }
  function renderAll() {
    if (!data) return;
    renderChrome();
    nav();
    hero();
    marquee();
    projectsGrid();
    about();
    contact();
    footer();
  }

  function init() {
    setRTL();
    applyTheme();
    hamburger();
    reveal();

    var t = $("theme-toggle");
    if (t) t.addEventListener("click", toggleTheme);
    var l = $("lang-toggle");
    if (l) l.addEventListener("click", toggleLangapsed);

    Promise.all([
      fetch("content/site.json").then(function (r) { return r.ok ? r.json() : Promise.reject(); }),
      fetch("content/projects.json").then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    ]).then(function (res) {
      data = res[0];
      projects = res[1];
      renderAll();
    }).catch(function () {
      var g = $("project-grid");
      if (g) g.innerHTML = "<p>" + esc("Could not load content — please reload.") + "</p>";
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
