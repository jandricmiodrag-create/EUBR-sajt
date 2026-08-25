/* EUROBROKER — dugotrajni sadržaj stranica (10-pitanja model).
 * Tabelarni podaci (nav, poruke, CTA, cjenovnik…) dolaze iz data/gsheet/*.csv.
 * Ovdje je samo prozni sadržaj koji ne pripada tabeli. */
window.EB_CONTENT = {

  pocetna: {
    heroProofs: [
      { k: "25 GODINA", v: "na tržištu kapitala" },
      { k: "LICENCIRANI TIM", v: "brokera i investicionih savjetnika" },
      { k: "STRUČNOST I INTEGRITET", v: "temelj poslovanja" }
    ],
    zasto: [
      { t: "Više usluga tržišta kapitala na jednom mjestu", d: "Brokersko posredovanje, investiciono savjetovanje, korporativne finansije i poslovi agenta emisije te kastodi poslovi — povezane usluge za investitore, kompanije i institucije." },
      { t: "Domaće i svjetska tržišta kroz jedan odnos", d: "Od Banjalučke berze i domaćih hartija od vrijednosti do globalnih akcija, ETF-ova i fjučersa — uz jedan odnos sa Eurobrokerom i stručnu podršku našeg tima." },
      { t: "Znate ko je zadužen za vas", d: "Iza odnosa sa klijentom stoji imenovana osoba. Znate kome se obraćate, ko prati vaš zahtjev i kada možete očekivati odgovor." }
    ]
  },

  investiranje: {
    what: "Investirajte samostalno putem brokerskog računa ili koristite investiciono savjetovanje kada želite stručnu podršku pri donošenju odluka.",
    whoFor: ["Građani koji žele više od depozita", "Iskusniji investitori za globalna tržišta", "Klijenti iz dijaspore", "Vlasnici većih portfelja koji traže savjet"]
  },

  "domace-trziste": {
    what: "Domaće posredovanje znači da Eurobroker u vaše ime kupuje i prodaje hartije od vrijednosti na Banjalučkoj berzi. Nalog potpisujete vi, a izvršenje i poravnanje vodi Društvo.",
    whoFor: ["Vlasnici akcija domaćih preduzeća", "Štediše koji prvi put ulaze na tržište", "Nasljednici hartija od vrijednosti", "Nije za one koji traže dnevno špekulativno trgovanje bez posrednika"],
    problem: "Domaće tržište djeluje zatvoreno i nelikvidno. Ne zna se šta se smije kupiti, koliko košta, kako se plaća i ko odgovara. Eurobroker taj put objašnjava korak po korak.",
    steps: [
      { t: "Otvaranje računa", d: "Potpisujete ugovor i punomoć; dobijate imenovanog brokera. Rok: 1–2 radna dana." },
      { t: "Nalog", d: "Dajete nalog za kupovinu ili prodaju; broker objašnjava cijenu i uslove." },
      { t: "Izvršenje na berzi", d: "Društvo izvršava nalog na Banjalučkoj berzi." },
      { t: "Poravnanje i izvještaj", d: "Dobijate potvrdu o izvršenju i stanje na računu." }
    ],
    roles: { eurobroker: "Prima i izvršava nalog, vodi evidenciju, izvještava.", klijent: "Donosi odluku i potpisuje nalog.", treci: "Banjalučka berza (izvršenje) i Centralni registar (poravnanje i evidencija vlasništva)." },
    risks: ["Cijena hartije može rasti i padati.", "Domaće tržište može biti nelikvidno — prodaja nije uvijek trenutna.", "Prošli prinosi ne garantuju buduće."],
    platforme: [
      { naziv: "eTrader", opis: "Elektronsko trgovanje putem web platforme", url: "https://eubr.blberza.com/etrader/", ikona: "monitor" },
      { naziv: "mTrader", opis: "Trgovanje putem mobilnog telefona", url: "https://eubr.blberza.com/mtrader/sign/in?returnUrl=~%2F", ikona: "smartphone" }
    ]
  },

  "svjetska-trzista": {
    what: "Preko Eurobrokera, kao domaćeg licenciranog društva, kupujete globalne akcije, ETF-ove i fjučerse — bez otvaranja računa kod nepoznate inostrane aplikacije.",
    whoFor: ["Investitori koji žele globalnu diversifikaciju", "Klijenti iz dijaspore", "Imućniji privatni klijenti", "Nije za one koji očekuju zagarantovan prinos"],
    problem: "Globalna tržišta djeluju nedostupno iz BiH, a inostrane platforme nose pitanja povjerenja, jezika, poreza i podrške. Eurobroker je domaći, licencirani sagovornik za isti pristup.",
    steps: [
      { t: "Otvaranje računa za svjetska tržišta", d: "Dostavljate dokumentaciju; dobijate listu koraka unaprijed." },
      { t: "Uplata i konverzija", d: "Sredstva se pripremaju za trgovanje prema važećim uslovima." },
      { t: "Nalog", d: "Kupujete globalne akcije, ETF-ove ili fjučerse uz podršku brokera." },
      { t: "Izvještaj", d: "Dobijate uzorak izvještaja i redovan pregled stanja." }
    ],
    roles: { eurobroker: "Posreduje, izvršava naloge i izvještava.", klijent: "Donosi investicionu odluku.", treci: "Inostrani izvršni partner i depozitar (naziv se navodi samo ako ugovor to dozvoljava)." },
    risks: ["Valutni rizik pri ulaganju u stranoj valuti.", "Tržišni rizik globalnih instrumenata.", "Poreske obaveze zavise od vaše situacije — dajemo opšte informacije, ne poreski savjet."]
  },

  "obveznice-rs": {
    what: "Obveznice Republike Srpske su dužnički instrument: pozajmljujete sredstva izdavaocu, a zauzvrat dobijate kamatu i povraćaj glavnice o dospijeću. Kupuju se preko brokera, ne u banci.",
    whoFor: ["Štediše koji traže razumljiviji prvi korak od akcija", "Konzervativniji investitori", "Nije za one koji traže brzu preprodaju uz visok prinos"],
    problem: "Mnogi ne znaju da se obveznice RS uopšte mogu kupiti kao građanin, ni kako. Eurobroker objašnjava dostupne serije, dospijeće i postupak.",
    steps: [
      { t: "Informacija o serijama", d: "Provjeravamo dostupne obveznice i uslove." },
      { t: "Otvaranje računa", d: "Standardni postupak; lista dokumenata unaprijed." },
      { t: "Kupovina", d: "Nalog se izvršava; dobijate potvrdu." }
    ],
    roles: { eurobroker: "Informiše, posreduje i izvršava kupovinu.", klijent: "Odlučuje o kupovini.", treci: "Berza i Centralni registar." },
    risks: ["Ne postoji zagarantovan prinos u svakoj situaciji.", "Rizik promjene cijene prije dospijeća.", "Prije odluke pročitajte upozorenje o rizicima."]
  },

  "investiciono-savjetovanje": {
    what: "Investiciono savjetovanje je ugovorena usluga: dobijate pisanu preporuku zasnovanu na vašem cilju i profilu rizika. To nije usputni razgovor uz izvršenje naloga.",
    whoFor: ["Imućni privatni klijenti", "Vlasnici većih portfelja", "Nije za one koji traže „siguran tip“ bez ugovora i profila rizika"],
    problem: "Izvršenje naloga i savjet se često miješaju. Kod savjetovanja odgovornost je jasno određena i dokumentovana — vi znate na čemu se preporuka zasniva.",
    steps: [
      { t: "Razgovor i profil rizika", d: "Utvrđujemo cilj, horizont i odnos prema riziku." },
      { t: "Pregled portfelja", d: "Analiziramo postojeće stanje." },
      { t: "Pisana preporuka", d: "Dobijate obrazloženu preporuku po ugovoru." }
    ],
    roles: { eurobroker: "Daje pisanu preporuku po ugovoru i vodi registar preporuka.", klijent: "Dostavlja podatke i donosi konačnu odluku.", treci: "—" },
    risks: ["Preporuka ne garantuje prinos.", "Rezultat zavisi od tržišnih kretanja.", "Savjet važi u okviru ugovorenog odnosa i profila rizika."],
    napomenaCijena: "Cijena i nazivi paketa objavljuju se tek po usvajanju politike sukoba interesa, registra preporuka i cjenovnika. Do tada je moguć samo razgovor."
  },

  "za-kompanije": {
    what: "Kapital ne mora doći samo iz kredita. Eurobroker pomaže preduzećima da se finansiraju putem tržišta kapitala — emisijom obveznica ili akcija — i vodi ih kroz cijeli proces.",
    whoFor: ["Preduzeća kojima treba kapital za rast", "Vlasnici koji traže alternativu bankarskom zaduženju", "Društva koja razmišljaju o uvrštenju"]
  },

  "finansiranje-putem-trzista-kapitala": {
    what: "Poređenje dva puta do kapitala: kreditno zaduženje i finansiranje putem tržišta kapitala. Bez omalovažavanja banaka — činjenično, da vlasnik može uporediti.",
    whoFor: ["Vlasnici i finansijski direktori", "Preduzeća pred većom investicijom", "Nije za mikro-potrebe likvidnosti"],
    problem: "Mnoga preduzeća znaju samo za kredit jer za emisiju nikad nisu čula od domaćeg sagovornika. Ova stranica objašnjava opcije prije nego što zatrebaju.",
    steps: [
      { t: "Poređenje", d: "Kredit ili obveznica — trošak, rok, obaveze, fleksibilnost." },
      { t: "Procjena spremnosti", d: "Kratak upitnik pokazuje da li ste kandidat." },
      { t: "Inicijalni razgovor", d: "Bez obaveze; dogovaramo naredne korake." }
    ],
    roles: { eurobroker: "Objašnjava opcije i vodi proces.", klijent: "Dostavlja podatke o potrebi i roku.", treci: "Berza, Komisija, registar (u kasnijim fazama)." },
    risks: ["Emisija nije unaprijed odobrena — izvodljivost se procjenjuje.", "Tržišni uslovi utiču na cijenu kapitala.", "Proces zahtijeva pripremu i vrijeme."]
  },

  "emisija-obveznica": {
    what: "Kao agent emisije, Eurobroker vodi emisiju obveznica od procjene spremnosti do uvrštenja na tržište. Vaše preduzeće pribavlja kapital od investitora, uz jasno definisane obaveze.",
    whoFor: ["Srednja i veća preduzeća", "Društva sa stabilnim novčanim tokom", "Nije za društva bez uređenih finansijskih izvještaja"],
    problem: "„Emisija“ zvuči komplikovano i nedostupno. Mi je razlažemo na faze sa realnim rokovima, tako da vlasnik zna šta ga čeka.",
    steps: [
      { t: "Procjena spremnosti", d: "Deset pitanja i inicijalna analiza." },
      { t: "Strukturiranje", d: "Veličina, rok, kamata i uslovi emisije." },
      { t: "Dokumentacija i odobrenja", d: "Priprema prospekta i postupak pred nadležnim organima." },
      { t: "Plasman i uvrštenje", d: "Emisija se nudi investitorima i uvrštava na tržište." }
    ],
    roles: { eurobroker: "Agent emisije: struktuira, priprema i vodi postupak.", klijent: "Emitent: donosi odluke i dostavlja podatke.", treci: "Komisija za HOV RS, berza, Centralni registar." },
    risks: ["Uspjeh emisije zavisi od tržišnih uslova i interesa investitora.", "Postupak podliježe regulatornim rokovima.", "Ova stranica opisuje uslugu, ne konkretnu emisiju, i ne predstavlja poziv na upis."]
  },

  "emisija-akcija-i-dokapitalizacija": {
    what: "Dokapitalizacija znači pribavljanje vlasničkog kapitala izdavanjem novih akcija — alternativa daljem zaduživanju. Eurobroker vodi postupak kao i kod obveznica.",
    whoFor: ["Društva koja žele kapital bez novog duga", "Preduzeća pred vlasničkim restrukturiranjem", "Nije za društva koja nisu spremna na nove vlasnike"],
    problem: "Vlasnicima nije uvijek jasno da postoji način da se pribavi kapital bez kredita. Dokapitalizacija to omogućava, uz promjenu vlasničke strukture.",
    steps: [
      { t: "Analiza opcija", d: "Da li je vlasnički kapital pravi put." },
      { t: "Strukturiranje emisije akcija", d: "Obim, cijena, prava iz akcija." },
      { t: "Postupak i uvrštenje", d: "Odobrenja, plasman i evidencija." }
    ],
    roles: { eurobroker: "Vodi postupak emisije akcija.", klijent: "Emitent: odlučuje o vlasničkoj strukturi.", treci: "Komisija, berza, registar." },
    risks: ["Ulazak novih vlasnika mijenja upravljačku strukturu.", "Cijena zavisi od tržišnih uslova.", "Ista regulatorna pravila kao za emisiju obveznica."]
  },

  "priprema-za-trziste-kapitala": {
    what: "Ako društvo još nije spremno za emisiju, pripremamo ga: uređenje izvještavanja, korporativnog upravljanja i dokumentacije, sa pogledom na buduću emisiju.",
    whoFor: ["Preduzeća sa potencijalom, ali bez uređene osnove", "Društva koja planiraju emisiju za 1–2 godine"],
    problem: "„Šta nam nedostaje?“ — najčešće pitanje vlasnika. Umjesto da vas odbijemo, pripremamo društvo za trenutak kada emisija postane izvodljiva.",
    steps: [
      { t: "Dijagnostika", d: "Gdje ste u odnosu na zahtjeve tržišta." },
      { t: "Plan pripreme", d: "Konkretne radnje i redoslijed." },
      { t: "Praćenje", d: "Do trenutka spremnosti za emisiju." }
    ],
    roles: { eurobroker: "Savjetuje i prati pripremu (pomoćni poslovi u okviru dozvole).", klijent: "Sprovodi preporučene radnje.", treci: "Po potrebi revizor i pravni savjetnik." },
    risks: ["Priprema ne garantuje kasniju uspješnu emisiju.", "Zahtijeva angažman menadžmenta.", "Rokovi zavise od stanja društva."]
  },

  "institucionalni-program": {
    what: "Institucionalni program je usluga prilagođena institucionalnim investitorima — sa jasnim nivoima usluge, izvještavanjem i eskalacijom. Konkretne obaveze dobijate u formalnoj ponudi.",
    whoFor: ["Penzioni i investicioni fondovi", "Osiguravajuća društva", "Veći korporativni portfelji"],
    problem: "Institucija u jednom kliku mora vidjeti da postoji program za nju — ozbiljan, bez marketinškog tona, sa mjerljivim obavezama.",
    steps: [
      { t: "Zahtjev za ponudu", d: "Definišete potrebe i obim." },
      { t: "Formalna ponuda", d: "Nivo usluge, rokovi, izvještavanje, eskalacija." },
      { t: "Ugovaranje", d: "Uspostavljanje odnosa i izvještajnog ciklusa." }
    ],
    roles: { eurobroker: "Izvršava, izvještava i eskalira prema ugovorenom nivou.", klijent: "Definiše mandate i ograničenja.", treci: "Berza, registar, depozitar." },
    risks: ["Tržišni rizik izvršenih naloga.", "Rokovi se objavljuju tek kada su operativno izvodljivi.", "Uslovi se preciziraju formalnom ponudom."]
  },

  "blok-transakcije": {
    what: "Blok-transakcija je izvršenje velikog naloga uz kontrolu uticaja na cijenu. Namijenjena je institucionalnim i velikim klijentima, u okviru postojeće dozvole.",
    whoFor: ["Institucionalni investitori", "Veći vlasnici paketa akcija"],
    problem: "Veliki nalog dat naivno pomjera cijenu na štetu klijenta. Blok-izvršenje to kontroliše.",
    steps: [
      { t: "Analiza naloga", d: "Veličina, likvidnost, vremenski okvir." },
      { t: "Strategija izvršenja", d: "Način da se ograniči uticaj na cijenu." },
      { t: "Izvršenje i izvještaj", d: "Realizacija i potvrda." }
    ],
    roles: { eurobroker: "Struktuira i izvršava blok-nalog.", klijent: "Definiše cilj i ograničenja.", treci: "Berza i registar." },
    risks: ["Tržišni rizik u toku izvršenja.", "Rezultat zavisi od likvidnosti.", "Samo u okviru postojeće dozvole."]
  },

  "regulatorni-status": {
    what: "Eurobroker posluje kao licencirano društvo tržišta kapitala pod nadzorom Komisije za hartije od vrijednosti Republike Srpske. Ovdje su, na jednom mjestu, dozvole i osnovni identifikacioni podaci.",
    napomena: "Konkretne brojeve dozvola, datume važenja i identifikacione podatke potvrđuje funkcija usklađenosti prije objave. Polja označena sa „unijeti“ popunjavaju se provjerenim podacima."
  },

  "o-nama": {
    what: "Eurobroker je jedna od prvih brokerskih kuća u Republici Srpskoj, prisutna na tržištu kapitala od 2001. godine. Više od dvije decenije iskustva donijele su nam duboko poznavanje tržišta, razumijevanje potreba klijenata i povjerenje koje gradimo dugoročnim i odgovornim pristupom.",
    danas: "Danas je Eurobroker savremena investiciona kompanija koja investitorima i kompanijama otvara nove mogućnosti na tržištu kapitala. Pored brokerskih usluga, razvijamo investiciono savjetovanje, korporativne finansije i kastodi poslove, kako biste sve što vam je potrebno imali na jednom mjestu.",
    cilj: "Naš cilj je jednostavan: učiniti tržište kapitala dostupnim, razumljivijim i bližim investitorima i kompanijama, uz stručnost i lični pristup koji ostaju u osnovi našeg poslovanja.",
    mission: { label: "Naša misija", msg: "Otvaramo mogućnosti tržišta kapitala investitorima i kompanijama.", desc: "Kroz stručnu podršku, savremena rješenja i pristup domaćim i globalnim tržištima, želimo da klijentima omogućimo da donose informisane finansijske odluke i koriste tržište kapitala kao prostor za investiranje, rast i razvoj." },
    vision: { label: "Naša vizija", msg: "Eurobroker kao prvi izbor za tržište kapitala.", desc: "Investiciona kompanija koja spaja dugogodišnje iskustvo sa savremenim pristupom investiranju — prepoznatljiva po stručnosti, pouzdanosti, brzini i posvećenosti pronalaženju najboljeg rješenja za svakog klijenta." },
    promise: "Želimo da Eurobroker bude više od mjesta na kojem investirate — partner kojem se možete obratiti sa idejom, pitanjem ili izazovom i znati da ćemo zajedno pronaći najbolje rješenje.",
    vrijednosti: [
      { t: "Transparentnost", d: "Govorimo jasno i otvoreno o mogućnostima, troškovima i rizicima, kako biste mogli donositi informisane odluke." },
      { t: "Integritet", d: "Interese klijenata stavljamo na prvo mjesto i odluke donosimo odgovorno, u skladu sa profesionalnim standardima." },
      { t: "Inicijativa", d: "Razmišljamo unaprijed i brzo pretvaramo ideje u rješenja. Pratimo promjene, prepoznajemo prilike i stalno tražimo načine da unaprijedimo ono što nudimo." }
    ]
  },

  "prikupljanje-kapitala": {
    sections: [
      { t: "Emisija obveznica", link: "emisija-obveznica", p: [
        "Emisijom obveznica kompanija pozajmljuje sredstva direktno od investitora, pod unaprijed definisanim uslovima. Iznos emisije, rok dospijeća, kamatna stopa i način otplate mogu se strukturirati u skladu sa potrebama i mogućnostima emitenta.",
        "Eurobroker vam pomaže da procijenite opravdanost ovog načina finansiranja, definišete osnovne elemente emisije, pripremite potrebnu dokumentaciju i sprovedete postupak do njegove realizacije."
      ] },
      { t: "Emisija akcija", link: "emisija-akcija-i-dokapitalizacija", p: [
        "Kada kompanija želi da pribavi dodatni kapital bez povećanja zaduženosti, jedna od mogućnosti je emisija novih akcija. Na taj način sredstva se obezbjeđuju kroz vlasnički kapital i mogu se koristiti za investicije, širenje poslovanja i druge razvojne potrebe.",
        "Pomažemo vam u pripremi i sprovođenju dokapitalizacije i emisije akcija, uz podršku kroz regulatorne i operativne korake postupka."
      ] },
      { t: "Agent emisije", p: [
        "Emisija hartija od vrijednosti podrazumijeva niz formalnih, regulatornih i operativnih aktivnosti. Kao agent emisije, Eurobroker preuzima poslove povezane sa pripremom i sprovođenjem emisije i koordinira ključne aktivnosti između učesnika u postupku.",
        "Za kompaniju to znači jednog stručnog sagovornika koji prati proces i vodi računa da potrebni koraci budu pravilno i pravovremeno sprovedeni."
      ] }
    ],
    consult: {
      t: "Niste sigurni koji model odgovara vašoj kompaniji?",
      p: "Prije odluke o emisiji potrebno je sagledati finansijsku poziciju kompanije, potrebe za kapitalom i mogućnosti koje tržište pruža. Razgovarajte sa našim timom o tome šta želite postići.",
      cta: "Zakažite inicijalni razgovor"
    }
  },

  partneri: {
    what: "Preporuke su najjači kanal našeg rasta. Ovdje formalizujemo saradnju sa partnerima — bankama, računovođama, advokatima i posrednicima — uz materijale i jasan model upućivanja.",
    whoFor: ["Računovodstvene i konsultantske kuće", "Advokatske kancelarije", "Poslovni posrednici i preporučioci"]
  },

  "otvorite-racun": {
    what: "Otvaranje računa je prvi korak do trgovanja. U Fazi 1 postupak je kombinovan (obrazac + potpis), sa ciljem od najviše dva radna dana.",
    steps: [
      { t: "Pošaljite zahtjev", d: "Popunite kratak obrazac; javljamo se u jednom radnom danu." },
      { t: "Dostavite dokumentaciju", d: "Dobijate tačnu listu dokumenata unaprijed." },
      { t: "Aktivacija računa", d: "Potpisujete ugovor; račun je spreman za nalog." }
    ]
  },

  "investiranje-iz-dijaspore": {
    what: "Iz inostranstva možete ulagati preko Eurobrokera kao domaćeg licenciranog društva — globalne akcije i ETF-ove, obveznice Republike Srpske ili domaću berzu — uz jasnu dokumentaciju i razgovor za otvaranje računa na daljinu.",
    whoFor: ["Članovi dijaspore i povratnici", "Nerezidenti sa vezama u Republici Srpskoj", "Oni koji žele domaćeg, odgovornog sagovornika"],
    problem: "Iz inostranstva postupak djeluje nedostupno: koja dokumentacija, kako se potpisuje, kako stoje porezi. Razlažemo ga korak po korak i što je moguće više obavljamo na daljinu.",
    steps: [
      { t: "Pošaljite upit", d: "Javljamo se u jednom radnom danu sa tačnom listom dokumenata." },
      { t: "Dokumentacija", d: "Identifikacija i obrasci; koliko je moguće — na daljinu." },
      { t: "Račun i prvi nalog", d: "Kada je račun aktivan, prvi nalog dajete uz podršku brokera." }
    ],
    roles: { eurobroker: "Vodi otvaranje računa, posreduje i izvještava.", klijent: "Dostavlja dokumente i donosi odluku.", treci: "Berza, registar i inostrani izvršni partner gdje je relevantno." },
    risks: ["Valutni rizik pri ulaganju u stranoj valuti.", "Poreske obaveze zavise od vašeg prebivališta — dajemo opšte informacije, ne poreski savjet.", "Tržišni rizik izabranih instrumenata."]
  },

  dokumenti: {
    what: "Na jednom mjestu: pravila poslovanja, opšti uslovi, obrasci, informacije za klijente, upozorenje o rizicima, postupak po prigovorima, zaštita podataka i sukob interesa. Svaki dokument ima verziju i datum.",
    lista: [
      "Pravila poslovanja i opšti uslovi",
      "Obrasci za preuzimanje (nalog, ugovor, punomoć)",
      "Informacije za klijente",
      "Upozorenje o rizicima",
      "Postupak po prigovorima",
      "Zaštita ličnih podataka",
      "Politika sukoba interesa"
    ]
  }
};
