# Generativni AI odgovori — backend (Cloudflare Worker)

AI asistent na sajtu radi i bez ovoga (pretraga baze znanja). Za **generativne**
odgovore (Claude piše prirodan, analitičan odgovor iz baze znanja) potreban je
mali backend koji čuva Anthropic API ključ — jer ključ **ne smije** stajati na
javnom sajtu. Ovaj folder sadrži gotov [Cloudflare Worker](cloudflare-worker.js)
(besplatan tarifni nivo je dovoljan).

## Kako radi
Sajt (klijent) pretraži bazu znanja i pošalje Worker-u `{ question, context, lang }`.
Worker poziva Claude uz **stručan, analitički sistem-prompt sa usklađenošću**
(odgovara samo iz konteksta, bez individualne investicione preporuke, bez
izmišljanja brojki) i vraća `{ answer }`. Ključ ostaje na Worker-u.

## Deploy (10–15 min, bez lokalnog build-a)

1. **Napravite nalog** na https://dash.cloudflare.com (besplatno).
2. **Workers & Pages → Create → Worker.** Dajte ime (npr. `eurobroker-asistent`) → **Deploy**.
3. **Edit code** → obrišite šablon i **zalijepite cijeli** sadržaj
   [`cloudflare-worker.js`](cloudflare-worker.js) → **Deploy**.
4. **Settings → Variables and Secrets:**
   - Dodajte **Secret** `ANTHROPIC_API_KEY` = vaš Anthropic API ključ
     (https://console.anthropic.com → API Keys). Secret se ne vidi u kodu.
   - (Opciono) **Variable** `EB_MODEL` = `claude-haiku-4-5` za **niži trošak**
     (podrazumijevano je `claude-opus-5` — najkvalitetniji, ali skuplji).
5. Kopirajte URL Worker-a (npr. `https://eurobroker-asistent.vas-nalog.workers.dev`).
6. U [`data/kb.config.js`](../data/kb.config.js) upišite taj URL u `llmEndpoint`,
   commit → asistent od tada daje generativne odgovore.

## Bezbjednost i trošak
- **Dozvoljeni sajtovi:** u vrhu `cloudflare-worker.js` je lista `ALLOWED_ORIGINS`
  (CORS). Dodajte svoj domen (`https://eurobroker.ba`) kad pređete na njega.
- **Zaštita od zloupotrebe:** Worker je javan; da neko ne bi trošio vaš ključ,
  preporučuje se Cloudflare **Rate Limiting** (Security → WAF) na Worker ruti,
  npr. 20 zahtjeva/min po IP-u. Model i `max_tokens` su ograničeni radi troška.
- **Cijena:** plaćate Anthropic po upitu (npr. Haiku 4.5 ~ $1/$5 na milion tokena;
  Opus 5 ~ $5/$25). Za javni widget razmislite o `EB_MODEL=claude-haiku-4-5`.
- **Model:** promijenite ga preko `EB_MODEL` varijable, bez diranja koda.

## Alternativa
Isti princip radi i kao **Vercel/Netlify serverless funkcija** ili Cloudflare
Pages Function — logika (sistem-prompt + poziv `POST https://api.anthropic.com/v1/messages`
sa `x-api-key` i `anthropic-version: 2023-06-01`) je ista. Ako želite tu varijantu,
javite pa je pripremim.
