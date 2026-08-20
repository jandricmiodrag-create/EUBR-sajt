# EUROBROKER — folder podataka (Google Sheets tabele)

Ovaj folder je **izvor podataka** za sajt. Sadržaj sajta se ne piše u HTML — čita
se odavde. Tako urednik i funkcija usklađenosti mogu mijenjati sadržaj bez diranja koda.

## Struktura

```
data/
├── gsheet/                 ← same tabele (jedna = jedan Google Sheets list/tab)
│   ├── stranice.csv        ← master indeks: navigacija, poruke, CTA, klasifikacija
│   ├── cjenovnik.csv       ← cjenovnik po uslugama
│   ├── urednicki-plan.csv  ← 12-mjesečni urednički plan (Analize + Edukacija)
│   ├── segmenti.csv        ← matrica segmenata („Šta vam je potrebno?“)
│   ├── klasifikacija.csv   ← regulatorna klasifikacija A/B/C (šta smije na sajt)
│   ├── faq.csv             ← česta pitanja po stranici
│   ├── drustvo.csv         ← identifikacioni i regulatorni podaci (podnožje)
│   └── kpi.csv             ← ključni pokazatelji uspjeha
├── sheets.config.js        ← konektor: gdje se čita svaka tabela
├── sheets-data.js          ← AUTOGENERISANA ugrađena kopija (da sajt radi offline)
└── build-sheets-data.py    ← generator: CSV → sheets-data.js
```

## Google Sheets tabele su već napravljene ✅

Sve tabele iz ovog foldera već postoje kao Google Sheets fajlovi u vašem Drive-u,
u folderu **„EUROBROKER — Web podaci“**:

> https://drive.google.com/drive/folders/1a85KKlnBy7vfiauHk0_PFRH_mzdAWfar

`data/sheets.config.js` već sadrži linkove na svaku tabelu. Da biste uključili žive podatke,
potreban je **samo jedan potez**:

1. Otvorite folder gore → **Share** → **Anyone with the link → Viewer** → **Done**.
   (Fajlovi u folderu naslijede pravo, pa se dijeli samo folder.)
2. U `data/sheets.config.js` promijenite `var LIVE = false;` u `var LIVE = true;`.

Od tada sajt čita **žive** podatke iz Google Sheets-a. Uredite ćeliju u tabeli i
osvježite sajt — promjena je odmah vidljiva, bez diranja koda. Dok je `LIVE = false`,
koristi se ugrađena kopija (bez mrežnih poziva), pa sajt radi i offline.

> Napomena: linkovi na pojedinačne tabele za uređivanje nalaze se i u
> `window.EB_SHEETS_LINKS` unutar `sheets.config.js`.

## Kako izmijeniti sadržaj lokalno

1. Uredite odgovarajući `gsheet/*.csv` (Excel, Google Sheets, ili tekst editor).
2. Pokrenite generator:

   ```bash
   python data/build-sheets-data.py
   ```

3. Osvježite sajt. Promjena je vidljiva.

## Regulatorna napomena

Kolona `kategorija` u `klasifikacija.csv` (A / B / C) je **obavezujuća**: usluge
iz kategorije C se ne objavljuju, iz B samo najavljuju. Sve brojke i tvrdnje
provjerava funkcija usklađenosti prije objave. Polja označena sa `[unijeti …]`
u `drustvo.csv` moraju se popuniti provjerenim podacima prije puštanja u rad.
