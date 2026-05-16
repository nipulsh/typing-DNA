"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import useStartStore from "@/store/StartStore";

export function RestartButton() {
  const { state, setState } = useStartStore();

  function handleClick() {
    setState(!state);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent triggering while typing in inputs
      const target = e.target as HTMLElement;

      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Space shortcut
      if (e.altKey && e.code === "KeyS") {
        e.preventDefault();
        handleClick();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row select-none">
      <Button
        variant="outline"
        onClick={(e) => {
          e.currentTarget.blur();
          handleClick();
        }}
      >
        {state ? "Stop" : "Start"}
      </Button>
    </div>
  );
}
