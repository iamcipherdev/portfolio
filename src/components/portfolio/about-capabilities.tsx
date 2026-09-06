"use client";

import { Reveal, WordReveal } from "./reveal";
import { capabilities } from "@/lib/site";
import { ArrowUpRight } from "lucide-react";

/* ── ABOUT ── */
export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-t border-[#11111114] py-20 sm:py-28 lg:py-36"
    >
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* label */}
          <div className="lg:col-span-3">
            <Reveal>
              <p className="micro flex items-center gap-3 text-[#555555]">
                <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
                ABOUT
              </p>
            </Reveal>
          </div>

          {/* heading + body */}
          <div className="lg:col-span-9">
            <h2
              id="about-heading"
              className="h-editorial max-w-[16ch] text-[8.6vw] leading-[1.04] sm:text-5xl lg:text-[3.6rem] xl:text-[4rem]"
            >
              <WordReveal text="I like turning messy ideas into clear products." />
            </h2>

            <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12">
              <Reveal delay={0.1} className="md:col-span-7">
                <p className="max-w-[58ch] text-[15px] leading-[1.85] text-[#3d3d3d] sm:text-base">
                  I&apos;m Cipher, an AI × Web Developer focused on building modern
                  digital products, experiments and useful tools. I enjoy taking
                  an idea from a rough concept to something real, interactive and
                  deployable — designing the structure, building the product and
                  shipping it to the live web.
                </p>
                <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.85] text-[#777777] sm:text-base">
                  The interesting part is rarely the code alone — it&apos;s the
                  translation: from a vague problem to a clear experience people
                  can actually use.
                </p>
              </Reveal>

              {/* metadata */}
              <Reveal delay={0.2} className="md:col-span-5">
                <dl className="grid grid-cols-3 gap-6 border-t border-[#11111114] pt-6 md:grid-cols-1 md:gap-0">
                  <div className="md:flex md:items-baseline md:justify-between md:border-b md:border-[#11111114] md:py-4">
                    <dt className="micro mb-1 text-[#999999] md:mb-0">BASED IN</dt>
                    <dd className="text-sm font-medium tracking-[0.02em]">Pakistan</dd>
                  </div>
                  <div className="md:flex md:items-baseline md:justify-between md:border-b md:border-[#11111114] md:py-4">
                    <dt className="micro mb-1 text-[#999999] md:mb-0">FOCUS</dt>
                    <dd className="text-sm font-medium tracking-[0.02em]">AI · WEB · PRODUCT</dd>
                  </div>
                  <div className="md:flex md:items-baseline md:justify-between md:py-4">
                    <dt className="micro mb-1 text-[#999999] md:mb-0">CURRENTLY</dt>
                    <dd className="text-sm font-medium tracking-[0.02em]">Building &amp; experimenting</dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CAPABILITIES ── */
export function Capabilities() {
  return (
    <section
      aria-labelledby="cap-heading"
      className="relative pb-20 sm:pb-28 lg:pb-36"
    >
      <div className="container-x">
        <Reveal className="mb-10 sm:mb-14">
          <p className="micro mb-4 flex items-center gap-3 text-[#555555]">
            <span className="inline-block h-[6px] w-[6px] rotate-45 bg-[#4D6BFF]" aria-hidden />
            CAPABILITIES
          </p>
          <h2 id="cap-heading" className="h-editorial text-3xl sm:text-5xl">
            What I bring to a product.
          </h2>
        </Reveal>

        <div role="list" className="border-t border-[#11111114]">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.index} delay={i * 0.05}>
              <div
                role="listitem"
                data-cursor="hover"
                className="group relative overflow-hidden border-b border-[#11111114] transition-colors duration-500 hover:border-[#111111]"
              >
                {/* sliding invert panel */}
                <div
                  className="absolute inset-0 translate-y-full bg-[#111111] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0"
                  aria-hidden
                />
                <div className="relative grid grid-cols-[auto_1fr_auto] items-center gap-4 py-7 transition-colors duration-500 group-hover:text-[#F5F3EE] sm:gap-8 sm:py-9 lg:grid-cols-12">
                  <span className="micro pl-1 text-[#4D6BFF] sm:pl-2 lg:col-span-1">
                    {cap.index}
                  </span>
                  <h3 className="h-editorial text-xl tracking-[-0.02em] sm:text-3xl lg:col-span-5 lg:text-4xl">
                    {cap.title}
                  </h3>
                  <p className="col-span-3 max-w-[52ch] pt-2 text-[13.5px] leading-relaxed text-[#777777] transition-colors duration-500 group-hover:text-[#F5F3EE]/70 sm:pt-0 lg:col-span-5 sm:text-sm">
                    {cap.description}
                  </p>
                  <span className="hidden justify-end pr-2 lg:col-span-1 lg:flex">
                    <ArrowUpRight
                      className="h-6 w-6 text-[#777777] transition-all duration-500 group-hover:rotate-45 group-hover:text-[#4D6BFF]"
                      aria-hidden
                    />
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
