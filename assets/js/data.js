/* EUROBROKER — sloj podataka
 * Učitava tabele prema data/sheets.config.js:
 *  - "embedded": iz window.EB_DATA (radi offline, file://)
 *  - "csv":      lokalni CSV (potreban server)
 *  - "gsheet":   objavljeni CSV iz Google Sheets-a (potreban internet)
 */
window.EB = window.EB || {};

/* --- minimalni CSV parser (podržava navodnike i zareze u polju) --- */
EB.parseCSV = function (text) {
  const rows = [];
  let row = [], field = "", inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (inQ) {
      if (c === '"' && n === '"') { field += '"'; i++; }
      else if (c === '"') { inQ = false; }
      else field += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\r") { /* skip */ }
      else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
      else field += c;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const head = rows.shift().map(h => h.trim());
  return rows
    .filter(r => r.some(c => c.trim() !== ""))
    .map(r => {
      const o = {};
      head.forEach((h, i) => { o[h] = (r[i] || "").trim(); });
      return o;
    });
};

EB.data = {};
EB._source = {};

/* očekivana prva kolona po tabeli — služi za provjeru da je učitan ispravan CSV
   (a ne HTML stranica za prijavu ako Sheet još nije javno dijeljen) */
EB._firstCol = {
  stranice: "id", cjenovnik: "kategorija", urednickiPlan: "mjesec", segmenti: "oznaka",
  klasifikacija: "usluga", faq: "stranica", drustvo: "grupa", kpi: "pokazatelj", dokumenti: "kategorija", publikacije: "emitent",
  planAnalize: "mjesec", planVodici: "mjesec", planWebinari: "mjesec", dokumentiRegistar: "grupa", cjenovnici: "redoslijed"
};
EB._valid = function (key, rows) {
  if (!Array.isArray(rows) || !rows.length) return false;
  const want = EB._firstCol[key];
  return want ? Object.prototype.hasOwnProperty.call(rows[0], want) : true;
};

/* fetch sa tajmautom — spor/neuspio Google zahtjev brzo pada na ugrađenu kopiju */
EB._fetchT = function (url, opts, ms) {
  if (typeof AbortController === "undefined") return fetch(url, opts);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 4000);
  return fetch(url, Object.assign({ signal: ctrl.signal }, opts)).finally(() => clearTimeout(t));
};

EB.loadAll = async function () {
  const cfg = window.EB_SHEETS_CONFIG || {};
  const base = "data/"; // relativno u odnosu na index.html
  const jobs = Object.keys(cfg).map(async (key) => {
    const c = cfg[key];
    try {
      if (c.source === "gsheet" && c.url) {
        const res = await EB._fetchT(c.url, { cache: "no-store", redirect: "follow" }, 4000);
        const txt = await res.text();
        const rows = EB.parseCSV(txt);
        if (res.ok && EB._valid(key, rows)) { EB.data[key] = rows; EB._source[key] = "gsheet"; return; }
        throw new Error("nevažeći odgovor (moguće da Sheet nije javno dijeljen)");
      }
      if (c.source === "csv" && c.file) {
        const res = await fetch(base + c.file, { cache: "no-store" });
        const rows = EB.parseCSV(await res.text());
        if (res.ok && EB._valid(key, rows)) { EB.data[key] = rows; EB._source[key] = "csv"; return; }
        throw new Error("nevažeći CSV");
      }
    } catch (e) {
      console.warn("[EB] " + key + ": izvor '" + c.source + "' nije dostupan — koristim ugrađenu kopiju.", e.message || e);
    }
    // fallback: ugrađena kopija (sajt uvijek radi)
    EB.data[key] = (window.EB_DATA && window.EB_DATA[key]) ? window.EB_DATA[key] : [];
    EB._source[key] = "embedded";
  });
  await Promise.all(jobs);
  return EB.data;
};

/* --- helperi --- */
EB.pages = () => EB.data.stranice || [];
EB.page = (slug) => EB.pages().find(p => p.slug === slug);
EB.children = (slug) => EB.pages().filter(p => p.parent === slug);
EB.navPages = () => EB.pages()
  .filter(p => p.nav_order !== "" && p.level === "1" && p.slug !== "pocetna")
  .sort((a, b) => (+a.nav_order) - (+b.nav_order));
