"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";
import { DecodeText } from "@/components/ui/decode-text";
import { Layers, Database, Shield, Globe, Smartphone, ArrowUpRight, Code2 } from "lucide-react";

interface NodeData {
  id: string;
  title: string;
  category: string;
  metric: string;
  color: string;
  codeSnippet: string;
}

const KTCC_NODES: NodeData[] = [
  {
    id: "client",
    title: "Web & Android Release APK",
    category: "LAYER 01 // FRONTEND",
    metric: "0ms Hybrid",
    color: "#00f0ff",
    codeSnippet: `// Capacitor Native In-App Updater
export async function checkNativeUpdate() {
  const res = await fetch('https://pub-20a7a71855de4a6bb926242af24fb808.r2.dev/manifest.json');
  const { latestBuild, downloadUrl } = await res.json();
  if (APP_BUILD < latestBuild) {
    AppUpdater.install({ url: downloadUrl });
  }
}`,
  },
  {
    id: "edge",
    title: "Next.js 15 & Turbopack SSR",
    category: "LAYER 02 // ROUTING",
    metric: "187ms Edge",
    color: "#38bdf8",
    codeSnippet: `// Zero-Gate Public Route Middleware
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/blueprint')) {
    return NextResponse.next();
  }
  return verifySession(req);
}`,
  },
  {
    id: "security",
    title: "Supabase GoTrue & RLS",
    category: "LAYER 03 // FIREWALL",
    metric: "Zero-Trust",
    color: "#10b981",
    codeSnippet: `-- PRD §35: Zero-Trust RLS Optimization
CREATE POLICY "Admins moderate submissions" ON submissions
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) IN (SELECT id FROM admin_profiles WHERE role = 'SUPERADMIN'));`,
  },
  {
    id: "ledger",
    title: "Immutable Double-Entry SQL",
    category: "LAYER 04 // LEDGER",
    metric: "100% ACID",
    color: "#f59e0b",
    codeSnippet: `-- PRD §28: Idempotent Ledger Trigger
CREATE TRIGGER enforce_ledger_integrity
BEFORE INSERT ON point_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_scoring();`,
  },
  {
    id: "cdn",
    title: "Cloudflare R2 APAC CDN",
    category: "LAYER 05 // EDGE",
    metric: "$0 Egress",
    color: "#818cf8",
    codeSnippet: `# GitHub Actions Zero-Egress R2 Deployment
- name: Deploy Signed APK to Cloudflare R2
  uses: jakejarvis/s3-sync-action@master
  env:
    AWS_S3_BUCKET: ktcc-releases`,
  },
];

export function IslandKtcc() {
  const [selectedNode, setSelectedNode] = useState<NodeData>(KTCC_NODES[0]);

  const handleSelect = (node: NodeData) => {
    sound.playNodePulse();
    setSelectedNode(node);
  };

  return (
    <div className="w-[420px] sm:w-[480px] rounded-3xl border border-[#00f0ff]/30 bg-[#080b10]/95 p-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden font-mono">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold">// 01</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 font-bold">
            FLAGSHIP ARCHITECTURE
          </span>
        </div>
        <a
          href="https://ktccofficial.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.playClick()}
          className="text-[#00f0ff] hover:underline text-[11px] flex items-center gap-1 font-bold"
        >
          <span>LAUNCH KTCC</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Title */}
      <h2 className="text-xl font-black text-white font-sans uppercase">
        KTCC Tournament Platform
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Full-Stack Android APK & Web with $0.00 infrastructure cost.
      </p>

      {/* Interactive 5-Layer Node Pills */}
      <div className="space-y-2 mt-4">
        {KTCC_NODES.map((node) => {
          const isSelected = selectedNode.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node)}
              onMouseEnter={() => sound.playHover()}
              className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 active:scale-98 cursor-pointer ${
                isSelected
                  ? "bg-[#0d1117] border-white/30 shadow-lg"
                  : "bg-white/[0.02] border-white/8 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ color: node.color }} className="text-xs font-bold">
                  {isSelected ? "●" : "○"}
                </span>
                <div>
                  <div className="text-[9px] text-gray-500 font-bold">{node.category}</div>
                  <div className="text-xs font-bold text-white">{node.title}</div>
                </div>
              </div>

              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                style={{
                  color: node.color,
                  borderColor: `${node.color}40`,
                  backgroundColor: `${node.color}15`,
                }}
              >
                {node.metric}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Code Telemetry Snippet */}
      <div className="mt-4 p-3 rounded-xl bg-[#05070a] border border-white/10 text-[11px] text-gray-300 overflow-x-auto max-h-36">
        <div className="flex items-center justify-between text-[10px] text-gray-500 mb-2 border-b border-white/5 pb-1">
          <span>{selectedNode.id}.arch.ts</span>
          <span className="text-[#00f0ff]">PRODUCTION CODE</span>
        </div>
        <pre className="whitespace-pre leading-relaxed font-mono">
          <code>{selectedNode.codeSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
