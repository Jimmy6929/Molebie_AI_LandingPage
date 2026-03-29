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

export function OsTabs() {
  const [activeTab, setActiveTab] = useState<OS>("unix");

  useEffect(() => {
    setActiveTab(detectOS());
  }, []);

  const command =
    activeTab === "unix" ? INSTALL_COMMAND_UNIX : INSTALL_COMMAND_WINDOWS;

  return (
    <div className="w-full max-w-2xl">
      <div className="flex gap-[3px] mb-[3px]">
        <button
          onClick={() => setActiveTab("unix")}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "unix"
              ? "bg-accent-yellow text-base-black"
              : "border-2 border-accent-yellow/40 text-bg-white hover:border-accent-yellow"
          }`}
        >
          macOS / Linux
        </button>
        <button
          onClick={() => setActiveTab("windows")}
          className={`px-6 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "windows"
              ? "bg-accent-yellow text-base-black"
              : "border-2 border-accent-yellow/40 text-bg-white hover:border-accent-yellow"
          }`}
        >
          Windows (WSL2)
        </button>
      </div>
      <div className="relative border-2 border-accent-yellow bg-base-black p-6">
        <code className="font-mono text-sm md:text-base text-accent-yellow break-all">
          {command}
        </code>
        <CopyButton text={command} />
      </div>
    </div>
  );
}
