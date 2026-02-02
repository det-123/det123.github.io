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

//  const latest = el("section", { class: "section" }, el("div", { class: "container" }, [
//    el("h2", { class: "sectionTitle" }, h.latestTitle || "Latest"),
//   el("div", { class: "postGrid" }, (h.latestItems || []).map((it) =>
//      el("a", { class: "post", href: it.href || "/resources/" }, [
//        el("div", { class: "postMedia" }, it.image && it.image.trim().length > 0
//          ? el("img", { class: "postImg", src: `/assets/img/${it.image}`, alt: it.title })
//         : null
//      ),
//        el("div", { class: "postBody" }, [
//          el("h3", {}, it.title),
//          el("p", { class: "muted" }, it.desc || "")
//        ])
//      ])
//    )),
//    el("div", { style: "margin-top:34px;" }, rule())
//  ]));

  const cred = el("section", { class: "section" }, el("div", { class: "container split" }, [
    el("div", {}, [
      el("p", { class: "kicker" }, "About"),
      el("h2", { class: "h2" }, "Executive level HR, without the overhead"),
      el("p", {}, h.credBody || ""),
      button("Learn more", "/about/", "outline")
    ]),
    el("div", {}, mediaBox(h.credImage ? `/assets/img/${h.credImage}` : "", "Credibility image"))
  ]));

  const solutions = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("h2", { class: "sectionTitle" }, h.solutionsTitle || "Solutions"),
    el("div", { class: "cardGrid4" }, (h.solutions || []).map((s) =>
      el("article", { class: "card" }, [
        el("h3", {}, s.title),
        s.price && s.price.trim().length > 0 ? el("p", { class: "price" }, s.price) : null,
        el("p", { class: "muted" }, s.desc || ""),
        el("div", { style: "margin-top:12px;" }, button(s.buttonText || "Explore", s.buttonHref || "/service-offerings/", "outline"))
      ])
    )),
    el("div", { style: "margin-top:34px;" }, rule())
  ]));

  const cta = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("div", { class: "signup" }, [
      el("div", {}, [
        el("h2", { class: "sectionTitle", style: "margin:0 0 10px;" }, h.ctaTitle || "Get in touch"),
        el("p", { class: "muted", style: "margin:0;" }, h.ctaBody || "")
      ]),
      el("div", {}, button(h.ctaButtonText || "Contact", h.ctaButtonHref || "/contact/"))
    ])
  ]));

  const expertise = el("section", { class: "section" }, el("div", { class: "container split" }, [
    el("div", {}, [
      el("p", { class: "kicker" }, h.expertiseTitle || "Expertise"),
      el("h2", { class: "h2" }, "Practical support that holds up in real organizations"),
      el("p", {}, h.expertiseBody || "")
    ]),
    el("div", {}, mediaBox("", ""))
  ]));

  const social = el("section", { class: "section" }, el("div", { class: "container" }, [
    el("p", { class: "kicker" }, h.socialTitle || "Social"),
    el("div", { class: "socialRow" }, (h.socialLinks || []).map((s) =>
      s.href && s.href.trim().length > 0
        ? el("a", { class: "btn btnGhost", href: s.href, target: "_blank", rel: "noreferrer" }, s.label)
        : el("span", { class: "btn btnGhost", style: "opacity:0.55; cursor:default;" }, s.label)
    ))
  ]));

  return [hero, cred, solutions, cta, expertise, social];
}
