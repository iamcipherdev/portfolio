"use client";

import { Reveal } from "./reveal";
import { labEntries, site, type LabEntry } from "@/lib/site";

/* status chip tones (dark section) */
const toneChip: Record<LabEntry["tone"], string> = {
  exploring: "border-[#4D6BFF]/40 text-[#8DA2FF]",
  concept: "border-white/15 text-white/50",
  research: "border-[#F5B83D]/30 text-[#F5C96B]",
  ongoing: "border-[#3ECF6E]/30 text-[#5CE393]",
};

const toneDot: Record<LabEntry["tone"], string> = {
  exploring: "bg-[#4D6BFF]",
  concept: "bg-white/40",
  research: "bg-[#F5B83D]",
  ongoing: "bg-[#3ECF6E]",
};

/* animated status indicator — dot + soft ping */
function StatusDot({ tone }: { tone: LabEntry["tone"] }) {
  return (
    <span className="relative inline-flex h-[6px] w-[6px]" aria-hidden>
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-50 ${toneDot[tone]}`}
      />
      <span className={`relative inline-flex h-[6px] w-[6px] rounded-full ${toneDot[tone]}`} />
    </span>
  );
}

function LabCard({ entry, index }: { entry: LabEntry; index: number }) {
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <article
        data-cursor="hover"
        className="group flex h-full flex-col bg-[#111111] p-6 transition-colors duration-500 hover:bg-[#161616] sm:p-8"
      >
        {/* top row — experiment ID · status · date */}
        <div className="flex items-center justify-between gap-3">
          <span className="micro text-[#8DA2FF] transition-colors duration-500 group-hover:text-[#4D6BFF]">
            {entry.id}
          </span>
          <span
            className={`micro inline-flex items-center gap-2 rounded-full border px-3 py-[6px] text-[9px] ${toneChip[entry.tone]}`}
          >
            <StatusDot tone={entry.tone} />
            {entry.status}
          </span>
        </div>

        {/* name */}
        <h3 className="h-editorial mt-5 text-lg tracking-[-0.015em] transition-transform duration-500 group-hover:translate-x-1 sm:text-[22px] sm:leading-snug">
          {entry.name}
        </h3>

        {/* description */}
        <p className="mt-3 max-w-[48ch] text-[13px] leading-relaxed text-white/50 sm:text-[13.5px]">
          {entry.note}
        </p>

        {/* technical note — expands on hover (desktop), always visible on touch */}
        <p className="overflow-hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/35 transition-all duration-500 sm:max-h-0 sm:mt-0 sm:opacity-0 sm:group-hover:mt-4 sm:group-hover:max-h-12 sm:group-hover:opacity-100 mt-3 sm:group-hover:translate-x-1">
          <span className="mr-2 text-[#4D6BFF]" aria-hidden>
            →
          </span>
          {entry.techNote}
        </p>

        {/* bottom row — tags · date */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-6">
          <ul className="flex flex-wrap gap-x-2 gap-y-1.5" aria-label="Experiment tags">
            {entry.tags.map((t) => (
              <li
                key={t}
                className="micro rounded-full border border-white/10 px-[10px] py-[5px] text-[9px] text-white/45 transition-colors duration-500 group-hover:border-white/20 group-hover:text-white/60"
              >
                {t}
              </li>
            ))}
          </ul>
          <span className="micro text-[10px] text-white/30">{entry.date}</span>
        </div>
      </article>
    </Reveal>
  );
}

export function Lab() {
  return (
    <section
      id="lab"
      data-dark
      aria-labelledby="lab-heading"
      className="relative overflow-hidden bg-[#111111] py-20 text-[#F5F3EE] sm:py-28 lg:py-36"
    >
      {/* subtle futuristic details */}
      <div className="dotgrid-light pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full border border-white/[0.06]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full border border-white/[0.05]"
        aria-hidden
      />

      <div className="container-x relative">
        {/* header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-white/50">
              <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
              EXPERIMENTS / 2026
            </p>
            <h2 id="lab-heading" className="h-editorial text-5xl sm:text-7xl lg:text-8xl">
              THE LAB
              <span
                className="ml-4 inline-block h-3 w-3 animate-pulse rounded-[3px] bg-[#4D6BFF] align-baseline sm:h-4 sm:w-4"
                aria-hidden
              />
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[38ch]">
            <p className="text-[13.5px] leading-relaxed text-white/50 sm:text-sm">
              Not everything starts as a product. The Lab is where I test
              ideas, technologies and weird little experiments before deciding
              what deserves to become one.
            </p>
          </Reveal>
        </div>

        {/* experimental grid — hairline dividers via gap-px */}
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
          {labEntries.map((entry, i) => (
            <LabCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>

        {/* footnote + CTA */}
        <Reveal delay={0.1} className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-6">
            <p className="micro max-w-[40ch] leading-[1.9] text-white/35">
              SOME EXPERIMENTS SHIP. SOME FAIL. BOTH TEACH ME SOMETHING.
            </p>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="micro group inline-flex h-12 items-center gap-3 rounded-full border border-white/15 px-6 text-white/70 transition-colors duration-300 hover:border-white/40 hover:text-white"
            >
              SEE WHAT I&apos;M BUILDING
              <span
                className="transition-transform duration-500 group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