EB.drustvo = () => {
  const o = {}; (EB.data.drustvo || []).forEach(r => { o[r.polje] = r.vrijednost; }); return o;
};
/* Regulatorni status: dinamičke grupe iz tabele EB · drustvo (kolona `grupa`).
   Prikazuju se samo redovi sa popunjenom `grupa`, statusom aktivan i vrijednošću.
   Grupe se sortiraju po `grupa_redoslijed` (pa prvom pojavljivanju), polja po redoslijedu iz tabele.
   Bilingvalno: grupa/grupa_en i label/label_en. `polje`/`vrijednost` ostaju za EB.drustvo() (footer/JSON-LD). */
EB.drustvoGroups = function (en) {
  const rows = EB.data.drustvo || [];
  const num = (v) => { const n = parseFloat(v); return isNaN(n) ? Infinity : n; };
  const active = (s) => { const x = String(s || "").trim().toLowerCase(); return x === "" || x === "aktivan"; };
  const href = (u) => { const s = String(u || "").trim(); if (!s || /^\s*javascript:/i.test(s)) return ""; return EB.plan.isLink(s) ? EB.plan.href(s) : ""; };
  const items = rows.map((r, i) => ({
    key: (r.grupa || "").trim(),
    grupa: ((en ? (r.grupa_en || r.grupa) : r.grupa) || "").trim(),
    grupaOrder: num(r.grupa_redoslijed),
    label: ((en ? (r.label_en || r.label) : (r.label || r.label_en)) || r.polje || "").trim(),
    value: (r.vrijednost || "").trim(),
    href: href(r.url),
    status: (r.status || "").trim(),
    idx: i
  })).filter(x => x.key && x.value && active(x.status));
  const map = new Map();
  items.forEach(it => {
    if (!map.has(it.key)) map.set(it.key, { grupa: it.grupa, order: it.grupaOrder, seen: it.idx, items: [] });
    const g = map.get(it.key);
    if (it.grupaOrder < g.order) g.order = it.grupaOrder;
    g.items.push(it);
  });
  const groups = [...map.values()].sort((a, b) => (a.order - b.order) || (a.seen - b.seen));
  groups.forEach(g => g.items.sort((a, b) => a.idx - b.idx));
  return groups;
};
EB.faqFor = (slug) => (EB.data.faq || []).filter(f => f.stranica === slug);
/* EB · cjenovnici — blok „Zvanični cjenovnici" na /cjenovnik/. Normalizacija u oblik koji koristi docCard
   (naziv/opis/url/format/velicina), sortirano po `redoslijed`. Relativni `url` se razrješava preko <base>. */
EB.cjenovnici = () => (EB.data.cjenovnici || [])
  .map(r => {
    const v = (r.velicina_kb || r.velicina || "").trim();
    return {
      naziv: (r.naziv || "").trim(), opis: (r.opis || "").trim(),
      url: (r.url || r.fajl || "").trim(), format: (r.format || r.tip || "").trim(),
      velicina: v ? (/\b(kb|mb|gb)\b/i.test(v) ? v : v + " KB") : "",
      _o: parseFloat(r.redoslijed)
    };
  })
  .filter(x => x.naziv && x.url)
  .sort((a, b) => (isNaN(a._o) ? 999 : a._o) - (isNaN(b._o) ? 999 : b._o));

/* --- Urednički plan: tri normalizovana content streama (jedan centralni mapping) ---
   Fetch/cache/fallback ide kroz zajednički EB.loadAll; ovdje je samo schema adapter po tipu.
   Alias logika (opis↔*_opis, vodic_link↔vodic_url) je centralizovana, ne razbacana po rendererima. */
EB._ts = (v) => { const d = Date.parse(v); return isNaN(d) ? NaN : d; };
EB._truthy = (v) => /^(true|da|1|yes|x|✓)$/i.test(String(v || "").trim());
EB.plan = {
  analize: () => (EB.data.planAnalize || []).map(r => ({
    month: r.mjesec || "", topic: r.tema || "", title: r.analiza || "",
    date: r.analiza_datum || "", url: r.analiza_url || "", status: r.analiza_status || "", description: r.analiza_opis || ""
  })).filter(x => x.title),
  vodici: () => (EB.data.planVodici || []).map(r => ({
    month: r.mjesec || "", title: r.vodic || "", description: r.opis || r.vodic_opis || "",
    url: r.vodic_link || r.vodic_url || "", date: r.vodic_datum || "", featured: EB._truthy(r.vodic_featured)
  })).filter(x => x.title),
  webinari: () => (EB.data.planWebinari || []).map(r => ({
    month: r.mjesec || "", title: r.webinar || "", description: r.opis || r.webinar_opis || "",
    date: r.webinar_datum || "", time: r.webinar_vrijeme || "", registrationUrl: r.webinar_prijava || "", status: r.webinar_status || ""
  })).filter(x => x.title)
};
/* Objava: skriva samo eksplicitni draft/nacrt/interno; prazan ili "objavljeno" se prikazuje. */
EB.plan.isPublished = (status) => !/draft|nacrt|interno/i.test(String(status || ""));
/* isUrl: strogo apsolutni http(s) — za analiza_url (Drive) i webinar_prijava (eksterni obrazac). */
EB.plan.isUrl = (u) => /^https?:\/\//i.test(String(u || "").trim());
EB.plan.isExternal = (u) => /^https?:\/\//i.test(String(u || "").trim());
/* isLink: prihvata i relativni vodic_link (npr. assets/dokumenti/vodici/x.pdf) pored apsolutnog URL-a.
   Relativni put mora ličiti na fajl/putanju da slučajni tekst ne postane CTA. */
