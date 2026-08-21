import { Project, StackCategory, SocialLink } from "@/types";

export const DEVELOPER_PROFILE = {
  name: "Neeraj M",
  handle: "neerajm-dev",
  title: "Solo Architect & Systems Engineer",
  age: 19,
  education: "Pursuing BCA @ SNCT (Kerala, India)",
  location: "Kerala, India 🇮🇳",
  status: "AVAILABLE FOR BUILDS",
  email: "ktcc.ofc@gmail.com",
  socials: {
    instagram: "https://instagram.com/neerajm_dev",
    github: "https://github.com/neerajm-dev",
    email: "mailto:ktcc.ofc@gmail.com",
  },
  flagshipUrl: "https://ktccofficial.vercel.app",
  portfolioUrl: "https://neerajm.vercel.app",
  customDomain: "https://neerajm.in",
  bio: "19-year-old solo systems architect building high-velocity Android engines, real-time tournament backends, and full-stack cloud platforms engineered with zero ongoing infrastructure expenses ($0.00/mo).",
  stats: [
    { label: "Cloud Infra Cost", value: "$0.00/mo", sub: "100% Free Tiers Forever" },
    { label: "APAC P99 Latency", value: "< 18ms", sub: "Cloudflare Edge + Vercel" },
    { label: "Ledger Consistency", value: "100%", sub: "Double-Entry ACID SQL" },
    { label: "Tournaments Managed", value: "50+", sub: "Car Parking Multiplayer" },
  ],
};

export const FLAGSHIP_PROJECT: Project = {
  id: "ktcc",
  title: "KTCC Platform",
  tagline: "Kerala Tourers Community Championship Platform",
  description:
    "Full-stack esports tournament automation platform for Car Parking Multiplayer. Features an immutable double-entry ledger database, automated CI/CD Android APK compilation via GitHub Actions, and high-speed APAC media delivery over Cloudflare R2 without egress fees.",
  category: "Full-Stack Web & Android Ecosystem",
  status: "LIVE PRODUCTION",
  badge: "FLAGSHIP SHOWCASE",
  liveUrl: "https://ktccofficial.vercel.app",
  repoUrl: "https://github.com/neerajm-dev",
  metrics: [
    { label: "Infrastructure Cost", value: "$0.00/month", highlight: true },
    { label: "Data Integrity", value: "Double-Entry Ledger" },
    { label: "APK Compilation", value: "Automated CI/CD" },
    { label: "CDN Egress Bandwidth", value: "Zero Egress ($0)" },
  ],
  techStack: [
    "Next.js 15 (App Router)",
    "React 19",
    "Supabase PostgreSQL",
    "Cloudflare R2 Storage",
    "GitHub Actions",
    "Capacitor Android",
    "Tailwind CSS 4",
    "Turbopack",
  ],
  highlights: [
    "Double-entry bookkeeping SQL engine prevents race conditions in tournament points and wallet balances.",
    "Automated headless Android APK builds triggered directly from GitHub repo commits.",
    "APAC asset distribution via Cloudflare R2 bucket proxy with 0 egress fees.",
    "Real-time leaderboards, automated bracket matching, and verified team registries.",
  ],
};

