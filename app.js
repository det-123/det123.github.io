async function loadContent() {
  const res = await fetch("/content.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load content.json");
  return await res.json();
}

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else node.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c === null || c === undefined) return;
    if (typeof c === "string") node.appendChild(document.createTextNode(c));
    else node.appendChild(c);
  });
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
    nav.map((n) => el("a", { href: n.href }, n.label))
  );

  const row = el("div", { class: "container navRow" }, [
    el("a", { class: "brand", href: "/" }, site.name),
    navLinks,
    button(site.primaryButtonText, site.primaryButtonHref, "outline")
  ]);

  return el("header", { class: "siteHeader" }, [
    row,
    el("div", { class: "container" }, rule())
  ]);
}

function footer(site) {
  const year = new Date().getFullYear();
  return el("footer", { class: "footer" }, el("div", { class: "container" }, [
    rule(),
    el("p", { class: "footerText" }, `© ${year} ${site.name}  ${site.footerNote ? site.footerNote : ""}`)
  ]));
}

function pageHome(data) {
  const h = data.home;

  const hero = el("section", { class: "hero" }, el("div", { class: "container heroGrid" }, [
    el("div", {}, [
      el("p", { class: "kicker" }, h.heroKicker),
      el("h1", { class: "h1" }, h.heroHeadline),
      el("p", { class: "sub" }, h.heroSubhead),
      el("div", { class: "ctaRow" }, [
        button(data.site.primaryButtonText, data.site.primaryButtonHref),
        button(data.site.secondaryButtonText, data.site.secondaryButtonHref, "ghost")
      ])
    ]),
    el("div", {}, mediaBox(h.heroImage ? `/assets/img/${h.heroImage}` : "", "Hero image"))
  ]));

  const services = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("h2", { class: "sectionTitle" }, h.servicesTitle),
    el("div", { class: "cardGrid3" }, h.services.map((s) =>
      el("article", { class: "card" }, [
        el("h3", {}, s.title),
        el("p", {}, s.desc),
        el("a", { class: "link", href: s.href }, "Learn more")
      ])
    )),
    el("div", { style: "margin-top:34px;" }, rule())
  ]));

  const about = el("section", { class: "section" }, el("div", { class: "container split" }, [
    el("div", {}, mediaBox(h.aboutImage ? `/assets/img/${h.aboutImage}` : "", "About image")),
    el("div", {}, [
      el("p", { class: "kicker" }, h.aboutKicker),
      el("h2", { class: "h2" }, h.aboutHeadline),
      el("p", {}, h.aboutBody),
      button(h.aboutButtonText, h.aboutButtonHref, "outline"),
      el("div", { style: "margin-top:34px;" }, rule())
    ])
  ]));

  const resources = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "splitHead" }, [
      el("div", {}, [
        el("p", { class: "kicker" }, h.resourcesKicker),
        el("h2", { class: "sectionTitle" }, h.resourcesHeadline)
      ]),
      button(h.resourcesButtonText, h.resourcesButtonHref, "ghost")
    ]),
    el("div", { class: "postGrid" }, h.featuredPosts.map((p) =>
      el("a", { class: "post", href: "/resources/" }, [
        el("div", { class: "postMedia" }),
        el("div", { class: "postBody" }, [
          el("h3", {}, p.title),
          el("p", { class: "muted" }, p.blurb)
        ])
      ])
    ))
  ]));

  const signup = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "signup" }, [
      el("div", {}, [
        el("h2", { class: "sectionTitle", style: "margin:0 0 10px;" }, h.signupHeadline),
        el("p", { class: "muted", style: "margin:0;" }, h.signupBody)
      ]),
      el("form", { class: "signupForm", action: "#", method: "post" }, [
        el("input", { type: "email", name: "email", placeholder: "Email Address", required: "true" }),
        el("button", { class: "btn", type: "submit" }, "Sign up")
      ])
    ]),
    el("p", { class: "muted", style: "margin:12px 0 0;" }, h.signupNote)
  ]));

  return [hero, services, about, resources, signup];
}

