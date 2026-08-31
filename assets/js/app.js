/* EUROBROKER — aplikacija (router + rendering + interakcije) */
(function () {
  "use strict";
  const C = () => window.EB_CONTENT || {};
  const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])));

  /* --- osnovna putanja (za GitHub Pages podputanju /<repo>/) --- */
  EB.BASE = (function () {
    if (typeof location !== "undefined" && location.hostname.slice(-10) === ".github.io") {
      var s = location.pathname.split("/").filter(Boolean)[0];
      if (s) return "/" + s + "/";
    }
    return "/";
  })();
  const BASEP = EB.BASE.replace(/\/$/, ""); // "" ili "/EUBR-sajt"

  /* --- dvojezičnost --- */
  EB.lang = (typeof localStorage !== "undefined" && localStorage.getItem("eb_lang") === "en") ? "en" : "sr";
  const T = (k) => { const e = (window.EB_I18N && EB_I18N.ui[k]) || null; return e ? (e[EB.lang] || e.sr) : k; };
  const content = (slug) => {
    const sr = (window.EB_CONTENT || {})[slug] || {};
    if (EB.lang === "en" && window.EB_I18N && EB_I18N.content[slug]) return Object.assign({}, sr, EB_I18N.content[slug]);
    return sr;
  };
  const isEN = () => EB.lang === "en";
  // hero naslov iz tabele: *zvjezdice* daju zlatni naglasak; bez njih se pozlati druga polovina
  const heroAccent = (s) => {
    s = (s || "").trim();
    if (s.indexOf("*") !== -1) return esc(s).replace(/\*([^*]+)\*/g, '<span class="accent">$1</span>');
    const w = s.split(/\s+/);
    if (w.length < 2) return esc(s);
    const cut = Math.floor(w.length / 2);
    return esc(w.slice(0, cut).join(" ")) + ' <span class="accent">' + esc(w.slice(cut).join(" ")) + "</span>";
  };
  const i18 = (bucket, slug) => (isEN() && window.EB_I18N && EB_I18N[bucket] && EB_I18N[bucket][slug]) || null;
  // Normalizacija vrijednosti iz tabele: trim (bez sadržajne izmjene teksta).
  const _s = (v) => (typeof v === "string" ? v.trim() : (v == null ? "" : String(v)));
  // Centralizovani mapping kolona tabele EB·stranice -> render polja (EN prevod ima prednost samo na EN sajtu).
  const pTitle = (p) => p ? (i18("titles", p.slug) || _s(p.title)) : "";
  const pMsg = (p) => p ? (i18("messages", p.slug) || _s(p.message) || _s(p.title)) : "";
  const pGoal = (p) => p ? (i18("goals", p.slug) || _s(p.goal) || _s(p.intent)) : "";
  // eyebrow (nadnaslov/tag): kolona `eyebrow` je primarni izvor, `type` je fallback.
  const pEyebrow = (p) => p ? (_s(p.eyebrow) || _s(p.type)) : "";
  function synthPage(slug) {
    const m = (window.EB_I18N && EB_I18N.pagemeta && EB_I18N.pagemeta[slug]) || {};
    const meta = m[EB.lang] || m.sr || {};
    return { slug: slug, title: meta.title || slug, type: meta.type || "Edukacija", message: meta.message || "", goal: meta.goal || "",
      url: SYNTH_PATHS[slug] || ("/" + slug + "/"), parent: "edukacija", segment: "C", primary_cta: "", primary_cta_link: "kontakt", secondary_cta: "", secondary_cta_link: "",
      related: "svjetska-trzista,edukacija,investiciono-savjetovanje", documents: "", classification: "A", compliance: "" };
  }

  // Stranice definisane u kodu (nisu u Google tabeli): ubacuju se u data model pri boot-u.
  // Time su prvorazredni članovi modela (rute, breadcrumb, related, hub-djeca, SEO) neovisno o tabeli.
  const EXTRA_PAGES = [{
    id: "K1", level: "2", parent: "institucionalni-klijenti", slug: "kastodi-poslovi",
    title: "Kastodi poslovi", url: "/institucionalni-klijenti/kastodi-poslovi/",
    type: "Uslužna", phase: "1", nav_order: "", segment: "G,F",
    intent: "Da li Eurobroker može čuvati i administrirati moje hartije od vrijednosti",
    message: "Sigurno vođenje i administriranje hartija od vrijednosti",
    goal: "Eurobroker pruža kastodi usluge u okviru dozvole Komisije, uključujući vođenje računa, administriranje prava iz hartija od vrijednosti i operativnu podršku klijentima u ostvarivanju njihovih prava.",
    primary_cta: "Razgovarajte o kastodi usluzi", primary_cta_link: "kontakt",
    secondary_cta: "Kontaktirajte naš tim", secondary_cta_link: "kontakt",
    related: "institucionalni-program,blok-transakcije,domace-trziste,za-kompanije",
    documents: "", seo: "", compliance: "Sadržaj u okviru dozvole Komisije za HOV RS; provjerava ga funkcija usklađenosti prije objave.",
    kpi: "Institucionalni i profesionalni upiti za kastodi", classification: "A", eyebrow: "", subtitle: ""
  }];
  function ensureExtraPages() {
    const rows = (EB.data && EB.data.stranice) || [];
    EXTRA_PAGES.forEach(pg => { if (!rows.some(r => r.slug === pg.slug)) rows.push(pg); });
    if (EB.data) EB.data.stranice = rows;
    _pathIndex = null; // poništi keš indeksa ruta da uključi nove stranice
  }

  /* ---------------- Icons ---------------- */
  const I = {
    invest: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    advice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    company: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>',
    inst: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M4 10h16"/><path d="M12 3l8 4H4z"/><path d="M6 10v11M10 10v11M14 10v11M18 10v11"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
    bond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M7 12h.01M17 12h.01"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M6 7l-3 6a3 3 0 0 0 6 0zM18 7l-3 6a3 3 0 0 0 6 0zM3 7h18"/></svg>',
    handshake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13l3 3 3-3 4-4-3-3-4 3-4-3-3 3 4 4z"/><path d="M2 12l4 4M22 12l-4 4"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4v16a1 1 0 0 0 1 1h14V3H6a2 2 0 0 0-2 2z"/><path d="M8 7h8M8 11h6"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></svg>',
    monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    smartphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg>'
  };
  const segIcon = { A: I.invest, B: I.globe, C: I.globe, D: I.advice, E: I.company, F: I.company, G: I.inst, H: I.handshake };
  const pageIcon = {
    investiranje: I.invest, "za-kompanije": I.company, "institucionalni-klijenti": I.inst,
    analize: I.book, edukacija: I.book, "o-nama": I.shield,
    "domace-trziste": I.invest, "svjetska-trzista": I.globe, "obveznice-rs": I.bond,
    "investiciono-savjetovanje": I.advice, "finansiranje-putem-trzista-kapitala": I.scale,
    "emisija-obveznica": I.bond, "emisija-akcija-i-dokapitalizacija": I.company,
    "priprema-za-trziste-kapitala": I.company, "procjena-spremnosti": I.check,
    "institucionalni-program": I.inst, "blok-transakcije": I.invest,
    "regulatorni-status": I.shield, cjenovnik: I.scale, "otvorite-racun": I.check,
    kontakt: I.phone, partneri: I.handshake, dokumenti: I.doc
  };

  /* ---------------- Header & Footer ---------------- */
  const NAVLABEL = {
    "institucionalni-klijenti": "Institucionalni",
    "analize": "Analize",
    "edukacija": "Edukacija",
    "za-kompanije": "Za kompanije"
  };
  const navLabel = (p) => T("nav." + p.slug) !== ("nav." + p.slug) ? T("nav." + p.slug) : (NAVLABEL[p.slug] || p.title);
  function renderHeader() {
    const nav = EB.navPages();
    const links = nav.map(p => `<a href="#/${p.slug}" data-slug="${p.slug}">${esc(navLabel(p))}</a>`).join("");
    const other = isEN() ? "SR" : "EN";
    return `
    <div class="utilitybar"><div class="wrap">
      <div class="u-links">
        <a href="#/cjenovnik">${T("u.cjenovnik")}</a>
        <a href="#/dokumenti" class="hide-sm">${T("u.dokumenti")}</a>
        <a href="#/kontakt">${T("u.kontakt")}</a>
      </div>
      <div class="u-right">
        <a href="#/kontakt" class="hide-sm">${I.phone} <span style="margin-left:6px">+387 51 ...</span></a>
        <button class="lang" id="langToggle" aria-label="Language">${EB.lang.toUpperCase()} · <b>${other}</b></button>
      </div>
    </div></div>
    <header class="header" id="hdr"><div class="wrap">
      <a class="brand" href="#/">${brandMark()}<span class="brand__name">EURO<b>BROKER</b></span></a>
      <nav class="nav" id="mainnav">${links}</nav>
      <div class="header__cta">
        <a class="btn btn--primary btn--sm" href="#/otvorite-racun">${T("btn.otvoriteRacun")}</a>
        <a class="btn btn--dark btn--sm" href="#/kontakt">${T("btn.prijava")}</a>
        <button class="hamburger" id="burger" aria-label="Meni"><span></span><span></span><span></span></button>
      </div>
    </div></header>
    <div class="drawer" id="drawer"><div class="drawer__panel">
      <button class="drawer__close" id="drawerClose" aria-label="Zatvori">✕</button>
      <div class="brand" style="margin:8px 0 20px">${brandMark()}<span class="brand__name">EURO<b>BROKER</b></span></div>
      ${nav.map(p => `<a href="#/${p.slug}">${esc(navLabel(p))}</a>`).join("")}
      <a href="#/cjenovnik">${T("u.cjenovnik")}</a><a href="#/dokumenti">${T("u.dokumenti")}</a><a href="#/kontakt">${T("u.kontakt")}</a>
      <a class="btn btn--primary btn--block" style="margin-top:18px" href="#/otvorite-racun">${T("btn.otvoriteRacun")}</a>
    </div></div>`;
  }
  function brandMark() {
    return `<svg class="brand__mark" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Eurobroker">
      <defs><radialGradient id="ebGlobe" cx="36%" cy="30%" r="78%">
        <stop offset="0%" stop-color="#5aa9e6"/><stop offset="55%" stop-color="#2172b4"/><stop offset="100%" stop-color="#0c3a63"/>
      </radialGradient></defs>
      <circle cx="24" cy="24" r="21.5" fill="url(#ebGlobe)"/>
      <g fill="none" stroke="#d6ecfb" stroke-width="1.1" opacity=".8">
        <ellipse cx="24" cy="24" rx="8" ry="21.5"/>
        <ellipse cx="24" cy="24" rx="15" ry="21.5"/>
        <line x1="3" y1="24" x2="45" y2="24"/>
        <line x1="6" y1="14.5" x2="42" y2="14.5"/>
        <line x1="6" y1="33.5" x2="42" y2="33.5"/>
      </g>
      <circle cx="24" cy="24" r="21.5" fill="none" stroke="#0a2540" stroke-width="1.4"/>
    </svg>`;
  }
  function renderFooter() {
    const d = EB.drustvo();
    return `<footer class="footer"><div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <a class="brand" href="#/">${brandMark()}<span class="brand__name">EURO<b>BROKER</b></span></a>
          <p>${T("foot.tagline")}</p>
        </div>
        <div><h4>${T("foot.usluge")}</h4><ul>
          <li><a href="#/domace-trziste">${T("svc.dom")}</a></li>
          <li><a href="#/svjetska-trzista">${T("svc.world")}</a></li>
          <li><a href="#/obveznice-rs">${isEN() ? "RS bonds" : "Obveznice RS"}</a></li>
          <li><a href="#/investiciono-savjetovanje">${T("svc.adv")}</a></li>
          <li><a href="#/za-kompanije">${T("nav.za-kompanije")}</a></li>
          <li><a href="#/institucionalni-klijenti">${T("nav.institucionalni-klijenti")}</a></li>
        </ul></div>
        <div><h4>${T("foot.sadrzaj")}</h4><ul>
          <li><a href="#/analize">${T("nav.analize")}</a></li>
          <li><a href="#/edukacija">${T("nav.edukacija")}</a></li>
          <li><a href="#/vijesti">${isEN() ? "News" : "Vijesti"}</a></li>
          <li><a href="#/o-nama">${T("nav.o-nama")}</a></li>
          <li><a href="#/regulatorni-status">${isEN() ? "Regulatory status" : "Regulatorni status"}</a></li>
          <li><a href="#/partneri">${isEN() ? "Partnerships" : "Partnerstva"}</a></li>
        </ul></div>
        <div><h4>${T("foot.dokumenti")}</h4><ul>
          <li><a href="#/cjenovnik">Cjenovnik</a></li>
          <li><a href="#/dokumenti">Pravila i obrasci</a></li>
          <li><a href="#/dokumenti">Upozorenje o rizicima</a></li>
          <li><a href="#/dokumenti">Prigovori</a></li>
          <li><a href="#/dokumenti">Zaštita podataka</a></li>
        </ul></div>
      </div>
      <div class="footer__legal">
        <div class="risk">${esc(d.upozorenje_rizik || "")}</div>
        <div class="cols">
          <span>${esc(d.puni_naziv || "Eurobroker a.d. Banja Luka")} · ${esc(d.grad || "Banja Luka")} · MB ${esc(d.maticni_broj || "—")} · PIB ${esc(d.poreski_broj || "—")}</span>
          <span>Nadzor: ${esc(d.nadzorni_organ || "KHOV RS")} · © ${new Date().getFullYear()} · v1.0</span>
        </div>
      </div>
    </div></footer>
    <div class="mobar">
      <a class="btn btn--primary" href="#/otvorite-racun">${T("btn.otvoriteRacun")}</a>
      <a class="btn btn--dark" href="#/kontakt">${I.phone} ${T("btn.pozovite")}</a>
    </div>`;
  }

  /* ---------------- Sekcija "Analize i edukacija" (data-adapter + fallback) ----------------
     Bira stvarno objavljen sadržaj iz data modela; kada nema potrebnih polja, koristi profesionalni fallback.
     NEDOSTAJE za punu dinamiku: tabela urednicki-plan nema kolone datuma/statusa/URL-a/featured
     (npr. analiza_datum, analiza_url, analiza_status, webinar_datum, webinar_vrijeme, webinar_prijava,
      vodic_url, vodic_datum, vodic_featured). Čim se dodaju, adapter ih automatski koristi. */
  const MJESECI = ["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"];
  function fmtDateSR(s) { const d = new Date(s); return isNaN(d) ? "" : (d.getDate() + ". " + MJESECI[d.getMonth()] + " " + d.getFullYear() + "."); }
  function insightData(en) {
    const t = (sr, e) => en ? e : sr;
    const ts = EB._ts;
    const isUrl = EB.plan.isUrl;
    // 1) Analiza — najnovija objavljena sa validnim URL-om i datumom (izvor: planAnalize)
    const analize = EB.plan.analize().filter(a => EB.plan.isPublished(a.status) && isUrl(a.url) && !isNaN(ts(a.date)))
      .sort((a, b) => ts(b.date) - ts(a.date));
    const analiza = analize[0]
      ? { eyebrow: t("Analize · Tržišta", "Insights · Markets"), title: analize[0].title, desc: analize[0].description || "", date: analize[0].date, href: analize[0].url, ext: true, cls: "analiza", cta: t("Pogledajte analize", "See insights") }
      : { eyebrow: t("Analize · Tržišta", "Insights · Markets"), title: t("Pregled svjetskih tržišta", "World markets overview"), desc: t("Kretanja na vodećim svjetskim tržištima, ključni događaji i teme koje vrijedi pratiti.", "Movements on the world's leading markets, the key events and themes worth following."), href: "#/analize", cls: "analiza", cta: t("Pogledajte analize", "See insights") };
    // 2) Webinar — naredni budući sa validnom prijavom (izvor: planWebinari)
    const now = Date.now();
    const webinari = EB.plan.webinari().filter(w => isUrl(w.registrationUrl) && !isNaN(ts(w.date)) && ts(w.date) >= now)
      .sort((a, b) => ts(a.date) - ts(b.date));
    const webinar = webinari[0]
      ? { eyebrow: t("Edukacija · Webinar", "Learning · Webinar"), title: webinari[0].title, desc: webinari[0].description || "", date: webinari[0].date, time: webinari[0].time || "", href: webinari[0].registrationUrl, ext: true, cls: "webinar", cta: t("Prijavite se", "Sign up") }
      : { eyebrow: t("Edukacija · Webinar", "Learning · Webinar"), title: t("Prvi koraci na svjetskim tržištima", "First steps on the world markets"), desc: t("Upoznajte se sa načinom pristupa svjetskim tržištima, vrstama instrumenata i osnovama procesa trgovanja.", "Get to know how to access world markets, the types of instruments and the basics of trading."), href: "#/edukacija", cls: "webinar", cta: t("Pogledajte edukaciju", "See learning") };
    // 3) Vodič — featured, pa najnoviji sa URL-om (izvor: planVodici)
    const vodici = EB.plan.vodici().filter(g => EB.plan.isLink(g.url))
      .sort((a, b) => ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) || (ts(b.date) - ts(a.date)));
    const vodic = vodici[0]
      ? { eyebrow: t("Vodič · Početak investiranja", "Guide · Getting started"), title: vodici[0].title, desc: vodici[0].description || "", date: vodici[0].date, href: EB.plan.href(vodici[0].url), ext: true, cls: "vodic", cta: t("Pogledajte vodič", "See guide") }
      : { eyebrow: t("Vodič · Početak investiranja", "Guide · Getting started"), title: t("Kako otvoriti brokerski račun", "How to open a brokerage account"), desc: t("Jasan vodič kroz dokumentaciju, otvaranje računa i korake do prvog naloga.", "A clear guide through the paperwork, opening an account and the steps to your first order."), href: "#/edukacija", cls: "vodic", cta: t("Pogledajte vodič", "See guide") };
    return [analiza, webinar, vodic];
  }

  /* ---------------- HOME ---------------- */
  function renderHome() {
    const c = content("pocetna");
    const en = isEN();
    const proofs = (c.heroProofs || []).map(p => `<div class="proof"><b>${esc(p.k)}</b><span>${esc(p.v)}</span></div>`).join("");
    // Naše usluge — četiri poslovne linije Eurobrokera (kod-vođen sadržaj, isti .segcard izgled + numeracija).
    const bizIcon = {
      broker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/><path d="M16 8h4v4"/></svg>',
      advice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M8.5 10l2.3 2.3L16 8"/></svg>',
      corp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V6l7-3v18"/><path d="M12 21V10l6 3v8"/><path d="M8 8h1M8 12h1M8 16h1"/></svg>',
      custody: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="3.4"/><path d="M12 8.6v.01M12 15.4v.01M8.6 12h.01M15.4 12h.01"/><path d="M6 20v1M18 20v1"/></svg>'
    };
    const bizLines = en ? [
      { slug: "investiranje", icon: "broker", t: "Brokerage services", d: "Trading securities on domestic and world markets.", cta: "Explore options" },
      { slug: "investiciono-savjetovanje", icon: "advice", t: "Investment advice", d: "Expert advice in making investment decisions, aligned with your goals and your attitude to risk.", cta: "Talk to an adviser" },
      { slug: "za-kompanije", icon: "corp", t: "Corporate finance", d: "Raising capital, restructuring and support across the stages of a company's development.", cta: "Solutions for companies" },
      { slug: "kastodi-poslovi", icon: "custody", t: "Custody services", d: "Safekeeping and administration of securities, account keeping and execution of tasks related to securities rights.", cta: "Custody services" }
    ] : [
      { slug: "investiranje", icon: "broker", t: "Brokerske usluge", d: "Trgovanje hartijama od vrijednosti na domaćim i svjetskim tržištima.", cta: "Istražite mogućnosti" },
      { slug: "investiciono-savjetovanje", icon: "advice", t: "Investiciono savjetovanje", d: "Stručno savjetovanje pri donošenju investicionih odluka, u skladu sa vašim ciljevima i odnosom prema riziku.", cta: "Razgovarajte sa savjetnikom" },
      { slug: "za-kompanije", icon: "corp", t: "Korporativne finansije", d: "Prikupljanje kapitala, restrukturiranje i podrška kroz različite faze razvoja kompanije.", cta: "Rješenja za kompanije" },
      { slug: "kastodi-poslovi", icon: "custody", t: "Kastodi poslovi", d: "Čuvanje i administriranje hartija od vrijednosti, vođenje računa i izvršavanje poslova povezanih sa pravima iz hartija od vrijednosti.", cta: "Kastodi usluge" }
    ];
    const segCards = bizLines.map((b, i) => `
      <a class="segcard reveal" href="#/${b.slug}">
        <span class="segcard__no">0${i + 1}</span>
        <div class="segcard__icon">${bizIcon[b.icon]}</div>
        <h3>${esc(b.t)}</h3>
        <p>${esc(b.d)}</p>
        <span class="link-arrow">${esc(b.cta)} ${I.arrow}</span>
      </a>`).join("");


    const why = (c.zasto || []).map((z, i) => `<div class="why__item reveal"><span class="why__num">0${i + 1}</span><h3>${esc(z.t)}</h3><p>${esc(z.d)}</p></div>`).join("");

    // Tanke line-ikone samo za blok "Domaće i svjetska tržišta" (scoped, ne diraju globalne I.*).
    const mktDomIcon = '<svg class="split__glyph" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6v20h20"/><path d="M11 19l5-5 4 4 6-8"/><path d="M22 10h4v4"/></svg>';
    const mktWorldIcon = '<svg class="split__glyph" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="16" r="11.5"/><path d="M4.5 16h23M16 4.5v23"/><ellipse cx="16" cy="16" rx="5.5" ry="11.5"/></svg>';

    const insight = `
      <div class="grid grid-3">${insightData(en).map(it => {
        const dateHtml = it.date ? `<time class="icard__date" datetime="${esc(it.date)}">${esc(fmtDateSR(it.date) + (it.time ? (", " + it.time) : ""))}</time>` : "";
        const linkAttrs = it.ext ? `href="${esc(it.href)}" target="_blank" rel="noopener"` : `href="${esc(it.href)}"`;
        return `<div class="icard reveal"><div class="icard__top ${it.cls}">${esc(it.eyebrow)}</div><div class="icard__body">${dateHtml}<h3>${esc(it.title)}</h3><p>${esc(it.desc)}</p><a class="link-arrow" ${linkAttrs}>${esc(it.cta)} ${I.arrow}</a></div></div>`;
      }).join("")}</div>`;

    const poc = EB.page("pocetna") || {};
    const heroTag = en ? c.heroTag : (poc.eyebrow || "25 godina na tržištu kapitala");
    const pocMsg = poc.message || "Svijet investicija *na jednom mjestu*";
    const heroTitle = en ? `${esc(c.heroTitleA)} <span class="accent">${esc(c.heroTitleB)}</span>` : heroAccent(pocMsg);
    const heroSub = en ? c.heroSub : (poc.subtitle || poc.goal || "Domaća berza i svjetska tržišta, investiciono savjetovanje i usluge za kompanije.");

    return `
    <section class="hero hero--video"><video class="hero__video" autoplay muted loop playsinline preload="auto" poster="assets/img/hero-map.png" aria-hidden="true" tabindex="-1"><source src="assets/video/hero.webm" type="video/webm"><source src="assets/video/hero.mp4" type="video/mp4"></video><div class="hero__grid"></div><div class="wrap">
      <div>
        <span class="eyebrow hero__eyebrow">${esc(heroTag)}</span>
        <h1>${heroTitle}</h1>
        <p class="hero__sub">${esc(heroSub)}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="#/otvorite-racun">${T("btn.otvoriteRacun")} ${I.arrow}</a>
          <a class="btn btn--ghost-light" href="#/kontakt">${T("btn.zakazite")}</a>
        </div>
        <div class="hero__proofs">${proofs}</div>
      </div>
      <div class="hero__card">
        <h3>${T("home.whatNeed")}</h3>
        <p class="tiny">${en ? "Choose the path built for you." : "Izaberite put napravljen baš za vas."}</p>
        <a class="miniquote" href="#/investiranje"><div><div class="mq-name">${T("seg.A")}</div><div class="mq-sub">${T("seg.A.sub")}</div></div><div class="mq-val">${I.arrow}</div></a>
        <a class="miniquote" href="#/investiciono-savjetovanje"><div><div class="mq-name">${T("seg.D")}</div><div class="mq-sub">${T("seg.D.sub")}</div></div><div class="mq-val">${I.arrow}</div></a>
        <a class="miniquote" href="#/za-kompanije"><div><div class="mq-name">${T("seg.F")}</div><div class="mq-sub">${T("seg.F.sub")}</div></div><div class="mq-val">${I.arrow}</div></a>
        <a class="miniquote" href="#/institucionalni-klijenti"><div><div class="mq-name">${T("seg.G")}</div><div class="mq-sub">${T("seg.G.sub")}</div></div><div class="mq-val">${I.arrow}</div></a>
      </div>
    </div></section>

    <section class="section">
      <div class="wrap">
        <div class="section-head center"><span class="eyebrow">${T("home.segEyebrow")}</span><h2>${T("home.segTitle")}</h2><p>${T("home.segSub")}</p></div>
        <div class="grid grid-2 biz-lines">${segCards}</div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head center"><span class="eyebrow">${T("home.whyEyebrow")}</span><h2>${T("home.whyTitle")}</h2><p>${T("home.whySub")}</p></div>
        <div class="why">${why}</div>
      </div>
    </section>

    <section class="section section--soft"><div class="wrap">
      <div class="section-head center"><span class="eyebrow">${T("home.mktEyebrow")}</span><h2>${T("home.mktTitle")}</h2><p>${T("home.mktSub")}</p></div>
      <div class="split split--mkt">
        <div class="split__col dom reveal">
          <div class="split__icon">${mktDomIcon}</div>
          <h3>${T("home.domH")}</h3>
          <p>${T("home.domP")}</p>
          <ul><li>${T("home.domL1")}</li><li>${T("home.domL2")}</li><li>${T("home.domL3")}</li></ul>
          <a class="btn btn--primary split__cta" href="#/domace-trziste">${T("home.domCta")} ${I.arrow}</a>
        </div>
        <div class="split__col world reveal">
          <div class="split__icon">${mktWorldIcon}</div>
          <h3>${T("home.worldH")}</h3>
          <p>${T("home.worldP")}</p>
          <ul><li>${T("home.worldL1")}</li><li>${T("home.worldL2")}</li><li>${T("home.worldL3")}</li></ul>
          <a class="btn btn--primary split__cta" href="#/svjetska-trzista">${T("home.worldCta")} ${I.arrow}</a>
        </div>
      </div>
    </div></section>

    ${en ? "" : `<section class="section"><div class="wrap">
      <div class="band reveal">
        <div>
          <span class="eyebrow">Investiciono savjetovanje</span>
          <h2>Niste sigurni u šta da uložite?</h2>
          <p>Tu smo da vam pomognemo.</p>
          <div class="packages" style="margin-top:18px">
            <div class="pkg"><b>Pregled</b><span>Osnovni paket</span></div>
            <div class="pkg"><b>Portfelj</b><span>Prošireni paket</span></div>
            <div class="pkg"><b>Privatni</b><span>Za veće portfelje</span></div>
          </div>
        </div>
        <div><a class="btn btn--dark btn--block" href="#/investiciono-savjetovanje">Želim da saznam više ${I.arrow}</a></div>
      </div>
    </div></section>`}

    <section class="section ${en ? "section--soft" : ""}"><div class="wrap">
      <div class="split split--entry">
        <div class="split__col dom reveal" style="background:linear-gradient(150deg,#5a3d0e,#8a6417)">
          <span class="eyebrow" style="color:#f0e3c2">${T("home.corpEyebrow")}</span>
          <h3 style="margin-top:10px">${T("home.corpH")}</h3>
          <p>${T("home.corpP")}</p>
          <a class="btn btn--primary" href="#/procjena-spremnosti">${T("home.corpCta")} ${I.arrow}</a>
        </div>
        <div class="split__col world reveal" style="background:linear-gradient(150deg,#0a2540,#163f6b)">
          <span class="eyebrow" style="color:#c3d2e2">${T("home.instEyebrow")}</span>
          <h3 style="margin-top:10px">${T("home.instH")}</h3>
          <p>${T("home.instP")}</p>
          <a class="btn btn--ghost-light" href="#/institucionalni-klijenti">${T("home.instCta")} ${I.arrow}</a>
        </div>
      </div>
    </div></section>

    <section class="section ${en ? "" : "section--soft"}"><div class="wrap">
      <div class="section-head"><span class="eyebrow">${T("home.insEyebrow")}</span><h2>${T("home.insTitle")}</h2><p>${T("home.insSub")}</p></div>
      ${insight}
    </div></section>

    <section class="section section--soft"><div class="wrap">
      <div class="section-head center"><span class="eyebrow">${T("home.trustEyebrow")}</span><h2>${T("home.trustTitle")}</h2></div>
      <div class="trust">
        <div class="trust__item">${I.shield} ${T("trust.licence")}</div>
        <div class="trust__item">${I.check} ${T("trust.fees")}</div>
        <div class="trust__item">${I.doc} ${T("trust.rules")}</div>
        <div class="trust__item">${I.phone} ${T("trust.contact")}</div>
        <div class="trust__item">${I.scale} ${T("trust.complaints")}</div>
      </div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="finalcta reveal">
        <h2>${T("home.finalTitle")}</h2>
        <p>${T("home.finalSub")}</p>
        <div class="hero__actions">
          <a class="btn btn--primary" href="#/otvorite-racun">${T("btn.otvoriteRacun")} ${I.arrow}</a>
          <a class="btn btn--ghost-light" href="#/kontakt">${T("btn.zakazite")}</a>
        </div>
      </div>
    </div></section>`;
  }
  function segHeadline(o) { return ({ A: "Želim da ulažem", D: "Treba mi savjet", F: "Kompaniji treba kapital", G: "Institucija smo" })[o] || ""; }

  /* ---------------- INVESTIRANJE (hub, namjenski) ---------------- */
  function renderInvestiranje(p) {
    const en = isEN();
    const cont = content("investiranje");
    const hero = pagehero(p); // hero (message/goal/eyebrow) iz tabele EB·stranice
    const copy = en ? {
      "domace-trziste": { d: "Trade shares, bonds and other securities on the Banja Luka Stock Exchange with the support of licensed brokers.", cta: "Explore the domestic market" },
      "svjetska-trzista": { d: "Access the world's leading exchanges and invest in global equities, ETFs, bonds and other financial instruments.", cta: "Explore world markets" },
      "investiciono-savjetovanje": { d: "If you want expert support when investing, our licensed investment advisers will help you weigh the options, assess risk and make decisions aligned with your goals.", cta: "Investment advice" }
    } : {
      "domace-trziste": { d: "Trgujte akcijama, obveznicama i drugim hartijama od vrijednosti na Banjalučkoj berzi uz podršku licenciranih brokera.", cta: "Istražite domaće tržište" },
      "svjetska-trzista": { d: "Pristupite vodećim svjetskim berzama i investirajte u globalne akcije, ETF-ove, obveznice i druge finansijske instrumente.", cta: "Istražite svjetska tržišta" },
      "investiciono-savjetovanje": { d: "Ako želite stručnu podršku pri ulaganju, naši licencirani investicioni savjetnici pomoći će vam da sagledate mogućnosti, procijenite rizik i donesete odluke usklađene sa svojim ciljevima.", cta: "Investiciono savjetovanje" }
    };
    // Tri glavne kartice (obveznice-rs namjerno izostavljene sa huba — stranica i ruta ostaju).
    const order = ["domace-trziste", "svjetska-trzista", "investiciono-savjetovanje"];
    const cards = order.map(slug => {
      const k = EB.page(slug); if (!k) return "";
      const cc = copy[slug];
      return `<a class="segcard reveal" href="#/${slug}">
        <div class="segcard__icon">${pageIcon[slug] || I.invest}</div>
        <h3>${esc(pTitle(k))}</h3>
        <p>${esc(cc.d)}</p>
        <span class="link-arrow">${esc(cc.cta)} ${I.arrow}</span>
      </a>`;
    }).join("");
    return hero + `
    <section class="section"><div class="wrap">
      ${cont.what ? `<div class="section-head" style="max-width:820px"><p class="lead">${esc(cont.what)}</p></div>` : ""}
      <div class="grid grid-3 invhub">${cards}</div>
    </div></section>
    ${ctaBand(p)}`;
  }

  /* ---------------- ZA KOMPANIJE (hub, namjenski: 4 poslovne cjeline + konsultativni CTA) ---------------- */
  function renderZaKompanije(p) {
    const en = isEN();
    const zkIcon = {
      kapital: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 2 6-7"/><path d="M16 6h4v4"/></svg>',
      savjet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z"/><path d="M8.5 10l2.3 2.3L16 8"/></svg>',
      korp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V6l7-3v18"/><path d="M12 21V10l6 3v8"/><path d="M8 8h1M8 12h1M8 16h1"/></svg>',
      analiza: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 17v-3M12 17v-5M16 17v-2"/></svg>'
    };
    const lines = en ? [
      { slug: "prikupljanje-kapitala", icon: "kapital", t: "Raising capital", d: "Share and bond issues, recapitalisation, issue-agent services and other solutions for accessing capital.", cta: "Learn more" },
      { slug: "poslovno-i-finansijsko-savjetovanje", icon: "savjet", t: "Business and financial advisory", d: "Advice on capital structure, business strategy and corporate governance, tailored to your company's needs and goals.", cta: "Learn more" },
      { slug: "korporativni-poslovi", icon: "korp", t: "Corporate services", d: "Company restructuring, status changes, preparation of legal and other documents, and support in complex corporate procedures.", cta: "Learn more" },
      { slug: "analize-i-poslovni-planovi", icon: "analiza", t: "Analyses and business plans", d: "Financial, fundamental, technical and other analyses, investment research and the preparation of business plans.", cta: "Learn more" }
    ] : [
      { slug: "prikupljanje-kapitala", icon: "kapital", t: "Prikupljanje kapitala", d: "Emisije akcija i obveznica, dokapitalizacija, poslovi agenta emisije i druga rješenja za pristup kapitalu.", cta: "Saznajte više" },
      { slug: "poslovno-i-finansijsko-savjetovanje", icon: "savjet", t: "Poslovno i finansijsko savjetovanje", d: "Savjetovanje o strukturi kapitala, poslovnoj strategiji i korporativnom upravljanju, prilagođeno potrebama i ciljevima vaše kompanije.", cta: "Saznajte više" },
      { slug: "korporativni-poslovi", icon: "korp", t: "Korporativni poslovi", d: "Preoblikovanje društava, statusne promjene, priprema pravnih i drugih akata i podrška u složenim korporativnim postupcima.", cta: "Saznajte više" },
      { slug: "analize-i-poslovni-planovi", icon: "analiza", t: "Analize i poslovni planovi", d: "Finansijske, fundamentalne, tehničke i druge analize, istraživanja iz oblasti investiranja i izrada poslovnih planova.", cta: "Saznajte više" }
    ];
    const cards = lines.map((b, i) => `
      <a class="segcard reveal" href="#/${b.slug}">
        <span class="segcard__no">0${i + 1}</span>
        <div class="segcard__icon">${zkIcon[b.icon]}</div>
        <h3>${esc(b.t)}</h3>
        <p>${esc(b.d)}</p>
        <span class="link-arrow">${esc(b.cta)} ${I.arrow}</span>
      </a>`).join("");
    const consult = `
      <div class="zk-consult reveal">
        <h2>${en ? "Need a solution that isn't on the list?" : "Treba vam rješenje koje nije na listi?"}</h2>
        <p>${en ? "Companies' needs are not always standard. If you are facing a complex financial or corporate task, talk to our team. We will assess the situation and the options and help you define the next steps." : "Potrebe kompanija nisu uvijek standardne. Ako je pred vama složen finansijski ili korporativni posao, razgovarajte sa našim timom. Sagledaćemo situaciju i mogućnosti i pomoći vam da definišete naredne korake."}</p>
        <a class="btn btn--primary" href="#/kontakt">${en ? "Book a call" : "Zakažite razgovor"} ${I.arrow}</a>
      </div>`;
    return pagehero(p) + `
    <section class="section"><div class="wrap">
      <div class="grid grid-2 biz-lines">${cards}</div>
      ${consult}
    </div></section>`;
  }

  /* ---------------- USLUŽNA STRANICA sa sekcijama (namjenska: prikupljanje-kapitala, poslovno-i-finansijsko-savjetovanje, korporativni-poslovi, analize-i-poslovni-planovi) ---------------- */
  function sectQb(s, n, more) {
    const paras = (s.p || []).map(t => `<p>${esc(t)}</p>`).join("");
    const link = s.link && EB.page(s.link) ? `<a class="link-arrow" href="#/${s.link}">${esc(s.cta || more)} ${I.arrow}</a>` : "";
    return qb(s.t, n, paras + link);
  }
  function renderZKUsluga(p) {
    const en = isEN();
    const c = content(p.slug);
    const more = en ? "Learn more" : "Saznajte više";
    let inner = "";
    (c.sections || []).forEach((s, i) => { inner += sectQb(s, "0" + (i + 1), more); });
    const con = c.consult;
    const conLink = (con && con.link) || "kontakt";
    const consult = con ? `<div class="zk-consult reveal"><h2>${esc(con.t)}</h2><p>${esc(con.p)}</p><a class="btn btn--primary" href="#/${conLink}">${esc(con.cta)} ${I.arrow}</a></div>` : "";
    // Opciona zaključna sadržajna sekcija nakon CTA bloka (npr. „Poslovni planovi")
    const after = c.after ? `
    <section class="section"><div class="wrap"><div class="prose">${sectQb(c.after, "0" + ((c.sections || []).length + 1), more)}</div></div></section>` : "";
    return pagehero(p) + `
    <section class="section"><div class="wrap"><div class="pglayout">
      <div class="prose">${inner}</div>
      ${serviceSidebar(p)}
    </div></div></section>
    <section class="section section--soft"><div class="wrap">${consult}</div></section>${after}`;
  }

  /* ---------------- PARTNERI (B2B partnerska stranica; hero iz tabele, scoped .pt-*) ---------------- */
  function renderPartneri(p) {
    const c = content("partneri");
    const svc = (slug) => "#/" + (EB.page(slug) ? slug : "kontakt");
    const head = (o) => `<div class="section-head"><span class="eyebrow">${esc(o.eyebrow)}</span><h2>${esc(o.t)}</h2>${o.lead ? `<p class="pt-lead">${esc(o.lead)}</p>` : ""}</div>`;
    const S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
    const netIc = [
      S + '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>',
      S + '<path d="M12 3v18M7 21h10M8 3h8"/><path d="M5 7h14"/><path d="M5 7l-2.5 6h5L5 7zM19 7l-2.5 6h5L19 7z"/></svg>',
      S + '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2z"/></svg>',
      S + '<path d="M3 21h18M4 21V10M20 21V10M3 10l9-5 9 5M9 21v-6h6v6"/></svg>',
      S + '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.2a3 3 0 0 1 0 5.6M21 20a6 6 0 0 0-4-5.6"/></svg>',
      S + '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg>'
    ];
    const valIc = [
      S + '<path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z"/><path d="M9.2 12l1.9 1.9L15 10"/></svg>',
      S + '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
      S + '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>',
      S + '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 2 6-7"/></svg>'
    ];

    const hero = pagehero(p) + `<div class="pt-heroband"><div class="wrap"><a class="btn btn--primary" href="#partneri-forma">${esc(c.final.primary)} ${I.arrow}</a></div></div>`;

    const net = c.network;
    const netCards = net.cards.map((x, i) => `<article class="pt-card reveal"><span class="pt-card__ic">${netIc[i] || netIc[5]}</span><span class="pt-card__no">0${i + 1}</span><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></article>`).join("");
    const sNetwork = `<section class="section"><div class="wrap">${head(net)}<div class="pt-grid pt-grid--3">${netCards}</div></div></section>`;

    const wh = c.when;
    const caseCards = wh.cases.map(x => `<a class="pt-case reveal" href="${svc(x.link)}"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p><span class="link-arrow">${esc(x.cta)} ${I.arrow}</span></a>`).join("");
    const sWhen = `<section class="section pt-dark"><div class="wrap">${head(wh)}<div class="pt-cases">${caseCards}</div></div></section>`;

    const pr = c.process;
    const steps = pr.steps.map((x, i) => `<div class="pt-step reveal"><div class="pt-step__n">0${i + 1}</div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join("");
    const sProcess = `<section class="section section--soft"><div class="wrap">${head(pr)}<div class="pt-flow">${steps}</div></div></section>`;

    const va = c.value;
    const benefits = va.items.map((x, i) => `<div class="pt-benefit reveal"><span class="pt-benefit__ic">${valIc[i] || valIc[0]}</span><div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div></div>`).join("");
    const sValue = `<section class="section"><div class="wrap">${head(va)}<div class="pt-benefits">${benefits}</div></div></section>`;

    const cm = c.comp;
    const comps = cm.items.map(x => `<a href="${svc(x.link)}"><span>${esc(x.t)}</span><span class="ar">${I.arrow}</span></a>`).join("");
    const sComp = `<section class="section section--soft"><div class="wrap">${head(cm)}<div class="pt-comp">${comps}</div></div></section>`;

    const mo = c.models;
    const models = mo.cards.map((x, i) => `<div class="pt-model reveal"><span class="pt-model__no">0${i + 1}</span><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join("");
    const sModels = `<section class="section"><div class="wrap">${head(mo)}<div class="pt-models">${models}</div></div></section>`;

    const ro = c.roles;
    const sRoles = `<section class="section section--soft"><div class="wrap"><div class="pt-roles reveal"><div class="pt-roles__head"><span class="eyebrow">${esc(ro.eyebrow)}</span><h2>${esc(ro.t)}</h2></div><p>${esc(ro.p)}</p></div></div></section>`;

    const fn = c.final, fm = c.form;
    const opts = fm.typeOpts.map(o => `<option>${esc(o)}</option>`).join("");
    const form = `<form class="form pt-form" id="partneri-forma" data-form="1" data-kind="partneri" aria-label="${esc(fm.t)}">
      <h3>${esc(fm.t)}</h3>
      <div class="row2">
        <div class="field"><label for="pt-name">${esc(fm.name)}</label><input id="pt-name" name="name" required placeholder="${esc(fm.name)}"></div>
        <div class="field"><label for="pt-company">${esc(fm.company)}</label><input id="pt-company" name="company" required placeholder="${esc(fm.company)}"></div>
      </div>
      <div class="row2">
        <div class="field"><label for="pt-email">${esc(fm.email)}</label><input id="pt-email" name="email" type="email" required placeholder="you@company"></div>
        <div class="field"><label for="pt-phone">${esc(fm.phone)}</label><input id="pt-phone" name="phone" placeholder="+387"></div>
      </div>
      <div class="field"><label for="pt-type">${esc(fm.type)}</label><select id="pt-type" name="type">${opts}</select></div>
      <div class="field"><label for="pt-desc">${esc(fm.desc)}</label><textarea id="pt-desc" name="desc" required placeholder="${esc(fm.descP)}"></textarea></div>
      <label class="consent"><input type="checkbox" required> ${esc(fm.consent)}</label>
      <button class="btn btn--primary" type="submit">${esc(fm.submit)} ${I.arrow}</button>
      <p class="formnote">${esc(fm.note)}</p>
    </form>`;
    const sFinal = `<section class="section pt-final"><div class="wrap">
      <div class="pt-final__head"><span class="eyebrow">${esc(fn.eyebrow)}</span><h2>${esc(fn.t)}</h2><p>${esc(fn.p)}</p></div>
      <div class="pt-final__actions"><a class="btn btn--primary" href="#partneri-forma">${esc(fn.primary)} ${I.arrow}</a><a class="btn btn--ghost-light" href="#/kontakt">${esc(fn.secondary)} ${I.arrow}</a></div>
      ${form}
    </div></section>`;

    return hero + sNetwork + sWhen + sProcess + sValue + sComp + sModels + sRoles + sFinal;
  }

  /* ---------------- HUB ---------------- */
  /* ---------------- INSTITUCIONALNI KLIJENTI (namjenski redizajn ispod hero-a) ----------------
     Hero ostaje pagehero(p) = dinamički iz EB·stranice. Sve ispod je scoped (.ik-*). */
  function renderInstitucionalni(p) {
    const en = isEN();
    const trust = [
      { k: en ? "25 YEARS" : "25 GODINA", v: en ? "in the capital market" : "na tržištu kapitala" },
      { k: en ? "LICENSED FIRM" : "LICENCIRANO DRUŠTVO", v: en ? "supervised by the SEC of Republika Srpska" : "pod nadzorom KHOV RS" },
      { k: en ? "CUSTODY LICENCE" : "KASTODI DOZVOLA", v: en ? "for performing custody operations" : "za obavljanje kastodi poslova" },
      { k: en ? "LICENSED TEAM" : "LICENCIRANI TIM", v: en ? "of brokers and investment advisers" : "brokera i investicionih savjetnika" }
    ];
    const audience = [
      { ic: I.invest, t: en ? "Investment and pension funds" : "Investicioni i penzioni fondovi", d: en ? "Brokerage and other support tailored to the investment process and the needs of an institutional client." : "Brokerska i druga podrška prilagođena investicionom procesu i potrebama institucionalnog klijenta." },
      { ic: I.shield, t: en ? "Insurance companies" : "Osiguravajuća društva", d: en ? "Services related to trading and managing portfolios of financial assets." : "Usluge povezane sa trgovanjem i upravljanjem portfeljima finansijske imovine." },
      { ic: I.inst, t: en ? "Public institutions and funds" : "Javne institucije i fondovi", d: en ? "Structured support for institutions operating within specific regulatory and internal procedures." : "Strukturisana podrška institucijama koje posluju u okviru posebnih regulatornih i internih procedura." },
      { ic: I.company, t: en ? "Companies and other institutional investors" : "Kompanije i drugi institucionalni investitori", d: en ? "Support for legal entities that invest in or manage portfolios of financial assets." : "Podrška pravnim licima koja investiraju ili upravljaju portfeljima finansijske imovine." }
    ];
    const program = [
      { no: "01", t: en ? "Order execution" : "Izvršenje naloga", d: en ? "Receipt, confirmation and execution of orders in line with agreed procedures and available market conditions." : "Prijem, potvrđivanje i izvršenje naloga u skladu sa ugovorenim procedurama i raspoloživim tržišnim uslovima." },
      { no: "02", t: en ? "Designated contact" : "Odgovorna osoba", d: en ? "A named contact at Eurobroker for operational communication, coordinating requests and monitoring the cooperation." : "Imenovani kontakt u Eurobrokeru za operativnu komunikaciju, koordinaciju zahtjeva i praćenje saradnje." },
      { no: "03", t: en ? "Reporting" : "Izvještavanje", d: en ? "The scope, format and frequency of reporting are defined according to the agreed model of cooperation and the institution's needs." : "Obim, format i dinamika izvještavanja definišu se prema ugovorenom modelu saradnje i potrebama institucije." },
      { no: "04", t: en ? "Operational escalation" : "Operativna eskalacija", d: en ? "A predefined way of handling situations when a request or operational issue requires additional coordination." : "Unaprijed definisan način postupanja kada zahtjev ili operativni problem zahtijeva dodatnu koordinaciju." }
    ];
    const services = [
      { ic: I.invest, t: en ? "Brokerage services" : "Brokerske usluge", d: en ? "Order execution on the domestic and available foreign markets, with operational support and reporting tailored to an institutional client." : "Izvršenje naloga na domaćem i dostupnim stranim tržištima uz operativnu podršku i izvještavanje prilagođeno institucionalnom klijentu.", cta: en ? "Explore brokerage services" : "Istražite brokerske usluge", href: "#/investiranje" },
      { ic: I.scale, t: en ? "Block trades" : "Blok-transakcije", d: en ? "Support in preparing and executing larger transactions, coordinating the process and taking account of the market, regulatory and operational conditions of execution." : "Podrška pri pripremi i realizaciji većih transakcija, uz koordinaciju procesa i vođenje računa o tržišnim, regulatornim i operativnim uslovima izvršenja.", cta: en ? "Learn more" : "Saznajte više", href: "#/blok-transakcije" },
      { ic: I.shield, t: en ? "Custody services" : "Kastodi poslovi", d: en ? "Keeping and administering securities accounts, exercising the rights arising from securities and other custody services within Eurobroker's licence." : "Vođenje i administriranje računa hartija od vrijednosti, ostvarivanje prava iz hartija od vrijednosti i druge kastodi usluge u okviru dozvole Eurobrokera.", cta: en ? "Custody services" : "Kastodi usluge", href: "#/kastodi-poslovi" }
    ];
    const checks = en
      ? ["The scope of services and responsibilities", "How orders are received and confirmed", "Response times and operational deadlines", "The format and frequency of reporting", "Responsible contacts and their backups", "The escalation procedure", "Handling operational issues and complaints", "Periodic review of the cooperation"]
      : ["Obuhvat usluga i odgovornosti", "Način prijema i potvrđivanja naloga", "Vrijeme odziva i operativne rokove", "Format i dinamiku izvještavanja", "Odgovorne kontakte i zamjene", "Proceduru eskalacije", "Postupanje po operativnim problemima i prigovorima", "Periodično preispitivanje saradnje"];
    const steps = [
      { no: "01", t: en ? "We understand your needs" : "Razumijemo vaše potrebe", d: en ? "We discuss your way of investing, the types of transactions, internal procedures, reporting and the expected level of support." : "Razgovaramo o načinu investiranja, vrstama transakcija, internim procedurama, izvještavanju i očekivanom nivou podrške." },
      { no: "02", t: en ? "We define the model of cooperation" : "Definišemo model saradnje", d: en ? "We propose the scope of services, the operational model, responsibilities, communication and the reporting approach." : "Predlažemo obim usluga, operativni model, odgovornosti, komunikaciju i način izvještavanja." },
      { no: "03", t: en ? "We contract the service" : "Ugovaramo uslugu", d: en ? "After the necessary regulatory and operational checks, we define the contractual relationship and, where applicable, the service level." : "Nakon potrebnih regulatornih i operativnih provjera definišemo ugovorni odnos i, kada je primjenjivo, nivo usluge." },
      { no: "04", t: en ? "We monitor delivery" : "Pratimo izvršenje", d: en ? "During the cooperation we monitor the agreed obligations, communication, reporting and any matters that require additional coordination." : "Tokom saradnje pratimo ugovorene obaveze, komunikaciju, izvještavanje i pitanja koja zahtijevaju dodatnu koordinaciju." }
    ];
    const regNote = en
      ? "Eurobroker a.d. Banja Luka is a broker-dealer licensed to operate in the securities market, supervised by the Securities and Exchange Commission of Republika Srpska. Individual services are provided within the relevant licences, statutory conditions and the contractual relationship with the client."
      : "Eurobroker a.d. Banja Luka je brokersko-dilersko društvo sa dozvolom za obavljanje poslova na tržištu hartija od vrijednosti, pod nadzorom Komisije za hartije od vrijednosti Republike Srpske. Pojedinačne usluge pružaju se u okviru odgovarajućih dozvola, zakonskih uslova i ugovornog odnosa sa klijentom.";

    return pagehero(p) + `
    <section class="section" style="padding-bottom:0"><div class="wrap">
      <div class="ik-trust reveal">${trust.map(x => `<div class="ik-trust__item"><div class="ik-trust__k">${esc(x.k)}</div><div class="ik-trust__v">${esc(x.v)}</div></div>`).join("")}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="section-head" style="max-width:840px"><h2>${en ? "For institutions that require more than order execution" : "Za institucije koje zahtijevaju više od izvršenja naloga"}</h2>
      <p class="lead">${en ? "The institutional programme is intended for organisations that manage financial assets and require reliable execution, clearly defined procedures, accountable communication and quality reporting." : "Institucionalni program namijenjen je organizacijama koje upravljaju finansijskom imovinom i zahtijevaju pouzdano izvršenje, jasno definisane procedure, odgovornu komunikaciju i kvalitetno izvještavanje."}</p></div>
      <div class="grid grid-2">${audience.map(a => `<div class="ik-card reveal"><div class="ik-card__ic">${a.ic}</div><h3>${esc(a.t)}</h3><p>${esc(a.d)}</p></div>`).join("")}</div>
    </div></section>

    <section class="section section--soft"><div class="wrap">
      <div class="section-head" style="max-width:840px"><span class="eyebrow">${en ? "Institutional programme" : "Institucionalni program"}</span>
      <h2>${en ? "A service tailored to the way your institution operates" : "Usluga prilagođena načinu na koji vaša institucija posluje"}</h2>
      <p class="lead">${en ? "Institutional clients have different requirements regarding order execution, communication, reporting and operational support. That is why cooperation can be defined through an agreed service level tailored to the client's needs and procedures." : "Institucionalni klijenti imaju različite zahtjeve u pogledu izvršenja naloga, komunikacije, izvještavanja i operativne podrške. Zato saradnju možemo definisati kroz ugovoreni nivo usluge prilagođen potrebama i procedurama klijenta."}</p></div>
      <div class="ik-prog">${program.map(x => `<div class="ik-prog__item"><div class="ik-prog__no">${x.no}</div><div class="ik-prog__b"><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div></div>`).join("")}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="section-head" style="max-width:840px"><h2>${en ? "Services we can include in an institutional relationship" : "Usluge koje možemo uključiti u institucionalni odnos"}</h2></div>
      <div class="grid grid-3">${services.map(s => `<a class="segcard reveal" href="${s.href}"><div class="segcard__icon">${s.ic}</div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><span class="link-arrow">${esc(s.cta)} ${I.arrow}</span></a>`).join("")}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="ik-dark reveal">
        <span class="eyebrow">${en ? "Clearly defined cooperation" : "Jasno definisana saradnja"}</span>
        <h2>${en ? "Institutional cooperation must be measurable" : "Institucionalna saradnja mora biti mjerljiva"}</h2>
        <p class="ik-dark__lead">${en ? "For an institutional client it is not enough to know which services a broker provides. What matters is knowing in advance how the cooperation will work and who is responsible for what." : "Institucionalnom klijentu nije dovoljno da zna koje usluge broker pruža. Važno je da unaprijed zna kako će saradnja funkcionisati i ko je za šta odgovoran."}</p>
        <ul class="ik-check">${checks.map(c => `<li>${I.check}<span>${esc(c)}</span></li>`).join("")}</ul>
      </div>
    </div></section>

    <section class="section section--soft"><div class="wrap">
      <div class="section-head" style="max-width:840px"><span class="eyebrow">${en ? "The cooperation process" : "Proces saradnje"}</span><h2>${en ? "How we begin the cooperation" : "Kako počinjemo saradnju"}</h2></div>
      <div class="ik-steps">${steps.map(x => `<div class="ik-steps__item reveal"><div class="ik-steps__no">${x.no}</div><h3>${esc(x.t)}</h3><p>${esc(x.d)}</p></div>`).join("")}</div>
    </div></section>

    <section class="section"><div class="wrap">
      <div class="section-head" style="max-width:840px"><h2>${en ? "We define the service level according to the institution's needs" : "Nivo usluge definišemo prema potrebama institucije"}</h2>
      <p class="lead">${en ? "We do not offer the same operational model to every institutional client. The scope of services, the way we communicate, deadlines, reporting and other matters are defined according to the type of service, regulatory requirements and the needs of the specific institution." : "Ne nudimo isti operativni model svakom institucionalnom klijentu. Obim usluga, način komunikacije, rokovi, izvještavanje i druga pitanja definišu se u skladu sa vrstom usluge, regulatornim zahtjevima i potrebama konkretne institucije."}</p>
      <div style="margin-top:18px"><a class="btn btn--dark" href="#/kontakt">${en ? "Discuss the model of cooperation" : "Razgovarajte o modelu saradnje"} ${I.arrow}</a></div></div>
    </div></section>

    <section class="section"><div class="wrap"><div class="finalcta reveal">
      <h2>${en ? "Let's talk about your institution's needs" : "Razgovarajmo o potrebama vaše institucije"}</h2>
      <p>${en ? "Tell us how you manage your portfolio, the markets you operate in and the level of support you expect. On that basis we can consider a suitable model of cooperation." : "Predstavite nam način na koji upravljate portfeljem, tržišta na kojima poslujete i nivo podrške koji očekujete. Na osnovu toga možemo sagledati odgovarajući model saradnje."}</p>
      <div class="hero__actions"><a class="btn btn--primary" href="#/kontakt">${en ? "Book an institutional conversation" : "Zakažite institucionalni razgovor"} ${I.arrow}</a></div>
    </div></div></section>

    <section class="section" style="padding-top:0"><div class="wrap">
      <p class="ik-reg">${esc(regNote)}</p>
    </div></section>`;
  }

  function renderHub(p) {
    const cont = content(p.slug);
    const kids = EB.children(p.slug);
    const kidSub = (k) => { const c = content(k.slug); return (isEN() && c.what) ? c.what.split(". ")[0] + "." : (k.message || k.intent); };
    const cards = kids.map(k => `
      <a class="segcard reveal" href="#/${esc(k.slug)}">
        <div class="segcard__icon">${pageIcon[k.slug] || I.invest}</div>
        <h3>${esc(pTitle(k))}</h3>
        <p>${esc(kidSub(k))}</p>
        <span class="link-arrow">${T("btn.saznajteVise")} ${I.arrow}</span>
      </a>`).join("");
    return pagehero(p) + `
    <section class="section"><div class="wrap">
      ${cont.what ? `<div class="section-head" style="max-width:820px"><p class="lead">${esc(cont.what)}</p></div>` : ""}
      <div class="grid ${kids.length === 4 ? "grid-2" : "grid-3"}">${cards}</div>
    </div></section>
    ${ctaBand(p)}`;
  }

  /* ---------------- SERVICE (10-question) ---------------- */
  function platformsBlock(list) {
    const en = isEN();
    const cards = list.map(x => `
      <a class="platcard" href="${esc(x.url)}" target="_blank" rel="noopener" data-ext>
        <span class="platcard__ic">${x.ikona === "smartphone" ? I.smartphone : I.monitor}</span>
        <span class="platcard__body"><b>${esc(x.naziv)}</b><small>${esc(x.opis)}</small></span>
        <span class="platcard__go">${en ? "Open" : "Otvorite"} ${I.external}</span>
      </a>`).join("");
    return `<div class="qblock"><span class="qn">${en ? "ELECTRONIC TRADING" : "ELEKTRONSKO TRGOVANJE"}</span>
      <h2>${en ? "Trade on the Banja Luka Stock Exchange online" : "Trgujte na Banjalučkoj berzi elektronski"}</h2>
      <div class="platgrid">${cards}</div>
      <p class="formnote" style="margin-top:10px">${en ? "For existing clients with a contract. Access is via the Banja Luka Stock Exchange platform." : "Za postojeće klijente sa ugovorom. Pristup je preko platforme Banjalučke berze."}</p>
    </div>`;
  }
  function renderService(p) {
    const c = content(p.slug);
    const faqs = EB.faqFor(p.slug);
    let body = "";
    if (c.what) body += qb(T("q1"), "01", `<p>${esc(c.what)}</p>`);
    if (c.platforme) body += platformsBlock(c.platforme);
    if (c.whoFor) body += qb(T("q2"), "02", `<div class="chips">${c.whoFor.map(w => `<span class="chip">${esc(w)}</span>`).join("")}</div>`);
    if (c.problem) body += qb(T("q3"), "03", `<p>${esc(c.problem)}</p>`);
    if (c.steps) body += qb(T("q4"), "04", `<div class="steps">${c.steps.map(s => `<div class="step"><div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p></div></div>`).join("")}</div>`);
    if (c.roles) body += qb(T("q5"), "05", `<div class="roles"><div class="role"><b>${T("roles.eb")}</b><p>${esc(c.roles.eurobroker)}</p></div><div class="role"><b>${T("roles.client")}</b><p>${esc(c.roles.klijent)}</p></div><div class="role"><b>${T("roles.third")}</b><p>${esc(c.roles.treci)}</p></div></div>`);
    body += qb(T("q6"), "06", `<p>${esc(c.napomenaCijena || T("side.cost"))}</p><a class="link-arrow" href="#/cjenovnik">${T("side.seeFees")} ${I.arrow}</a>`);
    if (c.risks) body += qb(T("q7"), "07", `<ul class="risklist">${c.risks.map(r => `<li>${esc(r)}</li>`).join("")}</ul><div class="notebox notebox--reg">${T("side.riskNote")}</div>`);
    // domace-trziste: blok "dokumenti" (PITANJE 08) uklonjen na zahtjev; izvor je kolona `documents`
    // u tabeli `stranice` (živi Google Sheet), koju ovaj sloj ne može mijenjati po ćeliji — zato se
    // ovdje suzbija samo za tu stranicu. Ostale stranice su nepromijenjene. Kad se ćelija isprazni u
    // živoj tabeli, ovaj uslov (i CSV) se mogu vratiti na `if (p.documents)`.
    if (p.documents && p.slug !== "domace-trziste") body += qb(T("q8"), "08", `<div class="chips">${String(p.documents).split(";").map(x => x.trim()).filter(Boolean).map(x => `<span class="chip">${I.doc} ${esc(x)}</span>`).join("")}</div>`);

    if (faqs.length) {
      body += `<div class="qblock"><span class="qn">${T("q.faq")}</span><h2>${T("q.faqTitle")}</h2>${renderFaq(faqs)}</div>`;
    }

    // Oznaka ostaje "PITANJE" ali bez rednog broja — samo na navedenim stranicama
    // (uklanjanje iz render izlaza, ne CSS). Ostale stranice zadržavaju numeraciju netaknutu.
    if (["svjetska-trzista", "investiciono-savjetovanje"].includes(p.slug)) body = body.replace(/(<span class="qn">[^<]*?)\s+\d+(<\/span>)/g, "$1$2");

    const finalCta = c.finalCta ? `<section class="section section--soft"><div class="wrap"><div class="finalcta reveal">
      <h2>${esc(c.finalCta.t)}</h2>
      <p>${esc(c.finalCta.p)}</p>
      <div class="hero__actions"><a class="btn btn--primary" href="#/${esc(c.finalCta.link || "kontakt")}">${esc(c.finalCta.cta)} ${I.arrow}</a></div>
    </div></div></section>` : "";
    return pagehero(p) + `
    <section class="section"><div class="wrap"><div class="pglayout">
      <div class="prose">${body}</div>
      ${serviceSidebar(p)}
    </div></div></section>` + finalCta;
  }
  function qb(title, n, inner) { return `<div class="qblock"><span class="qn">${T("q.label")} ${n}</span><h2>${esc(title)}</h2>${inner}</div>`; }

  /* ---------------- KASTODI (namjenska uslužna stranica) ---------------- */
  function renderKastodi(p) {
    const en = isEN();
    const K = en ? {
      q: ["What are custody services?", "Who is the service for?", "What can Eurobroker do?", "How does the engagement work?", "Which rights and corporate actions can be covered?", "How are records kept?", "Fees", "Risks and important notes"],
      a01: ["Custody services cover the holding and administration of securities for a client's account, the execution of orders related to securities rights, and operational support in exercising the rights of securities holders.", "Eurobroker performs these activities within the relevant licence issued by the Securities Commission of Republika Srpska."],
      who: ["Institutional investors", "Legal entities", "Investors with larger portfolios", "Domestic and foreign clients", "Clients needing support in exercising securities rights"],
      jobs: ["Opening and keeping custody accounts in the client's name", "Keeping omnibus custody accounts, where applicable", "Executing orders to transfer securities rights", "Registering third-party rights over securities", "Collecting due receivables, interest and dividends for the client's account", "Support in exercising other rights arising from securities", "Notifying clients of shareholder meetings and, where contracted and legally permitted, representation at them", "Notifying clients of rights and of legal changes that affect them", "Support regarding tax obligations related to securities", "Other contracted custody services not contrary to law"],
      jobsNote: "Securities lending and certain advanced services may be available depending on the contract, the market and operational conditions.",
      steps: [["Initial conversation", "Identifying the client's needs."], ["Checking conditions", "The regulatory and operational framework."], ["Contracting", "The custody agreement and terms of cooperation."], ["Opening accounts", "The appropriate custody accounts."], ["Ongoing operation", "Administration and execution of orders."], ["Reporting and support", "In exercising rights."]],
      rights: ["Dividends", "Interest", "Securities maturity", "Shareholder meetings", "Changes in capital", "Other rights arising from securities ownership"],
      rightsNote: "The exact scope depends on the type of security, the market, the contract and the applicable rules.",
      a06: ["Accounts and records are kept in line with regulations and the rules of the competent capital-market institutions (the Securities Registry and other relevant institutions).", "Records are kept separately for each client, in accordance with the contract and the applicable rules."],
      a07: "Custody fees depend on the type of service, the volume of activity and the agreed model of cooperation. See the current price list or contact our team for a specific figure.",
      seeFees: "See the price list",
      a08: ["As a custody-service provider, Eurobroker does not guarantee the market value of securities, any return, or the issuer's performance of its obligations.", "The custody service concerns administration, safekeeping, order execution and support in exercising rights, within the law and the contract."]
    } : {
      q: ["Šta su kastodi poslovi?", "Kome je usluga namijenjena?", "Koje poslove Eurobroker može obavljati?", "Kako izgleda saradnja?", "Koja prava i korporativne akcije mogu biti obuhvaćene?", "Kako se vodi evidencija?", "Naknade", "Rizici i važne napomene"],
      a01: ["Kastodi poslovi obuhvataju vođenje i administriranje hartija od vrijednosti za račun klijenta, izvršavanje naloga povezanih sa pravima iz hartija od vrijednosti i operativnu podršku u ostvarivanju prava vlasnika hartija od vrijednosti.", "Eurobroker ove poslove obavlja u okviru odgovarajuće dozvole Komisije za hartije od vrijednosti Republike Srpske."],
      who: ["Institucionalni investitori", "Pravna lica", "Investitori sa većim portfeljima", "Domaći i strani klijenti", "Klijenti kojima treba podrška u ostvarivanju prava"],
      jobs: ["Otvaranje i vođenje kastodi računa na ime klijenta", "Vođenje zbirnih (omnibus) kastodi računa, kada je primjenjivo", "Izvršavanje naloga za prenos prava iz hartija od vrijednosti", "Upis prava trećih lica na hartijama od vrijednosti", "Naplata dospjelih potraživanja, kamata i dividendi za račun klijenta", "Podrška u ostvarivanju drugih prava iz hartija od vrijednosti", "Obavještavanje o skupštinama akcionara i, kada je ugovoreno i pravno dopušteno, zastupanje na njima", "Obavještavanje o pravima i o zakonskim promjenama koje se tiču klijenta", "Podrška u vezi sa poreskim obavezama povezanim sa hartijama od vrijednosti", "Druge ugovorene kastodi usluge koje nisu u suprotnosti sa zakonom"],
      jobsNote: "Pozajmljivanje hartija od vrijednosti i pojedine napredne usluge mogu biti dostupni u zavisnosti od ugovora, tržišta i operativnih uslova.",
      steps: [["Inicijalni razgovor", "Identifikacija potreba klijenta."], ["Provjera uslova", "Regulatorni i operativni okvir."], ["Ugovaranje", "Kastodi ugovor i uslovi saradnje."], ["Otvaranje računa", "Odgovarajući kastodi računi."], ["Operativno vođenje", "Administriranje i izvršenje naloga."], ["Izvještavanje i podrška", "U ostvarivanju prava."]],
      rights: ["Dividende", "Kamate", "Dospijeće hartija od vrijednosti", "Skupštine akcionara", "Promjene kapitala", "Druga prava iz vlasništva nad hartijama od vrijednosti"],
      rightsNote: "Konkretan obuhvat zavisi od vrste hartije, tržišta, ugovora i važećih pravila.",
      a06: ["Računi i evidencije vode se u skladu sa propisima i pravilima nadležnih institucija tržišta kapitala (Registar hartija od vrijednosti i druge relevantne institucije).", "Evidencija se vodi odvojeno za svakog klijenta, u skladu sa ugovorom i važećim pravilima."],
      a07: "Naknade za kastodi usluge zavise od vrste usluge, obima aktivnosti i ugovorenog modela saradnje. Pogledajte važeći Cjenovnik ili kontaktirajte naš tim za konkretnu informaciju.",
      seeFees: "Pogledajte cjenovnik",
      a08: ["Eurobroker kao pružalac kastodi usluge ne garantuje tržišnu vrijednost hartija od vrijednosti, prinos niti izvršenje obaveza emitenta.", "Kastodi usluga odnosi se na administriranje, vođenje, izvršenje naloga i podršku u ostvarivanju prava, u okviru zakona i ugovora."]
    };
    let body = "";
    body += qb(K.q[0], "01", K.a01.map(t => `<p>${esc(t)}</p>`).join(""));
    body += qb(K.q[1], "02", `<div class="chips">${K.who.map(w => `<span class="chip">${esc(w)}</span>`).join("")}</div>`);
    body += qb(K.q[2], "03", `<ul class="risklist">${K.jobs.map(j => `<li>${esc(j)}</li>`).join("")}</ul><div class="notebox">${esc(K.jobsNote)}</div>`);
    body += qb(K.q[3], "04", `<div class="steps">${K.steps.map(s => `<div class="step"><div><h4>${esc(s[0])}</h4><p>${esc(s[1])}</p></div></div>`).join("")}</div>`);
    body += qb(K.q[4], "05", `<ul class="risklist">${K.rights.map(r => `<li>${esc(r)}</li>`).join("")}</ul><div class="notebox">${esc(K.rightsNote)}</div>`);
    body += qb(K.q[5], "06", K.a06.map(t => `<p>${esc(t)}</p>`).join(""));
    body += qb(K.q[6], "07", `<p>${esc(K.a07)}</p><a class="link-arrow" href="#/cjenovnik">${esc(K.seeFees)} ${I.arrow}</a>`);
    body += qb(K.q[7], "08", K.a08.map(t => `<p>${esc(t)}</p>`).join("") + `<div class="notebox notebox--reg">${T("side.riskNote")}</div>`);
    const faqs = EB.faqFor(p.slug);
    if (faqs.length) body += `<div class="qblock"><span class="qn">${T("q.faq")}</span><h2>${T("q.faqTitle")}</h2>${renderFaq(faqs)}</div>`;
    return pagehero(p) + `
    <section class="section"><div class="wrap"><div class="pglayout">
      <div class="prose">${body}</div>
      ${serviceSidebar(p)}
    </div></div></section>`;
  }

  function serviceSidebar(p) {
    const related = String(p.related || "").split(",").map(s => s.trim()).filter(Boolean)
      .map(slug => { const rp = EB.page(slug); return rp ? `<a href="#/${slug}">${esc(pTitle(rp))} ${I.arrow}</a>` : ""; }).join("");
    const cls = p.classification || "";
    const primaryCta = isEN() ? T("btn.zakazite") : (p.primary_cta || "Zakažite razgovor");
    return `<aside class="side">
      <div class="side__card dark">
        <h3>${esc(primaryCta)}</h3>
        <p>${T("cta.replyNote")}</p>
        <a class="btn btn--primary btn--block" href="#/${esc(p.primary_cta_link || "kontakt")}">${esc(isEN() ? T("btn.posaljite") : (p.primary_cta || "Pošaljite upit"))}</a>
        ${p.secondary_cta ? `<a class="btn btn--ghost-light btn--block" style="margin-top:10px" href="#/${esc(p.secondary_cta_link || "kontakt")}">${esc(isEN() ? T("btn.zakazite") : p.secondary_cta)}</a>` : ""}
      </div>
      <div class="side__card">
        <h3>${T("side.details")}</h3>
        <div class="side__meta" style="margin-top:12px">
          <div class="row"><span>${T("side.for")}</span><b>${esc(segNames(p.segment))}</b></div>
          <div class="row"><span>${T("side.status")}</span><b>${esc(clsLabel(cls))}</b></div>
          <div class="row"><span>${T("side.responseTime")}</span><b>${T("side.oneDay")}</b></div>
        </div>
      </div>
      ${related ? `<div class="side__card"><h3>${T("side.related")}</h3><div class="related" style="margin-top:8px">${related}</div></div>` : ""}
      <div class="side__card" style="background:var(--bg-soft)">
        <p class="formnote">${esc(p.compliance || "Sadržaj provjerava funkcija usklađenosti prije objave.")}</p>
      </div>
    </aside>`;
  }
  function segNames(seg) {
    const map = isEN()
      ? { A: "Domestic investors", B: "Foreign markets", C: "Diaspora", D: "Private clients", E: "Entrepreneurs", F: "Companies", G: "Institutions", H: "Partners" }
      : { A: "Domaći investitori", B: "Strana tržišta", C: "Dijaspora", D: "Privatni klijenti", E: "Preduzetnici", F: "Kompanije", G: "Institucije", H: "Partneri" };
    return String(seg || "").split(",").map(s => map[s.trim()] || s.trim()).filter(Boolean).join(", ") || (isEN() ? "All" : "Svi");
  }
  const clsLabel = (cls) => isEN() ? String(cls || "Active").replace("(uslovno)", "(conditional)") : (cls || "Aktivno");

  /* ---------------- PAGE HERO ---------------- */
  function pagehero(p) {
    const parent = p.parent ? EB.page(p.parent) : null;
    const section = (p.parent || p.slug || "").replace(/[^a-z-]/g, "");
    const crumb = `<div class="crumb"><a href="#/">${T("crumb.home")}</a> <span>/</span> ${parent ? `<a href="#/${parent.slug}">${esc(pTitle(parent))}</a> <span>/</span> ` : ""}${esc(pTitle(p))}</div>`;
    return `<section class="pagehero pagehero--${section}"><div class="wrap">
      ${crumb}
      <span class="tag">${esc(pEyebrow(p) || "Usluga")}</span>
      <h1>${heroAccent(pMsg(p))}</h1>
      <p>${esc(pGoal(p))}</p>
    </div></section>`;
  }
  function ctaBand(p) {
    const cta = isEN() ? T("btn.zakazite") : (p.primary_cta || "Zakažite razgovor");
    return `<section class="section section--soft"><div class="wrap"><div class="finalcta reveal">
      <h2>${esc(cta)}</h2>
      <p>${T("cta.replyNote")}</p>
      <div class="hero__actions"><a class="btn btn--primary" href="#/${esc(p.primary_cta_link || "kontakt")}">${esc(isEN() ? T("btn.posaljite") : (p.primary_cta || "Pošaljite upit"))} ${I.arrow}</a>${p.secondary_cta ? `<a class="btn btn--ghost-light" href="#/${esc(p.secondary_cta_link || "kontakt")}">${esc(isEN() ? T("btn.zakazite") : p.secondary_cta)}</a>` : ""}</div>
    </div></div></section>`;
  }

  /* ---------------- FAQ ---------------- */
  function renderFaq(list) {
    return `<div class="faq" style="margin-top:16px">${list.map(f => `
      <div class="faq__item"><button class="faq__q">${esc(f.pitanje)}<span class="ic">${I.plus}</span></button><div class="faq__a"><p>${esc(f.odgovor)}</p></div></div>`).join("")}</div>`;
  }

  /* ---------------- CJENOVNIK ---------------- */
  function renderCjenovnik(p) {
    const rows = EB.data.cjenovnik || [];
    const cats = [...new Set(rows.map(r => r.kategorija))];
    const body = cats.map(cat => {
      const rs = rows.filter(r => r.kategorija === cat);
      return rs.map((r, i) => `<tr>${i === 0 ? `<td rowspan="${rs.length}" class="cat">${esc(cat)}</td>` : ""}<td><b>${esc(r.usluga)}</b></td><td class="fee">${esc(r.naknada)}</td><td>${esc(r.osnovica)}</td><td>${esc(r.napomena)}</td></tr>`).join("");
    }).join("");
    const en = isEN();
    const th = en ? ["Category", "Service", "Fee", "Basis", "Note"] : ["Kategorija", "Usluga", "Naknada", "Osnovica", "Napomena"];
    const priceDocs = EB.cjenovnici();
    const officialBlock = priceDocs.length ? `
      <div class="section-head" style="margin-bottom:16px"><span class="eyebrow">${en ? "Official price lists" : "Zvanični cjenovnici"}</span><h2 style="font-size:1.3rem">${en ? "Download the published fee schedules" : "Preuzmite objavljene cjenovnike"}</h2></div>
      <div class="doclist" style="margin-bottom:28px">${priceDocs.map(docCard).join("")}</div>` : "";
    return pagehero(p) + `<section class="section"><div class="wrap">
      ${officialBlock}
      <div class="notebox" style="margin-bottom:24px">${en ? "The table below is an orientational summary. The downloadable price lists above are the authoritative documents; an updated price list with an effective date is published upon adoption." : "Tabela ispod je orijentacioni pregled. Cjenovnici za preuzimanje iznad su mjerodavni dokumenti; ažurirani cjenovnik sa datumom primjene objavljuje se po usvajanju."}</div>
      <div class="tablewrap"><table class="price"><thead><tr><th>${th[0]}</th><th>${th[1]}</th><th>${th[2]}</th><th>${th[3]}</th><th>${th[4]}</th></tr></thead><tbody>${body}</tbody></table></div>
      <p class="formnote" style="margin-top:16px">${en ? "The price list is linked from every service page and available from the utility bar. For an extract specific to your situation, " : "Cjenovnik je povezan sa svake uslužne stranice i dostupan iz uslužne trake. Za konkretan izvod za vašu situaciju, "}${'<a class="link-arrow" style="display:inline-flex" href="#/kontakt">' + (en ? "get in touch " : "javite nam se ") + I.arrow + '</a>'}.</p>
    </div></section>`;
  }

  /* ---------------- ANALIZE (izvor: EB · urednicki-plan-analize) ---------------- */
  function renderAnalize(p) {
    const en = isEN();
    const sub = en ? "General market review — not individual investment advice." : "Opšti tržišni pregled — ne predstavlja individualnu investicionu preporuku.";
    const L = en
      ? { open: "Analysis", access: "No access? Request access", soon: "In preparation", empty: "Publications will appear here soon." }
      : { open: "Analiza", access: "Nemate pristup? Zatražite pristup", soon: "U pripremi", empty: "Publikacije će uskoro biti objavljene ovdje." };
    const items = EB.plan.analize().filter(a => EB.plan.isPublished(a.status))
      .sort((a, b) => (isNaN(EB._ts(b.date)) ? 0 : EB._ts(b.date)) - (isNaN(EB._ts(a.date)) ? 0 : EB._ts(a.date)));
    const cards = items.map(a => {
      const eyebrow = [a.month, a.topic].filter(Boolean).join(" · ");
      const dateHtml = a.date ? `<time class="icard__date">${esc(fmtDateSR(a.date) || a.date)}</time>` : "";
      const primary = EB.plan.isUrl(a.url)
        ? `<a class="link-arrow" href="${esc(a.url)}" target="_blank" rel="noopener" data-ext>${L.open} ${I.arrow}</a>`
        : `<span class="link-arrow is-muted">${L.soon}</span>`;
      return `<div class="icard reveal"><div class="icard__top analiza">${esc(eyebrow)}</div>
        <div class="icard__body">${dateHtml}<h3>${esc(a.title)}</h3><p>${esc(a.description || sub)}</p>
        <div class="icard__cta">${primary}<a class="icard__access" href="#/kontakt">${L.access} ${I.arrow}</a></div></div></div>`;
    }).join("");
    const grid = items.length ? `<div class="grid grid-3">${cards}</div>` : `<div class="notebox">${L.empty}</div>`;
    return pagehero(p) + `<section class="section"><div class="wrap">
      <div class="notebox notebox--reg" style="margin-bottom:24px">${en ? "All publications are general market overviews and do not constitute individual investment advice. Read the risk warning before deciding." : "Sve publikacije su opšti tržišni pregledi i ne predstavljaju individualnu investicionu preporuku. Prije odluke pročitajte upozorenje o rizicima."}</div>
      ${grid}
    </div></section>${ctaBand(p)}`;
  }

  /* ---------------- EDUKACIJA (vodiči + webinari — dva nezavisna izvora) ---------------- */
  function renderEdukacija(p) {
    const en = isEN();
    // Vodiči — EB · urednicki-plan-edukacija-centar-znanja (featured prvo, pa datum opadajuće)
    const gL = { see: en ? "See the guide" : "Pogledajte vodič", soon: en ? "Coming soon" : "Uskoro", empty: en ? "Guides will be published here soon." : "Vodiči će uskoro biti objavljeni ovdje." };
    const guidesArr = EB.plan.vodici()
      .sort((a, b) => ((b.featured ? 1 : 0) - (a.featured ? 1 : 0)) || ((isNaN(EB._ts(b.date)) ? 0 : EB._ts(b.date)) - (isNaN(EB._ts(a.date)) ? 0 : EB._ts(a.date))));
    const guides = guidesArr.map(g => {
      const hasUrl = EB.plan.isLink(g.url);
      const href = hasUrl ? EB.plan.href(g.url) : "";
      const cta = hasUrl ? `<span class="link-arrow">${gL.see} ${I.arrow}</span>` : `<span class="link-arrow is-muted">${gL.soon}</span>`;
      const desc = g.description ? `<p class="cal__d">${esc(g.description)}</p>` : "";
      const open = hasUrl ? `<a class="cal__item reveal${g.featured ? " is-featured" : ""}" href="${esc(href)}" target="_blank" rel="noopener" data-ext>` : `<div class="cal__item reveal${g.featured ? " is-featured" : ""}">`;
      const close = hasUrl ? "</a>" : "</div>";
      return `${open}<div class="cal__m">${esc(g.month)}</div><h4>${esc(g.title)}</h4>${desc}${cta}${close}`;
    }).join("");
    // Webinari — EB · urednicki-plan-edukacija-webinari-i-dogadjaji (budući događaji, najbliži prvo; aktivan CTA samo uz validnu prijavu)
    const wL = { signup: en ? "Sign up" : "Prijavite se", soon: en ? "Registration opening soon" : "Prijava uskoro", free: en ? "Free webinar with registration." : "Besplatan webinar uz prijavu.", empty: en ? "No upcoming webinars at the moment." : "Trenutno nema najavljenih webinara." };
    const now = Date.now();
    const websArr = EB.plan.webinari()
      .filter(w => { const t = EB._ts(w.date); return isNaN(t) ? true : t >= now; })
      .sort((a, b) => { const ta = EB._ts(a.date), tb = EB._ts(b.date); if (isNaN(ta) && isNaN(tb)) return 0; if (isNaN(ta)) return 1; if (isNaN(tb)) return -1; return ta - tb; });
    const webs = websArr.map(w => {
      const when = [w.date ? (fmtDateSR(w.date) || w.date) : "", w.time].filter(Boolean).join(" · ");
      const cta = EB.plan.isUrl(w.registrationUrl)
        ? `<a class="link-arrow" href="${esc(w.registrationUrl)}" target="_blank" rel="noopener" data-ext>${wL.signup} ${I.arrow}</a>`
        : `<span class="link-arrow is-muted">${wL.soon}</span>`;
      return `<div class="icard reveal"><div class="icard__top webinar">${esc(w.month || "Webinar")}</div><div class="icard__body">${when ? `<time class="icard__date">${esc(when)}</time>` : ""}<h3>${esc(w.title)}</h3><p>${esc(w.description || wL.free)}</p><div class="icard__cta">${cta}</div></div></div>`;
    }).join("");
    const dia = `<a class="band reveal" href="#/investiranje-iz-dijaspore" style="text-decoration:none;margin-bottom:34px">
      <div><span class="eyebrow">${en ? "For the diaspora" : "Za dijasporu"}</span>
      <h2 style="margin:8px 0 6px">${en ? "Investing from abroad, step by step" : "Ulaganje iz inostranstva, korak po korak"}</h2>
      <p style="margin:0">${en ? "Documentation and a remote process for members of the diaspora and returnees." : "Dokumentacija i postupak na daljinu za članove dijaspore i povratnike."}</p></div>
      <span class="btn btn--dark">${en ? "Read the guide" : "Pročitajte vodič"} ${I.arrow}</span>
    </a>`;
    return pagehero(p) + `<section class="section"><div class="wrap">
      ${dia}
      <div class="section-head"><span class="eyebrow">${en ? "Knowledge centre" : "Centar znanja"}</span><h2>${en ? "Guides — from first step to portfolio" : "Vodiči, od prvog koraka do portfelja"}</h2></div>
      ${guides ? `<div class="cal">${guides}</div>` : `<div class="notebox">${gL.empty}</div>`}
    </div></section>
    <section class="section section--soft"><div class="wrap">
      <div class="section-head"><span class="eyebrow">${en ? "Webinars & events" : "Webinari i događaji"}</span><h2>${en ? "Learn live, ask directly" : "Uči uživo, pitaj direktno"}</h2></div>
      ${webs ? `<div class="grid grid-4">${webs}</div>` : `<div class="notebox">${wL.empty}</div>`}
    </div></section>${ctaBand(p)}`;
  }

  /* ---------------- READINESS TOOL ---------------- */
  const TOOLQ = [
    ["Kolika je godišnja potreba za kapitalom?", ["Manje od 1 mil. KM", "1–5 mil. KM", "Više od 5 mil. KM"], [0, 2, 3]],
    ["Da li društvo ima revidirane finansijske izvještaje?", ["Da, više godina", "Da, jednu godinu", "Ne"], [3, 1, 0]],
    ["Kakav je novčani tok u posljednje 3 godine?", ["Stabilan i pozitivan", "Promjenljiv", "Negativan"], [3, 1, 0]],
    ["Da li je vlasnička struktura uređena?", ["Da, jasno", "Djelimično", "Ne"], [2, 1, 0]],
    ["Postoji li iskustvo sa spoljnim finansiranjem?", ["Da (krediti/investitori)", "Ograničeno", "Ne"], [2, 1, 0]],
    ["Koji je cilj prikupljanja kapitala?", ["Rast/investicija", "Refinansiranje", "Likvidnost"], [3, 1, 0]],
    ["Da li menadžment može posvetiti vrijeme procesu?", ["Da", "Djelimično", "Ne"], [2, 1, 0]],
    ["Kakva je spremnost na transparentnost prema investitorima?", ["Visoka", "Srednja", "Niska"], [3, 1, 0]],
    ["Koji je željeni rok?", ["6–12 mjeseci", "3–6 mjeseci", "Odmah"], [2, 1, 0]],
    ["Da li postoji uređeno korporativno upravljanje?", ["Da", "Djelimično", "Ne"], [2, 1, 0]]
  ];
  const TOOLQ_EN = [
    ["What is your annual capital need?", ["Under 1M KM", "1–5M KM", "Over 5M KM"], [0, 2, 3]],
    ["Does the company have audited financial statements?", ["Yes, several years", "Yes, one year", "No"], [3, 1, 0]],
    ["How has cash flow been over the last 3 years?", ["Stable and positive", "Variable", "Negative"], [3, 1, 0]],
    ["Is the ownership structure orderly?", ["Yes, clearly", "Partly", "No"], [2, 1, 0]],
    ["Any experience with external financing?", ["Yes (loans/investors)", "Limited", "No"], [2, 1, 0]],
    ["What is the goal of raising capital?", ["Growth/investment", "Refinancing", "Liquidity"], [3, 1, 0]],
    ["Can management devote time to the process?", ["Yes", "Partly", "No"], [2, 1, 0]],
    ["How ready are you for transparency to investors?", ["High", "Medium", "Low"], [3, 1, 0]],
    ["What is your desired timeframe?", ["6–12 months", "3–6 months", "Immediately"], [2, 1, 0]],
    ["Is corporate governance in place?", ["Yes", "Partly", "No"], [2, 1, 0]]
  ];
  const toolStrings = () => isEN()
    ? { note: "The result is a general orientation of readiness, not investment advice or an offer. It is a basis for a conversation.", count: (a, b) => "Question " + a + " of " + b, verdicts: ["Good candidate", "With preparation", "Early stage"], notes: ["Your company shows clear signs of readiness. We suggest an initial conversation about the issue structure.", "The basis exists, but some areas need tidying. Preparing for the capital markets takes you to readiness.", "Before an issue it is worth tidying reporting and governance. We are glad to guide you through preparation."], send: "Send the result and book a call", again: "Retake the questionnaire" }
    : { note: "Rezultat je opšta orijentaciona procjena spremnosti, a ne investicioni savjet ni ponuda. Služi kao osnova za razgovor.", count: (a, b) => "Pitanje " + a + " od " + b, verdicts: ["Dobar kandidat", "Uz pripremu", "Rano je"], notes: ["Vaše društvo pokazuje jasne pokazatelje spremnosti. Predlažemo inicijalni razgovor o strukturi emisije.", "Osnova postoji, ali pojedina područja treba urediti. Priprema za tržište kapitala vodi vas do spremnosti.", "Prije emisije vrijedi urediti izvještavanje i upravljanje. Rado vas vodimo kroz pripremu."], send: "Pošaljite rezultat i zakažite razgovor", again: "Ponovite upitnik" };
  function renderTool(p) {
    return pagehero(p) + `<section class="section"><div class="wrap"><div class="pglayout">
      <div>
        <div class="notebox" style="margin-bottom:20px">${toolStrings().note}</div>
        <div class="tool" id="tool"><div class="tool__bar"><div class="tool__fill" id="toolFill"></div></div><div class="tool__body" id="toolBody"></div></div>
      </div>
      ${serviceSidebar(p)}
    </div></div></section>`;
  }
  function initTool() {
    const body = document.getElementById("toolBody"), fill = document.getElementById("toolFill");
    if (!body) return;
    const Q = isEN() ? TOOLQ_EN : TOOLQ, S = toolStrings();
    let i = 0, score = 0, max = Q.reduce((a, q) => a + Math.max(...q[2]), 0);
    if (EB.track) EB.track(EB.EVENTS.READINESS_START, {});
    function step() {
      if (i >= Q.length) return result();
      const q = Q[i];
      fill.style.width = ((i) / Q.length * 100) + "%";
      body.innerHTML = `<div class="tool__count">${S.count(i + 1, Q.length)}</div><div class="tool__q">${esc(q[0])}</div><div class="tool__opts">${q[1].map((o, k) => `<button class="tool__opt" data-v="${q[2][k]}">${esc(o)}</button>`).join("")}</div>`;
      body.querySelectorAll(".tool__opt").forEach(b => b.addEventListener("click", () => { score += +b.dataset.v; i++; step(); }));
    }
    function result() {
      fill.style.width = "100%";
      const pct = Math.round(score / max * 100);
      const idx = pct >= 70 ? 0 : (pct >= 40 ? 1 : 2);
      if (EB.track) EB.track(EB.EVENTS.READINESS_COMPLETE, { score_pct: pct, bucket: ["good", "with_prep", "early"][idx] });
      body.innerHTML = `<div class="tool__result">
        <div class="tool__score">${pct}%</div>
        <div style="font-family:var(--ff-head);font-weight:700;color:var(--teal);margin:6px 0 10px">${S.verdicts[idx]}</div>
        <p style="color:var(--muted);max-width:420px;margin:0 auto 22px">${esc(S.notes[idx])}</p>
        <a class="btn btn--primary" href="#/kontakt">${S.send} ${I.arrow}</a>
        <div style="margin-top:14px"><button class="link-arrow" id="toolReset" style="background:none;border:0">${S.again}</button></div>
      </div>`;
      const r = document.getElementById("toolReset"); if (r) r.addEventListener("click", () => { i = 0; score = 0; step(); });
    }
    step();
  }

  /* ---------------- FORMS (otvorite-racun, kontakt) ---------------- */
  function renderForm(p, kind) {
    const c = content(p.slug);
    const en = isEN();
    const L = en
      ? { name: "Full name", nameP: "Your name", contact: "Contact (phone or e-mail)", contactP: "+387 / you@email", topicRacun: "What are you interested in", topicTema: "Topic", msg: "Message", msgP: "Briefly about your situation", source: "How did you hear about us? (source)", consent: "I agree to the processing of my data for the purpose of responding to this inquiry, per the privacy policy.", note: "We reply within one business day. This form is neither a contract nor investment advice.", direct: "Direct contact", hours: "Weekdays 8am–4pm", phone: "Phone", email: "E-mail", hq: "Head office", optRacun: ["Domestic market", "World markets", "RS bonds", "Investment advice"], optTema: ["General inquiry", "Opening an account", "Investment advice", "Corporate services", "Institutional programme", "Partnerships"], optSrc: ["Search (Google)", "Referral", "Social media", "Existing client", "Other"] }
      : { name: "Ime i prezime", nameP: "Vaše ime", contact: "Kontakt (telefon ili e-pošta)", contactP: "+387 / vas@email", topicRacun: "Šta vas zanima", topicTema: "Tema", msg: "Poruka", msgP: "Ukratko o vašoj situaciji", source: "Kako ste čuli za nas? (izvor)", consent: "Saglasan/na sam sa obradom podataka u svrhu odgovora na upit, u skladu sa politikom zaštite podataka.", note: "Javljamo se u jednom radnom danu. Ovaj obrazac ne predstavlja ugovor niti investicionu preporuku.", direct: "Direktan kontakt", hours: "Radnim danima 08–16h.", phone: "Telefon", email: "E-pošta", hq: "Sjedište", optRacun: ["Domaće tržište", "Svjetska tržišta", "Obveznice RS", "Investiciono savjetovanje"], optTema: ["Opšti upit", "Otvaranje računa", "Investiciono savjetovanje", "Usluge za kompanije", "Institucionalni program", "Partnerstva"], optSrc: ["Pretraga (Google)", "Preporuka", "Društvene mreže", "Postojeći klijent", "Drugo"] };
    // Jedan korak (broj dolazi iz .step::before CSS countera)
    const stepBox = (s, extra) => `<div class="step${s.embed ? " step--embed" : ""}"><div><h4>${esc(s.t)}</h4><p>${esc(s.d)}</p>${extra || ""}</div></div>`;
    // Sadržaj kolone: za /otvorite-racun/ (racun) proces je 01 + 02 → dokumentacija → 03 (poslije dokumentacije)
    let mid = "";
    if (kind === "racun" && c.steps && c.steps.length >= 3) {
      const st = c.steps;
      const req = (EB.data.dokumenti || []).filter(d => d.kategorija === "Otvaranje računa");
      const docsBlock = req.length ? `<div class="oa-docs"><h3 class="oa-docs__h">${en ? "Required documentation and forms" : "Potrebna dokumentacija i obrasci"}</h3><div class="doclist">${req.map(docCard).join("")}</div></div>` : "";
      mid = `<div class="steps" style="margin-bottom:20px">${stepBox(st[0], "")}${stepBox(st[1], "")}</div>${docsBlock}<div class="steps" style="counter-reset:s 2;margin:20px 0 28px">${stepBox(st[2], "")}</div>`;
    } else {
      mid = c.steps ? `<div class="steps" style="margin-bottom:28px">${c.steps.map(s => stepBox(s, s.href ? `<a class="btn btn--primary step__cta" href="${esc(s.href)}"${s.ext ? ' target="_blank" rel="noopener noreferrer" data-ext' : ''}>${esc(s.cta)} ${I.arrow}</a>` : "")).join("")}</div>` : "";
    }
    const opts = (arr) => arr.map(o => `<option>${esc(o)}</option>`).join("");
    const topic = kind === "racun"
      ? `<div class="field"><label>${L.topicRacun}</label><select>${opts(L.optRacun)}</select></div>`
      : `<div class="field"><label>${L.topicTema}</label><select>${opts(L.optTema)}</select></div>`;
    // Uvodna poruka neposredno iznad obrasca (samo /otvorite-racun/) — povezuje proces sa formom zahtjeva
    const formIntro = kind === "racun"
      ? `<div class="oa-formintro"><h3>${en ? "Start the account-opening process" : "Započnite postupak otvaranja računa"}</h3><p>${en ? "Fill in and submit the request form to receive the online questionnaire and begin the account-opening process." : "Popunite i pošaljite obrazac sa zahtjevom za dostavu online Upitnika za početak postupka otvaranja računa."}</p></div>`
      : "";
    return pagehero(p) + `<section class="section"><div class="wrap"><div class="pglayout">
      <div>
        ${c.what ? `<p class="lead" style="margin-bottom:24px">${esc(c.what)}</p>` : ""}
        ${mid}
        ${formIntro}
        <form class="form" data-form="1" data-kind="${kind}">
          <div class="row2">
            <div class="field"><label>${L.name}</label><input required placeholder="${L.nameP}"></div>
            <div class="field"><label>${L.contact}</label><input required placeholder="${L.contactP}"></div>
          </div>
          ${topic}
          <div class="field"><label>${L.msg}</label><textarea placeholder="${L.msgP}"></textarea></div>
          <div class="field"><label>${L.source}</label><select>${opts(L.optSrc)}</select></div>
          <label class="consent"><input type="checkbox" required> ${L.consent}</label>
          <button class="btn btn--primary" type="submit">${T("btn.posaljite")} ${I.arrow}</button>
          <p class="formnote">${L.note}</p>
        </form>
      </div>
      <aside class="side">
        <div class="side__card dark"><h3>${L.direct}</h3><p>${L.hours}</p>
          <div class="side__meta"><div class="row"><span>${L.phone}</span><b>+387 51 ...</b></div><div class="row"><span>${L.email}</span><b>info@eurobroker.ba</b></div><div class="row"><span>${L.hq}</span><b>Banja Luka</b></div></div>
        </div>
        <div class="side__card"><h3>${T("home.whatNeed")}</h3><div class="related" style="margin-top:8px">
          <a href="#/investiranje">${T("seg.A")} ${I.arrow}</a>
          <a href="#/za-kompanije">${T("seg.F")} ${I.arrow}</a>
          <a href="#/institucionalni-klijenti">${T("seg.G")} ${I.arrow}</a>
        </div></div>
      </aside>
    </div></div></section>`;
  }

  /* ---------------- DOKUMENTI (stvarni dokumenti za preuzimanje) ---------------- */
  const DOC_CAT_EN = {
    "Pravila i uslovi": "Rules and terms", "Cjenovnik": "Price lists", "Obrasci": "Forms",
    "Izjave": "Declarations", "Upitnici": "Questionnaires", "Otvaranje računa": "Account opening"
  };
  const docCatLabel = (c) => isEN() ? (DOC_CAT_EN[c] || c) : c;
  /* Kartica dokumenta iz reda tabele EB · dokumenti (EB.docs). Prazna metadata se ne prikazuje. */
  function docCard(d) {
    const en = isEN();
    const href = EB.docs.href(d.url);
    const external = EB.plan.isExternal(d.url);
    const linkAttrs = external ? 'target="_blank" rel="noopener"' : 'download';
    const meta = [d.format, d.velicina].filter(Boolean).join(" · ");
    const dateLoc = d.dateEff ? (fmtDateSR(d.dateEff) || d.dateEff) : "";
    const effLabel = en ? "Effective from" : "Stupanje na snagu";
    return `<a class="docitem" href="${esc(href)}" ${linkAttrs} aria-label="${en ? "Open document" : "Otvori dokument"}: ${esc(d.naziv)}">
      <span class="docitem__ic">${I.doc}</span>
      <span class="docitem__body"><h3 class="docitem__name">${esc(d.naziv)}</h3>${d.opis ? `<small>${esc(d.opis)}</small>` : ""}${dateLoc ? `<span class="docitem__eff">${effLabel}: ${esc(dateLoc)}</span>` : ""}</span>
      <span class="docitem__meta">${meta ? esc(meta) + " " : ""}${I.download}</span>
    </a>`;
  }
  /* /dokumenti/ — dinamički registar: grupe i dokumenti u potpunosti iz tabele EB · dokumenti. */
  function renderDocs() {
    const groups = EB.docs.grouped();
    if (!groups.length) return `<div class="notebox">${isEN() ? "Documents are being prepared." : "Dokumenti se pripremaju."}</div>`;
    return groups.map(g => `
      <div class="docgroup">
        <h2 class="docgroup__h">${esc(docCatLabel(g.grupa))}</h2>
        <div class="doclist">${g.items.map(docCard).join("")}</div>
      </div>`).join("");
  }

  /* ---------------- SIMPLE PAGES (regulatorni, o-nama, partneri, dokumenti) ---------------- */
  // Stranica /o-nama/ — namjenski render (hero naslov/podnaslov fiksirani u kodu, restrukturiran sadržaj). Scoped CSS: .onama*.
  function renderONama(p) {
    const en = isEN();
    const c = content("o-nama");
    const hero = pagehero(p); // hero (message/goal/eyebrow) iz tabele EB·stranice
    const principles = (c.vrijednosti || []).map((v, i) => `<div class="why__item reveal"><span class="why__num">0${i + 1}</span><h3>${esc(v.t)}</h3><p>${esc(v.d)}</p></div>`).join("");
    const navDesc = en ? {
      "regulatorni-status": "Check Eurobroker's regulatory status, supervision and licences for operating in the capital market.",
      "cjenovnik": "An overview of fees and other costs related to Eurobroker's services."
    } : {
      "regulatorni-status": "Provjerite regulatorni status Eurobrokera, nadzor i dozvole za obavljanje poslova na tržištu kapitala.",
      "cjenovnik": "Pregled naknada i drugih troškova povezanih sa uslugama Eurobrokera."
    };
    const navCards = EB.children("o-nama").concat([EB.page("cjenovnik")]).filter(Boolean)
      .map(k => `<a class="svc" href="#/${k.slug}"><span class="svc__no">${I.arrow}</span><div><h3>${esc(pTitle(k))}</h3><p>${esc(navDesc[k.slug] || k.intent || "")}</p></div></a>`).join("");
    const netDeco = '<svg class="about-mv__deco" viewBox="0 0 120 120" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="1"><path d="M18 30l34 14 26-20 24 30"/><path d="M52 44l-8 34 34 8"/></g><g fill="currentColor"><circle cx="18" cy="30" r="2.4"/><circle cx="52" cy="44" r="2.4"/><circle cx="78" cy="24" r="2.4"/><circle cx="102" cy="54" r="2.4"/><circle cx="44" cy="78" r="2.4"/><circle cx="78" cy="86" r="2.4"/></g></svg>';
    const mvCard = (cls, o) => o ? `<div class="about-mv ${cls}">${netDeco}<span class="about-mv__label">${esc(o.label)}</span><p class="about-mv__msg">${esc(o.msg)}</p><p class="about-mv__desc">${esc(o.desc)}</p></div>` : "";
    return hero + `
    <section class="section"><div class="wrap onama">
      <div class="onama__prose">
        <p class="lead">${esc(c.what)}</p>
        ${c.danas ? `<p>${esc(c.danas)}</p>` : ""}
        ${c.cilj ? `<p>${esc(c.cilj)}</p>` : ""}
      </div>
      ${(c.mission || c.vision) ? `<div class="about-mv-section">
        <h2 class="about-mv__title">${en ? "Mission and vision" : "Misija i vizija"}</h2>
        <div class="about-mission-vision">${mvCard("about-mission", c.mission)}${mvCard("about-vision", c.vision)}</div>
      </div>` : ""}
      ${c.promise ? `<div class="onama__promise about-brand-statement">${esc(c.promise)}</div>` : ""}
      <h3 class="onama__principles-h">${en ? "Principles we follow" : "Principi kojima se vodimo"}</h3>
      <div class="why onama__principles">${principles}</div>
      <div class="grid grid-2 onama__nav">${navCards}</div>
    </div></section>${ctaBand(p)}`;
  }

  function renderSimple(p) {
    const c = content(p.slug);
    let inner = "";
    if (c.what) inner += `<p class="lead" style="margin-bottom:24px">${esc(c.what)}</p>`;
    if (p.slug === "regulatorni-status") {
      // Potpuno data-driven iz tabele EB · drustvo: grupe (H2) iz kolone `grupa`, polja iz `label`/`vrijednost`.
      const groups = EB.drustvoGroups(isEN());
      if (groups.length) {
        // Raspored: naziv grupe lijevo, polja (label + vrijednost) desno; svaka grupa jedan red.
        inner += `<div class="regtable">${groups.map(g => `<div class="regrow">
          <div class="regrow__grupa">${esc(g.grupa)}</div>
          <div class="regrow__fields">${g.items.map(it => `<div class="regfield"><span class="regfield__label">${esc(it.label)}</span><span class="regfield__value">${it.href ? `<a href="${esc(it.href)}"${EB.plan.isExternal(it.href) ? ' target="_blank" rel="noopener"' : ""}>${esc(it.value)}</a>` : esc(it.value)}</span></div>`).join("")}</div>
        </div>`).join("")}</div>`;
      } else {
        inner += `<div class="notebox">${isEN() ? "Regulatory details are being prepared." : "Regulatorni podaci se pripremaju."}</div>`;
      }
      if (c.napomena) inner += `<div class="notebox notebox--reg">${esc(c.napomena)}</div>`;
    }
    if (p.slug === "partneri" && c.whoFor) {
      inner += `<div class="chips" style="margin:10px 0 20px">${c.whoFor.map(w => `<span class="chip">${esc(w)}</span>`).join("")}</div>`;
    }
    if (p.slug === "dokumenti") {
      inner += renderDocs();
    }
    return pagehero(p) + `<section class="section"><div class="wrap"><div class="simple" style="max-width:840px">${inner || `<p class="lead">${esc(p.goal || "")}</p>`}</div></div></section>${ctaBand(p)}`;
  }

  /* ---------------- 404 ---------------- */
  function render404(slug) {
    const en = isEN();
    return `<section class="pagehero"><div class="wrap">
      <div class="crumb"><a href="#/">${T("crumb.home")}</a> <span>/</span> 404</div>
      <span class="tag">404</span>
      <h1>${en ? "Page not found" : "Stranica nije pronađena"}</h1>
      <p>${en ? "The address you requested does not exist or has moved." : "Adresa koju ste zatražili ne postoji ili je premještena."}</p>
    </div></section>
    <section class="section"><div class="wrap">
      <div class="grid grid-4">
        ${["investiranje", "za-kompanije", "institucionalni-klijenti", "edukacija"].map(s => { const pp = EB.page(s); return `<a class="segcard reveal" href="#/${s}"><div class="segcard__icon">${pageIcon[s] || I.invest}</div><h3>${esc(pTitle(pp))}</h3><span class="link-arrow">${T("btn.saznajteVise")} ${I.arrow}</span></a>`; }).join("")}
      </div>
      <div style="margin-top:26px"><a class="btn btn--dark" href="#/">${en ? "Back to home" : "Nazad na početnu"} ${I.arrow}</a></div>
    </div></section>`;
  }

  /* ---------------- VIJESTI (korporativne i regulatorne objave) ---------------- */
  function renderVijesti() {
    const en = isEN();
    // Hero: primarno iz EB·stranice (isti mehanizam kao ostale stranice); fallback dok red ne postoji.
    const fallbackMeta = { slug: "vijesti", title: en ? "News & notices" : "Vijesti i objave", type: en ? "Corporate / regulatory" : "Korporativna / regulatorna", eyebrow: en ? "Corporate / regulatory" : "Korporativna / regulatorna", message: en ? "Corporate and regulatory notices" : "Korporativne i regulatorne objave", goal: en ? "A record of orderly conduct and disclosure obligations." : "Dokaz urednosti i ispunjenja obaveza objavljivanja.", parent: "" };
    const p = EB.page("vijesti") || fallbackMeta;

    const news = EB.vijesti();
    const groups = EB.vijesti.groups();
    const emptyMsg = `<div class="notebox">${en ? "There are currently no published news." : "Trenutno nema objavljenih vijesti."}</div>`;
    const filter = groups.length ? `<div class="vfilter reveal">
      <button class="vfilter__b is-active" data-vfilter="*">${en ? "All" : "Sve"}</button>
      ${groups.map(g => `<button class="vfilter__b" data-vfilter="${esc(g)}">${esc(g)}</button>`).join("")}
    </div>` : "";
    const card = (v) => {
      const isHash = /^#\//.test(v.link);
      const href = isHash ? v.link : EB.vijesti.href(v.link);
      const attrs = isHash ? "" : ' target="_blank" rel="noopener" data-ext';
      const cta = href ? `<div class="icard__cta"><a class="link-arrow" href="${esc(href)}"${attrs}>${esc(v.linkTekst || (en ? "Read more" : "Pročitajte više"))} ${I.arrow}</a></div>` : "";
      const dateStr = v.datum ? (fmtDateSR(v.datum) || v.datum) : "";
      const img = v.slika ? `<img class="icard__img" src="${esc(v.slika)}" alt="${esc(v.altSlika)}" loading="lazy">` : "";
      return `<div class="icard reveal" data-grupa="${esc(v.grupa)}"><div class="icard__top vijest">${esc(v.grupa || (en ? "News" : "Vijest"))}</div>${img}<div class="icard__body">${dateStr ? `<time class="icard__date">${esc(dateStr)}</time>` : ""}<h3>${esc(v.naziv)}</h3>${v.opis ? `<p>${esc(v.opis)}</p>` : ""}${cta}</div></div>`;
    };
    const list = news.length ? `<div class="cal" id="vijesti-list">${news.map(card).join("")}</div>` : emptyMsg;

    // Filter kategorija — delegirani klik (veže se jednom; radi i nakon re-rendera).
    if (!EB._vfilterBound) {
      EB._vfilterBound = true;
      document.addEventListener("click", (e) => {
        const b = e.target.closest(".vfilter__b"); if (!b) return;
        const wrap = b.closest(".vfilter"); if (!wrap) return;
        wrap.querySelectorAll(".vfilter__b").forEach(x => x.classList.toggle("is-active", x === b));
        const f = b.getAttribute("data-vfilter");
        const el = document.getElementById("vijesti-list");
        if (el) el.querySelectorAll(".icard").forEach(c => { c.style.display = (f === "*" || c.getAttribute("data-grupa") === f) ? "" : "none"; });
      });
    }

    return pagehero(p) + `<section class="section"><div class="wrap">
      ${filter}
      ${list}
    </div></section>`;
  }

  /* ---------------- History API rutiranje (prave putanje) ---------------- */
  const SYNTH_PATHS = {
    "investiranje-iz-dijaspore": "/edukacija/investiranje-iz-dijaspore/",
    "vijesti": "/vijesti/"
  };
  function slugToPath(slug) {
    let rel;
    if (!slug || slug === "pocetna") rel = "/";
    else if (SYNTH_PATHS[slug]) rel = SYNTH_PATHS[slug];
    else { const pg = EB.page(slug); rel = (pg && pg.url) ? pg.url : "/" + slug + "/"; }
    return BASEP + rel;
  }
  let _pathIndex = null;
  function pathIndex() {
    if (_pathIndex) return _pathIndex;
    _pathIndex = {};
    EB.pages().forEach(pg => { if (pg.url && pg.url !== "/") _pathIndex[pg.url.replace(/\/*$/, "/")] = pg.slug; });
    Object.keys(SYNTH_PATHS).forEach(slug => { _pathIndex[SYNTH_PATHS[slug]] = slug; });
    return _pathIndex;
  }
  function pathToSlug(pathname) {
    let path = decodeURIComponent(pathname || "/").replace(/\/index\.html$/i, "/");
    if (BASEP && path.indexOf(BASEP) === 0) path = path.slice(BASEP.length) || "/"; // skini /<repo> prefiks
    if (!path || path === "/") return "pocetna";
    const norm = path.endsWith("/") ? path : path + "/";
    const idx = pathIndex();
    if (idx[norm]) return idx[norm];
    const seg = norm.replace(/\/+$/, "").split("/").pop();
    return seg || "pocetna";
  }
  // pretvori sve `#/slug` linkove (iz šablona) u prave putanje
  // Pauzira suptilnu animaciju pozadine dok hero/pagehero nisu u vidnom polju (ušteda GPU/baterije).
  function observeWorldFx() {
    const vid = document.querySelector(".hero__video");
    if (vid) {
      // Dinamički umetnut <video> (preko innerHTML) ne pali autoplay pouzdano zbog utrke sa 'canplay'.
      // Zato: muted kao SVOJSTVO + retry petlja koja zove play() dok video stvarno ne krene.
      vid.muted = true; vid.defaultMuted = true; vid.autoplay = true;
      const kick = () => { const p = vid.play && vid.play(); if (p && p.catch) p.catch(() => {}); };
      let tries = 0;
      const ensure = () => {
        if (!vid.paused || tries >= 15) return;      // krenuo je ili odustajemo nakon ~6s
        tries++; kick(); setTimeout(ensure, 400);
      };
      kick();
      vid.addEventListener("loadeddata", kick, { once: true });
      vid.addEventListener("canplay", kick, { once: true });
      setTimeout(ensure, 300);
    }
    if (!("IntersectionObserver" in window)) return;
    const els = document.querySelectorAll(".hero, .pagehero");
    if (!els.length) return;
    if (EB._fxIO) EB._fxIO.disconnect();
    EB._fxIO = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        e.target.classList.toggle("is-paused", !e.isIntersecting);
        const v = e.target.querySelector(".hero__video");
        if (v) {
          if (e.isIntersecting) { const p = v.play && v.play(); if (p && p.catch) p.catch(() => {}); }
          else if (v.pause) { v.pause(); }
        }
      });
    }, { rootMargin: "120px" });
    els.forEach((el) => EB._fxIO.observe(el));
  }
  function finalizeLinks(root) {
    root.querySelectorAll('a[href^="#/"]').forEach(a => {
      const slug = a.getAttribute("href").replace(/^#\//, "").replace(/\/$/, "") || "pocetna";
      a.setAttribute("href", slugToPath(slug));
    });
  }
  function navigate(path) {
    if (location.pathname !== path) history.pushState({}, "", path);
    route();
  }

  /* ---------------- ROUTER ---------------- */
  function route() {
    const slug = pathToSlug(location.pathname);
    let p = EB.page(slug);
    const main = document.getElementById("main");
    // sintetičke stranice (nisu u tabeli)
    if (!p && slug === "investiranje-iz-dijaspore") p = synthPage(slug);

    let html;
    if (slug === "pocetna") html = renderHome();
    else if (slug === "vijesti") html = renderVijesti();
    else if (!p) html = render404(slug);
    else if (slug === "cjenovnik") html = renderCjenovnik(p);
    else if (slug === "analize") html = renderAnalize(p);
    else if (slug === "edukacija") html = renderEdukacija(p);
    else if (slug === "procjena-spremnosti") html = renderTool(p);
    else if (slug === "otvorite-racun") html = renderForm(p, "racun");
    else if (slug === "kontakt") html = renderForm(p, "kontakt");
    else if (slug === "o-nama") html = renderONama(p);
    else if (slug === "investiranje") html = renderInvestiranje(p);
    else if (slug === "za-kompanije") html = renderZaKompanije(p);
    else if (slug === "institucionalni-klijenti") html = renderInstitucionalni(p);
    else if (slug === "prikupljanje-kapitala" || slug === "poslovno-i-finansijsko-savjetovanje" || slug === "korporativni-poslovi" || slug === "analize-i-poslovni-planovi") html = renderZKUsluga(p);
    else if (slug === "partneri") html = renderPartneri(p);
    else if (["regulatorni-status", "dokumenti"].includes(slug)) html = renderSimple(p);
    else if (slug === "investiranje-iz-dijaspore") html = renderService(p);
    else if (slug === "kastodi-poslovi") html = renderKastodi(p);
    else if ((p.type || "").toLowerCase().includes("hub")) html = renderHub(p);
    else html = renderService(p);

    main.innerHTML = html;
    let tprefix = "";
    if (slug === "vijesti") tprefix = (isEN() ? "News & notices" : "Vijesti i objave") + " · ";
    else if (!p && slug !== "pocetna") tprefix = "404 · ";
    else if (p && slug !== "pocetna") tprefix = pTitle(p) + " · ";
    document.title = tprefix + "Eurobroker — Tržište kapitala";
    updateSEO(p, slug);
    finalizeLinks(document);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    setActiveNav(slug, p);
    bindPage();
    observeWorldFx();
    if (slug === "procjena-spremnosti") initTool();
    if (EB.track) {
      EB.track(EB.EVENTS.PAGE_VIEW, { page_slug: slug, page_title: document.title });
      if (slug === "cjenovnik") EB.track(EB.EVENTS.PRICELIST_VIEW, { page_slug: slug });
    }
  }

  /* ---------------- SEO (meta + strukturirani podaci) ---------------- */
  const SITE = "https://eurobroker.ba";
  function setMeta(sel, attr, val) {
    let el = document.head.querySelector(sel);
    if (!el) { el = document.createElement("meta"); const m = sel.match(/\[(name|property)="([^"]+)"\]/); if (m) el.setAttribute(m[1], m[2]); document.head.appendChild(el); }
    el.setAttribute(attr, val);
  }
  function updateSEO(p, slug) {
    const is404 = !p && slug !== "pocetna" && slug !== "vijesti";
    const desc = p ? (pGoal(p) || pMsg(p) || "")
      : slug === "vijesti" ? (isEN() ? "Corporate and regulatory notices from Eurobroker." : "Korporativne i regulatorne objave Eurobrokera.")
      : (isEN() ? "Page not found." : "Stranica nije pronađena.");
    const path = (p && p.url) ? p.url : (slug === "pocetna" ? "/" : "/" + slug + "/");
    const url = SITE + path;
    setMeta('meta[name="robots"]', "content", is404 ? "noindex, follow" : "index, follow");
    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", document.title);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[property="og:locale"]', "content", isEN() ? "en_US" : "sr_RS");
    let can = document.head.querySelector('link[rel="canonical"]');
    if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
    can.href = url;
    document.documentElement.lang = isEN() ? "en" : "sr-Latn";
    injectJSONLD(p, slug, url);
  }
  function injectJSONLD(p, slug, url) {
    const d = EB.drustvo();
    const org = {
      "@context": "https://schema.org", "@type": "FinancialService",
      name: d.naziv || "Eurobroker a.d. Banja Luka",
      legalName: d.puni_naziv || undefined,
      url: SITE + "/",
      areaServed: "BA",
      address: { "@type": "PostalAddress", addressLocality: d.grad || "Banja Luka", addressCountry: "BA" },
      email: (d.email && d.email.indexOf("[") === -1) ? d.email : undefined,
      description: isEN() ? "A licensed capital-markets firm from Banja Luka." : "Licencirano društvo tržišta kapitala iz Banje Luke."
    };
    const graph = [org];
    if (p && slug !== "pocetna") {
      const items = [{ "@type": "ListItem", position: 1, name: T("crumb.home"), item: SITE + "/" }];
      const parent = p.parent ? EB.page(p.parent) : null;
      if (parent) items.push({ "@type": "ListItem", position: 2, name: pTitle(parent), item: SITE + (parent.url || "/" + parent.slug + "/") });
      items.push({ "@type": "ListItem", position: items.length + 1, name: pTitle(p), item: url });
      graph.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items });
    }
    let s = document.getElementById("eb-jsonld");
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = "eb-jsonld"; document.head.appendChild(s); }
    s.textContent = JSON.stringify(graph.length === 1 ? graph[0] : graph);
  }
  function setActiveNav(slug, p) {
    const active = (p && p.level !== "1") ? (p.parent || slug) : slug;
    document.querySelectorAll("#mainnav a").forEach(a => a.classList.toggle("active", a.dataset.slug === active));
  }

  /* ---------------- Page-level bindings ---------------- */
  function bindPage() {
    // reveal
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    // faq
    document.querySelectorAll(".faq__item").forEach(it => {
      const q = it.querySelector(".faq__q"), a = it.querySelector(".faq__a");
      q.addEventListener("click", () => {
        const open = it.classList.toggle("open"); a.style.maxHeight = open ? a.scrollHeight + "px" : 0;
        if (open && EB.track) EB.track(EB.EVENTS.FAQ_OPEN, { question: q.textContent.trim().slice(0, 120) });
      });
    });
    // forms
    const okMsg = isEN()
      ? "✓ Thank you. Your inquiry has been recorded (demo). In production it is sent to the CRM with the acquisition source logged, and we reply within one business day."
      : "✓ Hvala. Vaš upit je zabilježen (demo). U produkciji se šalje u CRM sa evidentiranim izvorom akvizicije, a javljamo se u jednom radnom danu.";
    document.querySelectorAll("form[data-form]").forEach(f => f.addEventListener("submit", e => {
      e.preventDefault();
      if (EB.track) {
        const kind = f.getAttribute("data-kind");
        EB.track(EB.EVENTS.GENERATE_LEAD, { form_kind: kind || "kontakt" });
        EB.track(kind === "racun" ? EB.EVENTS.ACCOUNT_SUBMIT : EB.EVENTS.CONTACT_SUBMIT, {});
      }
      f.innerHTML = `<div class="success">${okMsg}</div>`;
    }));
  }

  /* ---------------- Global bindings ---------------- */
  function bindGlobal() {
    const hdr = document.getElementById("hdr");
    window.addEventListener("scroll", () => { hdr.classList.toggle("scrolled", window.scrollY > 8); }, { passive: true });
    const drawer = document.getElementById("drawer"), burger = document.getElementById("burger"), close = document.getElementById("drawerClose");
    if (burger) burger.addEventListener("click", () => drawer.classList.add("open"));
    if (close) close.addEventListener("click", () => drawer.classList.remove("open"));
    drawer.addEventListener("click", e => { if (e.target === drawer) drawer.classList.remove("open"); });
    drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", () => drawer.classList.remove("open")));
    const lang = document.getElementById("langToggle");
    if (lang) lang.addEventListener("click", () => {
      EB.lang = isEN() ? "sr" : "en";
      if (EB.track) EB.track(EB.EVENTS.LANGUAGE_SWITCH, { to: EB.lang });
      try { localStorage.setItem("eb_lang", EB.lang); } catch (e) {}
      const root = document.getElementById("app");
      root.innerHTML = renderHeader() + '<main id="main"></main>' + renderFooter();
      bindGlobal();
      route();
    });
    // History API: presretni interne linkove + mjeri konverzije (veže se jednom)
    if (!EB._navBound) {
      EB._navBound = true;
      window.addEventListener("popstate", route);
      document.addEventListener("click", e => {
        const a = e.target.closest("a"); if (!a) return;
        const href = a.getAttribute("href") || "";
        if (href.indexOf("tel:") === 0) { if (EB.track) EB.track(EB.EVENTS.PHONE_CLICK, { number: href.slice(4) }); return; }
        if (a.hasAttribute("download")) { if (EB.track) EB.track(EB.EVENTS.DOC_INTENT, { file: href }); return; }
        if (a.hasAttribute("data-ext")) { if (EB.track) EB.track(EB.EVENTS.CTA_CLICK, { label: (a.textContent || "").trim().slice(0, 40), href: href, external: true }); return; }
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (a.target === "_blank") return;
        if (href.charAt(0) !== "/") return; // samo interne apsolutne putanje (http/mailto/# se preskaču)
        if (EB.track) {
          const sl = pathToSlug(href);
          if (sl === "otvorite-racun") EB.track(EB.EVENTS.OPEN_ACCOUNT_START, { from: location.pathname });
          if (a.classList.contains("btn") || a.classList.contains("link-arrow") || a.classList.contains("miniquote"))
            EB.track(EB.EVENTS.CTA_CLICK, { label: (a.textContent || "").trim().slice(0, 60), href: href });
        }
        e.preventDefault();
        navigate(href);
      });
    }
  }

  /* ---------------- Boot ---------------- */
  async function boot() {
    await EB.loadAll();
    ensureExtraPages();
    const root = document.getElementById("app");
    root.innerHTML = renderHeader() + '<main id="main"></main>' + renderFooter();
    bindGlobal();
    route();
    const badge = document.getElementById("srcBadge");
    if (badge) { const src = EB._source.stranice || "embedded"; badge.textContent = "podaci: " + src; }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
