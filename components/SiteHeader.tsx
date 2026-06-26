import Link from "next/link";

const quickLinks = [
  { href: "/apartments", label: "Wohnungen" },
  { href: "/kiez", label: "Kiez" },
  { href: "/haus", label: "Über Lola" },
  { href: "/apartments#kontakt", label: "Kontakt" },
];

type SiteHeaderProps = {
  theme?: "overlay" | "paper";
};

export function SiteHeader({ theme = "overlay" }: SiteHeaderProps) {
  const isOverlay = theme === "overlay";

  return (
    <header className="absolute left-0 right-0 top-0 z-10 flex flex-col gap-5 p-6 md:p-8 lg:flex-row lg:items-start lg:justify-between lg:p-10">
      <Link
        href="/"
        className={`font-[family-name:var(--font-ultrabold)] text-2xl uppercase tracking-[0.14em] md:text-[2.2rem] ${
          isOverlay ? "!text-white" : "text-[var(--accent)]"
        }`}
        style={isOverlay ? { color: "#ffffff" } : undefined}
      >
        Lola
      </Link>

      <div className="flex flex-wrap gap-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative overflow-hidden px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-[border-color,color,background-color] duration-500 md:px-4 md:text-xs ${
              isOverlay
                ? "border border-white/75 bg-white/[0.08] text-[#111111] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-[6px] backdrop-saturate-150 hover:border-white/90 hover:bg-white/20"
                : "border border-[var(--accent)]/24 bg-white/40 text-[var(--accent)] hover:border-transparent"
            }`}
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-white/35 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
            <span
              className={`relative z-10 transition-colors duration-500 ${
                isOverlay
                  ? "group-hover:text-[#111111]"
                  : "group-hover:text-[var(--accent)]"
              }`}
            >
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </header>
  );
}
