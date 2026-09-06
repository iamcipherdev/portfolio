import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { About, Capabilities } from "@/components/portfolio/about-capabilities";
import { Process, TechStack } from "@/components/portfolio/process-stack";
import { Lab } from "@/components/portfolio/lab";
import { Journey } from "@/components/portfolio/journey";
import { Testimonials } from "@/components/portfolio/testimonials";
import { Contact, Footer } from "@/components/portfolio/contact";
import { Cursor } from "@/components/portfolio/cursor";
import { getPublicData } from "@/lib/cms";

/* Content is served from the CMS database (managed via /admin).
   Direct SQLite reads are sub-millisecond; dynamic rendering keeps
   admin edits live without any rebuild. */
export const dynamic = "force-dynamic";

export default async function Home() {
  const { projects, lab, testimonials, profile } = await getPublicData();

  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#111111] focus:px-5 focus:py-3 focus:text-sm focus:text-[#F5F3EE]"
      >
        Skip to work
      </a>
      <Cursor />
      <Navbar profile={profile} />
      <main className="flex min-h-screen flex-col">
        <Hero profile={profile} />
        <SelectedWork projects={projects} />
        <About profile={profile} />
        <Capabilities />
        <Process />
        <TechStack skills={profile.skills} />
        <Lab entries={lab} profile={profile} />
        <Journey />
        <Testimonials testimonials={testimonials} />
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  );
}
