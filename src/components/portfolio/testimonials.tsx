"use client";

import { Reveal, WordReveal } from "./reveal";
import type { Testimonial } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * CLIENT NOTES — social proof section.
 * Data comes from the CMS (managed via /admin). Seeded entries are
 * anonymous reconstructed summaries, clearly disclosed on the section
 * and per-card. VERIFIED entries display a green status chip instead.
 * Avatars are typographic initials (or CMS-provided); no stock photos,
 * no ratings, no invented identities.
 */

function initialsOf(label: string) {
  return (
    label
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "·"
  );
}

function StatusChip({ status }: { status: Testimonial["status"] }) {
  return (
    <span
      className={cn(
        "micro shrink-0 rounded-full border px-2 py-[3px] text-[8px] leading-none",
        status === "VERIFIED"
          ? "border-[#3ECF6E]/40 bg-[#3ECF6E]/10 text-[#1d7c44]"
          : "border-[#1111111f] bg-transparent text-[#999999]"
      )}
      title={
        status === "VERIFIED"
          ? "Genuine client feedback"
          : "Reconstructed summary — wording is not verbatim"
      }
    >
      {status}
    </span>
  );
}

function TestimonialCard({
  t,
  size,
}: {
  t: Testimonial;
  size: "large" | "small";
}) {
  return (
    <figure
      data-cursor="hover"
      className={cn(
        "flex h-full flex-col rounded-2xl border border-[#11111114] bg-white transition-shadow duration-500 hover:shadow-[0_28px_60px_-30px_rgba(17,17,17,0.25)]",
        size === "large" ? "p-7 sm:p-9" : "p-6 sm:p-8"
      )}
    >
      {/* decorative quote mark */}
      <span
        aria-hidden
        className="block font-serif text-[52px] leading-[0.6] text-[#4D6BFF]/25"
      >
        &ldquo;
      </span>

      <blockquote className="mt-5">
        <p
          className={cn(
            "leading-[1.65] text-[#111111]",
            size === "large"
              ? "text-lg sm:text-[21px]"
              : "text-[16.5px] sm:text-lg"
          )}
        >
          {t.quote}
        </p>
      </blockquote>

      <figcaption className="mt-auto flex flex-col items-start gap-3 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          {/* typographic avatar — initials or CMS image */}
          {t.avatar?.startsWith?.("/") || t.avatar?.startsWith?.("http") ? (
            <img
              src={t.avatar}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full border border-[#11111114] object-cover"
            />
          ) : (
            <span
              className="micro flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#11111114] bg-[#F5F3EE] text-[10px] text-[#111111]"
              aria-hidden
            >
              {initialsOf(t.clientLabel)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-[-0.01em] text-[#111111]">
              {t.clientLabel}
            </p>
            <p className="micro mt-1 truncate text-[9px] normal-case tracking-[0.08em] text-[#777777]">
              {t.role}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-row items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
          <StatusChip status={t.status} />
          <span className="micro hidden text-[9px] text-[#999999] sm:block">
            {t.meta}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative border-t border-[#11111114] py-20 sm:py-28 lg:py-36"
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
              CLIENT NOTES / 2026
            </p>
            <h2
              id="testimonials-heading"
              className="h-editorial max-w-[16ch] text-4xl sm:text-5xl lg:text-6xl"
            >
              <WordReveal text="What people I've worked with say." />
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="max-w-[38ch]">
            {/* unobtrusive disclosure */}
            <p className="micro flex items-start gap-2.5 text-[9px] leading-[1.9] text-[#999999]">
              <span
                className="mt-[6px] inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-[#F5B83D]"
                aria-hidden
              />
              <span>
                <span className="text-[#777777]">CLIENT FEEDBACK — RECONSTRUCTED.</span>{" "}
                Feedback summarized from past client interactions; wording is not
                verbatim.
              </span>
            </p>
          </Reveal>
        </div>

        {/* desktop: editorial asymmetric grid · mobile: swipeable snap row */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-8">
            {testimonials.map((t, i) => {
              const large = i % 3 === 0;
              const offset = i % 3 === 1;
              return (
                <Reveal
                  key={`${t.clientLabel}-${i}`}
                  delay={(i % 3) * 0.08}
                  className={cn(
                    large ? "col-span-7" : "col-span-5",
                    offset && "lg:pt-14"
                  )}
                >
                  <TestimonialCard t={t} size={large ? "large" : "small"} />
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* mobile swipe row */}
        <div
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Client feedback carousel — swipe to read"
        >
          {testimonials.map((t, i) => (
            <Reveal
              key={`m-${t.clientLabel}-${i}`}
              delay={Math.min(i * 0.06, 0.24)}
              className="w-[84vw] shrink-0 snap-center"
            >
              <TestimonialCard t={t} size="small" />
            </Reveal>
          ))}
        </div>

        {/* swipe hint (mobile) */}
        <p className="micro mt-4 flex items-center justify-center gap-2 text-[9px] text-[#aaaaaa] md:hidden" aria-hidden>
          SWIPE
          <span className="inline-block h-px w-8 bg-[#11111126]" />
        </p>
      </div>
    </section>
  );
}
