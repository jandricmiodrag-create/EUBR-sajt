/*
 * EUROBROKER — backend za generativne odgovore AI asistenta (Cloudflare Worker).
 * Čuva Anthropic API ključ (nikad na sajtu). Prima { question, context, lang },
 * poziva Claude uz stručan, analitički sistem-prompt sa usklađenošću, vraća { answer }.
 *
 * DEPLOY (ukratko — puno uputstvo u backend/README.md):
 *   1. Napravite Cloudflare Worker i zalijepite ovaj fajl.
 *   2. Postavite Secret:  ANTHROPIC_API_KEY = <vaš Anthropic ključ>.
 *      (Opciono Variable:  EB_MODEL = claude-haiku-4-5  za niži trošak.)
 *   3. Kopirajte URL Worker-a u data/kb.config.js -> llmEndpoint.
 */

var ALLOWED_ORIGINS = [
  "https://jandricmiodrag-create.github.io",
  "https://eurobroker.ba",
  "https://www.eurobroker.ba",
  "http://localhost:8790",
  "http://localhost:3000"
];

var SYS_SR = [
  "Ti si stručni asistent društva Eurobroker a.d. Banja Luka za tržište kapitala.",
  "Odgovaraš profesionalno, analitički i sažeto, na srpskom jeziku (ijekavica, latinica).",
  "",
  "Pravila (obavezno):",
  "- Koristi ISKLJUČIVO informacije iz priloženog KONTEKSTA iz baze znanja. Ako kontekst ne sadrži odgovor, jasno reci da tu informaciju nemaš u bazi i uputi korisnika da kontaktira tim Eurobrokera. Ne nagađaj i ne izmišljaj.",
  "- NIKADA ne daješ individualnu ili personalizovanu investicionu preporuku, niti savjet da se kupi/proda konkretna hartija od vrijednosti. Daješ opšte, edukativne i analitičke informacije.",
  "- Ne izmišljaj brojeve, cijene, provizije, brojeve dozvola ni datume kojih nema u kontekstu.",
  "- Struktura odgovora: kratak stručan uvod, jezgrovit odgovor (po potrebi 2–4 kratke tačke), pa profesionalan naredni korak (npr. inicijalni razgovor ili ugovoreno savjetovanje).",
  "- Na kraju dodaj kratku napomenu: „Opšta informacija, ne individualna investiciona preporuka.“",
  "- Budi koncizan (obično 4–8 rečenica). Ne izmišljaj izvore."
].join("\n");

var SYS_EN = [
  "You are the expert capital-markets assistant of Eurobroker a.d. Banja Luka.",
  "You answer professionally, analytically and concisely, in English.",
  "",
  "Rules (mandatory):",
  "- Use ONLY the information in the provided KNOWLEDGE BASE CONTEXT. If the context does not contain the answer, clearly say you don't have that information and direct the user to contact the Eurobroker team. Do not guess or invent.",
  "- NEVER give individual or personalized investment advice, nor a recommendation to buy/sell a specific security. Provide general, educational, analytical information.",
  "- Do not invent numbers, prices, fees, licence numbers or dates not present in the context.",
  "- Structure: a short expert lead, a concise answer (2–4 short bullets if useful), then a professional next step.",
  "- End with a brief note: “General information, not individual investment advice.”",
  "- Be concise (usually 4–8 sentences). Do not fabricate sources."
].join("\n");

function cors(origin) {
  var allow = ALLOWED_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}
function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status: status,
    headers: Object.assign({ "content-type": "application/json; charset=utf-8" }, headers || {})
  });
}

export default {
  async fetch(request, env) {
    var origin = request.headers.get("Origin") || "";
    var ch = cors(origin);
    if (request.method === "OPTIONS") return new Response(null, { headers: ch });
    if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405, ch);

    var body;
    try { body = await request.json(); } catch (e) { return json({ error: "invalid_json" }, 400, ch); }
    var question = String(body.question || "").slice(0, 1000).trim();
    var context = String(body.context || "").slice(0, 12000);
    var lang = body.lang === "en" ? "en" : "sr";
    if (!question) return json({ error: "no_question" }, 400, ch);

    var apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) return json({ error: "server_misconfigured" }, 500, ch);

    var system = lang === "en" ? SYS_EN : SYS_SR;
    var userMsg = (lang === "en")
      ? "KNOWLEDGE BASE CONTEXT:\n" + (context || "(empty)") + "\n\nQUESTION: " + question
      : "KONTEKST IZ BAZE ZNANJA:\n" + (context || "(prazno)") + "\n\nPITANJE: " + question;

    var payload = {
      model: env.EB_MODEL || "claude-opus-5",
      max_tokens: 1024,
      system: system,
      messages: [{ role: "user", content: userMsg }],
      output_config: { effort: "low" }
    };

    var resp;
    try {
      resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(payload)
      });
    } catch (e) { return json({ error: "upstream_unreachable" }, 502, ch); }

    if (!resp.ok) {
      var errText = await resp.text().catch(function () { return ""; });
      return json({ error: "upstream_error", status: resp.status, detail: errText.slice(0, 300) }, 502, ch);
    }
    var data = await resp.json();
    var answer = "";
    if (Array.isArray(data.content)) {
      answer = data.content.filter(function (b) { return b.type === "text"; })
        .map(function (b) { return b.text; }).join("\n").trim();
    }
    if (data.stop_reason === "refusal") {
      answer = lang === "en" ? "I can't help with that request." : "Ne mogu pomoći sa tim zahtjevom.";
    }
    if (!answer) answer = lang === "en" ? "No answer available." : "Nema dostupnog odgovora.";
    return json({ answer: answer, model: payload.model }, 200, ch);
  }
};
