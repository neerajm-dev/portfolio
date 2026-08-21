import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Telemetry } from "@/components/telemetry";
import { TerminalCli } from "@/components/terminal-cli";
import { Projects } from "@/components/projects";
import { Stack } from "@/components/stack";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05070a] bg-grid-cyber flex flex-col selection:bg-[#00f0ff]/20 selection:text-[#00f0ff]">
      {/* Top Header Navigation */}
      <Navbar />

      {/* Main Showcase Stage */}
      <main className="flex-1">
        {/* Cinematic Hero Stage */}
        <Hero />

        {/* Live System Telemetry Banner */}
        <Telemetry />

        {/* Interactive Working Terminal CLI */}
        <TerminalCli />

        {/* KTCC Flagship Project Case Study */}
        <Projects />

        {/* $0 Cloud Infrastructure Breakdown */}
        <Stack />
      </main>

      {/* Footer & Social Hub */}
      <Footer />
    </div>
  );
}
