import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SiteHeader } from "@/components/SiteHeader";

const words = [
  {
    text: "Zuhause",
    className:
      "left-[4%] top-[12%] text-[12vw] italic md:text-[10vw] lg:text-[8vw]",
  },
  {
    text: "sein",
    className:
      "left-[38%] top-[32%] text-[10vw] md:text-[8vw] lg:text-[6vw]",
  },
  {
    text: "mitten",
    className:
      "right-[6%] top-[28%] text-[10vw] md:text-[8vw] lg:text-[6vw]",
  },
  {
    text: "in",
    className:
      "left-[20%] top-[52%] text-[10vw] md:text-[8vw] lg:text-[6vw]",
  },
  {
    text: "Berlin",
    className:
      "left-[48%] bottom-[10%] text-[10vw] md:text-[8vw] lg:text-[6vw]",
  },
];

export function SplashSection() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const berlinTime = now.toLocaleTimeString("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
      });

      setTime(berlinTime);
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(0,0,0,0.28))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(75,73,45,0.16),transparent_35%)]" />

      <SiteHeader />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-6 top-[30%] z-10 md:hidden"
      >
        <div className="space-y-1 text-white">
          <p className="font-serif text-[18vw] italic leading-[0.88] tracking-[-0.06em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
            Zuhause
          </p>
          <p className="pl-[12vw] font-serif text-[15vw] leading-[0.88] tracking-[-0.06em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
            sein
          </p>
          <p className="font-serif text-[14vw] leading-[0.88] tracking-[-0.06em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
            mitten in
          </p>
          <p className="pl-[20vw] font-serif text-[16vw] leading-[0.88] tracking-[-0.06em] drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)]">
            Berlin
          </p>
        </div>
      </motion.div>

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
          className={`absolute hidden font-serif leading-none text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.28)] md:block ${word.className}`}
        >
          {word.text}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-28 left-6 right-6 z-10 max-w-sm text-white md:bottom-24 md:right-auto md:left-10 md:max-w-lg"
      >
        <p className="text-base leading-6 text-white sm:text-lg sm:leading-7 md:text-2xl md:leading-9">
          Lola vereint zeitgemäße Wohnungen, ruhige Höfe und eine Berliner
          Adresse mit Charakter.
        </p>
      </motion.div>

      <footer className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8 lg:p-10">
        <div className="font-mono text-[10px] tracking-[0.12em] text-white drop-shadow-md md:text-xs">
          <p>Güntzelkiez, Berlin</p>
          <p>{time} (CEST)</p>
        </div>

        <p className="max-w-[320px] font-mono text-[10px] leading-relaxed tracking-[0.12em] text-white drop-shadow-md md:text-right md:text-xs">
          Jedes Zuhause, das wir schaffen, erzählt eine Geschichte, in der
          jeder Raum und jeder Winkel vom Leben erzählt, das hier beginnt.
        </p>
      </footer>
    </section>
  );
}
