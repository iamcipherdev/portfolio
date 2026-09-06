"use client";

import { Magnetic } from "./magnetic";
import { Reveal, WordReveal, EASE } from "./reveal";
import type { SiteProfile } from "@/lib/site";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("EMAIL COPIED TO CLIPBOARD");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — long-press to select.");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="open"
      data-cursor-label="COPY"
      className="link-underline text-white/60 transition-colors duration-300 hover:text-white"
    >
      {copied ? "COPIED ✓" : "EMAIL"}
    </button>
  );
}

export function Contact({ profile }: { profile: SiteProfile }) {
  return (
    <section
      id="contact"
      data-dark
      aria-labelledby="contact-heading"
      className="relative flex min-h-[92svh] flex-col overflow-hidden bg-[#111111] text-[#F5F3EE]"
    >
      {/* subtle futuristic atmosphere */}
      <div className="dotgrid-light pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
        aria-hidden
      />
      {/* ghost wordmark */}
      <span
        className="text-outline pointer-events-none absolute -bottom-[4vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[24vw] font-semibold leading-none tracking-[-0.04em]"
        aria-hidden
      >
        {profile.displayName}
      </span>

      <div className="container-x relative flex flex-1 flex-col items-center justify-center py-24 text-center sm:py-32">
        <Reveal>
          <p className="micro mb-8 flex items-center justify-center gap-3 text-white/50">
            <span className="relative inline-flex h-[7px] w-[7px]">
              <span className="soft-ping relative inline-flex h-full w-full rounded-full bg-[#4D6BFF]" />
            </span>
            {profile.availabilityStatus.toUpperCase()}
          </p>
        </Reveal>

        <h2
          id="contact-heading"
          className="h-editorial max-w-[12ch] text-[13vw] leading-[1.02] sm:text-[9vw] lg:text-[6.4vw]"
        >
          <WordReveal text="Have an idea" delay={0.05} />
          <span className="block overflow-hidden pb-[0.1em]">
            <WordReveal
              text="worth building?"
              delay={0.18}
              className="block text-[#8DA2FF]"
            />
          </span>
        </h2>

        <Reveal delay={0.3}>
          <p className="mt-7 max-w-[36ch] text-[15px] leading-relaxed text-white/55 sm:text-lg">
            Let&apos;s turn it into something real.
          </p>
        </Reveal>

        <Reveal delay={0.42} className="mt-12">
          <Magnetic strength={0.35}>
            <motion.a
              href={`mailto:${profile.email}`}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="group inline-flex h-[60px] items-center justify-center gap-4 rounded-full bg-[#F5F3EE] px-9 text-[12px] font-mono font-medium uppercase tracking-[0.2em] text-[#111111] transition-colors duration-300 hover:bg-[#4D6BFF] hover:text-white sm:h-[66px] sm:px-11"
            >
              {profile.contactCta}
              <span
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              >
                ↗
              </span>
            </motion.a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.55} className="mt-12">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em]">
            <li>
              <CopyEmailButton email={profile.email} />
            </li>
            <li aria-hidden className="text-white/25">/</li>
            <li>
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="link-underline text-white/60 transition-colors duration-300 hover:text-white"
              >
                GITHUB
              </a>
            </li>
            <li aria-hidden className="text-white/25">/</li>
            <li>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="open"
                className="link-underline text-white/60 transition-colors duration-300 hover:text-white"
              >
                LINKEDIN
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer({ profile }: { profile: SiteProfile }) {
  return (
    <footer className="relative border-t border-white/10 bg-[#111111] pb-[env(safe-area-inset-bottom)] text-[#F5F3EE]">
      <div className="container-x flex flex-col gap-8 py-10 sm:py-12">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <a
              href="#top"
              className="flex items-baseline gap-[3px] text-2xl font-semibold tracking-[-0.02em]"
              aria-label={`${profile.displayName} — back to top`}
            >
              {profile.displayName}
              <span className="inline-block h-[9px] w-[9px] rounded-[2.5px] bg-[#4D6BFF]" aria-hidden />
            </a>
            <p className="micro mt-3 text-white/40">AI × WEB DEVELOPER</p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em]">
              <li>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="link-underline text-white/60 transition-colors hover:text-white"
                >
                  GITHUB
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="open"
                  className="link-underline text-white/60 transition-colors hover:text-white"
                >
                  LINKEDIN
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline text-white/60 transition-colors hover:text-white"
                >
                  EMAIL
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="micro text-white/35">© 2026 {profile.displayName} — ALL RIGHTS RESERVED</p>
          <a
            href="#top"
            className="micro link-underline flex items-center gap-2 text-white/50 transition-colors hover:text-white"
          >
            BACK TO TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
