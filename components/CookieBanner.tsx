import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_STORAGE_KEY = "lola_cookie_consent";

type ConsentValue = "accepted" | "necessary";

function getStoredConsent() {
  const cookieConsent = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${CONSENT_STORAGE_KEY}=`));

  if (cookieConsent) {
    return cookieConsent.split("=")[1];
  }

  return window.localStorage.getItem(CONSENT_STORAGE_KEY);
}

function storeConsent(value: ConsentValue) {
  const maxAge = 60 * 60 * 24 * 180;

  try {
    document.cookie = `${CONSENT_STORAGE_KEY}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  } catch {
    // Some locked-down browser contexts disallow cookies.
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Some locked-down browser contexts disallow localStorage.
  }
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setIsVisible(!getStoredConsent());
      } catch {
        setIsVisible(true);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  function saveConsent(value: ConsentValue) {
    try {
      storeConsent(value);
    } catch {
      // If storage is unavailable, closing the banner is still the least noisy path.
    }

    setIsVisible(false);
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-label="Cookie-Hinweis"
      className="fixed inset-x-0 bottom-0 z-[140] border-t border-[#3f422d]/18 bg-[#f7f3ea] px-5 py-5 text-[#171713] shadow-[0_-18px_50px_rgba(23,23,19,0.16)] sm:px-8 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8a4432]">
            Datenschutz
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-none tracking-[-0.035em] text-[#3f422d] sm:text-3xl">
            Cookie-Einstellungen
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#171713]/72 sm:text-base sm:leading-7">
            Wir verwenden technisch notwendige Funktionen, damit diese Website
            sicher und zuverlässig angezeigt wird. Analyse- oder
            Marketing-Cookies setzen wir nur ein, wenn Sie zustimmen.
          </p>
          <Link
            href="/cookies"
            className="mt-3 inline-flex font-mono text-[10px] uppercase tracking-[0.2em] text-[#3f422d] underline underline-offset-4"
          >
            Cookie-Hinweise ansehen
          </Link>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <button
            type="button"
            onClick={() => saveConsent("necessary")}
            className="border border-[#3f422d]/30 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#3f422d] transition-colors hover:bg-white sm:min-w-44"
          >
            Nur notwendige
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="bg-[#3f422d] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-black sm:min-w-44"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </section>
  );
}
