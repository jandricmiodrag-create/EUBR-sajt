# Baza znanja AI asistenta (EUROBROKER)

Ovaj folder je **baza znanja** koju vi punite. AI asistent na sajtu (plutajuće
dugme dolje desno) pretražuje ova dokumenta i vraća najrelevantniji odgovor, uz
naznaku izvora. Radi u pregledaču, bez backenda i bez API ključa.

## Kako dodati znanje

1. Napravite novi `.md` fajl u ovom folderu (npr. `obveznice.md`).
2. Na vrhu stavite kratku „glavu" (frontmatter) sa naslovom i ključnim riječima:

   ```markdown
   ---
   title: Obveznice Republike Srpske
   tags: obveznice, rs, štednja, prinos, dospijeće
   lang: sr
   ---

   Obveznice Republike Srpske su dužnički instrument...

   ## Kako se kupuju
   Kupuju se preko brokera, ne u banci...
   ```

   - `title` — naslov teme (prikazuje se kao izvor odgovora).
   - `tags` — ključne riječi (pomažu pretragu), odvojene zarezom.
   - `lang` — `sr` ili `en` (opciono; podrazumijeva se `sr`).
   - Tijelo: običan tekst; svaki pasus/odjeljak postaje jedan „odgovor".
     Podnaslovi (`##`) grupišu tekst po temi.

3. Regenerišite indeks (jednom, nakon izmjena):

   ```bash
   python data/build-kb.py
   ```

4. Osvježite sajt — asistent odmah zna nove informacije.

## Savjeti za dobre odgovore

- Piši kratke, jasne pasuse — svaki pasus je zaokružen odgovor.
- Koristi riječi kojima klijent pretražuje („koliko košta", „kako otvoriti račun").
- Za dvojezičnost: napravi zaseban `*.en.md` fajl sa `lang: en`.
- Ne stavljaj povjerljive podatke — sve ovdje asistent može prikazati posjetiocu.

## Kasnije: pravi LLM (generativni odgovori)

Asistent je pripremljen da se poveže sa LLM-om. Kad budete imali mali backend
(serverless funkcija koja čuva API ključ), upišite njegov URL u
`data/kb.config.js` (`llmEndpoint`). Asistent će tada slati pitanje + pronađeni
kontekst backendu i prikazivati generisani odgovor. Bez toga radi kao pametna
pretraga baze znanja.
