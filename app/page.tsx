"use client";

import Navbar from "@/components/Navbar";
import TextDisplay from "@/components/TextDisplay";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { RestartButton } from "@/components/ui/RestartButton";

export default function Home() {
  return (
    <div>
      <div className="bg-white h-screen dark:bg-[#0d0d0d] overflow-hidden">
        <div>
          <Navbar />
        </div>
        <div className="mt-15">
          <TextDisplay />
        </div>
        <div>
          {/* <Keyboard rd onChange={(input) => console.log(input)} /> */}
        </div>
        <div className="mt-10 flex justify-center cursor-pointer hover:scale-105 transition-all duration-300">
          <RestartButton />
        </div>
      </div>
    </div>
  );
}
