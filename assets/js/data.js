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
  klasifikacija: "usluga", faq: "stranica", drustvo: "polje", kpi: "pokazatelj", dokumenti: "kategorija", publikacije: "emitent"
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
