"use client";

import { motion, useInView } from "framer-motion";
import { createContext, useContext, useRef } from "react";

const FadeInStaggerContext = createContext(false);

const viewport = { once: true, margin: "0px 0px -100px" };

export function FadeIn(
  props: React.ComponentPropsWithoutRef<typeof motion.div> & { delay?: number }
) {
  const isStaggered = useContext(FadeInStaggerContext);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } },
      }}
      initial={isStaggered ? undefined : "hidden"}
      whileInView={isStaggered ? undefined : "visible"}
      viewport={isStaggered ? undefined : viewport}
      transition={props.delay ? { delay: props.delay, duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } : undefined}
      {...props}
    />
  );
}

export function FadeInStagger({
  faster = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div> & { faster?: boolean }) {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: faster ? 0.1 : 0.2 },
          },
        }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  );
}
