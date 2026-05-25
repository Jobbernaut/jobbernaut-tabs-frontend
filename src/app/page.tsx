"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { FaLinkedin } from "react-icons/fa";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center px-6">
      <Card className="w-full max-w-sm bg-zinc-800 border-zinc-700">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-zinc-700 border border-zinc-600 shadow-md">
            <Image
              src="/logo.png"
              alt="Jobbernaut Logo"
              width={60}
              height={60}
            />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Tabs
            </h1>
            <span className="text-zinc-500 text-xs font-semibold tracking-widest uppercase">
              Dashboard
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-zinc-400 text-sm text-center leading-relaxed">
            Become a Jobbernaut today and navigate the vast space of the job
            market.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <button
            onClick={() => signIn("cognito", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center gap-3 w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 shadow-md"
          >
            <FaLinkedin className="w-5 h-5" />
            Continue with LinkedIn
          </button>
          <p className="text-zinc-600 text-xs">
            By continuing, you agree to our Terms of Service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
