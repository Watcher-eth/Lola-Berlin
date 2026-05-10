import Image from "next/image";
import { motion } from "motion/react";
import { SiteHeader } from "@/components/SiteHeader";

type HeroWord = {
  text: string;
  className: string;
};

type SubpageHeroProps = {
  imageSrc: string;
  imageAlt: string;
  words: HeroWord[];
  blurb: string;
};

export function SubpageHero({
  imageSrc,
  imageAlt,
  words,
  blurb,
}: SubpageHeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(0,0,0,0.28))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,73,45,0.16),transparent_35%)]" />

      <SiteHeader />

      {words.map((word, index) => (
        <motion.span
          key={word.text}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.18 + index * 0.08,
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`absolute font-serif leading-none text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)] ${word.className}`}
        >
          {word.text}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-24 left-6 z-10 max-w-md text-white md:left-10 md:max-w-lg"
      >
        <p className="text-lg leading-7 text-white md:text-2xl md:leading-9">
          {blurb}
        </p>
      </motion.div>
    </section>
  );
}
