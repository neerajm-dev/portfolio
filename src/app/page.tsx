import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Telemetry } from "@/components/telemetry";
import { ArchitectureOrbit } from "@/components/architecture-orbit";
import { Projects } from "@/components/projects";
import { TerminalCli } from "@/components/terminal-cli";
import { LedgerSandbox } from "@/components/ledger-sandbox";
import { Footer } from "@/components/footer";
import { AsciiCanvas } from "@/components/ascii-canvas";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white selection:bg-[#00f0ff] selection:text-black relative overflow-x-hidden">
      {/* Living ASCII Matrix Canvas Background */}
      <AsciiCanvas />

      {/* Navigation Bar with Web Audio Engine */}
      <Navbar />

      {/* Hero Stage with Matrix Avatar & Kinetic Typography */}
      <Hero />

      {/* Cyberdeck Telemetry HUD Bar */}
      <Telemetry />

      {/* 3D Nodal Architecture Blueprint & Packet Router */}
      <ArchitectureOrbit />

      {/* 4-Pillar Engineering Showcase */}
      <Projects />

      {/* Interactive Cyberdeck Web Terminal CLI */}
      <TerminalCli />

      {/* Interactive ACID SQL Ledger Sandbox */}
      <LedgerSandbox />

      {/* Footer & Connectivity */}
      <Footer />
    </main>
  );
}
