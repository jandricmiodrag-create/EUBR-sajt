/*
 * EUROBROKER — konfiguracija AI asistenta (baza znanja)
 * -----------------------------------------------------
 * Asistent pretražuje bazu znanja iz data/kb/ (indeks: data/kb-data.js)
 * i česta pitanja sa sajta. Radi u pregledaču, bez backenda.
 *
 * LLM (generativni odgovori):
 *   Gotov backend je u folderu backend/ (Cloudflare Worker) — vidi backend/README.md.
 *   Kad ga deployujete (čuva Anthropic API ključ), upišite njegov URL u "llmEndpoint".
 *   Asistent tada POST-uje { question, context, lang } i prikazuje { answer } koji
 *   Claude generiše stručno i analitički, samo iz konteksta baze znanja.
 *   Ostavite prazno ("") da asistent radi kao pretraga baze znanja (bez backenda).
 *
 *   Primjer: llmEndpoint: "https://eurobroker-asistent.vas-nalog.workers.dev"
 */
window.EB_KB_CONFIG = {
  llmEndpoint: "",     // npr. "https://vas-backend.example.com/api/asistent"
  maxResults: 3,       // koliko najrelevantnijih unosa se koristi
  minScore: 2          // prag relevantnosti (niže = više odgovora, ali manje precizno)
};
