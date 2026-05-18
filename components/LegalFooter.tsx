import Link from "next/link";

const legalLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/cookies", label: "Cookies" },
  { href: "/sonstiges", label: "Haftungsausschluss" },
];

export function LegalFooter() {
  return (
    <footer className="border-t border-[var(--accent)]/14 bg-[#f7f3ea] px-6 py-8 text-[var(--accent)] sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]/68">
          LOLA Berlin-Wilmersdorf
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/72 transition-colors hover:text-[var(--accent)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
