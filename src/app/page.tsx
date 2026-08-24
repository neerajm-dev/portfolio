import { DeveloperDesk3D } from "@/components/desk-3d/developer-desk-3d";

export default function Home() {
  return (
    <main className="fixed inset-0 h-[100dvh] w-screen bg-black text-[#00ff66] font-mono selection:bg-[#00ff66] selection:text-black overflow-hidden touch-none">
      <DeveloperDesk3D />
    </main>
  );
}
