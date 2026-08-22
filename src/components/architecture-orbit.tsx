"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";
import { DecodeText } from "./ui/decode-text";
import { Layers, Database, Shield, Globe, Smartphone, Terminal, Code2, ArrowRight } from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  category: string;
  metric: string;
  description: string;
  icon: typeof Layers;
  color: string;
  bgGlow: string;
  codeSnippet: string;
  codeLanguage: string;
}

const NODES: NodeData[] = [
  {
    id: "client",
    title: "Unified Web & Android Client",
    category: "FRONTEND // LAYER 01",
    metric: "0ms Hybrid State",
    description: "Single Next.js 15 App Router codebase delivering responsive Web, offline PWA, and Capacitor Android release APK with native OTA updater bridge.",
    icon: Smartphone,
    color: "#00f0ff",
    bgGlow: "rgba(0, 240, 255, 0.15)",
    codeLanguage: "typescript",
    codeSnippet: `// Capacitor Native In-App Updater Bridge
export async function checkNativeUpdate() {
  const r2Manifest = await fetch('https://pub-20a7a71855de4a6bb926242af24fb808.r2.dev/manifest.json');
  const { latestBuild, downloadUrl } = await r2Manifest.json();
  if (APP_BUILD < latestBuild) {
    AppUpdater.downloadAndInstall({ url: downloadUrl });
  }
}`,
  },
  {
    id: "edge",
    title: "Next.js 15 & Vercel Edge SSR",
    category: "ROUTING // LAYER 02",
    metric: "187ms Turbopack",
    description: "Sub-20ms edge execution with dynamic server-side rendering, zero-cold-start edge middleware, and automated Core Web Vitals telemetry.",
    icon: Globe,
    color: "#38bdf8",
    bgGlow: "rgba(56, 189, 248, 0.15)",
    codeLanguage: "typescript",
    codeSnippet: `// Edge Proxy & Zero-Gate Middleware
export function middleware(req: NextRequest) {
  const isPublicBlueprint = req.nextUrl.pathname.startsWith('/blueprint');
  if (isPublicBlueprint) {
    return NextResponse.next(); // 0-auth friction for social referrals
  }
  return verifySession(req);
}`,
  },
  {
    id: "security",
    title: "Supabase RLS & GoTrue Firewall",
    category: "AUTH // LAYER 03",
    metric: "100% Zero-Trust RLS",
    description: "Row-Level Security on every single PostgreSQL table with subquery-optimized InitPlans (select auth.uid()) to eliminate security leaks.",
    icon: Shield,
    color: "#10b981",
    bgGlow: "rgba(16, 185, 129, 0.15)",
    codeLanguage: "sql",
    codeSnippet: `-- PRD §35: Zero-Trust RLS with InitPlan O(1) Optimization
CREATE POLICY "Admins moderate submissions" ON submissions
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) IN (SELECT id FROM admin_profiles WHERE role = 'SUPERADMIN'))
WITH CHECK (true);`,
  },
  {
    id: "ledger",
    title: "Immutable Double-Entry SQL Ledger",
    category: "DATABASE // LAYER 04",
    metric: "100% ACID Integrity",
    description: "Points are never stored as a mutable integer. Total scores are strictly derived from point_transactions with unique constraints preventing double-claims.",
    icon: Database,
    color: "#f59e0b",
    bgGlow: "rgba(245, 158, 11, 0.15)",
    codeLanguage: "sql",
    codeSnippet: `-- PRD §28: Idempotent Ledger Transaction Trigger
CREATE TRIGGER enforce_ledger_integrity
BEFORE INSERT ON point_transactions
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_task_scoring();`,
  },
  {
    id: "cdn",
    title: "Cloudflare R2 Zero-Egress CDN",
    category: "DISTRIBUTION // LAYER 05",
    metric: "$0.00 Permanent Egress",
    description: "Dual-cloud edge distribution layer uploading signed APK binaries and static assets to APAC edge bucket with 0 egress bandwidth fees.",
    icon: Layers,
    color: "#818cf8",
    bgGlow: "rgba(129, 140, 248, 0.15)",
    codeLanguage: "yaml",
    codeSnippet: `# GitHub Actions CI/CD Edge Deployment
- name: Deploy Signed APK to Cloudflare R2
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --endpoint-url https://1c88e2c0858b2ba6104fd20e79f8e681.r2.cloudflarestorage.com
  env:
    AWS_S3_BUCKET: ktcc-releases`,
  },
];

