"use client";

import { useRouter } from "next/navigation";
import { FileText, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="w-full bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left — Logo */}
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

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm"
          onClick={() => router.push("/resume")}
        >
          <FileText className="w-4 h-4" />
          Master Resume
        </Button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-zinc-700">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name ?? "User"}
                className="w-8 h-8 rounded-full border border-zinc-600"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-zinc-700 border border-zinc-600 flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}

            <div className="flex flex-col leading-tight">
              {user.name && (
                <span className="text-white text-sm font-medium">
                  {user.name}
                </span>
              )}
              {user.email && (
                <span className="text-zinc-500 text-xs">{user.email}</span>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-500 hover:text-red-400 transition-colors"
              onClick={() =>
                signOut({
                  callbackUrl: "/",
                  redirect: true,
                })
              }
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
