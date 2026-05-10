import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { apartmentRenderGallery } from "@/data/apartments";

function RowReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function ApartmentRenderGallery() {
  const [livingroom, kitchen, bathroom, bedroom] = apartmentRenderGallery;

  return (
    <section className="border-t border-[var(--accent)]/14 bg-white px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
            Räume
          </p>
          <h2 className="mt-4 font-serif text-3xl leading-none tracking-[-0.05em] text-balance text-[var(--accent)] sm:text-5xl lg:text-[4rem]">
            Wohnräume mit festen Einbauten und offener Möblierbarkeit.
          </h2>
        </div>

        <div className="mt-14 space-y-20 lg:space-y-24">
          <RowReveal>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)] lg:items-center">
              <div className="relative aspect-[1.34/1] overflow-hidden bg-[#f2eee5]">
                <Image
                  src={livingroom.imageSrc}
                  alt={livingroom.title}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:px-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  {livingroom.subtitle}
                </p>
                <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-4xl">
                  {livingroom.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
                  {livingroom.description}
                </p>
              </div>
            </div>
          </RowReveal>

          <RowReveal delay={0.08}>
            <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.84fr)_minmax(0,1.16fr)] lg:items-center">
              <div className="order-2 lg:order-1 lg:pr-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  {kitchen.subtitle}
                </p>
                <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-4xl">
                  {kitchen.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
                  {kitchen.description}
                </p>
              </div>
              <div className="order-1 relative aspect-[1.28/1] overflow-hidden bg-[#f2eee5] lg:order-2">
                <Image
                  src={kitchen.imageSrc}
                  alt={kitchen.title}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </RowReveal>

          <RowReveal delay={0.14}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)] lg:items-center">
              <div className="relative aspect-[1.28/1] overflow-hidden bg-[#f2eee5]">
                <Image
                  src={bathroom.imageSrc}
                  alt={bathroom.title}
                  fill
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="lg:px-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  {bathroom.subtitle}
                </p>
                <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-4xl">
                  {bathroom.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
                  {bathroom.description}
                </p>
              </div>
            </div>
          </RowReveal>

          <RowReveal delay={0.2}>
            <div className="grid gap-8 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-center">
              <div className="order-2 lg:order-1 lg:pr-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  {bedroom.subtitle}
                </p>
                <h3 className="mt-4 font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-4xl">
                  {bedroom.title}
                </h3>
                <p className="mt-5 text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
                  {bedroom.description}
                </p>
              </div>
              <div className="order-1 relative aspect-[1.25/1] overflow-hidden bg-[#f2eee5] lg:order-2">
                <Image
                  src={bedroom.imageSrc}
                  alt={bedroom.title}
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </RowReveal>
        </div>
      </div>
    </section>
  );
}
