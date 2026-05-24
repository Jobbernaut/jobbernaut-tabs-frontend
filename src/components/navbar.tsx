"use client";

import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700">
          <Image src="/logo.png" alt="Jobbernaut Logo" width={20} height={20} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-sm">Tabs</span>
          <span className="text-zinc-500 text-xs">by Jobbernaut</span>
        </div>
      </div>

      <Button
        variant="ghost"
        className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
        onClick={() => router.push("/resume")}
      >
        <FileText className="w-4 h-4" />
        Master Resume
      </Button>
    </nav>
  );
}
