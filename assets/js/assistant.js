/* EUROBROKER — AI asistent iz baze znanja (client-side, bez backenda).
 * Pretražuje window.EB_KB (data/kb/*.md) + česta pitanja sa sajta.
 * Pripremljeno za LLM: ako je EB_KB_CONFIG.llmEndpoint postavljen, šalje
 * pitanje + pronađeni kontekst backendu i prikazuje generisani odgovor. */
(function () {
  "use strict";
  var CFG = window.EB_KB_CONFIG || { maxResults: 3, minScore: 2, llmEndpoint: "" };
  var lang = function () { return (window.EB && EB.lang) || "sr"; };
  var esc = function (s) { return (s == null ? "" : String(s)).replace(/[&<>"]/g, function (m) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m]; }); };

  var T = {
    sr: { open: "Pitajte nas", title: "Eurobroker asistent", sub: "Baza znanja", ph: "Pitanje o uslugama, računu, tržištima…",
      greet: "Zdravo! Postavite pitanje pa ću pretražiti bazu znanja Eurobrokera.",
      nomatch: "Nemam siguran odgovor na to. Najbolje je da nas kontaktirate — javljamo se u jednom radnom danu.",
      source: "Izvor", related: "Povezano", contact: "Kontakt", send: "Pošalji",
      disc: "Odgovori iz baze znanja; ne predstavljaju investicionu preporuku.",
      chips: ["Kako da otvorim račun?", "Kako se kupuju obveznice RS?", "Šta je eTrader?", "Ko je Eurobroker?"] },
    en: { open: "Ask us", title: "Eurobroker assistant", sub: "Knowledge base", ph: "Ask about services, accounts, markets…",
      greet: "Hi! Ask a question and I'll search the Eurobroker knowledge base.",
      nomatch: "I'm not sure about that. It's best to contact us — we reply within one business day.",
      source: "Source", related: "Related", contact: "Contact", send: "Send",
      disc: "Answers from the knowledge base; not investment advice.",
      chips: ["How do I open an account?", "How are RS bonds bought?", "What is eTrader?", "Who is Eurobroker?"] }
  };
  var t = function (k) { return (T[lang()] || T.sr)[k]; };

  /* ---------- indeks ---------- */
  function buildIndex() {
    var idx = [];
    (window.EB_KB || []).forEach(function (e) {
      idx.push({ title: e.title, text: e.text, tags: (e.tags || []).join(" "), source: e.title, lang: e.lang || "sr" });
    });
    // česta pitanja sa sajta
    var faq = (window.EB && EB.data && EB.data.faq) || [];
    faq.forEach(function (f) {
      idx.push({ title: f.pitanje, text: f.odgovor, tags: f.pitanje, source: (lang() === "en" ? "FAQ" : "Česta pitanja"), lang: "sr" });
    });
    return idx;
  }

  var STOP = { "i": 1, "u": 1, "na": 1, "za": 1, "je": 1, "se": 1, "da": 1, "li": 1, "the": 1, "a": 1, "of": 1, "to": 1, "is": 1, "how": 1, "what": 1, "do": 1, "i": 1, "kako": 1, "šta": 1, "sta": 1, "koji": 1, "koje": 1 };
  function tokens(s) {
    return (s || "").toLowerCase().replace(/[^0-9a-zа-яćčđšžà-ÿ]+/gi, " ").split(/\s+/)
      .filter(function (w) { return w.length >= 3 && !STOP[w]; });
  }
  function search(q, index) {
    var qt = tokens(q);
    if (!qt.length) return [];
    var scored = index.map(function (e) {
      var hay = (e.title + " " + e.tags + " " + e.text).toLowerCase();
      var titletags = (e.title + " " + e.tags).toLowerCase();
      var score = 0, covered = 0;
      qt.forEach(function (w) {
        var inTT = titletags.indexOf(w) !== -1;
        var inTx = hay.indexOf(w) !== -1;
        if (inTT) { score += 3; covered++; }
        else if (inTx) { score += 1; covered++; }
      });
      score += covered * 1.5; // nagradi pokrivenost više pojmova
      return { e: e, score: score };
    }).filter(function (r) { return r.score >= (CFG.minScore || 2); });
    scored.sort(function (a, b) { return b.score - a.score; });
    return scored.slice(0, (CFG.maxResults || 3) + 2);
  }

  /* ---------- UI ---------- */
  var panel, msgs, input, opened = false, index = null;
  function el(html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstChild; }

  function mount() {
    if (document.getElementById("ebAsstBtn")) return;
    var btn = el('<button id="ebAsstBtn" class="ebasst-btn" aria-label="' + esc(t("open")) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 9h8M8 13h5"/></svg>' +
      '<span>' + esc(t("open")) + '</span></button>');
    panel = el('<div id="ebAsstPanel" class="ebasst-panel" role="dialog" aria-label="' + esc(t("title")) + '">' +
      '<div class="ebasst-head"><div><b>' + esc(t("title")) + '</b><small>' + esc(t("sub")) + '</small></div>' +
      '<button class="ebasst-x" aria-label="Zatvori">✕</button></div>' +
      '<div class="ebasst-msgs" id="ebAsstMsgs"></div>' +
      '<form class="ebasst-form" id="ebAsstForm"><input id="ebAsstInput" autocomplete="off" placeholder="' + esc(t("ph")) + '">' +
      '<button type="submit" aria-label="' + esc(t("send")) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button></form>' +
      '<div class="ebasst-disc">' + esc(t("disc")) + '</div></div>');
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    msgs = panel.querySelector("#ebAsstMsgs");
    input = panel.querySelector("#ebAsstInput");
    btn.addEventListener("click", toggle);
    panel.querySelector(".ebasst-x").addEventListener("click", toggle);
    panel.querySelector("#ebAsstForm").addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });
    greet();
  }
  function toggle() {
    opened = !opened;
    panel.classList.toggle("open", opened);
    document.getElementById("ebAsstBtn").classList.toggle("hidden", opened);
    if (opened) setTimeout(function () { input && input.focus(); }, 60);
  }
  function bubble(who, html) {
    var b = el('<div class="ebasst-b ebasst-' + who + '">' + html + '</div>');
    msgs.appendChild(b); msgs.scrollTop = msgs.scrollHeight; return b;
  }
  function greet() {
    var chips = t("chips").map(function (c) { return '<button class="ebasst-chip">' + esc(c) + '</button>'; }).join("");
    bubble("bot", esc(t("greet")) + '<div class="ebasst-chips">' + chips + '</div>');
    msgs.querySelectorAll(".ebasst-chip").forEach(function (ch) {
      ch.addEventListener("click", function () { ask(ch.textContent); });
    });
  }
  function answerHtml(results) {
    var top = results[0].e;
    var html = '<p>' + esc(top.text) + '</p>' +
      '<div class="ebasst-src">' + esc(t("source")) + ': <b>' + esc(top.source) + '</b></div>';
    var rel = results.slice(1, 3);
    if (rel.length) {
      html += '<div class="ebasst-rel"><span>' + esc(t("related")) + ':</span> ' +
        rel.map(function (r) { return '<button class="ebasst-chip" data-t="' + esc(r.e.text).replace(/"/g, "&quot;") + '">' + esc(r.e.title) + '</button>'; }).join(" ") + '</div>';
    }
    return html;
  }
  function ask(q) {
    q = (q || "").trim(); if (!q) return;
    input.value = "";
    bubble("user", esc(q));
    if (!index) index = buildIndex();
    var results = search(q, index);
    if (window.EB && EB.track) EB.track("assistant_query", { q: q.slice(0, 120), hits: results.length });

    // LLM hook (ako je backend konfigurisan)
    if (CFG.llmEndpoint) {
      var typing = bubble("bot", '<span class="ebasst-typing">•••</span>');
      var ctx = results.slice(0, CFG.maxResults || 3).map(function (r) { return r.e.title + ": " + r.e.text; }).join("\n\n");
      fetch(CFG.llmEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, context: ctx, lang: lang() }) })
        .then(function (r) { return r.json(); })
        .then(function (d) { typing.innerHTML = esc((d && (d.answer || d.text)) || t("nomatch")); msgs.scrollTop = msgs.scrollHeight; })
        .catch(function () { typing.innerHTML = results.length ? answerHtml(results) : localFallback(); wireRel(typing); });
      return;
    }
    var b = bubble("bot", results.length ? answerHtml(results) : localFallback());
    wireRel(b);
  }
  function localFallback() {
    var link = (window.EB ? "#/kontakt" : "/kontakt/");
    return esc(t("nomatch")) + ' <a class="ebasst-link" href="' + link + '">' + esc(t("contact")) + '</a>';
  }
  function wireRel(scope) {
    scope.querySelectorAll(".ebasst-chip[data-t]").forEach(function (ch) {
      ch.addEventListener("click", function () {
        bubble("user", esc(ch.textContent));
        bubble("bot", '<p>' + esc(ch.getAttribute("data-t")) + '</p>');
      });
    });
    // interni linkovi u fallback-u prate SPA
    scope.querySelectorAll("a.ebasst-link").forEach(function (a) {
      a.addEventListener("click", function () { if (opened) toggle(); });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
