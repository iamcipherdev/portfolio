import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { About, Capabilities } from "@/components/portfolio/about-capabilities";
import { Process, TechStack } from "@/components/portfolio/process-stack";
import { Lab } from "@/components/portfolio/lab";
import { Journey } from "@/components/portfolio/journey";
import { Contact, Footer } from "@/components/portfolio/contact";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#111111] focus:px-5 focus:py-3 focus:text-sm focus:text-[#F5F3EE]"
      >
        Skip to work
      </a>
      <Navbar />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <SelectedWork />
        <About />
        <Capabilities />
        <Process />
        <TechStack />
        <Lab />
        <Journey />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
