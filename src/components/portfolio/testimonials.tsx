"use client";

import { Reveal, WordReveal } from "./reveal";
import { testimonials } from "@/lib/site";

/*
 * KIND WORDS — social proof section.
 * Data policy: quotes/names/roles come ONLY from src/lib/site.ts
 * `testimonials` (currently structural placeholders — no invented clients).
 * Avatars are typographic initials; no stock photos, no ratings.
 */

function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "·"
  );
}

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative py-20 sm:py-28 lg:py-36"
    >
      <div className="container-x">
        {/* header */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
          <Reveal>
            <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
              <span
                className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]"
                aria-hidden
              />
              KIND WORDS
            </p>
            <h2
              id="testimonials-heading"
              className="h-editorial max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl"
            >
              <WordReveal text="What people I've worked with say." />
            </h2>
          </Reveal>
        </div>

        {/* editorial asymmetric cards — deliberately different sizes */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
          {testimonials.map((t, i) => (
            <Reveal
              key={`${t.name}-${i}`}
              delay={i * 0.08}
              className={i % 2 === 0 ? "md:col-span-7" : "md:col-span-5 lg:pt-14"}
            >
              <figure
                data-cursor="hover"
                className={`flex h-full flex-col rounded-2xl border border-[#11111114] bg-white p-7 transition-shadow duration-500 hover:shadow-[0_28px_60px_-30px_rgba(17,17,17,0.25)] sm:p-9 ${
                  i % 2 === 0 ? "" : "sm:p-8"
                }`}
              >
                {/* decorative quote mark */}
                <span
                  aria-hidden
                  className="block font-serif text-[52px] leading-[0.6] text-[#4D6BFF]/25"
                >
                  &ldquo;
                </span>

                <blockquote className="mt-5">
                  <p className="text-lg leading-[1.65] text-[#111111] sm:text-[21px]">
                    {t.quote}
                  </p>
                </blockquote>

                <figcaption className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <div className="flex items-center gap-3.5">
                    {/* typographic avatar — initials only, no stock photos */}
                    <span
                      className="micro flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#11111114] bg-[#F5F3EE] text-[10px] text-[#111111]"
                      aria-hidden
                    >
                      {initialsOf(t.name)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold tracking-[-0.01em] text-[#111111]">
                        {t.name}
                      </p>
                      <p className="micro mt-1 text-[9px] text-[#777777]">{t.role}</p>
                    </div>
                  </div>
                  <span className="micro hidden shrink-0 text-[9px] text-[#999999] sm:block">
                    {t.meta}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
