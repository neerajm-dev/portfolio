"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";

interface NodeData {
  id: string;
  label: string;
  category: string;
  metric: string;
  code: string;
}

const ARCH_NODES: NodeData[] = [
  {
    id: "01_CLIENT",
    label: "[01] UNIFIED WEB & ANDROID APK",
    category: "FRONTEND // NEXT.JS 15 + CAPACITOR",
    metric: "0ms Hybrid",
    code: `// Capacitor Native In-App Auto-Updater
export async function checkNativeUpdate() {
  const res = await fetch('https://pub-20a7a71855de4a6bb926242af24fb808.r2.dev/manifest.json');
  const { latestBuild, downloadUrl } = await res.json();
  if (APP_BUILD < latestBuild) {
    AppUpdater.install({ url: downloadUrl });
  }
}`,
  },
  {
    id: "02_EDGE",
    label: "[02] VERCEL EDGE SSR & ROUTING",
    category: "ROUTING // TURBOPACK",
    metric: "187ms Hot Reload",
    code: `// Zero-Gate Public Referral Middleware
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/blueprint')) {
    return NextResponse.next();
  }
  return verifySession(req);
}`,
  },
  {
    id: "03_AUTH",
    label: "[03] SUPABASE RLS FIREWALL",
    category: "SECURITY // POSTGRESQL RLS",
    metric: "Zero-Trust",
    code: `-- PRD §35: Zero-Trust RLS Optimization
CREATE POLICY "Admins moderate submissions" ON submissions
FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) IN (SELECT id FROM admin_profiles WHERE role = 'SUPERADMIN'));`,
  },
  {
    id: "04_LEDGER",
    label: "[04] IMMUTABLE DOUBLE-ENTRY SQL",
    category: "DATABASE // ACID LEDGER",
    metric: "100% ACID Integrity",
    code: `-- PRD §28: Idempotent Ledger Trigger
CREATE TRIGGER enforce_ledger_integrity
BEFORE INSERT ON point_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_duplicate_scoring();`,
  },
  {
    id: "05_CDN",
    label: "[05] CLOUDFLARE R2 ZERO-EGRESS",
    category: "STORAGE // APAC CDN",
    metric: "$0.00 Egress Fees",
    code: `# GitHub Actions Zero-Egress R2 Deployment
- name: Deploy Signed APK to Cloudflare R2
  uses: jakejarvis/s3-sync-action@master
  env:
    AWS_S3_BUCKET: ktcc-releases`,
  },
];

export function AsciiArchitecture() {
  const [selected, setSelected] = useState<NodeData>(ARCH_NODES[0]);

  const handleSelect = (node: NodeData) => {
    sound.playNodePulse();
    setSelected(node);
  };

  return (
    <div className="border border-[#00ff66]/40 bg-black p-4 sm:p-6 font-mono text-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.15)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#00ff66]/30 pb-2 mb-4 text-xs font-mono">
        <div className="font-bold tracking-wider">// 01: SYSTEM ARCHITECTURE &amp; PRODUCTION BLUEPRINT</div>
        <a
          href="https://ktccofficial.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => sound.playClick()}
          className="text-[#00ff66] hover:underline font-bold"
        >
          [ &gt; LAUNCH KTCC LIVE PLATFORM ]
        </a>
      </div>

      {/* ASCII Circuit Diagram */}
      <pre className="text-[9px] sm:text-[11px] leading-[1.2] text-[#00ff66] font-mono whitespace-pre overflow-x-auto p-3 bg-black border border-[#00ff66]/20 select-none">
{`+-----------------------------------------------------------------------------------+
|  [ CLIENT WEB/APK ] ===> [ NEXT.JS 15 EDGE ] ===> [ SUPABASE RLS FIREWALL ]      |
|         |                                                      |                  |
|         v                                                      v                  |
|  [ CAPACITOR BRIDGE ] <=== [ CLOUDFLARE R2 CDN ] <=== [ IMMUTABLE SQL LEDGER ]    |
+-----------------------------------------------------------------------------------+`}
      </pre>

      {/* Interactive Node Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-1.5 my-4">
        {ARCH_NODES.map((node) => {
          const isSelected = selected.id === node.id;
          return (
            <button
              key={node.id}
              onClick={() => handleSelect(node)}
              onMouseEnter={() => sound.playHover()}
              className={`p-2 text-left text-xs font-mono border transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.3)] font-bold"
                  : "bg-black border-[#00ff66]/30 text-[#00ff66]/70 hover:border-[#00ff66] hover:text-[#00ff66]"
              }`}
            >
              <div className="text-[9px] text-[#00ff66]/50">{node.id}</div>
              <div className="text-[11px] truncate">{node.label}</div>
              <div className="text-[9px] text-[#00ff66]/80 mt-1 font-bold">[{node.metric}]</div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Code View */}
      <div className="border border-[#00ff66]/30 bg-black p-3 text-xs">
        <div className="flex justify-between text-[10px] text-[#00ff66]/60 border-b border-[#00ff66]/20 pb-1 mb-2">
          <span>SOURCE ARTIFACT: {selected.category}</span>
          <span>100% PRODUCTION VERIFIED</span>
        </div>
        <pre className="text-[11px] leading-relaxed text-[#00ff66] font-mono whitespace-pre overflow-x-auto">
          <code>{selected.code}</code>
        </pre>
      </div>
    </div>
  );
}
