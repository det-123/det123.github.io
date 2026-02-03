async function loadContent() {
  const res = await fetch("/content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load content.json");
  return await res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  }
  const list = Array.isArray(children) ? children : [children];
  for (const c of list) {
    if (c === null || c === undefined) continue;
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  }
  return node;
}

function rule() {
  return el("div", { class: "rule" });
}

function button(text, href, variant) {
  const cls = variant === "outline" ? "btn btnOutline" : variant === "ghost" ? "btn btnGhost" : "btn";
  return el("a", { class: cls, href }, text);
}

function mediaBox(imagePath, altText) {
  if (imagePath && imagePath.trim().length > 0) {
    return el("div", { class: "mediaBox" }, el("img", { class: "mediaImg", src: imagePath, alt: altText || "" }));
  }
  return el("div", { class: "mediaBox" }, el("div", { class: "mediaPlaceholder" }, "Add an image"));
}

function header(site, nav) {
  const navLinks = el("nav", { class: "navLinks", "aria-label": "Primary" },
    (nav || []).map((n) => el("a", { href: n.href }, n.label))
  );

  const row = el("div", { class: "container navRow" }, [
    el("a", { class: "brand", href: "/" }, site.name || "Site"),
    navLinks,
    button(site.primaryButtonText || "Contact", site.primaryButtonHref || "/contact/", "outline")
  ]);

  return el("header", { class: "siteHeader" }, [
    row,
    el("div", { class: "container" }, rule())
  ]);
}

function footer(site) {
  const year = new Date().getFullYear();
  const note = site.footerNote ? `  ${site.footerNote}` : "";
  return el("footer", { class: "footer" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "footerText" }, `© ${year} ${site.name || ""}${note}`)
  ]));
}

function pageHome(data) {
  const h = data.home || {};

  const hero = el("section", { class: "hero" }, el("div", { class: "container" }, [
    el("div", { class: "heroStack" }, [
      el("p", { class: "kicker" }, h.heroKicker || ""),
      el("h1", { class: "h1" }, h.heroHeadline || ""),
      el("p", { class: "sub" }, h.heroSubhead || ""),
      el("div", { class: "ctaRow" }, [
        button(data.site.primaryButtonText || "Contact", data.site.primaryButtonHref || "/contact/"),
        button(data.site.secondaryButtonText || "Services", data.site.secondaryButtonHref || "/service-offerings/", "ghost")
      ])
    ]),
    el("div", { style: "margin-top:22px;" },
      mediaBox(h.heroImage ? `/assets/img/${h.heroImage}` : "", "Hero image")
    )
  ]));

  const divider1 = el("div", { class: "divider" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "dividerText" }, "Section")
  ]));

  const cred = el("section", { class: "section" }, el("div", { class: "container split" }, [
    el("div", {}, [
      el("p", { class: "kicker" }, h.credKicker || "About"),
      el("h2", { class: "h2" }, h.credHeadline || ""),
      el("p", {}, h.credBody || ""),
      button(h.credButtonText || "Learn more", h.credButtonHref || "/about/", "outline")
    ]),
    el("div", {}, mediaBox(h.credImage ? `/assets/img/${h.credImage}` : "", "About image"))
  ]));

  const divider2 = el("div", { class: "divider" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "dividerText" }, "Section")
  ]));

  const solutions = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("h2", { class: "sectionTitle" }, h.solutionsTitle || "Solutions"),
    el("div", { class: "cardGrid4" }, (h.solutions || []).map((s) =>
      el("article", { class: "card" }, [
        el("h3", {}, s.title || ""),
        el("p", { class: "muted" }, s.desc || ""),
        el("div", { style: "margin-top:12px;" },
          button(s.buttonText || "Explore", s.buttonHref || "/service-offerings/", "outline")
        )
      ])
    ))
  ]));

  const divider3 = el("div", { class: "divider" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "dividerText" }, "Section")
  ]));

  const cta = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "signup" }, [
      el("div", {}, [
        el("h2", { class: "sectionTitle", style: "margin:0 0 10px;" }, h.ctaTitle || "Let’s talk"),
        el("p", { class: "muted", style: "margin:0;" }, h.ctaBody || "")
      ]),
      el("div", {}, button(h.ctaButtonText || "Contact", h.ctaButtonHref || "/contact/"))
    ])
  ]));

  const divider4 = el("div", { class: "divider" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "dividerText" }, "Section")
  ]));

  const expertise = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, h.expertiseKicker || "Expertise"),
    el("h2", { class: "h2" }, h.expertiseHeadline || ""),
    el("p", {}, h.expertiseBody || "")
  ]));

  const social = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, h.socialTitle || "Follow along"),
    el("div", { class: "socialRow" }, (h.socialLinks || []).map((s) =>
      s.href && s.href.trim().length > 0
        ? el("a", { class: "btn btnGhost", href: s.href, target: "_blank", rel: "noreferrer" }, s.label)
        : el("span", { class: "btn btnGhost", style: "opacity:0.55; cursor:default;" }, s.label)
    ))
  ]));

  return [hero, divider1, cred, divider2, solutions, divider3, cta, divider4, expertise, social];
}

