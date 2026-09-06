"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Reveal, EASE } from "./reveal";
import { BrowserFrame } from "./browser-frame";
import type { Project } from "@/lib/site";

/* ── Quran Guard: honest CSS product mockup (extension popup) ── */
function ExtensionMockup() {
  return (
    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-[#101010]">
      <div className="dotgrid-light absolute inset-0 opacity-40" aria-hidden />
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10"
        aria-hidden
      />
      <div
        className="absolute -bottom-14 -left-8 h-44 w-44 rounded-full border border-white/10"
        aria-hidden
      />
      {/* popup card */}
      <div className="relative w-[68%] max-w-[300px] rounded-2xl border border-white/10 bg-[#181818] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4D6BFF]/15">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3z"
                  stroke="#4D6BFF"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M9.2 12.2l2 2 3.6-3.9" stroke="#4D6BFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <p className="text-[12px] font-semibold text-white">Quran Guard</p>
              <p className="text-[9px] uppercase tracking-[0.18em] text-white/40">
                Protection on
              </p>
            </div>
          </div>
          <span className="flex h-5 w-9 items-center rounded-full bg-[#4D6BFF] px-[3px]">
            <span className="ml-auto h-[14px] w-[14px] rounded-full bg-white" />
          </span>
        </div>
        <div className="space-y-2.5">
          {[
            { label: "Distraction shield", state: "Active" },
            { label: "Safe search layer", state: "Active" },
            { label: "Intentional browsing", state: "Active" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-lg bg-white/[0.04] px-3 py-2.5"
            >
              <span className="text-[10.5px] text-white/70">{row.label}</span>
              <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-[#7d94ff]">
                <span className="h-[5px] w-[5px] rounded-full bg-[#4D6BFF]" />
                {row.state}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Restrained scroll parallax for large visuals ── */
function useFinePointer(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );
}

function ParallaxImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-2.5%", "2.5%"]);
  const active = !reduce && finePointer;

  return (
    <div ref={ref} className="relative aspect-[16/10] overflow-hidden">
      <motion.div
        className="absolute -inset-y-[4%] inset-x-0 will-change-transform"
        style={active ? { y } : undefined}
      >
        <Image
          src={src}
          alt={alt}
          fill
          loading={priority ? undefined : "lazy"}
          sizes={sizes}
          className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.035]"
        />
      </motion.div>
      {/* editorial crop veil */}
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/[0.06] to-transparent opacity-0 transition-opacity duration-700 group-hover/card:opacity-100" />
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({
  project,
  large,
  offset = false,
  delay = 0,
}: {
  project: Project;
  large?: boolean;
  offset?: boolean;
  delay?: number;
}) {
  const darkShot = project.name === "LETTER THAT NEVER SEND" || project.name === "QURAN GUARD";
  const interactive = !!project.url;
  const isClientWork = !!project.category;

  const Wrapper = interactive ? "a" : "div";
  const linkProps = interactive
    ? { href: project.url, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Reveal className={`group/card ${offset ? "lg:mt-20" : ""}`} delay={delay}>
      <Wrapper
        {...linkProps}
        {...(interactive
          ? {
              "data-cursor": "view",
              "data-cursor-label": "VIEW",
              "aria-label": `${project.name} — visit live site`,
            }
          : {})}
        className="block outline-offset-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:-translate-y-1.5"
      >
        {/* visual */}
        <div className="relative overflow-hidden rounded-xl transition-shadow duration-500 group-hover/card:shadow-[0_44px_90px_-36px_rgba(17,17,17,0.45)]">
          {project.image ? (
            <BrowserFrame url={project.domain} dark={darkShot}>
              {large ? (
                <ParallaxImage
                  src={project.image.lg}
                  alt={project.image.alt}
                  sizes={large ? "(max-width: 1024px) 92vw, 56vw" : "(max-width: 1024px) 92vw, 40vw"}
                />
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={project.image.lg}
                    alt={project.image.alt}
                    fill
                    loading="lazy"
                    sizes={large ? "(max-width: 1024px) 92vw, 56vw" : "(max-width: 1024px) 92vw, 40vw"}
                    className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/[0.06] to-transparent opacity-0 transition-opacity duration-700 group-hover/card:opacity-100" />
                </div>
              )}
            </BrowserFrame>
          ) : (
            <div className="overflow-hidden rounded-xl border border-[#11111114] shadow-[0_24px_60px_-24px_rgba(17,17,17,0.28)]">
              <ExtensionMockup />
            </div>
          )}

          {/* category badge — client work, always visible (desktop: overlay / mobile: inline chip below) */}
          {isClientWork ? (
            <div
              className="micro pointer-events-none absolute right-4 top-4 z-10 hidden rounded-full border border-white/20 bg-[#111111]/85 px-3 py-[7px] text-[#F5F3EE] backdrop-blur-sm sm:block"
            >
              {project.category}
            </div>
          ) : null}

          {/* hover index badge */}
          <div
            className="micro pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-[#111111]/85 px-3 py-[7px] text-[#F5F3EE] opacity-0 backdrop-blur-sm transition-all duration-500 group-hover/card:opacity-100"
            aria-hidden
          >
            {project.index}
          </div>
        </div>

        {/* meta */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-[6px] flex items-baseline gap-3">
              <span
                className="micro text-[#4D6BFF] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-1.5"
              >
                {project.index}
              </span>
              <h3
                className={`h-editorial ${large ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
              >
                {project.name}
              </h3>
            </div>
            <p className="max-w-[52ch] text-[13.5px] leading-relaxed text-[#777777] transition-colors duration-500 group-hover/card:text-[#555555] sm:text-sm">
              {project.description}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5" aria-label="Project tags">
              {isClientWork ? (
                <li
                  className="micro rounded-full border border-[#4D6BFF]/40 px-[10px] py-[5px] text-[9px] text-[#4D6BFF] sm:hidden"
                >
                  {project.category}
                </li>
              ) : null}
              {project.tags.map((t) => (
                <li
                  key={t}
                  className="micro rounded-full border border-[#11111114] px-[10px] py-[5px] text-[9px] text-[#777777] transition-colors duration-300 group-hover/card:border-[#11111126]"
                >
                  {t}
                </li>
              ))}
            </ul>
            {project.cta ? (
              <span className="micro mt-4 inline-flex items-center gap-2 text-[#111111]">
                {project.cta}
                <span
                  className="transition-transform duration-500 group-hover/card:translate-x-1 group-hover/card:-translate-y-1"
                  aria-hidden
                >
                  ↗
                </span>
              </span>
            ) : null}
          </div>

          {/* visit affordance */}
          {interactive ? (
            <span
              className="micro mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#11111114] text-[#111111] transition-all duration-500 group-hover/card:border-[#111111] group-hover/card:bg-[#111111] group-hover/card:text-[#F5F3EE]"
              aria-hidden
            >
              <span className="transition-transform duration-500 group-hover/card:rotate-45">↗</span>
            </span>
          ) : (
            <span
              className="micro mt-1 flex h-11 shrink-0 items-center rounded-full border border-[#11111114] px-4 text-[#777777]"
              title="Browser extension — not a public URL"
            >
              PRIVATE
            </span>
          )}
        </div>
      </Wrapper>
    </Reveal>
  );
}

/* ── Section ── */
export function SelectedWork({ projects }: { projects: Project[] }) {
  /* editorial layout pattern for the grid, repeating safely for any count */
  const pattern: { span: string; large?: boolean; offset?: boolean }[] = [
    { span: "md:col-span-7", large: true },
    { span: "md:col-span-5 lg:pt-24" },
    { span: "md:col-span-5" },
    { span: "md:col-span-7 lg:-mt-6", large: true },
    { span: "md:col-span-7", large: true },
    { span: "md:col-span-5 lg:pt-24" },
    { span: "md:col-span-12", large: true },
  ];

  return (
    <section id="work" aria-labelledby="work-heading" className="relative py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        {/* header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
              <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
              PORTFOLIO
            </p>
            <h2 id="work-heading" className="h-editorial text-4xl sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="inline-block will-change-transform"
                >
                  Selected
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  initial={{ y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
                  className="inline-block will-change-transform"
                >
                  Work
                  <sup className="micro ml-3 align-super text-[#4D6BFF]">/ {String(projects.length).padStart(2, "0")}</sup>
                </motion.span>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[32ch]">
            <p className="text-[13.5px] leading-relaxed text-[#777777] sm:text-sm">
              Shipped products, interactive experiences and real-world client
              work — each one live on the web, not imagined.
            </p>
          </Reveal>
        </div>

        {/* asymmetric editorial grid — staggered entrances */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-12 lg:gap-y-8">
          {projects.map((project, i) => {
            const slot = pattern[i % pattern.length];
            return (
              <div key={`${project.index}-${project.name}`} className={slot.span}>
                <ProjectCard
                  project={project}
                  large={slot.large}
                  offset={slot.offset}
                  delay={(i % 2) * 0.08}
                />
              </div>
            );
          })}
        </div>

        {/* footnote */}
        <Reveal delay={0.1} className="mt-16 sm:mt-20">
          <div className="rule mb-6" />
          <p className="micro text-[#777777]">
            MORE EXPERIMENTS LIVE IN{" "}
            <a href="#lab" className="link-underline text-[#111111]">
              THE LAB
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