EB.plan.isLink = (u) => {
  const s = String(u || "").trim();
  return EB.plan.isExternal(s) || /^\//.test(s) || /^(assets|dokumenti)\//i.test(s) || /\.(pdf|html?|docx?|xlsx?|pptx?)$/i.test(s);
};
/* href: apsolutni ostaje kakav jest; relativni se razrješava u odnosu na <base> (/EUBR-sajt/ na produkciji). */
EB.plan.href = (u) => {
  const s = String(u || "").trim();
  if (EB.plan.isExternal(s)) return s;
  try { return new URL(s, document.baseURI).href; } catch (e) { return s; }
};

/* --- EB · dokumenti: dinamički registar zvaničnih dokumenata (jedini izvor za /dokumenti/) ---
   Fetch/cache/fallback kroz zajednički EB.loadAll; ovdje su normalizacija, status-filter,
   bezbjedna validacija URL-a i grupisanje/sortiranje na jednom mjestu. */
EB.docs = {};
/* Na javnoj strani prikazuj samo aktivne (prazan status = podrazumijevano aktivan); skrij arhiva/u_pripremi. */
EB.docs.isPublished = (status) => { const s = String(status || "").trim().toLowerCase(); return s === "" || s === "aktivan"; };
/* Bezbjedan URL: bez javascript:; dozvoljeni su http(s) i očekivani relativni putevi (EB.plan.isLink). */
EB.docs.safeUrl = (u) => { const s = String(u || "").trim(); if (/^\s*javascript:/i.test(s)) return false; return EB.plan.isLink(s); };
EB.docs.href = (u) => EB.plan.href(u);
EB.docs._num = (v) => { const n = parseFloat(v); return isNaN(n) ? Infinity : n; };
EB.docs.all = function () {
  return (EB.data.dokumentiRegistar || []).map(r => ({
    grupa: (r.grupa || "").trim(),
    grupaOrder: EB.docs._num(r.grupa_redoslijed),
    naziv: (r.naziv || "").trim(),
    opis: (r.opis || "").trim(),
    dateEff: (r.datum_stupanja_na_snagu || "").trim(),
    datePub: (r.datum_objave || "").trim(),
    verzija: (r.verzija || "").trim(),
    status: (r.status || "").trim(),
    jezik: (r.jezik || "").trim(),
    format: (r.format || "").trim(),
    velicina: (r.velicina || "").trim(),
    url: (r.url || "").trim(),
    order: EB.docs._num(r.redoslijed),
    featured: EB._truthy(r.featured)
  })).filter(d => d.naziv && EB.docs.safeUrl(d.url) && EB.docs.isPublished(d.status));
};
/* Grupiši po `grupa`; grupe sortiraj po najnižem grupa_redoslijed (pa prvom pojavljivanju),
   dokumente unutar grupe po `redoslijed` (pa nazivu). Nove grupe se pojavljuju automatski. */
EB.docs.grouped = function () {
  const rows = EB.docs.all();
  const map = new Map();
  rows.forEach((d, i) => {
    if (!map.has(d.grupa)) map.set(d.grupa, { grupa: d.grupa, order: d.grupaOrder, seen: i, items: [] });
    const g = map.get(d.grupa);
    if (d.grupaOrder < g.order) g.order = d.grupaOrder;
    g.items.push(d);
  });
  const groups = [...map.values()].sort((a, b) => (a.order - b.order) || (a.seen - b.seen));
  groups.forEach(g => g.items.sort((a, b) => (a.order - b.order) || a.naziv.localeCompare(b.naziv, "sr")));
  return groups;
};
