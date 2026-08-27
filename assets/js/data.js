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
  klasifikacija: "usluga", faq: "stranica", drustvo: "polje", kpi: "pokazatelj", dokumenti: "kategorija", publikacije: "emitent",
  planAnalize: "mjesec", planVodici: "mjesec", planWebinari: "mjesec"
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
EB.faqFor = (slug) => (EB.data.faq || []).filter(f => f.stranica === slug);

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
EB.plan.isUrl = (u) => /^https?:\/\//i.test(String(u || "").trim());