export const ZERO_DOLLAR_STACK: StackCategory[] = [
  {
    title: "Edge Compute & Frontend",
    description: "Global CDN edge deployment with zero warm-up cold starts",
    iconName: "Globe",
    items: [
      { name: "Vercel Hobby", role: "Next.js 15 Edge Hosting", tier: "Hobby Free", cost: "$0.00", badge: "Live" },
      { name: "Turbopack / React 19", role: "Zero-Latency Client Hydration", tier: "Open Source", cost: "$0.00" },
      { name: "Tailwind CSS 4", role: "High-Performance Style Engine", tier: "Open Source", cost: "$0.00" },
    ],
  },
  {
    title: "Data & Storage Systems",
    description: "ACID compliant transactional databases & unmetered asset distribution",
    iconName: "Database",
    items: [
      { name: "Supabase PostgreSQL", role: "Relational Ledger & Auth", tier: "Free Tier (500MB)", cost: "$0.00", badge: "ACID" },
      { name: "Cloudflare R2", role: "APAC Zero-Egress Media Bucket", tier: "10GB Free/mo", cost: "$0.00", badge: "0 Egress" },
    ],
  },
  {
    title: "CI/CD & Android Pipeline",
    description: "Automated test suites, container builds, and mobile artifacts",
    iconName: "Cpu",
    items: [
      { name: "GitHub Actions", role: "Automated Headless APK CI/CD", tier: "2,000 Free min/mo", cost: "$0.00", badge: "Automated" },
      { name: "Capacitor / Android SDK", role: "Cross-Platform Mobile Runtime", tier: "Native OSS", cost: "$0.00" },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "Instagram",
    handle: "@neerajm_dev",
    url: "https://instagram.com/neerajm_dev",
    icon: "Instagram",
    badge: "Daily Updates",
  },
  {
    name: "GitHub",
    handle: "neerajm-dev",
    url: "https://github.com/neerajm-dev",
    icon: "Github",
    badge: "Open Source",
  },
  {
    name: "Email",
    handle: "ktcc.ofc@gmail.com",
    url: "mailto:ktcc.ofc@gmail.com",
    icon: "Mail",
    badge: "Direct Contact",
  },
  {
    name: "Live Platform",
    handle: "ktccofficial.vercel.app",
    url: "https://ktccofficial.vercel.app",
    icon: "ExternalLink",
    badge: "Production",
  },
];

export const TERMINAL_COMMANDS = {
  help: `AVAILABLE COMMANDS:
  help      - Display this list of interactive commands
  whoami    - Show Neeraj M developer identity & profile
  ktcc      - Inspect the KTCC tournament flagship platform
  stack     - List the strict $0.00 cloud infrastructure stack
  stats     - View live telemetry & engineering metrics
  socials   - Output all active developer social handles
  challenge - Details about the Onam Vacation Portfolio Challenge
  clear     - Wipe the terminal display buffer`,

  whoami: `NEERAJ M | SOLO ARCHITECT & SYSTEMS ENGINEER
------------------------------------------------------
Age:        19 years old
Location:   Kerala, India 🇮🇳
Education:  BCA Student @ SNCT
Focus:      Full-Stack Android & Cloud Platforms
Ethos:      High-signal software engineered at $0.00/mo ongoing cost.
Status:     ● ACTIVE & AVAILABLE FOR HIGH-IMPACT BUILDS`,

  ktcc: `KTCC (KERALA TOURERS COMMUNITY CHAMPIONSHIP)
------------------------------------------------------
Type:       Full-Stack Esports & Community Platform
Live URL:   https://ktccofficial.vercel.app
Tech:       Next.js 15 + Supabase + Cloudflare R2 + GitHub Actions
Key Feat:   • Double-entry ledger prevents points race conditions
            • Automated Android APK CI/CD pipeline
            • Zero-egress APAC CDN storage
            • Full mobile responsiveness`,

  stack: `STRICT $0.00/MO CLOUD INFRASTRUCTURE ARCHITECTURE
------------------------------------------------------
• Compute:   Vercel Hobby Edge (Next.js 15 App Router)        [$0.00]
• Database:  Supabase PostgreSQL (ACID Ledger & Row Auth)     [$0.00]
• Storage:   Cloudflare R2 Object Bucket (Zero Egress)       [$0.00]
• CI/CD:     GitHub Actions Headless Android APK Builder      [$0.00]
• Styling:   Tailwind CSS 4 + TokyoNight Cyberpunk Tokens    [$0.00]
• TOTAL RECURRING MONTHLY INFRASTRUCTURE BILL:               $0.00/mo`,

  stats: `SYSTEM TELEMETRY & SYSTEM BENCHMARKS
------------------------------------------------------
• Architecture Cost:  $0.00 / month (100% Free Tiers Forever)
• Global Latency:     < 18ms (Cloudflare Edge APAC)
• Ledger Model:       Immutable Double-Entry Accounting
• Android Pipeline:   Automated GitHub Actions Matrix
• Uptime Goal:        99.98% High Availability`,

  socials: `CONNECT WITH NEERAJ M:
------------------------------------------------------
• Instagram:  https://instagram.com/neerajm_dev  (@neerajm_dev)
• GitHub:     https://github.com/neerajm-dev     (neerajm-dev / Neeraj M)
• Email:      ktcc.ofc@gmail.com
• Live App:   https://ktccofficial.vercel.app`,

  challenge: `ONAM VACATION BUILD-IN-PUBLIC CHALLENGE 🌴🚀
------------------------------------------------------
Documenting the build of a premier, hyper-interactive developer
portfolio live on Instagram & GitHub. Day 1 Scaffolding Complete!`,
};
