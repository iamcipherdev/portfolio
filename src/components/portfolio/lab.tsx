"use client";

import { Reveal } from "./reveal";
import { labEntries } from "@/lib/site";

const toneStyles: Record<string, string> = {
  live: "bg-[#3ECF6E]/12 text-[#5CE393] border-[#3ECF6E]/25",
  building: "bg-[#F5B83D]/10 text-[#F5C96B] border-[#F5B83D]/25",
  experiment: "bg-[#4D6BFF]/15 text-[#8DA2FF] border-[#4D6BFF]/30",
  archived: "bg-white/5 text-white/40 border-white/10",
};

const dotTone: Record<string, string> = {
  live: "bg-[#3ECF6E]",
  building: "bg-[#F5B83D]",
  experiment: "bg-[#4D6BFF]",
  archived: "bg-white/30",
};

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
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-white/50">
              <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
              EXPERIMENTS
            </p>
            <h2 id="lab-heading" className="h-editorial text-5xl sm:text-7xl lg:text-8xl">
              THE LAB
              <span className="ml-4 inline-block h-3 w-3 animate-pulse rounded-[3px] bg-[#4D6BFF] align-baseline sm:h-4 sm:w-4" aria-hidden />
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[34ch]">
            <p className="text-[13.5px] leading-relaxed text-white/50 sm:text-sm">
              Experiments, ideas and things I&apos;m currently exploring. The
              inventory changes — that&apos;s the point.
            </p>
          </Reveal>
        </div>

        {/* lab index — table rows */}
        <div role="list" className="border-t border-white/10">
          {labEntries.map((entry, i) => (
            <Reveal key={entry.name} delay={i * 0.04} y={18}>
              <div
                role="listitem"
                data-cursor="hover"
                className="group relative grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2 overflow-hidden border-b border-white/10 py-6 transition-colors duration-500 hover:bg-white/[0.035] sm:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1.6fr)_auto_72px] sm:items-center sm:gap-6 sm:py-7"
              >
                {/* index */}
                <span className="micro pl-1 text-white/30 transition-colors duration-500 group-hover:text-[#8DA2FF] sm:pl-2">
                  {entry.index}
                </span>

                {/* name */}
                <h3 className="h-editorial text-xl tracking-[-0.015em] transition-transform duration-500 group-hover:translate-x-1.5 sm:text-2xl">
                  {entry.name}
                </h3>

                {/* note */}
                <p className="col-span-2 max-w-[56ch] text-[13px] leading-relaxed text-white/45 sm:col-span-1 sm:text-[13.5px]">
                  {entry.note}
                </p>

                {/* status */}
                <span className="col-start-2 row-start-1 justify-self-end sm:col-start-4 sm:row-start-1">
                  <span
                    className={`micro inline-flex items-center gap-2 rounded-full border px-3 py-[7px] text-[9px] ${toneStyles[entry.tone]}`}
                  >
                    <span className={`h-[6px] w-[6px] rounded-full ${dotTone[entry.tone]}`} aria-hidden />
                    {entry.status}
                  </span>
                </span>

                {/* year */}
                <span className="micro hidden text-right text-white/30 sm:block">
                  {entry.year}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <p className="micro text-white/35">
            MORE ENTRIES ARE ADDED AS EXPERIMENTS MATURE
            <span className="ml-3 inline-block h-[6px] w-[6px] rounded-full bg-[#4D6BFF] align-middle" aria-hidden />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
