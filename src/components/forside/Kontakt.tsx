import Image from "next/image";

import { Container } from "@/components/Container";
import { Kontaktskjema } from "@/components/Kontaktskjema";
import { TbdMarkor, hentTekst } from "@/components/Slot";
import { front } from "@/content/sider/front";
import { site } from "@/content/site";

/**
 * Kontaktseksjonen med skjemaet.
 *
 * Utskilt fra page.tsx 16.09.2026. Begrunnelsene for alt i denne seksjonen
 * står i kommentarene under — de fulgte med flyttingen og er ikke endret.
 */
export function Kontakt() {
  return (
    <>
      {/* 7 · KONTAKT */}
      {/*
      7 · KONTAKT

      DØDPLASSEN VAR PROBLEMET. Venstrespalten hadde overskrift, ingress og
      NAP — rundt 300 px — mot et skjema på nesten 700. Resten var tom
      brun flate, og den tomheten leste ikke som ro. Den leste som at vi
      gikk tom for ting å si akkurat der kunden skal bestemme seg.

      To klipp fyller den nå, og de fyller den NØYAKTIG: raden har
      `flex-1`, så den tar det skjemaet ikke bruker. Blir skjemaet
      høyere eller overskriften lengre, justerer klippene seg. Det kan
      ikke oppstå nytt tomrom.

      HVORFOR VIDEO OG IKKE MER TEKST: kolonnen svarer på «hvem er dette»,
      og dette er et selskap som lager film. Å bevise det med to filmer er
      mer direkte enn å skrive en setning til. Skjemaet står urørt på egen
      lys flate til høyre — argumentet og handlingen er fortsatt adskilt.

      JEG VURDERTE Å PAUSE KLIPPENE NÅR SKJEMAET FÅR FOKUS, for bevegelse
      ved siden av et skjema kan trekke blikket. Droppet: det finnes ingen
      måling som sier at det hjelper, det binder to komponenter sammen i
      delt tilstand, og to frosne bilder ved siden av et halvutfylt skjema
      har sin egen feilmodus. På mobil stables alt uansett, så klippene er
      over skjemaet og ute av syne mens man skriver.

      INGEN BILDETEKSTER. Klippene er fra Premium PT og Bjørvika, og
      ingen av dem står på den bekreftede kundelisten som brukes ellers
      på siden. Samme regel som i arbeidsrutenettet: et navn på siden
      skal komme fra en kilde, ikke fra at filene lå i samme mappe.
    */}
      <section id="kontakt" className="pb-24">
        <Container>
          <div className="rounded-flate bg-dyp px-8 py-14 text-pa-dyp sm:px-14">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-20">
              <div className="flex flex-col">
                <h2 className="text-3xl sm:text-4xl">
                  {hentTekst(front, "front.contact.h2") ?? (
                    <TbdMarkor id="front.contact.h2" />
                  )}
                </h2>
                <p className="mt-4 max-w-sm text-pa-dyp-dempet">
                  {hentTekst(front, "front.contact.sub") ?? (
                    <TbdMarkor id="front.contact.sub" />
                  )}
                </p>

                <div className="mt-10 text-sm text-pa-dyp-dempet">
                  <p className="font-medium text-pa-dyp">
                    {site.kontakt.firma}
                  </p>
                  <p className="mt-1">{site.kontakt.adresse}</p>
                  <p className="mt-3">
                    <a
                      href={`mailto:${site.kontakt.epost}`}
                      className="hover:text-pa-dyp"
                    >
                      {site.kontakt.epost}
                    </a>
                  </p>
                </div>

                {/*
                ETT BILDE, IKKE TO KLIPP.

                Her sto to stående klipp side om side. De fylte plassen
                fint, men de var det femte og sjette bevegelige elementet
                på siden — etter heroklippet, reel-veggen,
                arbeidsrutenettet, prisklippet og arbeidsveggen. Et
                stillbilde akkurat her er et REGISTERSKIFTE, og det er
                poenget: det er her man bestemmer seg, og en pause er
                bedre enn mer bevegelse.

                Det fjerner også den ene innvendingen jeg noterte da
                klippene kom inn — bevegelse ved siden av et skjema kan
                trekke blikket. Nå finnes ikke problemet.

                HVORFOR AKKURAT DETTE BILDET: overskriften spør «se hva vi
                ville filmet hos dere». Bildet svarer på hvem som dukker
                opp — stativ på ryggen, kamera i hånda, koffert etter seg.
                Det er hele leveransen i ett bilde.

                De to montasjevideoene som også lå ved er ikke brukt. De
                er 2,4:1, bygget for å være brede, og i denne rammen
                (429x315) overlever bare to av fire paneler. Skulle de
                brukes, måtte de hatt full kortbredde — og da oppstår
                tomrommet i venstrespalten på nytt.

                UTSNITTET ER VALGT, IKKE STANDARD. `object-position` på
                12 % fra toppen: senter kutter hodet, topp gir for mye
                tak. Bildet finnes i to formater i Dropbox; 1:1 er valgt
                fordi 16:9-varianten allerede er beskåret så hodet er ute.

                `flex-1` + `min-h-0` er det som gjør at rammen tar
                NØYAKTIG resten av spalten. Uten `min-h-0` nekter en
                flex-item å krympe under sitt eget innhold.
              */}
                <figure className="relative mt-8 aspect-[4/3] overflow-hidden rounded-medie bg-flate-dempet lg:mt-10 lg:aspect-auto lg:min-h-0 lg:flex-1">
                  <Image
                    src="/arbeid/pa-vei.jpg"
                    alt="Fotograf på vei inn til opptak med stativ, kamera og utstyrskoffert"
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-[center_12%]"
                  />
                </figure>
              </div>

              {/* Skjemaet på lys flate — kontrast mot den mørke blokken, og
                feltene leser som felt. Selve skjemaet er urørt: det er
                bygget på det som faktisk er dokumentert om skjemadesign,
                og står beskrevet i Kontaktskjema.tsx. */}
              <div className="rounded-flate bg-flate p-6 text-blekk sm:p-8">
                <Kontaktskjema side="/" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
