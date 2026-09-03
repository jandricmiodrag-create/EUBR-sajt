/* EUROBROKER — obrada obrazaca (Cloudflare Pages Function, ruta: POST /api/forma)
 *
 * Logika je prenesena iz Next.js projekta (`eurobroker-sajt`,
 * src/app/kontakt/actions.ts + src/lib/turnstile.ts) — isti redoslijed:
 * Turnstile provjera → Resend e-pošta → upis u D1. Nije pisana iznova.
 *
 * Obrađuje sva tri obrasca sa sajta (`kind`): kontakt, racun, partneri.
 */

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_API_URL = "https://api.resend.com/emails";
const FROM = "Eurobroker sajt <forma@send.eurobroker.ba>";
const TO = "eurobroker.klijent@gmail.com";

/* Cloudflare-ov zvanični „uvijek prolazi" test par ključeva —
 * https://developers.cloudflare.com/turnstile/troubleshooting/testing/
 * Bezbjedno je u repozitorijumu: test tajna potvrđuje samo tokene test
 * sitekey-a i ne može da falsifikuje token za pravu produkcijsku tajnu. */
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";
const PRODUCTION_HOSTNAMES = new Set(["eurobroker.ba", "www.eurobroker.ba"]);

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = new Set(["kontakt", "racun", "partneri"]);
const MAX = 4000; // gornja granica dužine polja (zaštita od zloupotrebe)

/* Produkcijski sitekey je u Turnstile Hostname Management-u vezan samo za
 * pravi domen; svuda drugdje (localhost, Pages preview URL) koristi se test
 * par, pa widget nikad ne pada na grešku 110200. Provjerava se hostname, a ne
 * build-time varijabla — jedini signal koji je tačan u trenutku zahtjeva. */
const isProdHost = (hostname) => PRODUCTION_HOSTNAMES.has(hostname);

const str = (v) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

const MSG = {
  sr: {
    fields: "Molimo provjerite označena polja.",
    turnstile: "Provjera nije uspjela, pokušajte ponovo.",
    send: "Slanje nije uspjelo, pokušajte kasnije ili nas pozovite direktno.",
    hard: "Greška pri slanju, molimo pozovite nas direktno.",
    ok: "Hvala. Vaš upit je zaprimljen — javljamo se u jednom radnom danu.",
    name: "Unesite ime i prezime.",
    email: "Unesite ispravnu e-poštu.",
    company: "Unesite naziv kompanije ili organizacije.",
    message: "Unesite kratak opis.",
    consent: "Potrebna je saglasnost za obradu podataka."
  },
  en: {
    fields: "Please check the highlighted fields.",
    turnstile: "Verification failed, please try again.",
    send: "Sending failed — please try later or call us directly.",
    hard: "Error while sending, please call us directly.",
    ok: "Thank you. Your enquiry has been received — we reply within one business day.",
    name: "Enter your full name.",
    email: "Enter a valid e-mail address.",
    company: "Enter the company or organisation name.",
    message: "Enter a short description.",
    consent: "Consent to data processing is required."
  }
};

const SUBJECT = {
  kontakt: "Novi upit sa sajta",
  racun: "Zahtjev za otvaranje računa",
  partneri: "Upit za partnerstvo"
};

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });

async function handlePost(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ status: "error", message: MSG.sr.fields }, 400);
  }

  const lang = body.lang === "en" ? "en" : "sr";
  const L = MSG[lang];
  const kind = KINDS.has(body.kind) ? body.kind : "kontakt";

  const ime = str(body.ime);
  const email = str(body.email);
  const telefon = str(body.telefon) || null;
  const kompanija = str(body.kompanija);
  const tema = str(body.tema);
  const izvor = str(body.izvor);
  const poruka = str(body.poruka);
  const saglasnost = body.saglasnost === true;
  const token = str(body["cf-turnstile-response"]);

  const fieldErrors = {};
  if (!ime) fieldErrors.ime = L.name;
  if (!email || !EMAIL_SHAPE.test(email)) fieldErrors.email = L.email;
  if (kind === "partneri") {
    if (!kompanija) fieldErrors.kompanija = L.company;
    if (!poruka) fieldErrors.poruka = L.message;
  }
  if (!saglasnost) fieldErrors.saglasnost = L.consent;

  if (Object.keys(fieldErrors).length > 0) {
    return json({ status: "error", fieldErrors, message: L.fields }, 400);
  }

  const hostname = new URL(request.url).hostname;
  const secret = isProdHost(hostname) ? env.TURNSTILE_SECRET_KEY : TURNSTILE_TEST_SECRET;

  let turnstileOk = false;
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: request.headers.get("CF-Connecting-IP") || ""
      })
    });
    turnstileOk = ((await res.json()) || {}).success === true;
  } catch {
    turnstileOk = false;
  }
  if (!turnstileOk) return json({ status: "error", message: L.turnstile }, 400);

  /* Tijelo e-pošte — sva polja obrasca, da nijedan odgovor ne propadne. */
  const lines = [
    `Obrazac: ${kind}`,
    `Ime: ${ime}`,
    `E-pošta: ${email}`,
    `Telefon: ${telefon ?? "—"}`,
    kind === "partneri" ? `Kompanija: ${kompanija || "—"}` : null,
    `Tema: ${tema || "—"}`,
    kind === "partneri" ? null : `Izvor: ${izvor || "—"}`,
    "",
    "Poruka:",
    poruka || "—"
  ].filter((l) => l !== null);
  const text = lines.join("\n");

  let emailFailed = true;
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM,
        to: TO,
        reply_to: email,
        subject: `${SUBJECT[kind]} — ${ime}`,
        text
      })
    });
    emailFailed = !res.ok;
  } catch {
    emailFailed = true;
  }

  /* D1: postojeća tabela `contact_submissions` (name, email, phone, message).
   * Tabela nema kolone za obrazac/temu/izvor, pa oni ulaze u `message` — tako
   * upis ne traži migraciju šeme koju dijeli sa starim sajtom. */
  let dbFailed = true;
  try {
    await env.DB.prepare(
      "INSERT INTO contact_submissions (name, email, phone, message) VALUES (?, ?, ?, ?)"
    )
      .bind(ime, email, telefon, text)
      .run();
    dbFailed = false;
  } catch {
    dbFailed = true;
  }

  if (emailFailed && dbFailed) return json({ status: "error", message: L.hard }, 502);
  if (emailFailed) return json({ status: "error", message: L.send }, 502);

  return json({ status: "success", message: L.ok });
}

/* Jedinstveni ulaz — metod se grana ovdje, da ne zavisi od redoslijeda
 * Pages ruter-a između `onRequest` i `onRequestPost`. */
export function onRequest({ request, env }) {
  if (request.method === "POST") return handlePost(request, env);
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" }
  });
}
