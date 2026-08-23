import Script from "next/script";

/**
 * Google Tag Manager (brief 8.4, LÅST).
 *
 * Container-ID-en videreføres uendret fra dagens nettsted. Ikke opprett ny
 * container: over 100 historiske Google Ads-konverteringer henger på
 * oppsettet som ligger i denne, og budgivningsgrunnlaget kan ikke gjenskapes.
 *
 * ID-en står i klartekst her fordi den allerede er offentlig i sidekildekoden
 * på reflektor.no. Alle andre nøkler hører hjemme i Vercel-miljøvariabler.
 */
export const GTM_ID = "GTM-N4KGSS93";

export function Sporing() {
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function GtmNoscript() {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
