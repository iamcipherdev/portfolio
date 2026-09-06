"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Reveal, WordReveal } from "./reveal";

/* Count-up for the projects stat */
function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, target]);

  return (
    <span ref={ref}>
      {String(value).padStart(2, "0")}
      {suffix}
    </span>
  );
}

const timeline = [
  {
    period: "PHASE 01",
    title: "EXPLORING WEB DEVELOPMENT",
    text: "Started building and experimenting with modern web technologies — learning by shipping small things end to end.",
  },
  {
    period: "PHASE 02",
    title: "AI + DIGITAL PRODUCTS",
    text: "Started combining AI with product development and automation — moving from pages to products that behave intelligently.",
  },
  {
    period: "2026 — NOW",
    title: "BUILDING & SHIPPING",
    text: "Building, shipping and experimenting with digital products — from WhatsApp ordering flows to browser extensions.",
  },
];

const stats = [
  { value: <CountUp target={7} suffix="+" />, label: "SELECTED PROJECTS" },
  { value: "AI × WEB", label: "CORE FOCUS" },
  { value: "2026", label: "BUILDING YEAR" },
  { value: "PAKISTAN", label: "BASED IN" },
];

export function Journey() {
  return (
    <section
      aria-labelledby="journey-heading"
      className="relative py-20 sm:py-28 lg:py-36"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-8">
          {/* timeline */}
          <div className="lg:col-span-7">
            <Reveal className="mb-10">
              <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
                <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
                JOURNEY
              </p>
              <h2 id="journey-heading" className="h-editorial max-w-[14ch] text-4xl sm:text-5xl lg:text-6xl">
                <WordReveal text="A short, honest timeline." />
              </h2>
            </Reveal>

            <div role="list" className="relative border-l border-[#1111111f] pl-8 sm:pl-10">
              {timeline.map((item, i) => (
                <Reveal
                  key={item.period}
                  delay={i * 0.08}
                  className="group relative pb-10 last:pb-0 sm:pb-12"
                >
                  <div role="listitem" className="relative">
                    <span
                      className="absolute -left-[37px] top-[7px] flex h-[13px] w-[13px] items-center justify-center rounded-full border border-[#1111111f] bg-[#F5F3EE] transition-colors duration-500 group-hover:border-[#4D6BFF] sm:-left-[45px]"
                      aria-hidden
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-[#111111] transition-colors duration-500 group-hover:bg-[#4D6BFF]" />
                    </span>
                    <p className="micro mb-2 text-[#4D6BFF]">{item.period}</p>
                    <h3 className="h-editorial mb-2 text-lg sm:text-xl">{item.title}</h3>
                    <p className="max-w-[56ch] text-[13.5px] leading-relaxed text-[#777777] sm:text-sm">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* stats */}
          <div className="lg:col-span-5">
            <Reveal delay={0.1} className="h-full">
              <div className="grid h-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[#11111114] bg-[#11111114]">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    data-cursor="hover"
                    className="group flex flex-col justify-between gap-8 bg-[#F5F3EE] p-6 transition-colors duration-500 hover:bg-white sm:p-7"
                  >
                    <span className="micro text-[#999999]">0{i + 1}</span>
                    <div>
                      <p className="h-editorial text-[clamp(1.7rem,4.5vw,2.6rem)] leading-none text-[#111111] transition-colors duration-500 group-hover:text-[#4D6BFF]">
                        {stat.value}
                      </p>
                      <p className="micro mt-3 text-[#777777]">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
