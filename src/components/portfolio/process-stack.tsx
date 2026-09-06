"use client";

import { useState } from "react";
import { Reveal, WordReveal } from "./reveal";
import { processSteps, stackGroups } from "@/lib/site";

/* ── PROCESS ── */
export function Process() {
  return (
    <section
      aria-labelledby="process-heading"
      className="relative border-t border-[#11111114] py-20 sm:py-28 lg:py-36"
    >
      <div className="container-x">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-20">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
              <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
              PROCESS
            </p>
            <h2 id="process-heading" className="h-editorial text-4xl sm:text-6xl lg:text-7xl">
              <WordReveal text="From problem to product." />
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[30ch]">
            <p className="text-[13.5px] leading-relaxed text-[#777777] sm:text-sm">
              The same five moves every time — whether it&apos;s a weekend
              experiment or a full product build.
            </p>
          </Reveal>
        </div>

        {/* desktop: horizontal track / mobile: vertical timeline */}
        <div role="list" className="relative">
          {/* horizontal connector (desktop) */}
          <div
            className="absolute left-0 right-0 top-[26px] hidden h-px bg-[#11111114] lg:block"
            aria-hidden
          />
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, i) => (
              <Reveal key={step.index} delay={i * 0.09} className="relative">
                <div role="listitem" className="group relative pb-10 pl-12 lg:pb-0 lg:pl-0">
                  {/* vertical connector (mobile) */}
                  <span
                    className="absolute left-[19px] top-[52px] bottom-0 w-px bg-[#11111114] lg:hidden"
                    aria-hidden
                  />
                  {i === processSteps.length - 1 && (
                    <span
                      className="absolute left-[19px] bottom-auto top-[52px] h-[calc(100%-52px)] w-px bg-transparent lg:hidden"
                      aria-hidden
                    />
                  )}

                  {/* node */}
                  <div className="absolute left-0 top-0 lg:relative lg:mb-8">
                    <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#1111111f] bg-[#F5F3EE] font-mono text-[10px] font-medium tracking-[0.08em] text-[#111111] transition-all duration-500 group-hover:border-[#4D6BFF] group-hover:bg-[#4D6BFF] group-hover:text-white lg:h-[52px] lg:w-[52px] lg:text-[11px]">
                      {step.index}
                    </span>
                  </div>

                  {/* ghost number */}
                  <span
                    className="h-editorial text-outline-ink pointer-events-none absolute right-0 top-0 hidden text-[64px] leading-none opacity-70 transition-opacity duration-500 group-hover:opacity-100 lg:block"
                    aria-hidden
                  >
                    {step.index}
                  </span>

                  <div className="lg:pr-10">
                    <h3 className="h-editorial mt-0 text-lg sm:text-xl lg:mb-3 lg:mt-2 lg:text-2xl">
                      {step.title}
                    </h3>
                    <p className="max-w-[26ch] text-[13.5px] leading-relaxed text-[#777777] sm:text-sm">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── TECH STACK ── */
export function TechStack() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  return (
    <section
      aria-labelledby="stack-heading"
      className="relative border-t border-[#11111114] py-20 sm:py-28 lg:py-36"
    >
      <div className="container-x">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
              <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
              TECH STACK
            </p>
            <h2 id="stack-heading" className="h-editorial text-4xl sm:text-6xl lg:text-7xl">
              <WordReveal text="Tools of the trade." />
            </h2>
          </Reveal>
          <Reveal delay={0.15} className="max-w-[30ch]">
            <p className="text-[13.5px] leading-relaxed text-[#777777] sm:text-sm">
              Chosen for speed and reliability — not collected for decoration.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {stackGroups.map((group, gi) => (
            <Reveal key={group.label} delay={gi * 0.07}>
              <div className="border-t-2 border-[#111111] pt-5">
                <p className="micro mb-5 flex items-center justify-between text-[#111111]">
                  {group.label}
                  <span className="text-[#4D6BFF]">0{gi + 1}</span>
                </p>
                <ul className="space-y-[2px]">
                  {group.items.map((item) => {
                    const key = `${group.label}-${item.name}`;
                    const isActive = activeItem === key;
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveItem(key)}
                          onMouseLeave={() => setActiveItem(null)}
                          onFocus={() => setActiveItem(key)}
                          onBlur={() => setActiveItem(null)}
                          data-cursor="hover"
                          aria-label={`${item.name} — ${item.note}`}
                          className="group flex w-full items-baseline justify-between gap-3 rounded-md py-[6px] text-left transition-colors duration-300"
                        >
                          <span
                            className={`text-[19px] font-medium tracking-[-0.015em] transition-all duration-300 sm:text-[21px] ${
                              isActive ? "translate-x-1.5 text-[#4D6BFF]" : "text-[#111111]"
                            }`}
                          >
                            {item.name}
                          </span>
                          <span
                            aria-hidden
                            className={`text-[#4D6BFF] transition-all duration-300 ${
                              isActive ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"
                            }`}
                          >
                            →
                          </span>
                        </button>
                        <div
                          className="grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                          style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                        >
                          <p className="overflow-hidden text-[12px] leading-snug text-[#777777]">
                            <span className="block pb-2 pl-px pt-px">{item.note}</span>
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