export function ArchitectureOrbit() {
  const [activeNode, setActiveNode] = useState<NodeData>(NODES[0]);
  const [pulsePath, setPulsePath] = useState<number | null>(null);

  const handleSelectNode = (node: NodeData, index: number) => {
    sound.playNodePulse();
    setActiveNode(node);
    setPulsePath(index);
    setTimeout(() => setPulsePath(null), 1200);
  };

  return (
    <section id="architecture" className="relative py-24 px-4 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1117] border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs mb-3 shadow-inner">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>// 3D NODAL ARCHITECTURE BLUEPRINT</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-sans uppercase">
          <DecodeText text="How I Architect Production Systems" />
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-3 font-mono">
          Click any node below to route live simulated data packets and inspect the underlying production engineering code.
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Nodal Pipeline */}
        <div className="lg:col-span-6 space-y-3">
          {NODES.map((node, index) => {
            const Icon = node.icon;
            const isSelected = activeNode.id === node.id;

            return (
              <motion.div
                key={node.id}
                onClick={() => handleSelectNode(node, index)}
                onMouseEnter={() => sound.playHover()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-300 backdrop-blur-md ${
                  isSelected
                    ? "bg-[#0d1117] border-white/30 shadow-2xl"
                    : "bg-[#080b10]/80 border-white/8 hover:border-white/20 hover:bg-[#0d1117]/60"
                }`}
                style={{
                  boxShadow: isSelected ? `0 0 25px ${node.bgGlow}` : "none",
                }}
              >
                {/* Active Indicator Accent Bar */}
                {isSelected && (
                  <motion.div
                    layoutId="activeGlowBar"
                    className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                    style={{ backgroundColor: node.color }}
                  />
                )}

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="p-2.5 rounded-lg border border-white/10 flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isSelected ? node.bgGlow : "rgba(255,255,255,0.03)",
                        color: node.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-wider text-gray-400">
                        {node.category}
                      </div>
                      <div className="text-sm md:text-base font-bold text-white font-sans flex items-center gap-2">
                        <span>{node.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        borderColor: `${node.color}40`,
                        color: node.color,
                        backgroundColor: `${node.color}15`,
                      }}
                    >
                      {node.metric}
                    </span>
                  </div>
                </div>

                {/* Circuit Flow Arrow Line */}
                {index < NODES.length - 1 && (
                  <div className="absolute -bottom-3.5 left-8 w-0.5 h-3 bg-white/10 z-0">
                    {pulsePath === index && (
                      <motion.div
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 12, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] -ml-0.5 shadow-lg shadow-[#00f0ff]"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: Code Telemetry & Deep-Dive Drawer */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-white/15 bg-[#080b10] p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-xs font-mono text-gray-400 ml-2">
                    {activeNode.id}.arch.{activeNode.codeLanguage}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono text-gray-400">
                  <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>PRODUCTION ARTIFACT</span>
                </div>
              </div>

              {/* Node Overview */}
              <div className="mb-4">
                <h3 className="text-xl font-black text-white font-sans flex items-center gap-2">
                  <span style={{ color: activeNode.color }}>●</span>
                  <span>{activeNode.title}</span>
                </h3>
                <p className="text-gray-300 text-xs md:text-sm mt-1.5 leading-relaxed font-mono">
                  {activeNode.description}
                </p>
              </div>

              {/* Code Viewer */}
              <div className="relative rounded-xl border border-white/10 bg-[#05070a] p-4 font-mono text-xs text-gray-200 overflow-x-auto">
                <pre className="leading-relaxed whitespace-pre font-mono">
                  <code>{activeNode.codeSnippet}</code>
                </pre>
              </div>

              {/* Bottom Quick Metric Pills */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>LATENCY:</span>
                  <span className="text-[#00f0ff] font-bold">SUB-20MS</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>SECURITY:</span>
                  <span className="text-[#10b981] font-bold">ACID VERIFIED</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>INFRA COST:</span>
                  <span className="text-[#f59e0b] font-bold">$0.00 / MO</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
