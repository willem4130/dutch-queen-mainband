import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/lib/site-config";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";

// Privacy statement. Identical file on Full Band, Unplugged and MJ Unplugged.
// The analytics section renders only when this site actually runs analytics
// (same env check as the cookie banner). Adding or changing a tracker, a
// processor or a retention period? Update this text in all three repos.
// Facts (9 Oct 2026): GA4 standard property (retention max 14 months);
// PostHog EU cloud, anonymize_ips on, session recordings kept 30 days,
// inputs masked, event data up to 7 years (plan limit).
const HAS_GA = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
const HAS_POSTHOG = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);
const HAS_ANALYTICS = HAS_GA || HAS_POSTHOG;

const UPDATED = "9 oktober 2026";
const CONTACT = "info@thedutchqueen.com";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Hoe ${siteConfig.bandName} omgaat met je gegevens.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

const linkClass =
  "text-amber-300/90 underline underline-offset-2 transition-colors hover:text-amber-200";

const Mail = () => (
  <a href={`mailto:${CONTACT}`} className={linkClass}>
    {CONTACT}
  </a>
);

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 text-[15px] leading-relaxed text-white/75 sm:pt-32">
      <Link
        href="/"
        className="text-sm text-white/50 transition-colors hover:text-white/80"
      >
        ← Terug naar de website
      </Link>
      <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
        Privacyverklaring
      </h1>
      <p className="mt-2 text-sm text-white/40">Laatst bijgewerkt: {UPDATED}</p>
      <p className="mt-6">
        Hier lees je welke gegevens we verwerken als je de website van{" "}
        {siteConfig.bandName} bezoekt, waarom we dat doen en wat je rechten
        zijn.
      </p>

      <Section title="Wie zijn wij?">
        <p>
          Deze website is van The Dutch Queen. Vragen over je privacy? Mail
          naar <Mail />.
        </p>
      </Section>

      <Section title="Je bezoek aan de website">
        <p>
          De website draait bij Vercel (hosting). Bij elk bezoek verwerkt Vercel
          technische gegevens, zoals je IP-adres, je type browser en het
          tijdstip. Dat is nodig om de website te tonen en te beveiligen; we
          hebben er dus een gerechtvaardigd belang bij. Deze gegevens worden
          alleen bewaard zolang dat nodig is voor beveiliging en het oplossen
          van storingen.
        </p>
      </Section>

      {HAS_ANALYTICS ? (
        <Section title="Statistieken: alleen met je toestemming">
          <p>
            Klik je in de cookiemelding op &lsquo;Accept All&rsquo;, dan meten
            we hoe bezoekers de website gebruiken, bijvoorbeeld welke
            pagina&apos;s ze bekijken. Klik je op &lsquo;Reject All&rsquo;, dan
            doen we dat niet. We gebruiken de cijfers alleen om de website te
            verbeteren en verkopen niets door.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {HAS_GA && (
              <li>
                <strong className="text-white/90">Google Analytics</strong>{" "}
                (Google Ireland Ltd.) zet de cookies <code>_ga</code> en{" "}
                <code>_ga_…</code> (maximaal 2 jaar geldig). Google verwerkt
                onder meer welke pagina&apos;s je bekijkt, je apparaat, je
                browser en je globale locatie, en bewaart de statistieken
                maximaal 14 maanden. Google kan gegevens ook in de Verenigde
                Staten verwerken.
              </li>
            )}
            {HAS_POSTHOG && (
              <li>
                <strong className="text-white/90">PostHog</strong> (servers in
                de EU) bewaart een willekeurige code in je browser en verwerkt
                welke pagina&apos;s je bekijkt en hoe je door de website klikt
                en scrolt. PostHog maakt daarbij opnames van je bezoek
                (sessie-opnames); die worden na 30 dagen verwijderd. De overige
                statistieken worden maximaal 7 jaar bewaard. Je IP-adres wordt
                niet opgeslagen.
              </li>
            )}
          </ul>
          <p>
            Je keuze onthouden we in je browser. Je kunt hem altijd veranderen
            of je toestemming intrekken:
          </p>
          <CookieSettingsButton />
          <p>
            Ben je jonger dan 16? Vraag dan eerst je ouders of je op
            &lsquo;Accept All&rsquo; mag klikken.
          </p>
        </Section>
      ) : (
        <Section title="Cookies en statistieken">
          <p>
            Deze website gebruikt geen cookies en geen statistiek- of
            advertentiediensten.
          </p>
        </Section>
      )}

      <Section title="Als je contact met ons opneemt">
        <p>
          Mail of bel je ons, bijvoorbeeld voor een boeking? Dan gebruiken we je
          naam, je contactgegevens en je bericht alleen om je te helpen. We
          bewaren ze niet langer dan daarvoor nodig is.
        </p>
      </Section>

      <Section title="Tickets en andere websites">
        <p>
          Tickets koop je bij de theaters en ticketverkopers waar we naar
          linken. Ook onze links naar sociale media gaan naar andere websites.
          Daar geldt de privacyverklaring van die partijen.
        </p>
      </Section>

      <Section title="Je rechten">
        <p>
          Je mag ons vragen welke gegevens we van je hebben, en die laten
          verbeteren of verwijderen. Je mag ook bezwaar maken tegen het gebruik
          ervan, of je toestemming intrekken. Mail daarvoor naar <Mail />; we
          reageren binnen een maand.
        </p>
        <p>
          Ben je niet tevreden over hoe we met je gegevens omgaan? Dan kun je
          een klacht indienen bij de{" "}
          <a
            href="https://autoriteitpersoonsgegevens.nl"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Autoriteit Persoonsgegevens
          </a>
          .
        </p>
      </Section>

      <Section title="Wijzigingen">
        <p>
          We kunnen deze privacyverklaring aanpassen. Bovenaan zie je wanneer
          dat voor het laatst is gebeurd.
        </p>
      </Section>
    </div>
  );
}
