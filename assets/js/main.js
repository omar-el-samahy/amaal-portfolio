/* Amaal Abdou — portfolio interactions + data-driven rendering */
(function () {
  "use strict";

  var revealEls = document.querySelectorAll(".reveal");
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  function observe(el) {
    if (io) io.observe(el);
    else el.classList.add("is-in");
  }

  function esc(s) {
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function escAttr(s) { return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el && val !== undefined && val !== null && val !== "") el.textContent = val;
  }

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var site = null;

  function renderSite() {
    if (!site) return;

    setText("site-wordmark", site.name + "\u00ae");
    document.title = site.name + " — " + site.role;
    setText("hero-kicker", site.heroKicker);
    setText("hero-lead", site.heroLead);
    setText("hero-note", site.heroNote);

    // Hero title lines
    var hTitle = document.getElementById("hero-title");
    if (hTitle && site.heroLines && site.heroLines.length) {
      hTitle.textContent = "";
      site.heroLines.forEach(function (line, i) {
        var s = document.createElement("span");
        s.className = "line reveal" + (i === Number(site.heroAccentLine) ? " accent" : "");
        s.style.setProperty("--d", (i * 0.1 + 0.05).toFixed(2) + "s");
        s.textContent = line;
        hTitle.appendChild(s);
        observe(s);
      });
    }

    // Marquee
    var mq = document.getElementById("marquee-track");
    if (mq && site.marquee && site.marquee.length) {
      var inner = site.marquee.map(function (w) {
        return "<span>" + esc(w) + "</span><i>&#10003;</i>";
      }).join("");
      mq.innerHTML = inner + inner; // duplicate for the -50% loop
    }

    setText("work-title", site.workTitle);
    setText("work-intro", site.workIntro);
    var wm = document.getElementById("work-more");
    if (wm) wm.innerHTML = esc(site.workMoreText) + ' <span aria-hidden="true">&rarr;</span>';

    setText("about-title", site.aboutTitle);
    setText("about-intro", site.aboutIntro);

    // About paragraphs + actions
    var aboutText = document.getElementById("about-text");
    if (aboutText) {
      aboutText.textContent = "";
      (site.aboutParagraphs || []).forEach(function (p) {
        var el = document.createElement("p");
        el.textContent = p;
        aboutText.appendChild(el);
      });
      var actions = document.createElement("div");
      actions.className = "about-actions";
      actions.innerHTML =
        '<a class="btn btn-solid" href="' + escAttr(site.behanceUrl) + '" target="_blank" rel="noopener">Behance profile</a>' +
        '<a class="btn btn-ghost" href="' + escAttr(site.linkedinUrl) + '" target="_blank" rel="noopener">LinkedIn</a>';
      aboutText.appendChild(actions);
    }

    // Experience list
    var xp = document.getElementById("exp-list");
    if (xp) {
      xp.textContent = "";
      (site.experience || []).forEach(function (job) {
        var li = document.createElement("li");
        var strong = document.createElement("strong");
        strong.textContent = job.role;
        var span = document.createElement("span");
        span.textContent = job.org;
        li.appendChild(strong);
        li.appendChild(span);
        xp.appendChild(li);
      });
    }

    // Tools
    var tl = document.getElementById("tools-list");
    if (tl) {
      tl.textContent = "";
      (site.tools || []).forEach(function (t) {
        var li = document.createElement("li");
        li.textContent = t;
        tl.appendChild(li);
      });
    }

    // Contact
    var ct = document.getElementById("contact-title");
    if (ct) ct.innerHTML = esc(site.contactTitle1) + "<br>" + esc(site.contactTitle2);
    setText("contact-sub", site.contactSub);
    var ce = document.getElementById("contact-email");
    if (ce) { ce.href = "mailto:" + site.email; ce.textContent = site.email; }
    var cp = document.getElementById("contact-phone");
    if (cp) { cp.href = "tel:" + site.phone.replace(/[^+\d]/g, ""); cp.textContent = site.phone; }
    var cb = document.getElementById("contact-behance");
    if (cb) cb.href = site.behanceUrl;
    var cl = document.getElementById("contact-linkedin");
    if (cl) cl.href = site.linkedinUrl;

    // Footer
    setText("footer-name", site.name);
    setText("footer-credit", site.footerCredit);
  }

  // --- Projects ---
  function buildCard(p, index) {
    var art = document.createElement("article");
    art.className = "card reveal";
    var tags = (p.tools || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    art.innerHTML =
      '<a class="thumb" href="' + escAttr(p.link || "#") + '" target="_blank" rel="noopener">' +
      '  <img src="' + escAttr(p.image) + '" alt="' + escAttr(p.title) + '" loading="lazy">' +
      (p.category ? '<span class="thumb-tag">' + esc(p.category) + "</span>" : "") +
      "</a>" +
      '<div class="card-body">' +
      '  <h3><a href="' + escAttr(p.link || "#") + '" target="_blank" rel="noopener">' + esc(p.title) + "</a></h3>" +
      "  <p>" + esc(p.description || "") + "</p>" +
      (tags ? '<ul class="tags" aria-label="Tools">' + tags + "</ul>" : "") +
      "</div>";
    return art;
  }

  function renderProjects(list, gridEl) {
    gridEl.setAttribute("aria-busy", "false");
    gridEl.textContent = "";
    if (!list || !list.length) {
      gridEl.className = "grid grid-empty reveal";
      gridEl.innerHTML = "<p>Work coming soon.</p>";
      return;
    }
    var frag = document.createDocumentFragment();
    list.forEach(function (p) { frag.appendChild(buildCard(p)); });
    gridEl.appendChild(frag);
    gridEl.querySelectorAll(".reveal").forEach(function (el) {
      setTimeout(function () { observe(el); }, 60);
    });
  }

  function loadProjects(gridEl) {
    return fetch("content/projects.json")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (projects) { renderProjects(projects, gridEl); })
      .catch(function (err) {
        gridEl.setAttribute("aria-busy", "false");
        gridEl.className = "grid grid-empty reveal";
        gridEl.innerHTML = "<p>Couldn't load projects right now. Please refresh.</p>";
        console.error("projects.json load error:", err);
      });
  }

  // Load site content then projects
  fetch("content/site.json")
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      site = data;
      renderSite();
    })
    .catch(function (err) { console.warn("site.json fallback to defaults:", err); });

  var gridEl = document.getElementById("project-grid");
  if (gridEl) loadProjects(gridEl);

  // Active nav highlight while scrolling
  var sections = ["#work", "#about", "#contact"];
  var navLinks = document.querySelectorAll(".head-nav a");
  var scrollTimeout = null;
  function highlight() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = "#work";
    sections.forEach(function (id) {
      var sec = document.querySelector(id);
      if (sec && sec.offsetTop <= pos) current = id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle("is-active", a.getAttribute("href") === current);
    });
  }
  window.addEventListener("scroll", function () {
    if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    scrollTimeout = window.requestAnimationFrame(highlight);
  }, { passive: true });
  highlight();
})();