function pageAbout(data) {
  const a = data.about || {};
  return [
    el("section", { class: "section" }, el("div", { class: "container split" }, [
      el("div", {}, mediaBox(a.image ? `/assets/img/${a.image}` : "", "About image")),
      el("div", {}, [
        el("p", { class: "kicker" }, a.kicker || "About"),
        el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, a.headline || ""),
        el("p", {}, a.body || "")
      ])
    ]))
  ];
}

function pageServices(data) {
  const s = data.services || {};
  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, s.kicker || "Service offerings"),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, s.headline || ""),
    el("p", { class: "sub" }, s.intro || ""),
    rule()
  ]));

  const cards = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "cardGrid4" }, (s.offers || []).map((o) =>
      el("article", { class: "card" }, [
        el("h3", {}, o.title || ""),
        el("p", { class: "muted" }, o.desc || ""),
        el("ul", { class: "muted", style: "margin:0; padding-left:18px;" },
          (o.bullets || []).map((b) => el("li", {}, b))
        )
      ])
    ))
  ]));

  return [top, cards];
}

function pageResources(data) {
  const r = data.resources || {};
  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, r.kicker || "Resources"),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, r.headline || ""),
    el("p", { class: "sub" }, r.intro || "")
  ]));

  const list = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "cardGrid4" }, (r.items || []).map((it) =>
      el("article", { class: "card" }, [
        el("h3", {}, it.title || ""),
        el("p", { class: "muted" }, it.desc || "")
      ])
    ))
  ]));

  return [top, list];
}

function pageContact(data) {
  const c = data.contact || {};
  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, c.kicker || "Contact"),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, c.headline || ""),
    el("p", { class: "sub" }, c.body || "")
  ]));

  const box = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "notice" }, [
      el("p", { style: "margin:0 0 10px;" }, `${c.emailLabel || "Email"}: ${c.email || ""}`),
      c.schedulerHref && c.schedulerHref.trim().length > 0
        ? el("p", { style: "margin:0;" }, [
            el("span", {}, `${c.schedulerLabel || "Scheduler"}: `),
            el("a", { class: "btn btnGhost", href: c.schedulerHref, target: "_blank", rel: "noreferrer" }, c.schedulerText || "Schedule")
          ])
        : el("p", { style: "margin:0;" }, "Add a scheduler link when ready.")
    ])
  ]));

  return [top, box];
}

function pagePortfolio(data) {
  const p = data.portfolio || {};
  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, p.kicker || "Portfolio"),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, p.headline || ""),
    el("p", { class: "sub" }, p.intro || "")
  ]));

  const grid = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "cardGrid4" }, (p.projects || []).map((proj) =>
      el("article", { class: "card" }, [
        el("h3", {}, proj.title || ""),
        el("p", { class: "muted", style: "margin:0 0 10px;" }, proj.context || ""),
        el("p", {}, proj.work || ""),
        el("p", { class: "muted" }, proj.impact || "")
      ])
    ))
  ]));

  return [top, grid];
}

function buildMain(data, page) {
  const main = el("main", {}, []);
  let sections = [];

  if (page === "home") sections = pageHome(data);
  else if (page === "about") sections = pageAbout(data);
  else if (page === "services") sections = pageServices(data);
  else if (page === "resources") sections = pageResources(data);
  else if (page === "contact") sections = pageContact(data);
  else if (page === "portfolio") sections = pagePortfolio(data);
  else sections = [el("section", { class: "section" }, el("div", { class: "container" }, el("p", {}, "Page not found.")))];

  for (const s of sections) main.appendChild(s);
  return main;
}

async function init() {
  const app = document.getElementById("app");
  const page = document.body.getAttribute("data-page") || "home";

  try {
    const data = await loadContent();
    app.innerHTML = "";
    app.appendChild(header(data.site || {}, data.nav || []));
    app.appendChild(buildMain(data, page));
    app.appendChild(footer(data.site || {}));
  } catch (e) {
    app.innerHTML = "";
    app.appendChild(el("div", { class: "container", style: "padding:56px 0;" }, [
      el("div", { class: "notice" }, [
        el("p", { style: "margin:0 0 10px;" }, "The site could not load."),
        el("p", { class: "muted", style: "margin:0;" }, String(e))
      ])
    ]));
  }
}

init();