function pageSimpleSection(kicker, headline, body, imageName) {
  return el("section", { class: "section" }, el("div", { class: "container split" }, [
    el("div", {}, mediaBox(imageName ? `/assets/img/${imageName}` : "", headline)),
    el("div", {}, [
      el("p", { class: "kicker" }, kicker),
      el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, headline),
      el("p", {}, body)
    ])
  ]));
}

function pageAbout(data) {
  const a = data.about;
  return [pageSimpleSection(a.kicker, a.headline, a.body, a.image)];
}

function pageServices(data) {
  const s = data.services;

  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, s.kicker),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, s.headline),
    el("p", { class: "sub" }, s.intro),
    rule()
  ]));

  const cards = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "cardGrid3" }, s.offers.map((o) =>
      el("article", { class: "card" }, [
        el("h3", {}, o.title),
        el("p", {}, o.desc),
        el("ul", { class: "muted", style: "margin:0; padding-left:18px;" },
          (o.bullets || []).map((b) => el("li", {}, b))
        )
      ])
    ))
  ]));

  return [top, cards];
}

function pageResources(data) {
  const r = data.resources;

  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, r.kicker),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, r.headline),
    el("p", { class: "sub" }, r.intro)
  ]));

  const grid = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "postGrid" }, (r.items || []).map((it) =>
      el("div", { class: "post" }, [
        el("div", { class: "postMedia" }),
        el("div", { class: "postBody" }, [
          el("h3", {}, it.title),
          el("p", { class: "muted" }, it.desc)
        ])
      ])
    ))
  ]));

  return [top, grid];
}

function pageContact(data) {
  const c = data.contact;

  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, c.kicker),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, c.headline),
    el("p", { class: "sub" }, c.body)
  ]));

  const box = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "notice" }, [
      el("p", { style: "margin:0 0 10px;" }, `${c.emailLabel}: ${c.email}`),
      c.schedulerHref && c.schedulerHref.trim().length > 0
        ? el("p", { style: "margin:0;" }, [
            el("span", {}, `${c.schedulerLabel}: `),
            el("a", { class: "link", href: c.schedulerHref, target: "_blank", rel: "noreferrer" }, c.schedulerText)
          ])
        : el("p", { style: "margin:0;" }, "Add a scheduler link when ready.")
    ])
  ]));

  return [top, box];
}

function pagePortfolio(data) {
  const p = data.portfolio;

  const top = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, p.kicker),
    el("h1", { class: "h1", style: "font-size:clamp(38px,4.2vw,54px);" }, p.headline),
    el("p", { class: "sub" }, p.intro)
  ]));

  const list = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "cardGrid3" }, (p.projects || []).map((proj) =>
      el("article", { class: "card" }, [
        el("h3", {}, proj.title),
        el("p", { class: "muted", style: "margin:0 0 10px;" }, proj.context),
        el("p", {}, proj.work),
        el("p", { class: "muted" }, proj.impact),
        proj.image && proj.image.trim().length > 0
          ? el("div", { style: "margin-top:12px;" }, mediaBox(`/assets/img/${proj.image}`, proj.title))
          : null
      ])
    ))
  ]));

  return [top, list];
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

  sections.forEach((s) => main.appendChild(s));
  return main;
}

async function init() {
  const app = document.getElementById("app");
  const page = document.body.getAttribute("data-page") || "home";

  try {
    const data = await loadContent();
    document.title = page === "home" ? data.site.name : document.title;

    app.innerHTML = "";
    app.appendChild(header(data.site, data.nav));
    app.appendChild(buildMain(data, page));
    app.appendChild(footer(data.site));
  } catch (e) {
    app.innerHTML = "";
    app.appendChild(el("div", { class: "container", style: "padding:56px 0;" }, [
      el("div", { class: "notice" }, [
        el("p", { style: "margin:0 0 10px;" }, "Something went wrong loading the site content."),
        el("p", { class: "muted", style: "margin:0;" }, String(e))
      ])
    ]));
  }
}

init();
