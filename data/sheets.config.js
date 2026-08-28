/*
 * EUROBROKER — konfiguracija povezivanja sa Google Sheets tabelama
 * ------------------------------------------------------------------
 * Tabele su POVEZANE sa živim Google Sheets fajlovima (folder "EUROBROKER — Web podaci").
 * URL koristi Google-ov CSV izvoz (gviz). Da bi sajt mogao da ih čita, folder mora biti
 * podijeljen kao "Anyone with the link → Viewer" (jedan potez, fajlovi naslijede pravo).
 *
 * Dok to ne uradite, sajt automatski koristi UGRAĐENU kopiju (data/sheets-data.js),
 * pa radi normalno i offline — vidi loader u assets/js/data.js (validacija + fallback).
 *
 *   source: "gsheet"  -> čita živi CSV iz Google Sheets-a (polje url)
 *   source: "csv"     -> lokalni CSV iz data/gsheet/<file> (potreban server)
 *   source: "embedded"-> ugrađena kopija (radi bez interneta)
 *
 * Folder sa tabelama:
 *   https://drive.google.com/drive/folders/1a85KKlnBy7vfiauHk0_PFRH_mzdAWfar
 */
(function () {
  /* ┌──────────────────────────────────────────────────────────────────────┐
     │  JEDINI POTREBAN POTEZ ZA ŽIVE PODATKE:                               │
     │  1) Podijelite folder "EUROBROKER — Web podaci" kao                   │
     │     „Anyone with the link → Viewer“.                                  │
     │  2) Ovdje postavite:  var LIVE = true;                                │
     │  Sajt će od tada čitati žive podatke iz Google Sheets-a.             │
     │  Dok je LIVE = false, koristi se ugrađena kopija (bez mrežnih poziva).│
     └──────────────────────────────────────────────────────────────────────┘ */
  var LIVE = true;

  var csv = function (id) { return "https://docs.google.com/spreadsheets/d/" + id + "/gviz/tq?tqx=out:csv"; };
  var src = LIVE ? "gsheet" : "embedded";
  window.EB_SHEETS_CONFIG = {
    stranice:      { source: src, file: "gsheet/stranice.csv",       url: csv("1BrSzZR-qAtfJAfJjMtmTk4UeAq95HEdusRd-txXyQxM") },
    cjenovnik:     { source: src, file: "gsheet/cjenovnik.csv",      url: csv("1jybJiqU2b47cktaH6PqejiwoewS9M5TkMO5Ke7ARYjE") },
    urednickiPlan: { source: src, file: "gsheet/urednicki-plan.csv", url: csv("1iu41K45917wFqyAfrUCOiEGRy7vyOC9mC9UhkqkRIDQ") },
    // Urednički plan razdvojen na tri tematska izvora (analize / vodiči / webinari)
    planAnalize:   { source: src, file: "gsheet/urednicki-plan-analize.csv",   url: csv("1LOrsYrhzmnsbr-9DgAZlno-yvf6U1OtClbXFdz_2Ghc") },
    planVodici:    { source: src, file: "gsheet/urednicki-plan-vodici.csv",    url: csv("1eiNx3hiSCCRjAq6f0akzWTswpbebulN8hczW5Y4YcJs") },
    planWebinari:  { source: src, file: "gsheet/urednicki-plan-webinari.csv",  url: csv("1qjxzseR-I2UjvwBDLuyHp9tz_yg7Y6RxTITiJLZ5758") },
    segmenti:      { source: src, file: "gsheet/segmenti.csv",       url: csv("1dHRDSJCgYBgxiAZ4erOTlBnMCxsCE37_YJlDqDwGYv4") },
    klasifikacija: { source: src, file: "gsheet/klasifikacija.csv",  url: csv("1rXoIDjp_AT5TXZ9l3_lkHt9zugHl0T0daVzv99Ym6Tc") },
    faq:           { source: src, file: "gsheet/faq.csv",            url: csv("1u3abhAluksimNRmLixWjxpt4xGX3fZMeQRUUb60rCSE") },
    drustvo:       { source: src, file: "gsheet/drustvo.csv",        url: csv("1KPAE5rLGqdtji2B7A81DN5Qq6_CsvryA9e7xd1YWXO8") },
    kpi:           { source: src, file: "gsheet/kpi.csv",            url: csv("15FY3PDqOOkjJ2rM1DgwYzZa86rB2wn0Zwu5PI8_agrM") },
    // Katalog dokumenata i obrazaca (koristi ga cjenovnik i otvorite-racun; embedded kopija)
    dokumenti:     { source: "embedded", file: "gsheet/dokumenti.csv", url: "" },
    // EB · dokumenti — dinamički registar zvaničnih dokumenata za stranicu /dokumenti/ (živa tabela)
    dokumentiRegistar: { source: src, file: "gsheet/dokumenti-registar.csv", url: csv("19IC5sUeodkwA1FCs5R5sLZvvS6kURl7Th7Syw8232uI") },
    // Istraživački izvještaji / analize po emitentu
    publikacije:   { source: "embedded", file: "gsheet/publikacije.csv", url: "" }
  };

  // Direktni linkovi na tabele (za uređivanje):
  window.EB_SHEETS_LINKS = {
    folder:        "https://drive.google.com/drive/folders/1a85KKlnBy7vfiauHk0_PFRH_mzdAWfar",
    stranice:      "https://docs.google.com/spreadsheets/d/1BrSzZR-qAtfJAfJjMtmTk4UeAq95HEdusRd-txXyQxM/edit",
    cjenovnik:     "https://docs.google.com/spreadsheets/d/1jybJiqU2b47cktaH6PqejiwoewS9M5TkMO5Ke7ARYjE/edit",
    urednickiPlan: "https://docs.google.com/spreadsheets/d/1iu41K45917wFqyAfrUCOiEGRy7vyOC9mC9UhkqkRIDQ/edit",
    planAnalize:   "https://docs.google.com/spreadsheets/d/1LOrsYrhzmnsbr-9DgAZlno-yvf6U1OtClbXFdz_2Ghc/edit",
    planVodici:    "https://docs.google.com/spreadsheets/d/1eiNx3hiSCCRjAq6f0akzWTswpbebulN8hczW5Y4YcJs/edit",
    planWebinari:  "https://docs.google.com/spreadsheets/d/1qjxzseR-I2UjvwBDLuyHp9tz_yg7Y6RxTITiJLZ5758/edit",
    dokumentiRegistar: "https://docs.google.com/spreadsheets/d/19IC5sUeodkwA1FCs5R5sLZvvS6kURl7Th7Syw8232uI/edit",
    segmenti:      "https://docs.google.com/spreadsheets/d/1dHRDSJCgYBgxiAZ4erOTlBnMCxsCE37_YJlDqDwGYv4/edit",
    klasifikacija: "https://docs.google.com/spreadsheets/d/1rXoIDjp_AT5TXZ9l3_lkHt9zugHl0T0daVzv99Ym6Tc/edit",
    faq:           "https://docs.google.com/spreadsheets/d/1u3abhAluksimNRmLixWjxpt4xGX3fZMeQRUUb60rCSE/edit",
    drustvo:       "https://docs.google.com/spreadsheets/d/1KPAE5rLGqdtji2B7A81DN5Qq6_CsvryA9e7xd1YWXO8/edit",
    kpi:           "https://docs.google.com/spreadsheets/d/15FY3PDqOOkjJ2rM1DgwYzZa86rB2wn0Zwu5PI8_agrM/edit"
  };
})();
