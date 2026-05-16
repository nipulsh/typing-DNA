"use client";

import Image from "next/image";
import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Settings } from "lucide-react";
import Link from "next/link";
import TimerDurationMenu from "@/components/TimerDurationMenu";
import textTabStore, { type TextTab } from "@/store/textTabStore";

const Navbar = () => {
  const activeTab = textTabStore((s) => s.activeTab);
  const setActiveTab = textTabStore((s) => s.setActiveTab);
  const tabClass = (tab: TextTab) =>
    activeTab === tab
      ? "text-primary cursor-pointer underline"
      : "text-gray-500 cursor-pointer";

  return (
    <div className="p-5 flex items-center justify-between gap-4">
      <div className="flex shrink-0 items-center gap-3">
        <Image src={"/logo_text.svg"} alt="logo" width={100} height={100} />
        <TimerDurationMenu />
      </div>
      <div>
        <ul className="flex space-x-4">
          <li onClick={() => setActiveTab("Normal")} className={tabClass("Normal")}>
            Normal
          </li>
          <li onClick={() => setActiveTab("Coding")} className={tabClass("Coding")}>
            Coding
          </li>
          <li onClick={() => setActiveTab("Symbols")} className={tabClass("Symbols")}>
            Symbols
          </li>
          <li onClick={() => setActiveTab("Adaptive")} className={tabClass("Adaptive")}>
            Adaptive
          </li>
          <li onClick={() => setActiveTab("Zen")} className={tabClass("Zen")}>
            Zen
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/settings">
        <Settings className="w-6 h-6 cursor-pointer hover:scale-105 transition-all duration-300" />
        </Link>
          <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
