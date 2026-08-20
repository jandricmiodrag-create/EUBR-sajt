/* EUROBROKER — mjerni sloj (poglavlje 19 plana: „konverzija umjesto posjeta“).
 * Događaji se guraju u window.dataLayer (spremno za Google Tag Manager / GA4).
 * Da uključite GA4/GTM: dodajte svoj GTM kontejner u <head> (vidi README),
 * ovaj sloj već emituje standardizovane događaje ispod. Bez GTM-a, događaji se
 * skupljaju u window.dataLayer i mogu se pregledati u konzoli. */
window.EB = window.EB || {};
window.dataLayer = window.dataLayer || [];

/* Katalog mjerenih događaja — usklađen sa „14 mjerenih događaja“ i definicijom web lead-a */
EB.EVENTS = {
  PAGE_VIEW: "page_view",
  CTA_CLICK: "cta_click",
  OPEN_ACCOUNT_START: "open_account_start",   // klik na „Otvorite račun“
  GENERATE_LEAD: "generate_lead",             // poslat bilo koji obrazac (web lead)
  CONTACT_SUBMIT: "contact_submit",
  ACCOUNT_SUBMIT: "account_request_submit",
  READINESS_START: "readiness_tool_start",
  READINESS_COMPLETE: "readiness_tool_complete",
  FAQ_OPEN: "faq_open",
  WEBINAR_INTENT: "webinar_signup_intent",
  NEWSLETTER_INTENT: "newsletter_signup_intent",
  PHONE_CLICK: "phone_click",
  PRICELIST_VIEW: "pricelist_view",
  DOC_INTENT: "document_download_intent",
  LANGUAGE_SWITCH: "language_switch"
};

EB.track = function (event, params) {
  try {
    var payload = Object.assign({ event: event, event_ts: Date.now(), page: location.pathname || "/", lang: EB.lang || "sr" }, params || {});
    window.dataLayer.push(payload);
    if (typeof window.gtag === "function") window.gtag("event", event, params || {});
    if (window.EB_ANALYTICS_DEBUG) console.debug("[EB.track]", event, params || {});
  } catch (e) { /* nikad ne ruši UI zbog mjerenja */ }
};
