"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { BrowserFrame } from "./browser-frame";
import { Magnetic } from "./magnetic";
import { WordReveal, EASE } from "./reveal";
import type { SiteProfile } from "@/lib/site";

const DEFAULT_HEADLINE = "I build useful digital products with AI & the web.";

/** Split the editable headline into up to 3 editorial lines. */
function headlineLines(headline: string): string[] {
  const trimmed = headline.trim();
  if (trimmed === DEFAULT_HEADLINE) {
    return ["I build useful", "digital products", "with AI & the web."];
  }
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length <= 3) return [trimmed];
  if (words.length <= 6) {
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
  }
  const size = Math.ceil(words.length / 3);
  return [
    words.slice(0, size).join(" "),
    words.slice(size, size * 2).join(" "),
    words.slice(size * 2).join(" "),
  ];
}

export function Hero({ profile }: { profile: SiteProfile }) {
  const reduce = useReducedMotion();
  const zone = useRef<HTMLDivElement>(null);

  /* cursor-aware parallax (desktop, fine pointers) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  const frontX = useTransform(smx, [-1, 1], [-10, 10]);
  const frontY = useTransform(smy, [-1, 1], [-6, 6]);
  const backX = useTransform(smx, [-1, 1], [16, -16]);
  const backY = useTransform(smy, [-1, 1], [10, -10]);
  const chipX = useTransform(smx, [-1, 1], [-18, 18]);
  const chipY = useTransform(smy, [-1, 1], [-12, 12]);

  function onMove(e: React.MouseEvent) {
    if (reduce || !zone.current) return;
    const r = zone.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const lines = headlineLines(profile.headline);

  return (
    <section
      id="top"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-[68px] sm:pt-[76px]"
      aria-label="Introduction"
    >
      {/* faint dot grid + hairlines */}
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 top-[68px] h-px bg-[#1111110a] sm:top-[76px]"
        aria-hidden
      />

      <div className="container-x relative grid flex-1 grid-cols-1 items-center gap-12 pb-10 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-6 lg:pb-6">
        {/* ── Copy ─────────────────────────────── */}
        <div className="relative z-10 lg:col-span-7 xl:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="micro mb-6 flex items-center gap-3 text-[#555555] sm:mb-8"
          >
            <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
            {profile.availabilityStatus.toUpperCase()}
          </motion.p>

          <h1 className="h-editorial max-w-[13ch] text-[13.2vw] leading-[0.98] sm:text-[11vw] lg:text-[5.6vw] xl:text-[6vw]">
            {lines.map((line, i) => {
              const isLast = i === lines.length - 1;
              return (
                <span key={line} className="block overflow-hidden">
                  <WordReveal
                    text={line}
                    delay={0.35 + i * 0.1}
                    className={`block ${isLast && lines.length > 1 ? "text-[#777777]" : ""}`}
                  />
                </span>
              );
            })}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: EASE }}
            className="mt-7 max-w-[46ch] text-[15px] leading-relaxed text-[#555555] sm:text-base"
          >
            {profile.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: EASE }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5"
          >
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-[#111111] px-7 text-[11px] font-mono font-medium uppercase tracking-[0.18em] text-[#F5F3EE] transition-colors duration-300 hover:bg-[#4D6BFF]"
              >
                View Selected Work
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full border border-[#11111126] bg-transparent px-7 text-[11px] font-mono font-medium uppercase tracking-[0.18em] text-[#111111] transition-all duration-300 hover:border-[#111111] hover:bg-[#111111] hover:text-[#F5F3EE]"
              >
                Let&apos;s Work Together
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* ── Layered product visuals ──────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.6, ease: EASE }}
          className="relative z-0 mx-auto w-full max-w-[560px] lg:col-span-5 lg:max-w-none"
          ref={zone}
        >
          <div className="relative pb-14 pl-4 pr-0 sm:pb-16 sm:pl-10 lg:pl-6">
            {/* back layer — Late Night Corner */}
            <motion.div
              style={reduce ? undefined : { x: backX, y: backY }}
              className="absolute -top-6 right-0 w-[62%] sm:-top-10 lg:-right-4"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              >
                <BrowserFrame url="latenightcorner.space-z.ai" dark>
                  <div className="relative aspect-[16/10]">
                    <Image
                      src="/projects/latenightcorner-sm.webp"
                      alt="Late Night Corner — interactive web experience"
                      fill
                      priority
                      sizes="(max-width: 1024px) 40vw, 22vw"
                      className="object-cover object-top"
                    />
                  </div>
                </BrowserFrame>
              </motion.div>
            </motion.div>

            {/* front layer — Recuroo */}
            <motion.div
              style={reduce ? undefined : { x: frontX, y: frontY }}
              className="relative z-10 w-[86%] sm:w-[80%]"
            >
              <BrowserFrame url="recuroo.vercel.app">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/projects/recuroo-sm.webp"
                    alt="Recuroo — WhatsApp-first ordering product"
                    fill
                    priority
                    sizes="(max-width: 1024px) 80vw, 34vw"
                    className="object-cover object-top"
                  />
                </div>
              </BrowserFrame>
            </motion.div>

            {/* floating status chip */}
            <motion.div
              style={reduce ? undefined : { x: chipX, y: chipY }}
              className="absolute bottom-0 left-0 z-20 sm:left-0"
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }}
                className="flex items-center gap-3 rounded-full border border-[#11111114] bg-white/90 px-4 py-3 shadow-[0_16px_40px_-16px_rgba(17,17,17,0.25)] backdrop-blur-md"
              >
                <span className="relative flex h-[8px] w-[8px]">
                  <span className="soft-ping relative inline-flex h-full w-full rounded-full bg-[#4D6BFF]" />
                </span>
                <span className="micro text-[#111111]">{profile.availabilityStatus}</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── bottom metadata bar ─────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.25 }}
        className="container-x relative pb-6 sm:pb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#11111114] pt-4">
          <p className="micro text-[#777777]">
            BASED IN {profile.location.toUpperCase()} <span className="mx-1 text-[#4D6BFF]">·</span>{" "}
            BUILDING IN 2026
          </p>
          <a href="#work" className="micro link-underline hidden items-center gap-2 text-[#111111] sm:flex">
            SCROLL
            <motion.span
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              ↓
            </motion.span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
