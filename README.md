# EUROBROKER — web sajt

Moderan, dinamičan sajt društva **Eurobroker a.d. Banja Luka**, izrađen prema
dokumentima *„Plan sadržaja web sajta Eurobroker“* i njegovom Excel prilogu.
Sadržaj se ne piše u kodu — čita se iz **povezanih Google Sheets tabela** u
folderu [`data/`](data/), pa ga urednik i funkcija usklađenosti mijenjaju bez diranja koda.

## Kako pokrenuti

Sajt koristi **History API rutiranje** (prave putanje poput
`/investiranje/domace-trziste/`), pa mu treba server koji nepoznate putanje
vraća na `index.html` (SPA fallback). Za to služi priloženi dev server:

```bash
cd "eurobroker.ba"
python .devserver.py
```

Zatim otvorite **http://127.0.0.1:8790/** u pregledaču. Dev server dodaje i
`no-store` zaglavlja (bez keširanja tokom uređivanja).

> `python -m http.server` takođe radi za početnu stranu, ali **deep-linkovi**
> (npr. direktan ulazak na `/za-kompanije/emisija-obveznica/`) tada vraćaju 404
> jer taj server ne radi SPA fallback — zato koristite `.devserver.py`.
>
> Na produkciji podesite isti fallback na web-serveru (Nginx `try_files … /index.html;`,
> Apache `FallbackResource /index.html`, ili Netlify/Vercel SPA rewrite). Statički
> `robots.txt` i `sitemap.xml` se poslužuju direktno.

## Struktura

```
eurobroker.ba/
├── index.html                 ← ljuska aplikacije
├── assets/
│   ├── css/styles.css         ← kompletan dizajn (navy + zlatna + tirkiz)
│   └── js/
│       ├── data.js            ← učitavanje/parsiranje podataka + veza sa Sheets
│       ├── content.js         ← prozni sadržaj uslužnih stranica (10-pitanja model)
│       └── app.js             ← router, rendering svih stranica, interakcije
└── data/                      ← POVEZANE GOOGLE SHEETS TABELE (vidi data/README.md)
    ├── gsheet/*.csv           ← same tabele (jedna = jedan Sheets list)
    ├── sheets.config.js       ← gdje se čita svaka tabela (embedded / csv / gsheet)
    ├── sheets-data.js         ← autogenerisana ugrađena kopija
    └── build-sheets-data.py   ← generator CSV → JS
```

## Šta pokreću podaci

| Tabela | Pokreće na sajtu |
|---|---|
| `stranice.csv` | glavnu navigaciju, huben, breadcrumb i svaku uslužnu stranicu |
| `segmenti.csv` | sekciju „Šta vam je potrebno?“ |
| `cjenovnik.csv` | stranicu Cjenovnik |
| `urednicki-plan.csv` | Analize i Edukaciju (12-mjesečni plan) |
| `klasifikacija.csv` | regulatornu klasifikaciju A/B/C (šta smije na sajt) |
| `faq.csv` | česta pitanja po stranici |
| `drustvo.csv` | identifikacione i regulatorne podatke u podnožju |
| `kpi.csv` | ključne pokazatelje |

## Ključne funkcionalnosti

- **Segmentni ulazi** (fizička lica, savjet, kompanije, institucije) — po planu.
- **Uslužne stranice** po jedinstvenom modelu od 10 pitanja + česta pitanja.
- **Interaktivni alat „Procjena spremnosti za emisiju“** (10 pitanja → rezultat i CTA).
- **Konverzioni obrasci** sa obaveznim poljem „izvor akvizicije“ (demo, bez slanja).
- **Dvojezičnost SR / EN** — prekidač SR/EN u gornjoj traci (pamti izbor). Engleska
  verzija je sada **potpuna**: prevedene su sve stranice — početna, sve uslužne
  (domaće/svjetska/obveznice/savjetovanje, korporativne, institucionalne), analize,
  edukacija, cjenovnik, dokumenti, partneri, kontakt, otvaranje računa i alat za
  procjenu spremnosti. Tabelarni podaci (cjenovnik, urednički plan) ostaju na jeziku
  unosa u tabeli. Prevodi žive u `assets/js/i18n.js`.
