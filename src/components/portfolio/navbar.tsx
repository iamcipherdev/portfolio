"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { navItems, site } from "@/lib/site";
import { Magnetic } from "./magnetic";
import { EASE } from "./reveal";

function AvailabilityDot() {
  return (
    <span className="relative inline-flex h-[7px] w-[7px]">
      <span className="soft-ping relative inline-flex h-full w-full rounded-full bg-[#4D6BFF]" />
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.4,
  });

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 40);
    /* invert chrome while overlapping dark sections */
    const darks = document.querySelectorAll("[data-dark]");
    let dark = false;
    darks.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top <= 40 && r.bottom >= 40) dark = true;
    });
    setOverDark(dark);
  });

  /* Active section tracking */
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-38% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  /* Lock body scroll when the mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape closes menu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* scroll progress */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[80] h-[2px] origin-left bg-[#4D6BFF]"
        style={{ scaleX: progress }}
        aria-hidden
      />

      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
        className={`fixed inset-x-0 top-0 z-[70] transition-all duration-500 ${
          scrolled
            ? overDark
              ? "border-b border-white/10 bg-[#111111]/85 backdrop-blur-xl text-[#F5F3EE]"
              : "border-b border-[#11111112] bg-[#F5F3EE]/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className={`container-x flex items-center justify-between transition-all duration-500 ${
            scrolled ? "h-[58px]" : "h-[68px] sm:h-[76px]"
          }`}
        >
          {/* Wordmark */}
          <a
            href="#top"
            className="group flex items-baseline gap-[3px] text-[17px] font-semibold tracking-[-0.02em]"
            aria-label="Cipher — back to top"
          >
            CIPHER
            <span
              className="inline-block h-[7px] w-[7px] rounded-[2px] bg-[#4D6BFF] transition-transform duration-500 group-hover:rotate-45"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={`micro relative py-2 transition-colors duration-300 ${
                  active === item.id
                    ? overDark
                      ? "text-[#F5F3EE]"
                      : "text-[#111111]"
                    : overDark
                      ? "text-white/50 hover:text-[#F5F3EE]"
                      : "text-[#777777] hover:text-[#111111]"
                }`}
              >
                {item.label}
                {active === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#4D6BFF]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}

            <div className="micro hidden items-center gap-2 text-white/60 lg:flex" style={{ color: overDark ? "rgba(245,243,238,0.6)" : "#555555" }}>
              <AvailabilityDot />
              AVAILABLE FOR WORK
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-[75] flex h-11 w-11 items-center justify-center md:hidden"
          >
            <span className="relative flex h-3 w-6 flex-col justify-between">
              <motion.span
                animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="block h-[1.5px] w-full bg-current"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="block h-[1.5px] w-full bg-current"
              />
            </span>
          </button>
        </nav>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-0 z-[65] flex flex-col bg-[#F5F3EE] md:hidden"
          >
            <div className="dotgrid pointer-events-none absolute inset-0 opacity-60" />
            <div className="container-x relative flex flex-1 flex-col justify-center gap-1 pb-16 pt-20">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.6, ease: EASE }}
                  className="group flex items-baseline gap-4 border-b border-[#11111114] py-5"
                >
                  <span className="micro text-[#4D6BFF]">0{i + 1}</span>
                  <span className="h-editorial text-[13vw] leading-none sm:text-6xl">
                    {item.label}
                  </span>
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
                className="mt-10 flex flex-col gap-4"
              >
                <div className="micro flex items-center gap-2 text-[#111111]">
                  <AvailabilityDot />
                  AVAILABLE FOR WORK
                </div>
                <div className="micro flex items-center gap-3 text-[#777777]">
                  <a href={site.github} target="_blank" rel="noreferrer" className="link-underline">
                    GITHUB
                  </a>
                  <span>/</span>
                  <a href={site.linkedin} target="_blank" rel="noreferrer" className="link-underline">
                    LINKEDIN
                  </a>
                  <span>/</span>
                  <a href={site.email} className="link-underline">
                    EMAIL
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
