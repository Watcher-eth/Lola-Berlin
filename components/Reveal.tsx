import { ReactNode } from "react";
import { HTMLMotionProps, motion } from "motion/react";

type RevealProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  ...props
}: RevealProps) {
  return (
    <motion.div
      {...props}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{paddingTop: "3rem",
        paddingBottom: "3rem"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