- **Stranica „Investiranje iz dijaspore“** (SR/EN), dostupna iz Edukacije.
- **Zvanični dokumenti i obrasci (21)** — pravi PDF-ovi iz `08 - web portal/Regulativa`
  kopirani u `assets/dokumenti/` i katalogizovani u `data/gsheet/dokumenti.csv`
  (kategorije: Pravila i uslovi, Cjenovnik, Obrasci, Izjave, Upitnici, Otvaranje računa).
  Stranica **Dokumenti** ih prikazuje sa preuzimanjem; **Cjenovnik** vodi zvaničnim
  cjenovnicima (mjerodavan izvor); **Otvorite račun** povezuje potrebnu dokumentaciju
  po tipu klijenta. Iznosi se ne prepisuju u kod (CID fontovi + regulatorni rizik) —
  objavljuje se zvanični dokument. Naziv inostrane platforme se ne navodi (§4.2).
- **Istraživački izvještaji (7)** — analize po emitentu (2019, SR+EN) iz
  `08 - web portal/Regulativa/Analize`, u `assets/dokumenti/analize/`, katalog
  `data/gsheet/publikacije.csv`; prikazani na stranici **Analize** kao preuzimanja uz
  obaveznu napomenu „opšte istraživanje, ne individualna preporuka“ (§12).
- **Žive Google Sheets tabele** — sadržaj se čita iz `data/gsheet/` ili iz povezanih
  Google Sheets fajlova (folder „EUROBROKER — Web podaci“ u Drive-u). Vidi
  [data/README.md](data/README.md) za uključivanje živih podataka (jedan potez).
- **Regulatorna disciplina:** objavljene su samo usluge kategorije A/A-uslovno;
  kategorije B (najava) i C (bez pomena) su isključene; svaka uslužna stranica
  nosi upozorenje o riziku i napomenu da sadržaj nije individualna preporuka.

## Priprema za produkciju (dodato)

- **Mjerni sloj** ([assets/js/analytics.js](assets/js/analytics.js)) — svi ključni
  događaji iz poglavlja 19 („konverzija umjesto posjeta“) guraju se u
  `window.dataLayer`: `page_view`, `cta_click`, `open_account_start`,
  **`generate_lead`** (web lead), `contact_submit` / `account_request_submit`,
  `readiness_tool_start` / `…_complete`, `faq_open`, `pricelist_view`,
  `language_switch`, `phone_click`. Spremno za **GA4 / Google Tag Manager** —
  umetnite svoj GTM kontejner u `<head>` fajla `index.html` (naznačeno mjesto).
  Za brzo testiranje u konzoli postavite `window.EB_ANALYTICS_DEBUG = true`.
- **History API rutiranje** — sajt koristi **prave putanje** iz plana
  (`/investiranje/domace-trziste/`, `/za-kompanije/emisija-obveznica/` …), sa
  radnim „nazad/naprijed“ dugmadima i deep-linkovima. Interni linkovi se u DOM-u
  ispisuju kao prave putanje (dobro za dijeljenje i pretragu).
- **SEO** — po stranici se ažuriraju `title`, `meta description`, `canonical`
  (= stvarna putanja), Open Graph i Twitter oznake; ubacuje se **JSON-LD**
  (`FinancialService` + `BreadcrumbList`). Dodati su [robots.txt](robots.txt) i
  [sitemap.xml](sitemap.xml) (26 stvarnih URL-ova iz plana).
- **404** — nepoznate adrese daju pravu „stranica nije pronađena“ sa `noindex`.
- **Vijesti** — dodata stranica (Faza 1 iz sitemapa), dostupna iz podnožja.
- **AI asistent (baza znanja)** — plutajući chat (`assets/js/assistant.js`) koji
  pretražuje bazu znanja iz **foldera `data/kb/`** (`.md` fajlovi → `data/build-kb.py`
  → `data/kb-data.js`) + česta pitanja. Client-side, bez backenda/API ključa,
  dvojezično, sa izvorom odgovora. Pripremljeno za LLM: `data/kb.config.js`
  (`llmEndpoint`) — kad se doda backend, asistent daje generativne odgovore.
  Uputstvo za punjenje: [data/kb/README.md](data/kb/README.md).

> **Preostali SEO korak (opciono):** za potpunu indeksaciju svih putanja od strane
> pretraživača preporučuje se **prerendering / SSR** (npr. statičko generisanje HTML-a
> po ruti), jer je ovo klijentski renderovana aplikacija. Meta/JSON-LD/sitemap su
> spremni; nedostaje samo unaprijed generisan HTML po URL-u.

## Prije puštanja u rad (checklist usklađenosti)

- Popuniti polja `[unijeti …]` u `data/gsheet/drustvo.csv` provjerenim podacima.
- Zamijeniti ilustrativni cjenovnik zvaničnim, usvojenim, sa datumom primjene.
- Potvrditi sve tvrdnje i brojke (funkcija usklađenosti) prije objave.
- Dodati zvanične PDF dokumente i obrasce (sa verzijom i datumom).
