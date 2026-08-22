import { DeveloperDesk3D } from "@/components/desk-3d/developer-desk-3d";

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black text-[#00ff66] font-mono selection:bg-[#00ff66] selection:text-black overflow-hidden">
      <DeveloperDesk3D />
    </main>
  );
}
