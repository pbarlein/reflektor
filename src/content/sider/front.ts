import { tekst, type Side } from "./_slot.ts";

/**
 * Forsiden.
 *
 * Strukturen er bestemt av evidens, ikke av briefens kapittel 3.0.1 — som er
 * satt til side. Rekkefølgen er den alle tre researchsporene fant uavhengig
 * av hverandre: tilbudet over folden, arbeidet umiddelbart, så prosess, pris,
 * bevis, innvendinger, kontakt.
 *
 * Begrunnelse for at arbeidet kommer så tidlig: Reflektor er et videobyrå.
 * Å vise produktet er både bevis og arbeidsprøve i samme element, og det er
 * billigere enn å beskrive det.
 *
 * NN/g eyetracking: 57 % av visningstiden ligger over folden, og over 65 % av
 * den tiden i øvre halvdel. Posisjoneringen må stå der — beviset kan ligge
 * lenger nede.
 */
export const front: Side = {
  sti: "/",
  spørsmål: "Kan noen andre overta sosiale medier for oss?",
  søkeord: ["merkevaresøk — ingen kommersielle ord i H1 eller title"],
  ready: true,
  seksjoner: [
    {
      nr: 0,
      navn: "Metadata",
      jobb: "Avgjør om noen klikker i søkeresultatet.",
      slots: {
        /*
         * BYTTET 04.10.2026, bestilt av Pål. Her sto «Sosiale medier
         * nesten på autopilot. Fast pris, ingen binding».
         *
         * Tittelen solgte løftet, men inneholdt ikke ordet folk søker på.
         * «some byrå» har 100 søk i måneden i Norge og «sosiale medier
         * byrå» 50, begge med lav konkurranse, og ingen av dem sto i en
         * tittel noe sted på nettstedet. Løftet står fortsatt, nå bak
         * ordet som gjør at noen finner det.
         *
         * DE TO ORDENE EIES AV FORSIDEN ALENE. Ingen andre sider skal ha
         * «SoMe-byrå» eller «sosiale medier byrå» i tittel eller
         * overskrift — /reels-produksjon lenker hit med ordet som
         * ankertekst i stedet. Se søkeordkartet i docs/sidearkitektur.md.
         */
        "front.meta.title": tekst(
          "SoMe-byrå i Oslo – sosiale medier nesten på autopilot",
          { maksTegn: 60 },
        ),
        "front.meta.description": tekst(
          "Reflektor filmer hos dere én dag i måneden og publiserer 8–10 videoer på Instagram og Facebook. 30 000 kr/mnd. Tre måneders oppsigelse, ingen binding.",
          {
            maksTegn: 155,
            jobb: "Prisen bør stå. AEO vekter pristransparens tungt.",
          },
        ),
      },
    },
    {
      nr: 1,
      navn: "Hero",
      jobb: "Tilbudet, arbeidsmengden og beviset i øvre halvdel av første skjerm.",
      slots: {
        // Godkjent 23.08. Kursiveringen av «nesten» er poenget: løftet og
        // forbeholdet i samme setning.
        "front.hero.h1": tekst("Sosiale medier – nesten på autopilot.", {
          maksOrd: 8,
        }),
        /*
         * FORMULERT AV PÅL 16.09.2026. Copy-protokollen er fulgt: setningen
         * er hans, ikke min.
         *
         * Den løser kadens-tvetydigheten bedre enn mitt eget forsøk gjorde.
         * Opprinnelig sto «8–10 videoer på Instagram og Facebook, to ganger
         * i uken», der «to ganger i uken» kom ETTER plattformene og kunne
         * feste seg til dem — altså fire poster. Jeg satte inn punktum, som
         * gjorde feillesningen grammatisk umulig, men lot tallet stå etter
         * plattformene. Påls versjon flytter det foran: «Publisering 2
         * ganger per uke til Instagram og Facebook». Da er kadensen knyttet
         * til publiseringen, og plattformene er adressen den går til.
         *
         * Det stemmer med leveransen: posterPerUke er 2, til Instagram med
         * krysspublisering til Facebook. 2 x 52 = 104 i året = 8,7 i
         * måneden, midt i «8–10 videoer». Ordlyden ligger nær
         * tilbud.inngar[3], som sier det samme på prisseksjonen.
         *
         * ÉN MEKANISK ENDRING FRA PÅLS ORDLYD: «og publisering» er strøket
         * fra oppramsingen foran. Rett inn ble setningen 191 av 180 tegn,
         * og ordet sto nå to ganger i samme avsnitt. Uten det: 178.
         */
        /*
         * ÉN SETNING LAGT FORAN 04.10.2026, bestilt av Pål og ordrett hans:
         * «Reflektor er et SoMe-byrå i Oslo som filmer hos dere og
         * publiserer for dere.»
         *
         * DEN STÅR FØRST, ikke sist. Hovedsøkeordet skal stå i tittelen og
         * i første setning under H1 — står det til slutt i et avsnitt, er
         * det ikke lenger første setning, og en språkmodell som siterer de
         * første linjene får ikke med hva Reflektor er.
         *
         * GRENSEN ER HEVET FRA 180 TIL 260 TEGN. Det er to linjer mer på en
         * telefon, og det er prisen for å ha ordet over folden. Påls egen
         * setning fra 16.09.2026 står ellers uendret — se begrunnelsen
         * under for hvorfor rekkefølgen i den er som den er.
         */
        "front.hero.sub": tekst(
          "Reflektor er et SoMe-byrå i Oslo som filmer hos dere og publiserer for dere. Én produksjonsdag hos dere i måneden. Reflektor gjør resten: idé, opptak og klipp. 8–10 videoer. Publisering 2 ganger per uke til Instagram og Facebook. Fast pris, ingen binding.",
          {
            maksTegn: 260,
            jobb: "Arbeidsmengden for kunden. Den er innvendingen, ikke prisen.",
          },
        ),
        "front.hero.cta": tekst("Få et strategiforslag", { maksTegn: 24 }),
        "front.hero.proof": tekst(
          "Produserer foto og video for Anton Sport, The Well, Peppes Pizza, Egon og Baker Brun.",
          {
            maksTegn: 100,
            jobb: "Navngitt bevis over folden. Kun bekreftede produksjonskunder.",
          },
        ),
      },
    },
    {
      nr: 2,
      navn: "Arbeidet",
      jobb: "Vis produktet. Reel-vegg i 9:16, ikke bakgrunnsvideo.",
      slots: {
        "front.work.eyebrow": tekst("Arbeidet", { maksTegn: 30 }),
        "front.work.h2": tekst("Slik ser det ut når vi filmer hos andre", {
          maksTegn: 60,
        }),
        "front.work.sub": tekst(
          "Fire klipp fra produksjonsdager hos Anton Sport, The Well og Soulcake. Samme folk og samme tempo som i abonnementet.",
          {
            maksTegn: 120,
            jobb: "Slå fast at alt er egenprodusert. Ingen stock.",
          },
        ),
        // Klippene er IKKE slots. De ligger i src/content/reels.ts med
        // kunde og bransje — se begrunnelsen for utvalget der.
      },
    },
    {
      nr: 3,
      navn: "Slik fungerer det",
      jobb: "Gjør modellen synlig. Innvendingen løses ved å vise, ikke love.",
      slots: {
        "front.how.eyebrow": tekst("Slik jobber vi", { maksTegn: 30 }),
        "front.how.h2": tekst(
          "Dere setter av én dag. Resten av måneden er vår jobb.",
          { maksTegn: 70 },
        ),
        /*
         * KORTET NED 02.10.2026, bestilt av Pål: «Gjør hele "slik jobber
         * vi"-seksjonen mye lavere. finn en smart måte å komprimere og
         * forkorte betydelig.»
         *
         * De tre forklaringene var 134, 134 og 148 tegn og brakk over tre
         * linjer hver på en telefon. Nå er de 97, 110 og 112, og tittelen
         * står på samme linje som teksten i stedet for over den — til
         * sammen rundt 190 px kortere seksjon på mobil.
         *
         * HVA SOM FAKTISK ER STRØKET, og hvor det står igjen:
         *
         * - «sesong, tilbud, folk og produkter» (steg 1). Oppramsingen
         *   forklarte «hva måneden skal handle om» med eksempler. Setningen
         *   står uten dem.
         * - «til 8–10 videoer» (steg 2). Tallet står i priskortet, i punkt
         *   3 under «Dette inngår», i heroen og i JSON-LD-en. Det var det
         *   mest gjentatte tallet på hele forsiden.
         * - «på Instagram og videre til Facebook» (steg 3). Begge kanalene
         *   står i «Dette inngår» rett under, i heroen og i markeringen.
         *
         * Ingen av dem forsvinner altså fra siden — de slutter bare å stå
         * tre ganger.
         */
        "front.how.steps[0]": tekst(
          "Vi planlegger | Før opptak avtaler vi hva måneden skal handle om. Dere trenger ikke levere manus eller ideer.",
          {
            maksTegn: 180,
            jobb: "Tittel og forklaring, skilt med |.",
          },
        ),
        "front.how.steps[1]": tekst(
          "Vi filmer én dag | Vi kommer til dere og filmer alt på én dag. Folk gjør jobben sin som vanlig – vi finner videoene i det.",
          {
            maksTegn: 180,
            jobb: "Tittel og forklaring, skilt med |.",
          },
        ),
        "front.how.steps[2]": tekst(
          "Vi klipper og publiserer | Ferdige klipp går ut to ganger i uken. Neste produksjonsdag står allerede i kalenderen.",
          {
            maksTegn: 180,
            jobb: "Tittel og forklaring, skilt med |.",
          },
        ),
      },
    },
    {
      nr: 4,
      navn: "Pris",
      jobb: "Åpen pris. Selvkvalifisering, og AEO vekter det tungt.",
      slots: {
        "front.price.eyebrow": tekst("Pris", { maksTegn: 30 }),
        "front.price.h2": tekst("Én pris. Alt inkludert. Ingen binding.", {
          maksTegn: 60,
        }),
        /*
         * KUTTET 19.09.2026: «– fri bruk i annonser, på nettsider og
         * skjermer». Enumerasjonen var innholdet i tilbud.inngar[5] en gang
         * til, i samme kort, omtrent 150 px lenger opp — og der står den
         * mer komplett (den har «presentasjoner» med). Eierskapspåstanden
         * «Alt innhold er deres» er beholdt: den sier noe inngar[5] ikke
         * sier, siden bruksrett og eierskap ikke er det samme.
         */
        "front.price.note": tekst(
          "Tre måneders oppsigelse, ingen bindingstid, ingen timepriser. Alt innhold er deres. Fungerer det ikke, sier dere opp. Så enkelt er det.",
          {
            maksTegn: 220,
            jobb: "Hva som gjør fastprisen mulig. Innvendingen bak innvendingen.",
          },
        ),
      },
    },
    {
      nr: 5,
      navn: "Anmeldelser",
      jobb: "Navngitt sosialt bevis. Den best støttede formen som finnes.",
      slots: {
        "front.reviews.eyebrow": tekst("Det kundene sier", { maksTegn: 30 }),
        // Byttet 01.10.2026: omtalevideoen fra Soulcake står nå øverst i
        // seksjonen, og overskriften skal dekke både den og anmeldelsene.
        // «Google-anmeldelser fra dem som har hatt oss på besøk» sto her før.
        "front.reviews.h2": tekst(
          "Fem år senere vil de helst ha oss for seg selv",
          { maksTegn: 70 },
        ),
        // Selve anmeldelsene er IKKE slots. De er fakta hentet fra Google og
        // ligger i src/content/anmeldelser.ts — ingen skal skrive dem om.
        // Her står bare rammen rundt dem.
      },
    },
    {
      nr: 6,
      navn: "FAQ",
      jobb: "Innvendingshåndtering. Lengde er ikke variabelen — dekning er.",
      slots: {
        "front.faq.qa[0]": tekst(
          "Hva om det ikke fungerer for oss? | Da sier dere opp. Avtalen har tre måneders oppsigelse og ingen bindingstid – ingen minimumsperiode, ingen gebyr. Det betyr at vi må levere hver eneste måned for å beholde dere. Det er sånn vi vil ha det.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
        "front.faq.qa[1]": tekst(
          "Hva må vi gjøre selv? | Sette av én dag i måneden og være dere selv mens vi filmer. Utover det: en rask godkjenning før publisering. Vi står for idé, planlegging, opptak, klipp, tekst og publisering. Dere trenger ikke levere manus, bilder eller tid utover produksjonsdagen.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
        "front.faq.qa[2]": tekst(
          "Hva koster markedsføring på Instagram hos Reflektor? | 30 000 kr/mnd. Det dekker strategi, én produksjonsdag, 8–10 ferdige videoer og publisering to ganger i uken på Instagram, med krysspublisering til Facebook. Vi holder oss til de to kanalene fordi to gjort ordentlig slår fire halvveis. Prisen er lik hver måned. Hva som ikke inngår, står under prisen.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
        "front.faq.qa[3]": tekst(
          "Vi har ikke så mye å vise fram. Går det likevel? | Ja. Det er produksjonsdagen som løser det. Folk som jobber, produkter som lages, kunder som kommer inn – det holder til langt mer enn 8–10 videoer. Alt filmes hos dere, med deres folk. Ingen stockmateriale, ingen maler. De fleste har mer å vise enn de tror.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
        "front.faq.qa[4]": tekst(
          "Hva er Reflektor? | Reflektor er et sosiale medier-byrå og produksjonshus i Oslo som planlegger, filmer, klipper og publiserer video for bedrifter i hele Norge, til fast månedspris. Vi har produsert foto og video for blant andre Anton Sport, The Well, Peppes Pizza og Egon. Abonnementet er kjernen: én produksjonsdag i måneden, 8–10 videoer, publisert to ganger i uken.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
        "front.faq.qa[5]": tekst(
          "Hvor fort kommer vi i gang? | Fyll ut skjemaet. Innen tre virkedager får dere et forslag til hvordan en måned med Reflektor kan se ut hos dere. Sier dere ja, setter vi første produksjonsdag i kalenderen.",
          {
            maksTegn: 500,
            jobb: "Spørsmål | svar.",
          },
        ),
      },
    },
    {
      nr: 7,
      navn: "Kontakt",
      jobb: "Skjemaet. Eneste inbound-strøm siden jobber for.",
      slots: {
        "front.contact.h2": tekst("Se hva vi ville filmet hos dere", {
          maksTegn: 60,
        }),
        /*
         * INGRESSEN ER FJERNET 19.09.2026, ikke omskrevet.
         *
         * Den sa tre ting. Jeg sjekket hvert av dem mot resten av siden:
         *
         *   forslagsløftet   → knappen heter «Få et strategiforslag», og
         *                      rett under den står «Uforpliktende — du får
         *                      et konkret forslag, ikke en generisk
         *                      presentasjon». Begge nærmere handlingen.
         *   Oslo             → NAP-en står 40 px under, med gateadresse.
         *   hele Norge       → FAQ-svaret «Hva er Reflektor?» på samme
         *                      side, og `areaServed: "NO"` i både
         *                      Organization- og Service-schema.
         *
         * Ingenting gikk altså tapt, verken for leseren eller for SEO og
         * AEO. Det som sto igjen var tre linjer som utsatte skjemaet.
         *
         * Skal det stå noe her igjen, må copyen bestilles — jeg skriver
         * den ikke selv. Slotten er borte, ikke satt til TBD, fordi en TBD
         * ville meldt siden som ufullstendig for noe som er et bevisst
         * kutt.
         */
      },
    },
  ],
};
