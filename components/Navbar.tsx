"use client";

import Image from "next/image";
import React, { useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Settings } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("Normal");
  return (
    <div className="p-5 flex items-center justify-between">
      <div>
        <Image src={"/logo_text.svg"} alt="logo" width={100} height={100} />
      </div>
      <div>
        <ul className="flex space-x-4">
          <li onClick={() => setActiveTab("Normal")} className={activeTab === "Normal" ? "text-primary cursor-pointer underline" : "text-gray-500 cursor-pointer"}>Normal</li>
          <li onClick={() => setActiveTab("Coding")} className={activeTab === "Coding" ? "text-primary cursor-pointer underline" : "text-gray-500 cursor-pointer"}>Coding</li>
          <li onClick={() => setActiveTab("Symbols")} className={activeTab === "Symbols" ? "text-primary cursor-pointer underline" : "text-gray-500 cursor-pointer"}>Symbols</li>
          <li onClick={() => setActiveTab("Adaptive")} className={activeTab === "Adaptive" ? "text-primary cursor-pointer underline" : "text-gray-500 cursor-pointer"}>Adaptive</li>
          <li onClick={() => setActiveTab("Zen")} className={activeTab === "Zen" ? "text-primary cursor-pointer underline" : "text-gray-500 cursor-pointer"}>Zen</li>
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
