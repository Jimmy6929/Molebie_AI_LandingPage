"use client";

import { useState, useEffect } from "react";
import { CopyButton } from "./copy-button";
import { INSTALL_COMMAND_UNIX, INSTALL_COMMAND_WINDOWS } from "@/lib/constants";

type OS = "unix" | "windows";

function detectOS(): OS {
  if (typeof window === "undefined") return "unix";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("win")) return "windows";
  return "unix";
}

export function OsTabs({ inverted = false }: { inverted?: boolean }) {
  const [activeTab, setActiveTab] = useState<OS>("unix");

  useEffect(() => {
    setActiveTab(detectOS());
  }, []);

  const command =
    activeTab === "unix" ? INSTALL_COMMAND_UNIX : INSTALL_COMMAND_WINDOWS;

  const activeClass = inverted
    ? "bg-base-black text-accent-yellow"
    : "bg-accent-yellow text-base-black";

  const inactiveClass = inverted
    ? "border-2 border-base-black/40 text-base-black hover:border-base-black"
    : "border-2 border-accent-yellow/40 text-bg-white hover:border-accent-yellow";

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-[3px] mb-[3px]">
        <button
          onClick={() => setActiveTab("unix")}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "unix" ? activeClass : inactiveClass
          }`}
        >
          macOS / Linux
        </button>
        <button
          onClick={() => setActiveTab("windows")}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "windows" ? activeClass : inactiveClass
          }`}
        >
          Windows (WSL2)
        </button>
      </div>
      <div className="flex items-center gap-2 border-2 border-base-black bg-base-black p-4">
        <code className="font-mono text-sm md:text-base text-accent-yellow break-all flex-1 mr-2">
          {command}
        </code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
