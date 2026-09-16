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
        "front.meta.title": tekst("Sosiale medier nesten på autopilot. Fast pris, ingen binding", { maksTegn: 60 }),
        "front.meta.description": tekst("Reflektor filmer hos dere én dag i måneden og publiserer 8–10 videoer på Instagram og Facebook. 30 000 kr/mnd. Tre måneders oppsigelse, ingen binding.", {
          maksTegn: 155,
          jobb: "Prisen bør stå. AEO vekter pristransparens tungt.",
        }),
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
         * ENDRET 16.09.2026 UTENFOR COPY-PROTOKOLLEN, med Påls uttrykkelige
         * tillatelse: «du kan overstyre med min tillatelse på punktet du
         * stoppet på». Dette er det ENESTE feltet den tillatelsen gjelder.
         *
         * Her sto «8–10 videoer på Instagram og Facebook, to ganger i uken».
         * «To ganger i uken» sto etter plattformene og kunne leses som to
         * ganger på HVER, altså fire poster. Det leveres to i uken totalt:
         * `posterPerUke` er 2, til Instagram med krysspublisering til
         * Facebook. 2 x 52 = 104 i året = 8,7 i måneden, som lander midt i
         * «8–10 videoer».
         *
         * Punktumet er hele rettelsen. Med plattformene i en LUKKET setning
         * kan ikke «to nye hver uke» feste seg til dem — det kan bare telle
         * videoer. En komma-variant («…og Facebook, to nye i uken») fjerner
         * mesteparten av tvetydigheten, men ikke all.
         *
         * 177 av 180 tegn. Ingenting annet i setningen er rørt.
         */
        "front.hero.sub": tekst("Én produksjonsdag hos dere i måneden. Reflektor gjør resten: idé, opptak, klipp og publisering. 8–10 videoer på Instagram og Facebook. To nye hver uke. Fast pris, ingen binding.", {
          maksTegn: 180,
          jobb: "Arbeidsmengden for kunden. Den er innvendingen, ikke prisen.",
        }),
        "front.hero.cta": tekst("Få et strategiforslag", { maksTegn: 24 }),
        "front.hero.proof": tekst("Produserer foto og video for Anton Sport, The Well, Peppes Pizza, Egon og Baker Brun.", {
          maksTegn: 100,
          jobb: "Navngitt bevis over folden. Kun bekreftede produksjonskunder.",
        }),
      },
    },
    {
      nr: 2,
      navn: "Arbeidet",
      jobb: "Vis produktet. Reel-vegg i 9:16, ikke bakgrunnsvideo.",
      slots: {
        "front.work.eyebrow": tekst("Arbeidet", { maksTegn: 30 }),
        "front.work.h2": tekst("Slik ser det ut når vi filmer hos andre", { maksTegn: 60 }),
        "front.work.sub": tekst("Fire klipp fra produksjonsdager hos Anton Sport, The Well og Soul Cake. Samme folk og samme tempo som i abonnementet.", {
          maksTegn: 120,
          jobb: "Slå fast at alt er egenprodusert. Ingen stock.",
        }),
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
        "front.how.h2": tekst("Dere setter av én dag. Resten av måneden er vår jobb.", { maksTegn: 70 }),
        "front.how.steps[0]": tekst("Vi planlegger | Før opptak avtaler vi hva måneden skal handle om: sesong, tilbud, folk og produkter. Dere trenger ikke levere manus eller idéer.", {
          maksTegn: 180,
          jobb: "Tittel og forklaring, skilt med |.",
        }),
        "front.how.steps[1]": tekst("Vi filmer én dag | Vi kommer til dere og filmer alt til 8–10 videoer på én dag. Folk gjør jobben sin som vanlig. Vi finner videoene i det.", {
          maksTegn: 180,
          jobb: "Tittel og forklaring, skilt med |.",
        }),
        "front.how.steps[2]": tekst("Vi klipper og publiserer | Ferdige klipp går ut to ganger i uken på Instagram og videre til Facebook. Neste produksjonsdag står allerede i kalenderen.", {
          maksTegn: 180,
          jobb: "Tittel og forklaring, skilt med |.",
        }),
      },
    },
    {
      nr: 4,
      navn: "Pris",
      jobb: "Åpen pris. Selvkvalifisering, og AEO vekter det tungt.",
      slots: {
        "front.price.eyebrow": tekst("Pris", { maksTegn: 30 }),
        "front.price.h2": tekst("Én pris. Alt inkludert. Ingen binding.", { maksTegn: 60 }),
        "front.price.note": tekst("Tre måneders oppsigelse, ingen bindingstid, ingen timepriser. Alt innhold er deres – fri bruk i annonser, på nettsider og skjermer. Fungerer det ikke, sier dere opp. Så enkelt er det.", {
          maksTegn: 220,
          jobb: "Hva som gjør fastprisen mulig. Innvendingen bak innvendingen.",
        }),
      },
    },
    {
      nr: 5,
      navn: "Anmeldelser",
      jobb: "Navngitt sosialt bevis. Den best støttede formen som finnes.",
      slots: {
        "front.reviews.eyebrow": tekst("Det kundene sier", { maksTegn: 30 }),
        "front.reviews.h2": tekst("Google-anmeldelser fra dem som har hatt oss på besøk", { maksTegn: 70 }),
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
        "front.faq.qa[0]": tekst("Hva om det ikke fungerer for oss? | Da sier dere opp. Avtalen har tre måneders oppsigelse og ingen bindingstid – ingen minimumsperiode, ingen gebyr. Det betyr at vi må levere hver eneste måned for å beholde dere. Det er sånn vi vil ha det.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
        "front.faq.qa[1]": tekst("Hva må vi gjøre selv? | Sette av én dag i måneden og være dere selv mens vi filmer. Utover det: en rask godkjenning før publisering. Vi står for idé, planlegging, opptak, klipp, tekst og publisering. Dere trenger ikke levere manus, bilder eller tid utover produksjonsdagen.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
        "front.faq.qa[2]": tekst("Hva koster markedsføring på Instagram hos Reflektor? | 30 000 kr/mnd. Det dekker strategi, én produksjonsdag, 8–10 ferdige videoer og publisering to ganger i uken på Instagram, med krysspublisering til Facebook. Vi holder oss til de to kanalene fordi to gjort ordentlig slår fire halvveis. Prisen er lik hver måned. Hva som ikke inngår, står under prisen.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
        "front.faq.qa[3]": tekst("Vi har ikke så mye å vise fram. Går det likevel? | Ja. Det er produksjonsdagen som løser det. Folk som jobber, produkter som lages, kunder som kommer inn – det holder til langt mer enn 8–10 videoer. Alt filmes hos dere, med deres folk. Ingen stockmateriale, ingen maler. De fleste har mer å vise enn de tror.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
        "front.faq.qa[4]": tekst("Hva er Reflektor? | Reflektor er et sosiale medier-byrå og produksjonshus i Oslo som planlegger, filmer, klipper og publiserer video for bedrifter i hele Norge, til fast månedspris. Vi har produsert foto og video for blant andre Anton Sport, The Well, Peppes Pizza og Egon. Abonnementet er kjernen: én produksjonsdag i måneden, 8–10 videoer, publisert to ganger i uken.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
        "front.faq.qa[5]": tekst("Hvor fort kommer vi i gang? | Fyll ut skjemaet. Innen tre virkedager får dere et forslag til hvordan en måned med Reflektor kan se ut hos dere. Sier dere ja, setter vi første produksjonsdag i kalenderen.", {
          maksTegn: 500,
          jobb: "Spørsmål | svar.",
        }),
      },
    },
    {
      nr: 7,
      navn: "Kontakt",
      jobb: "Skjemaet. Eneste inbound-strøm siden jobber for.",
      slots: {
        "front.contact.h2": tekst("Se hva vi ville filmet hos dere", { maksTegn: 60 }),
        "front.contact.sub": tekst("Skriv hvem dere er og hva dere vil oppnå. Dere får et forslag tilbake til hvordan en måned med Reflektor kan se ut hos dere. Vi holder til i Oslo og jobber i hele Norge. Dere bestemmer etterpå.", { maksTegn: 200 }),
      },
    },
  ],
};
