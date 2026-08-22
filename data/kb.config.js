/*
 * EUROBROKER — konfiguracija AI asistenta (baza znanja)
 * -----------------------------------------------------
 * Asistent pretražuje bazu znanja iz data/kb/ (indeks: data/kb-data.js)
 * i česta pitanja sa sajta. Radi u pregledaču, bez backenda.
 *
 * LLM (generativni odgovori) — kasnije:
 *   Kad budete imali mali backend (serverless funkcija koja ČUVA API ključ),
 *   upišite njegov URL u "llmEndpoint". Asistent će tada POST-ovati
 *   { question, context } i prikazivati generisani odgovor.
 *   Ostavite prazno ("") da asistent radi kao pretraga baze znanja.
 */
window.EB_KB_CONFIG = {
  llmEndpoint: "",     // npr. "https://vas-backend.example.com/api/asistent"
  maxResults: 3,       // koliko najrelevantnijih unosa se koristi
  minScore: 2          // prag relevantnosti (niže = više odgovora, ali manje precizno)
};
