/* EUROBROKER — dvojezičnost (SR / EN)
 * Engleska verzija je, prema planu, namijenjena institucionalnom, korporativnom
 * i dijasporskom dijelu. Chrome (navigacija, dugmad, podnožje, skela uslužne
 * stranice) prevodi se u cijelosti; proza je prevedena za te ciljne stranice,
 * a ostale zadržavaju srpski tekst uz englesku navigaciju. */
window.EB_I18N = {
  /* --- UI stringovi --- */
  ui: {
    "nav.investiranje":   { sr: "Investiranje", en: "Investing" },
    "nav.za-kompanije":   { sr: "Za kompanije", en: "For companies" },
    "nav.institucionalni-klijenti": { sr: "Institucionalni", en: "Institutional" },
    "nav.analize":        { sr: "Analize", en: "Insights" },
    "nav.edukacija":      { sr: "Edukacija", en: "Learn" },
    "nav.o-nama":         { sr: "O nama", en: "About" },

    "btn.otvoriteRacun":  { sr: "Otvorite račun", en: "Open an account" },
    "btn.prijava":        { sr: "Prijava", en: "Sign in" },
    "btn.zakazite":       { sr: "Zakažite razgovor", en: "Book a call" },
    "btn.saznajteVise":   { sr: "Saznajte više", en: "Learn more" },
    "btn.posaljite":      { sr: "Pošaljite", en: "Send" },
    "btn.pozovite":       { sr: "Pozovite", en: "Call us" },

    "u.cjenovnik":        { sr: "Cjenovnik", en: "Fees" },
    "u.dokumenti":        { sr: "Dokumenti", en: "Documents" },
    "u.kontakt":          { sr: "Kontakt", en: "Contact" },

    "foot.tagline":       { sr: "licencirano društvo tržišta kapitala pod nadzorom KHOV RS.", en: "a licensed capital-markets firm supervised by the SEC of Republika Srpska." },
    "foot.usluge":        { sr: "Usluge", en: "Services" },
    "foot.sadrzaj":       { sr: "Sadržaj", en: "Content" },
    "foot.dokumenti":     { sr: "Dokumenti", en: "Documents" },

    "crumb.home":         { sr: "Početna", en: "Home" },
    "q.label":            { sr: "PITANJE", en: "QUESTION" },
    "q.faq":              { sr: "ČESTA PITANJA", en: "FAQ" },
    "q.faqTitle":         { sr: "Pitanja koja najčešće dobijamo", en: "Questions we hear most" },
    "q1": { sr: "Šta je usluga?", en: "What is the service?" },
    "q2": { sr: "Kome je namijenjena?", en: "Who is it for?" },
    "q3": { sr: "Koji problem rješava?", en: "What problem does it solve?" },
    "q4": { sr: "Kako funkcioniše?", en: "How does it work?" },
    "q5": { sr: "Šta radi Eurobroker, šta klijent, šta treća lica?", en: "Who does what — Eurobroker, client, third parties?" },
    "q6": { sr: "Koliko košta i gdje je cjenovnik?", en: "What does it cost, and where are the fees?" },
    "q7": { sr: "Koji su rizici?", en: "What are the risks?" },
    "q8": { sr: "Koji dokumenti su potrebni?", en: "Which documents are needed?" },
    "roles.eb": { sr: "Eurobroker", en: "Eurobroker" },
    "roles.client": { sr: "Klijent", en: "Client" },
    "roles.third": { sr: "Treća lica", en: "Third parties" },
    "side.cost": { sr: "Naknada se utvrđuje objavljenim cjenovnikom. Konkretan izvod dobijate uz uslugu.", en: "Fees follow the published price list. You receive the relevant extract with the service." },
    "side.seeFees": { sr: "Pogledajte cjenovnik", en: "See the price list" },
    "side.riskNote": { sr: "Vrijednost ulaganja može rasti i padati. Prije odluke pročitajte upozorenje o rizicima. Ovaj sadržaj ne predstavlja individualnu investicionu preporuku.", en: "The value of investments can rise and fall. Read the risk warning before deciding. This content is not individual investment advice." },
    "side.details": { sr: "Detalji usluge", en: "Service details" },
    "side.for": { sr: "Namijenjeno", en: "For" },
    "side.status": { sr: "Status", en: "Status" },
    "side.responseTime": { sr: "Rok odziva", en: "Response time" },
    "side.oneDay": { sr: "1 radni dan", en: "1 business day" },
    "side.related": { sr: "Povezano", en: "Related" },
    "cta.replyNote": { sr: "Javljamo se u jednom radnom danu.", en: "We reply within one business day." },
    "home.whatNeed": { sr: "Šta vam je potrebno?", en: "What do you need?" },

    "home.segEyebrow": { sr: "Naše usluge", en: "Our services" },
    "home.segTitle": { sr: "Sve što vam je potrebno za tržište kapitala", en: "Everything you need for the capital market" },
    "home.segSub": { sr: "Širok spektar usluga za investitore i kompanije uz stručnu podršku našeg tima.", en: "A broad range of services for investors and companies, with expert support from our team." },
    "seg.A": { sr: "Želim da ulažem", en: "I want to invest" },
    "seg.D": { sr: "Treba mi savjet", en: "I need advice" },
    "seg.F": { sr: "Kompaniji treba kapital", en: "My company needs capital" },
    "seg.G": { sr: "Institucija smo", en: "We are an institution" },
    "seg.A.title": { sr: "Želim da ulažem", en: "I want to invest" },
    "seg.D.title": { sr: "Treba mi investiciono savjetovanje", en: "I need investment advice" },
    "seg.F.title": { sr: "Kompaniji je potreban kapital", en: "My company needs capital" },
    "seg.G.title": { sr: "Institucionalne usluge", en: "Institutional services" },
    "seg.A.desc": { sr: "Pristup domaćem i svjetskim tržištima kapitala uz brokersku podršku i jasne informacije prije svakog narednog koraka.", en: "Access to the domestic and world capital markets with broker support and clear information before each next step." },
    "seg.D.desc": { sr: "Stručna analiza i pisana investiciona preporuka zasnovana na vašim ciljevima, finansijskoj situaciji i profilu rizika.", en: "Expert analysis and a written investment recommendation based on your goals, financial situation and risk profile." },
    "seg.F.desc": { sr: "Podrška u pripremi i realizaciji finansiranja putem tržišta kapitala, od procjene spremnosti do emisije obveznica ili akcija.", en: "Support in preparing and carrying out capital-markets financing, from readiness assessment to a bond or share issue." },
    "seg.G.desc": { sr: "Brokerske, kastodi i druge usluge prilagođene operativnim i regulatornim potrebama institucionalnih klijenata.", en: "Brokerage, custody and other services tailored to the operational and regulatory needs of institutional clients." },
    "seg.A.cta": { sr: "Istražite mogućnosti ulaganja", en: "Explore investment options" },
    "seg.D.cta": { sr: "Razgovarajte sa savjetnikom", en: "Talk to an adviser" },
    "seg.F.cta": { sr: "Razgovarajte o finansiranju", en: "Discuss financing" },
    "seg.G.cta": { sr: "Pogledajte institucionalne usluge", en: "See institutional services" },
    "seg.A.sub": { sr: "Domaće i svjetska tržišta", en: "Domestic and world markets" },
    "seg.D.sub": { sr: "Investiciono savjetovanje", en: "Investment advice" },
    "seg.F.sub": { sr: "Emisija obveznica i akcija", en: "Bond and share issues" },
    "seg.G.sub": { sr: "Institucionalni program", en: "Institutional programme" },
    "svc.dom": { sr: "Domaće tržište", en: "Domestic market" },
    "svc.dom.d": { sr: "Nalozi na Banjalučkoj berzi uz brokera koji objašnjava.", en: "Orders on the Banja Luka exchange with a broker who explains." },
    "svc.world": { sr: "Svjetska tržišta", en: "World markets" },
    "svc.world.d": { sr: "Globalne akcije, ETF-ovi i fjučersi preko domaćeg društva.", en: "Global equities, ETFs and futures via a local firm." },
    "svc.adv": { sr: "Investiciono savjetovanje", en: "Investment advice" },
    "svc.adv.d": { sr: "Pisana preporuka po vašem cilju i profilu rizika.", en: "A written recommendation for your goal and risk profile." },
    "svc.corp": { sr: "Usluge za kompanije", en: "Corporate services" },
    "svc.corp.d": { sr: "Finansiranje putem tržišta kapitala — emisija obveznica i akcija.", en: "Capital-markets financing — bond and share issues." },
    "svc.inst": { sr: "Institucionalni program", en: "Institutional programme" },
    "svc.inst.d": { sr: "Nivoi usluge, izvještavanje i kontrola izvršenja.", en: "Service levels, reporting and execution control." },
    "svc.cust": { sr: "Kastodi poslovi", en: "Custody services" },
    "svc.cust.d": { sr: "Čuvanje, administriranje i ostvarivanje prava iz hartija od vrijednosti uz profesionalnu kastodi podršku.", en: "Safekeeping, administration and exercise of securities rights with professional custody support." },
    "home.whyEyebrow": { sr: "Zašto Eurobroker", en: "Why Eurobroker" },
    "home.whyTitle": { sr: "Tri razloga za dugoročan odnos", en: "Three reasons for a long-term relationship" },
    "home.whySub": { sr: "Licencirane usluge. Pristup domaćim i svjetskim tržištima. Lična odgovornost prema klijentu.", en: "Licensed services. Access to domestic and world markets. Personal responsibility to the client." },
    "home.mktEyebrow": { sr: "Brokerske usluge", en: "Brokerage services" },
    "home.mktTitle": { sr: "Gdje želite investirati?", en: "Where do you want to invest?" },
    "home.mktSub": { sr: "Odaberite tržište koje vas zanima, a mi vas vodimo kroz naredne korake.", en: "Choose the market that interests you and we guide you through the next steps." },
    "home.domH": { sr: "Banjalučka berza", en: "Banja Luka Stock Exchange" },
    "home.domP": { sr: "Akcije, obveznice i instrumenti tržišta novca uvršteni na Banjalučku berzu.", en: "Shares, bonds and money-market instruments listed on the Banja Luka Stock Exchange." },
    "home.domL1": { sr: "Akcije domaćih emitenata", en: "Shares of domestic issuers" },
    "home.domL2": { sr: "Dužničke hartije od vrijednosti", en: "Debt securities" },
    "home.domL3": { sr: "Prenos i administracija naslijeđenih hartija od vrijednosti", en: "Transfer and administration of inherited securities" },
    "home.domCta": { sr: "Istražite domaće tržište", en: "Explore the domestic market" },
    "home.worldH": { sr: "Svjetska tržišta", en: "World markets" },
    "home.worldP": { sr: "Investirajte u vodeće svjetske kompanije i proširite svoj portfolio.", en: "Invest in the world's leading companies and expand your portfolio." },
    "home.worldL1": { sr: "Globalne akcije i ETF-ovi", en: "Global equities and ETFs" },
    "home.worldL2": { sr: "Fjučersi i drugi dostupni instrumenti", en: "Futures and other available instruments" },
    "home.worldL3": { sr: "Izvještavanje i brokerska podrška", en: "Reporting and brokerage support" },
    "home.worldCta": { sr: "Istražite svjetska tržišta", en: "Explore world markets" },
    "home.corpEyebrow": { sr: "Za kompanije", en: "For companies" },
    "home.corpH": { sr: "Otvorite kompaniji novi put do kapitala", en: "Open a new path to capital for your company" },
    "home.corpP": { sr: "Finansiranje putem tržišta kapitala može biti alternativa ili dopuna tradicionalnim izvorima finansiranja. Pomažemo kompanijama da procijene mogućnosti, pripreme se za tržište i sprovedu odgovarajuću transakciju.", en: "Capital-markets financing can be an alternative or a complement to traditional funding sources. We help companies assess the options, prepare for the market and carry out the appropriate transaction." },
    "home.corpCta": { sr: "Provjerite spremnost kompanije", en: "Check your company's readiness" },
    "home.instEyebrow": { sr: "Institucionalni klijenti", en: "Institutional clients" },
    "home.instH": { sr: "Usluge prilagođene institucionalnim zahtjevima", en: "Services tailored to institutional requirements" },
    "home.instP": { sr: "Brokerske, kastodi i druge usluge za institucionalne klijente — uz direktnu stručnu podršku i jasno definisan model saradnje.", en: "Brokerage, custody and other services for institutional clients — with direct expert support and a clearly defined model of cooperation." },
    "home.instCta": { sr: "Istražite institucionalne usluge", en: "Explore institutional services" },
    "home.insEyebrow": { sr: "Analize i edukacija", en: "Insights and learning" },
    "home.insTitle": { sr: "Znanje za bolje razumijevanje tržišta", en: "Knowledge for a better understanding of the markets" },
    "home.insSub": { sr: "Pratite tržišne preglede, praktične vodiče i edukativne sadržaje koji vam pomažu da bolje razumijete tržišta kapitala, instrumente i proces investiranja.", en: "Follow market overviews, practical guides and educational content that help you better understand the capital markets, instruments and the investment process." },
    "home.trustEyebrow": { sr: "Elementi povjerenja", en: "Trust signals" },
    "home.trustTitle": { sr: "Rizik saradnje je mali i provjerljiv", en: "The risk of working with us is small and verifiable" },
    "trust.licence": { sr: "Dozvole KHOV RS", en: "SEC RS licences" },
    "trust.fees": { sr: "Objavljen cjenovnik", en: "Published price list" },
    "trust.rules": { sr: "Pravila poslovanja", en: "Business rules" },
    "trust.contact": { sr: "Imenovani sagovornik", en: "A named contact" },
    "trust.complaints": { sr: "Postupak po prigovorima", en: "Complaints procedure" },
    "home.finalTitle": { sr: "Naredni korak je jednostavan i neobavezujući", en: "The next step is simple and without obligation" },
    "home.finalSub": { sr: "Otvorite račun ili zakažite razgovor — javljamo se u jednom radnom danu.", en: "Open an account or book a call — we reply within one business day." },
  },

  /* --- EN proza po stranici (ista struktura kao window.EB_CONTENT) --- */
  content: {
    pocetna: {
      heroTag: "25 years in the capital market",
      heroTitleA: "The world of investing", heroTitleB: "in one place",
      heroSub: "The domestic exchange and world markets, investment advice and corporate services.",
      heroProofs: [
        { k: "25 YEARS", v: "in the capital market" },
        { k: "LICENSED TEAM", v: "of brokers and investment advisers" },
        { k: "EXPERTISE & INTEGRITY", v: "the foundation of our work" }
      ],
      zasto: [
        { t: "More capital-markets services in one place", d: "Brokerage, investment advice, corporate finance and issue-agent services, plus custody — connected services for investors, companies and institutions." },
        { t: "Domestic and world markets through one relationship", d: "From the Banja Luka Stock Exchange and domestic securities to global equities, ETFs and futures — through a single relationship with Eurobroker and expert support from our team." },
        { t: "You know who is responsible for you", d: "Behind the client relationship stands a named person. You know who to contact, who follows your request, and when to expect an answer." }
      ]
    },

    "za-kompanije": {
      what: "Capital does not have to come from a loan alone. Eurobroker helps companies raise capital through the capital markets — by issuing bonds or shares — and guides them through the entire process.",
      whoFor: ["Companies that need growth capital", "Owners seeking an alternative to bank debt", "Firms considering a listing"]
    },
    "finansiranje-putem-trzista-kapitala": {
      what: "A comparison of two routes to capital: bank debt and capital-markets financing. No disparaging of banks — just the facts, so an owner can compare.",
      whoFor: ["Owners and CFOs", "Companies facing a larger investment", "Not for micro liquidity needs"],
      problem: "Many firms know only the loan, because no local partner ever told them about an issue. This page explains the options before they are needed.",
      steps: [
        { t: "Comparison", d: "Loan vs. bond — cost, term, obligations, flexibility." },
        { t: "Readiness assessment", d: "A short questionnaire shows whether you are a candidate." },
        { t: "Initial conversation", d: "No obligation; we agree the next steps." }
      ],
      roles: { eurobroker: "Explains the options and runs the process.", klijent: "Provides data on the need and timing.", treci: "Exchange, Commission, registry (in later phases)." },
      risks: ["An issue is not pre-approved — feasibility is assessed.", "Market conditions affect the cost of capital.", "The process requires preparation and time."]
    },
    "emisija-obveznica": {
      what: "As an issue agent, Eurobroker runs a bond issue from readiness assessment to listing. Your company raises capital from investors, with clearly defined obligations.",
      whoFor: ["Medium and larger companies", "Firms with stable cash flow", "Not for firms without orderly financial statements"],
      problem: "“An issue” sounds complex and out of reach. We break it into phases with realistic deadlines, so the owner knows what lies ahead.",
      steps: [
        { t: "Readiness assessment", d: "Ten questions and an initial analysis." },
        { t: "Structuring", d: "Size, maturity, coupon and terms of the issue." },
        { t: "Documentation and approvals", d: "Prospectus preparation and the procedure before the authorities." },
        { t: "Placement and listing", d: "The issue is offered to investors and listed." }
      ],
      roles: { eurobroker: "Issue agent: structures, prepares and runs the procedure.", klijent: "Issuer: makes decisions and provides data.", treci: "SEC of Republika Srpska, the exchange, the Central Registry." },
      risks: ["Success depends on market conditions and investor interest.", "The procedure is subject to regulatory deadlines.", "This page describes the service, not a specific issue, and is not a call to subscribe."]
    },
    "emisija-akcija-i-dokapitalizacija": {
      what: "A recapitalisation means raising equity capital by issuing new shares — an alternative to further borrowing. Eurobroker runs the procedure as it does for bonds.",
      whoFor: ["Companies wanting capital without new debt", "Firms facing ownership restructuring", "Not for firms not ready for new owners"],
      problem: "Owners do not always realise capital can be raised without a loan. A recapitalisation makes that possible, with a change in the ownership structure.",
      steps: [
        { t: "Options analysis", d: "Whether equity is the right route." },
        { t: "Structuring the share issue", d: "Volume, price, rights attached to the shares." },
        { t: "Procedure and listing", d: "Approvals, placement and registration." }
      ],
      roles: { eurobroker: "Runs the share-issue procedure.", klijent: "Issuer: decides on the ownership structure.", treci: "Commission, exchange, registry." },
      risks: ["New owners change the governance structure.", "Price depends on market conditions.", "The same regulatory rules apply as for a bond issue."]
    },
    "priprema-za-trziste-kapitala": {
      what: "If a company is not yet ready for an issue, we prepare it: tidying reporting, corporate governance and documentation, with a future issue in mind.",
      whoFor: ["Companies with potential but no orderly base", "Firms planning an issue in 1–2 years"],
      problem: "“What are we missing?” is the owner's most common question. Rather than turn you away, we prepare the company for the moment an issue becomes feasible.",
      steps: [
        { t: "Diagnostics", d: "Where you stand against market requirements." },
        { t: "Preparation plan", d: "Concrete actions and their sequence." },
        { t: "Follow-through", d: "Until readiness for an issue." }
      ],
      roles: { eurobroker: "Advises and monitors the preparation (ancillary services within the licence).", klijent: "Carries out the recommended actions.", treci: "Auditor and legal adviser, as needed." },
      risks: ["Preparation does not guarantee a later successful issue.", "It requires management's involvement.", "Timelines depend on the state of the company."]
    },
    "institucionalni-klijenti": {
      what: "A programme tailored to institutional investors — with clear service levels, reporting and escalation. Concrete obligations are set out in a formal proposal.",
      whoFor: ["Pension and investment funds", "Insurance companies", "Larger corporate portfolios"]
    },
    "institucionalni-program": {
      what: "The institutional programme is a service tailored to institutional investors — with clear service levels, reporting and escalation. You receive concrete obligations in a formal proposal.",
      whoFor: ["Pension and investment funds", "Insurance companies", "Larger corporate portfolios"],
      problem: "An institution must see, in one click, that a programme exists for it — serious, without marketing tone, with measurable obligations.",
      steps: [
        { t: "Request for proposal", d: "You define needs and scope." },
        { t: "Formal proposal", d: "Service level, deadlines, reporting, escalation." },
        { t: "Contracting", d: "Establishing the relationship and reporting cycle." }
      ],
      roles: { eurobroker: "Executes, reports and escalates per the agreed level.", klijent: "Defines mandates and limits.", treci: "Exchange, registry, depositary." },
      risks: ["Market risk on executed orders.", "Deadlines are published only when operationally feasible.", "Terms are set out in the formal proposal."]
    },
    "blok-transakcije": {
      what: "A block trade executes a large order while controlling its price impact. It is intended for institutional and large clients, within the existing licence.",
      whoFor: ["Institutional investors", "Holders of large share blocks"],
      problem: "A large order placed naively moves the price against the client. Block execution controls that.",
      steps: [
        { t: "Order analysis", d: "Size, liquidity, time frame." },
        { t: "Execution strategy", d: "How to limit price impact." },
        { t: "Execution and reporting", d: "Realisation and confirmation." }
      ],
      roles: { eurobroker: "Structures and executes the block order.", klijent: "Defines the objective and limits.", treci: "Exchange and registry." },
      risks: ["Market risk during execution.", "Outcome depends on liquidity.", "Only within the existing licence."]
    },
    "investiranje-iz-dijaspore": {
      what: "You can invest from abroad through Eurobroker as a local licensed firm — global equities and ETFs, Republika Srpska bonds, or the domestic exchange — with documentation and a remote onboarding conversation.",
      whoFor: ["Members of the diaspora and returnees", "Non-residents with ties to Republika Srpska", "Those who want a local, accountable point of contact"],
      problem: "From abroad, the process seems inaccessible: which documents, how to sign, how taxes work. We lay it out step by step and handle as much as possible remotely.",
      steps: [
        { t: "Send an inquiry", d: "We reply within one business day with the exact document list." },
        { t: "Documentation", d: "Identification and forms; as much as possible handled remotely." },
        { t: "Account and first order", d: "Once the account is active, you place your first order with broker support." }
      ],
      roles: { eurobroker: "Guides onboarding, intermediates and reports.", klijent: "Provides documents and makes the decision.", treci: "Exchange, registry, and a foreign execution partner where relevant." },
      risks: ["Currency risk when investing in a foreign currency.", "Tax obligations depend on your residence — we give general information, not tax advice.", "Market risk of the chosen instruments."]
    },
    "o-nama": {
      what: "Eurobroker is one of the first brokerage houses in Republika Srpska, present in the capital market since 2001. More than two decades of experience have given us a deep understanding of the market, an understanding of clients' needs, and trust we build through a long-term, responsible approach.",
      danas: "Today Eurobroker is a modern investment company that opens new opportunities in the capital market for investors and companies. Alongside brokerage services, we are developing investment advice, corporate finance and custody services, so that everything you need is in one place.",
      cilj: "Our goal is simple: to make the capital market accessible, more understandable and closer to investors and companies, with the expertise and personal approach that remain at the core of our business.",
      mission: { label: "Our mission", msg: "We open the possibilities of the capital market to investors and companies.", desc: "Through expert support, modern solutions and access to domestic and global markets, we want to enable clients to make informed financial decisions and use the capital market as a space for investing, growth and development." },
      vision: { label: "Our vision", msg: "Eurobroker as the first choice for the capital market.", desc: "An investment company that combines long-standing experience with a modern approach to investing — recognised for expertise, reliability, speed and dedication to finding the best solution for every client." },
      promise: "We want Eurobroker to be more than a place where you invest — a partner you can approach with an idea, a question or a challenge, knowing that together we will find the best solution.",
      vrijednosti: [
        { t: "Transparency", d: "We speak clearly and openly about options, costs and risks, so you can make informed decisions." },
        { t: "Integrity", d: "We put clients' interests first and make decisions responsibly, in line with professional standards." },
        { t: "Initiative", d: "We think ahead and quickly turn ideas into solutions. We follow changes, spot opportunities and constantly seek ways to improve what we offer." }
      ]
    },
    "regulatorni-status": {
      what: "Eurobroker operates as a licensed capital-markets firm supervised by the Securities and Exchange Commission of Republika Srpska. Here, in one place, are the licences and basic identification details.",
      napomena: "Exact licence numbers, validity dates and identification details are confirmed by the compliance function before publication. Fields marked “to be entered” are filled with verified data."
    },
    "prikupljanje-kapitala": {
      sections: [
        { t: "Bond issue", link: "emisija-obveznica", p: [
          "Through a bond issue, a company borrows funds directly from investors, on terms defined in advance. The issue amount, maturity, interest rate and repayment method can be structured to suit the issuer's needs and capabilities.",
          "Eurobroker helps you assess whether this form of financing is justified, define the basic elements of the issue, prepare the necessary documentation and carry out the process through to completion."
        ] },
        { t: "Share issue", link: "emisija-akcija-i-dokapitalizacija", p: [
          "When a company wants to raise additional capital without increasing its debt, one option is to issue new shares. Funds are then secured through equity and can be used for investment, business expansion and other development needs.",
          "We assist you in preparing and carrying out recapitalisation and share issues, with support through the regulatory and operational steps of the process."
        ] },
        { t: "Issue agent", p: [
          "A securities issue involves a range of formal, regulatory and operational activities. As the issue agent, Eurobroker takes on the tasks related to preparing and carrying out the issue and coordinates the key activities among the participants in the process.",
          "For the company this means a single expert point of contact who follows the process and makes sure the required steps are carried out correctly and on time."
        ] }
      ],
      consult: { t: "Not sure which model suits your company?", p: "Before deciding on an issue, it is necessary to review the company's financial position, its capital needs and the options the market offers. Talk to our team about what you want to achieve.", cta: "Book an initial call" }
    },
    "poslovno-i-finansijsko-savjetovanje": {
      sections: [
        { t: "Capital structure", link: "kontakt", cta: "Talk to an adviser", p: [
          "How much of the business should be financed with own capital and how much with borrowed capital? Does the existing structure match the company's plans, and is there room for a different way of financing?",
          "We analyse the capital structure and help you review the balance of the various sources of financing, their costs and their impact on the company's financial position."
        ] },
        { t: "Business strategy", link: "kontakt", cta: "Request a consultation", p: [
          "An investment, business expansion, a change in the way of financing or another important business move requires a look at the financial consequences before the decision is made.",
          "We help you analyse the financial aspects of business plans and strategy and assess the different options before you take the next step."
        ] },
        { t: "Business plans", link: "kontakt", cta: "Business plan preparation", p: [
          "A good business plan should clearly show what the company wants to achieve, how much funding it needs and whether the planned activities are financially sustainable.",
          "We prepare business plans for new projects, investments, business development, financing needs and other purposes, with financial projections and analyses tailored to the specific project."
        ] },
        { t: "Corporate governance", link: "kontakt", cta: "Learn more", p: [
          "Sound corporate governance means clearly arranged relationships, responsibilities and decision-making processes within the company.",
          "We provide legal and financial advice in the area of corporate governance and help companies review questions that may matter to owners, governing bodies and the future development of the company."
        ] }
      ],
      consult: { t: "Need a second opinion?", p: "If you are facing a decision that requires an additional financial assessment or specific expertise, present us the situation. We tailor the advice to the specific question and to your company's needs.", cta: "Talk to our team" }
    },
    "korporativni-poslovi": {
      sections: [
        { t: "Company restructuring", link: "kontakt", cta: "Learn more about restructuring", p: [
          "As a company grows, its existing legal form does not always match its size, ownership structure or future plans. Restructuring makes it possible to change the company's legal form while the business continues in the new form.",
          "We help you review the procedure, prepare the necessary acts and documentation, and carry out the steps required to restructure the company."
        ] },
        { t: "Status changes", link: "kontakt", cta: "Status changes", p: [
          "Mergers, acquisitions, divisions and other status changes can be part of a reorganisation, growth, or a change in the company's ownership and business structure.",
          "We provide support in preparing and carrying out the procedure, including the required documentation and the activities related to realising a specific status change."
        ] },
        { t: "Legal and other acts and documentation", link: "kontakt", cta: "Request more information", p: [
          "Financial and corporate transactions often require the preparation of specific decisions, acts, analyses and other documentation.",
          "We take part in preparing them within the scope of the work we perform, making sure the documentation fits the specific procedure and its regulatory requirements."
        ] }
      ],
      consult: { t: "Have a more complex corporate procedure?", p: "Not every task fits a predefined category. Tell us what you want to carry out, and our team will assess how we can support you.", cta: "Send an enquiry" }
    },
    "analize-i-poslovni-planovi": {
      sections: [
        { t: "Financial analysis", link: "kontakt", cta: "Request a financial analysis", p: [
          "Financial analysis provides a more detailed insight into a company's operations, financial position and the movement of its key indicators.",
          "We analyse the relevant financial data and the relationships between them so you get a clearer basis for assessing operations, an investment, financing or other decisions."
        ] },
        { t: "Fundamental analysis", link: "kontakt", cta: "Fundamental analyses", p: [
          "Fundamental analysis looks at the value of an investment through the issuer's operations, its financial results, market position and other relevant factors.",
          "The goal is to obtain, based on the available data and indicators, a stronger basis for assessing a particular security or investment opportunity."
        ] },
        { t: "Technical analysis", link: "kontakt", cta: "Technical analyses", p: [
          "Technical analysis starts from historical price and trading-volume data and follows patterns and indicators that may be relevant for assessing market movements.",
          "We prepare technical and other analyses in the area of investing, in line with the subject and objective of the analysis."
        ] },
        { t: "Investment research", link: "kontakt", cta: "Research and analyses", p: [
          "When a decision requires a broader picture, we research markets, securities and other relevant financial information and prepare a structured analytical basis.",
          "In this way we turn a large amount of data into clear information that can be useful when assessing investment opportunities."
        ] }
      ],
      consult: { t: "Need an analysis for a specific decision?", p: "Tell us what you want to learn or assess. We will define the scope of the analysis according to your question and the information you need to make a decision.", cta: "Send an enquiry" },
      after: { t: "Business plans", link: "kontakt", cta: "Business plan preparation", p: [
        "A good business plan should clearly show what the company wants to achieve, how much funding it needs and whether the planned activities are financially sustainable.",
        "We prepare business plans for new projects, investments, business development, financing needs and other purposes, with financial projections and analyses tailored to the specific project."
      ] }
    },
    "otvorite-racun": {
      what: "Opening an account is the first step to trading. In Phase 1 the process is combined (form + signature), aiming for at most two business days.",
      steps: [
        { t: "Fill in the questionnaire", d: "Fill in and submit the client questionnaire and start the account-opening process." },
        { t: "Provide documentation", d: "You receive the exact document list in advance." },
        { t: "Signing and account activation", d: "After completing the documentation you sign the agreement and we finalise the account-opening process." }
      ]
    },

    investiranje: {
      what: "Invest on your own through a brokerage account, or use investment advice when you want expert support in making decisions.",
      whoFor: ["Savers who want more than a deposit", "Experienced investors for global markets", "Clients from the diaspora", "Larger-portfolio owners seeking advice"]
    },
    "domace-trziste": {
      what: "Domestic brokerage means Eurobroker buys and sells securities on the Banja Luka Stock Exchange on your behalf. You sign the order; the firm handles execution and settlement.",
      whoFor: ["Owners of shares in local companies", "Savers entering the market for the first time", "Heirs of securities", "Not for those seeking daily speculative trading without an intermediary"],
      problem: "The domestic market seems closed and illiquid. It is unclear what may be bought, what it costs, how it is paid for, and who is responsible. Eurobroker explains that path step by step.",
      steps: [
        { t: "Opening an account", d: "You sign an agreement and power of attorney; you get a named broker. Timeline: 1–2 business days." },
        { t: "Order", d: "You place a buy or sell order; the broker explains price and terms." },
        { t: "Execution on the exchange", d: "The firm executes the order on the Banja Luka Stock Exchange." },
        { t: "Settlement and report", d: "You receive execution confirmation and your account balance." }
      ],
      roles: { eurobroker: "Receives and executes the order, keeps records, reports.", klijent: "Makes the decision and signs the order.", treci: "Banja Luka Stock Exchange (execution) and the Central Registry (settlement and ownership records)." },
      risks: ["A security's price can rise and fall.", "The domestic market can be illiquid — a sale is not always immediate.", "Past returns do not guarantee future ones."],
      platforme: [
        { naziv: "eTrader", opis: "Electronic trading via the web platform", url: "https://eubr.blberza.com/etrader/", ikona: "monitor" },
        { naziv: "mTrader", opis: "Trading via mobile phone", url: "https://eubr.blberza.com/mtrader/sign/in?returnUrl=~%2F", ikona: "smartphone" }
      ]
    },
    "svjetska-trzista": {
      what: "Through Eurobroker, as a local licensed firm, you buy global equities, ETFs and futures — without opening an account with an unfamiliar foreign app.",
      whoFor: ["Investors seeking global diversification", "Clients from the diaspora", "Higher-net-worth private clients", "Not for those expecting a guaranteed return"],
      problem: "Global markets seem out of reach from BiH, and foreign platforms raise questions of trust, language, tax and support. Eurobroker is a local, licensed partner for the same access.",
      steps: [
        { t: "Opening a world-markets account", d: "You provide documentation; you get the list of steps in advance." },
        { t: "Funding and conversion", d: "Funds are prepared for trading per the applicable terms." },
        { t: "Order", d: "You buy global equities, ETFs or futures with broker support." },
        { t: "Reporting", d: "You get a sample report and regular balance overviews." }
      ],
      roles: { eurobroker: "Intermediates, executes orders and reports.", klijent: "Makes the investment decision.", treci: "A foreign execution partner and depositary (named only if the contract allows)." },
      risks: ["Currency risk when investing in a foreign currency.", "Market risk of global instruments.", "Tax obligations depend on your situation — we give general information, not tax advice."]
    },
    "obveznice-rs": {
      what: "Republika Srpska bonds are a debt instrument: you lend funds to the issuer and, in return, receive interest and repayment of principal at maturity. They are bought through a broker, not at a bank.",
      whoFor: ["Savers wanting a more understandable first step than shares", "More conservative investors", "Not for those seeking quick resale at a high return"],
      problem: "Many do not know that RS bonds can be bought as a citizen at all, or how. Eurobroker explains the available series, maturity and procedure.",
      steps: [
        { t: "Information on series", d: "We check available bonds and terms." },
        { t: "Opening an account", d: "A standard procedure; the document list in advance." },
        { t: "Purchase", d: "The order is executed; you receive confirmation." }
      ],
      roles: { eurobroker: "Informs, intermediates and executes the purchase.", klijent: "Decides on the purchase.", treci: "The exchange and the Central Registry." },
      risks: ["There is not a guaranteed return in every situation.", "Risk of price change before maturity.", "Read the risk warning before deciding."]
    },
    "investiciono-savjetovanje": {
      what: "Investment advice is for anyone who wants an expert assessment before making an investment decision. Through a clearly defined process we arrive at a concrete investment proposal.",
      whoFor: ["Higher-net-worth private clients", "Larger-portfolio owners", "Not for those seeking a “sure tip” without a contract and risk profile"],
      problem: "Advice adds value: a clear recommendation, documented analysis and greater confidence in your investment decision.",
      steps: [
        { t: "WE GET TO KNOW YOU", d: "Before we consider specific investments, it is important to understand what you expect from investing. We talk about your financial situation, experience, planned investment horizon and willingness to accept changes in the value of the investment." },
        { t: "WE REVIEW THE MARKET", d: "Our team analyses the available financial instruments, assesses their potential and risks and selects those that match your goals." },
        { t: "YOU RECEIVE A RECOMMENDATION", d: "You receive a written recommendation in which we clearly present the proposed investment, the reasons for the choice and the risks to consider." },
        { t: "YOU MAKE THE DECISION", d: "The final decision is always yours. If you decide to invest, Eurobroker can execute the order to purchase the selected financial instruments." }
      ],
      roles: { eurobroker: "Provides a written recommendation under contract and keeps a register of recommendations.", klijent: "Provides data and makes the final decision.", treci: "—" },
      risks: ["A recommendation does not guarantee a return.", "The outcome depends on market movements.", "Advice applies within the contracted relationship and risk profile."],
      napomenaCijena: "Prices and package names are published only after the conflict-of-interest policy, the register of recommendations and the price list are adopted. Until then, only a conversation is possible.",
      finalCta: { t: "Let's talk about your investments", p: "You don't need a ready investment plan before the first conversation. Tell us what you want to achieve, and together we will find the optimal solution.", cta: "Book a call", link: "kontakt" }
    },
    kontakt: {
      what: "One named person and a published response time. Tell us what you need — we reply within one business day."
    },
    partneri: {
      network: {
        eyebrow: "Partner network",
        t: "Cooperation that complements your services",
        lead: "We work with professionals and organisations who, in their work, recognise client needs in investing, financing and the capital market.",
        cards: [
          { t: "Accounting and consulting firms", d: "For clients who need capital, financial analysis, a business plan or support in development projects." },
          { t: "Law offices", d: "For transactions that, alongside the legal part, require brokerage, market or corporate-finance expertise." },
          { t: "Financial and business advisers", d: "For clients who need specialised capital-market support." },
          { t: "Banks and financial institutions", d: "For areas where services and professional competencies can complement one another." },
          { t: "Business associations and chambers", d: "For company education, the exchange of professional knowledge and developing access to the capital market." },
          { t: "Other professional partners", d: "For cooperation on specific matters where Eurobroker can complement a partner's existing expertise." }
        ]
      },
      when: {
        eyebrow: "Recognise the need",
        t: "When we can help your client",
        lead: "The need for the capital market often appears before the client knows which specific service they require. These are the situations where it makes sense to involve our team.",
        cases: [
          { t: "The client wants to invest", d: "Brokerage services and investment advice.", cta: "Explore investing", link: "investiranje" },
          { t: "A company needs capital", d: "Bond and share issues, recapitalisation and issue-agent services.", cta: "Raising capital", link: "prikupljanje-kapitala" },
          { t: "A company faces an important financial decision", d: "Capital structure, business strategy and other questions requiring financial assessment.", cta: "Business and financial advisory", link: "poslovno-i-finansijsko-savjetovanje" },
          { t: "A corporate change is ahead", d: "Company restructuring, status changes and related corporate procedures.", cta: "Corporate services", link: "korporativni-poslovi" },
          { t: "An analysis or business plan is needed", d: "Financial, fundamental and other analyses, research and business plans.", cta: "Analyses and business plans", link: "analize-i-poslovni-planovi" },
          { t: "Custody services are needed", d: "Safekeeping and administration of securities and tasks related to exercising securities rights.", cta: "Custody services", link: "kastodi-poslovi" }
        ]
      },
      process: {
        eyebrow: "Process",
        t: "From a client's need to a concrete solution",
        steps: [
          { t: "You recognise the need", d: "In your client's business you spot a question where Eurobroker's expertise may be needed." },
          { t: "We connect the teams", d: "With the appropriate consent, we establish contact and get to know the client's needs." },
          { t: "We assess the options", d: "We review the matter, the regulatory framework and how we can help." },
          { t: "We define the engagement", d: "We present the client with the scope of service, the next steps and the terms of cooperation." }
        ]
      },
      value: {
        eyebrow: "Why cooperate",
        t: "You keep your relationship with the client. We add our expertise.",
        lead: "A partnership with Eurobroker lets you broaden the support you provide to clients without developing your own capacity for specialised capital-market work.",
        items: [
          { t: "Specialised expertise", d: "You bring in an expert team when it is needed." },
          { t: "Broader client support", d: "The client gains access to additional capital-market solutions." },
          { t: "Clear division of responsibility", d: "Each side acts within its own expertise and authorisations." },
          { t: "Long-term cooperation", d: "The goal is to develop a partner relationship and jointly recognise future business opportunities." }
        ]
      },
      comp: {
        eyebrow: "Our competencies",
        t: "One partner for different capital-market needs",
        items: [
          { t: "Brokerage services", link: "investiranje" },
          { t: "Investment advice", link: "investiciono-savjetovanje" },
          { t: "Raising capital", link: "prikupljanje-kapitala" },
          { t: "Business and financial advisory", link: "poslovno-i-finansijsko-savjetovanje" },
          { t: "Corporate services", link: "korporativni-poslovi" },
          { t: "Analyses and business plans", link: "analize-i-poslovni-planovi" },
          { t: "Custody services", link: "kastodi-poslovi" }
        ]
      },
      models: {
        eyebrow: "Models of cooperation",
        t: "Cooperation tailored to the specific matter",
        cards: [
          { t: "Client referral", d: "When the client has a need that Eurobroker can take on directly within its services and authorisations." },
          { t: "Joint project", d: "When the matter requires a combination of the partner's and Eurobroker's expertise." },
          { t: "Long-term partnership", d: "For organisations where there is room for continuous cooperation, education, joint projects or the development of new business opportunities." }
        ]
      },
      roles: {
        eyebrow: "Professional standards",
        t: "Clear roles. Professional cooperation.",
        p: "Each partner retains responsibility for the services it provides within its own activity and authorisations. Work requiring the appropriate licences and professional qualifications is performed by Eurobroker within its regulatory authorisations and its contractual relationship with the client."
      },
      final: {
        eyebrow: "Let's start the conversation",
        t: "Have a client or a project we could work on together?",
        p: "Tell us about the need or the business opportunity. We will discuss where our competencies complement each other and whether there is a basis for cooperation.",
        primary: "Talk about a partnership",
        secondary: "Contact our team"
      },
      form: {
        t: "Partner enquiry",
        name: "Full name", company: "Company / organisation", email: "Business e-mail", phone: "Phone",
        type: "Type of cooperation",
        typeOpts: ["Client referral", "Joint project", "Long-term partnership", "Other"],
        desc: "Short description", descP: "Briefly about the need or opportunity (no confidential client data)",
        consent: "I agree to the processing of my data for the purpose of responding to this enquiry, per the privacy policy.",
        note: "Please do not include confidential or sensitive client data in this initial enquiry. We reply within one business day.",
        submit: "Send enquiry"
      }
    },
    dokumenti: {
      what: "In one place: business rules, general terms, forms, client information, the risk warning, the complaints procedure, data protection and conflict of interest. Every document carries a version and a date.",
      lista: [
        "Business rules and general terms",
        "Forms to download (order, agreement, power of attorney)",
        "Client information",
        "Risk warning",
        "Complaints procedure",
        "Personal data protection",
        "Conflict-of-interest policy"
      ]
    }
  },

  /* EN naslovi stranica (za navigaciju, breadcrumb, kartice) */
  titles: {
    "investiranje": "Investing",
    "domace-trziste": "Domestic market",
    "svjetska-trzista": "World markets",
    "obveznice-rs": "Republika Srpska bonds",
    "investiciono-savjetovanje": "Investment advice",
    "za-kompanije": "For companies",
    "finansiranje-putem-trzista-kapitala": "Capital-markets financing",
    "prikupljanje-kapitala": "Raising capital",
    "poslovno-i-finansijsko-savjetovanje": "Business and financial advisory",
    "korporativni-poslovi": "Corporate services",
    "analize-i-poslovni-planovi": "Analyses and business plans",
    "emisija-obveznica": "Bond issue",
    "emisija-akcija-i-dokapitalizacija": "Share issue & recapitalisation",
    "priprema-za-trziste-kapitala": "Preparing for the capital markets",
    "procjena-spremnosti": "Issue-readiness assessment",
    "institucionalni-klijenti": "Institutional clients",
    "institucionalni-program": "Institutional programme",
    "blok-transakcije": "Block trades",
    "kastodi-poslovi": "Custody services",
    "analize": "Insights & markets",
    "edukacija": "Learning centre",
    "o-nama": "About us",
    "regulatorni-status": "Regulatory status & licences",
    "cjenovnik": "Price list",
    "otvorite-racun": "Open an account",
    "kontakt": "Contact",
    "partneri": "Partnerships & cooperation",
    "dokumenti": "Documents & forms",
    "investiranje-iz-dijaspore": "Investing from the diaspora"
  },
  /* EN glavne poruke (message) za hero na stranicama u EN obuhvatu */
  messages: {
    "za-kompanije": "Capital does not have to come from a loan alone",
    "finansiranje-putem-trzista-kapitala": "Loan and capital markets — a factual comparison",
    "prikupljanje-kapitala": "Capital doesn't have to come from a loan alone",
    "poslovno-i-finansijsko-savjetovanje": "Expert support for important business decisions",
    "korporativni-poslovi": "Complex changes, a clearly defined process",
    "analize-i-poslovni-planovi": "Good decisions call for quality analysis",
    "emisija-obveznica": "We run the issue from readiness assessment to listing",
    "emisija-akcija-i-dokapitalizacija": "Recapitalisation as an alternative to debt",
    "priprema-za-trziste-kapitala": "We prepare your company for a future issue",
    "procjena-spremnosti": "Ten questions and three minutes",
    "institucionalni-klijenti": "A programme tailored to institutional needs",
    "institucionalni-program": "Three service levels with clear obligations",
    "blok-transakcije": "Large orders while controlling price impact",
    "kastodi-poslovi": "Secure holding and administration of securities",
    "o-nama": "Experience in the market. Trust that is built.",
    "regulatorni-status": "Licences and the supervisory authority in one place",
    "otvorite-racun": "Three steps to an active account",
    "kontakt": "A named person and a response time",
    "investiranje": "Invest on your own or with advice",
    "domace-trziste": "An order on the Banja Luka exchange, with a broker who explains",
    "svjetska-trzista": "Global equities, ETFs and futures through a local licensed firm",
    "obveznice-rs": "Bonds are bought through a broker, not at a bank",
    "investiciono-savjetovanje": "A written recommendation based on your goal and risk",
    "analize": "A market overview and commentary — without individual advice",
    "edukacija": "First steps, guides and webinars",
    "cjenovnik": "A published price list, applied from its effective date",
    "dokumenti": "Every document with a version and a date",
    "partneri": "Together we open new opportunities for clients"
  },
  goals: {
    "za-kompanije": "Turn “we need money” into an initial conversation.",
    "prikupljanje-kapitala": "Explore the options for financing through the capital market and find the model that suits your company's needs and plans.",
    "poslovno-i-finansijsko-savjetovanje": "We help you review the financial and business options and make decisions aligned with your company's goals.",
    "korporativni-poslovi": "From company restructuring to more complex corporate procedures, we help you prepare and carry out changes efficiently and in line with regulations.",
    "analize-i-poslovni-planovi": "We turn data and information into a clear basis for assessing investments, business options and future moves.",
    "emisija-obveznica": "A clear path for companies raising capital.",
    "institucionalni-klijenti": "A serious institutional programme, without marketing tone.",
    "o-nama": "Eurobroker combines long-standing capital-markets experience with a professional and responsible relationship with every client.",
    "kastodi-poslovi": "Eurobroker provides custody services within its Commission licence — account keeping, administration of securities rights and operational support for clients in exercising those rights.",
    "otvorite-racun": "The primary conversion — start in one business day.",
    "kontakt": "We reply within one business day.",
    "investiranje": "Choose the market and the level of support.",
    "domace-trziste": "Retaining and reactivating the existing base.",
    "svjetska-trzista": "New accounts and access to global markets.",
    "obveznice-rs": "An entry point through the most understandable instrument.",
    "investiciono-savjetovanje": "Turning knowledge into a contracted service.",
    "analize": "Proof of expertise that keeps refreshing.",
    "edukacija": "Education as an acquisition channel.",
    "cjenovnik": "Price transparency as a trust signal.",
    "dokumenti": "Client support and lighter broker workload.",
    "partneri": "We connect our partners' expertise with Eurobroker's services so investors and companies get the right support in the capital market."
  },

  /* EN meta za sintetičku dijaspora stranicu i huben naslov */
  pagemeta: {
    "investiranje-iz-dijaspore": {
      sr: { title: "Investiranje iz dijaspore", type: "Edukacija", message: "Ulažite iz inostranstva, uz domaćeg sagovornika", goal: "Jasna dokumentacija i postupak na daljinu za klijente iz dijaspore." },
      en: { title: "Investing from the diaspora", type: "Guide", message: "Invest from abroad, with a local point of contact", goal: "Clear documentation and a remote process for clients abroad." }
    }
  }
};
