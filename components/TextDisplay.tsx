import React, { useEffect, useMemo } from "react";
import splitText from "@/utils/wordSplit";
import keystrokeStore from "@/store/keystrokeStore";
import textStore from "@/store/TextStore";
import useUpdateText from "@/hooks/useUpdateText";

const TextDisplay = () => {
  const { position, setPosition } = keystrokeStore();
  const { text, toggleState } = textStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        const newPosition = Math.max(position - 1, 0);
        setPosition(newPosition);
        // FIX: pass the new position index so the store can untoggle the
        // correct character; passing null was likely a bug — adjust the
        // argument to match your toggleState signature if needed.
        toggleState(newPosition);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, setPosition, toggleState]); // FIX: added missing deps

  const paragraph =
    "Morning sunlight entered the quiet library while students prepared assignments, discussed creative ideas, and drank coffee peacefully Outside, gentle rain cooled the streets, creating a calm atmosphere throughout the city";
  const words = useMemo(() => splitText(paragraph), [paragraph]);
  useUpdateText(words);

  const textEntries = Object.entries(text) as [
    string,
    { value: string | null; position: number; matched?: boolean | null },
  ][];

  return (
    <div className="p-4 h-[60vh] text-gray-500 dark:text-gray-400 text-center flex justify-center items-center flex-wrap text-4xl tracking-[10px] font-bold px-[20vw] capitalize">
      {textEntries.map(([key, cell]) => {
        const index = Number(key);
        const ch = cell.value;
        const isMatched = cell.matched === true;
        const colorClass =
          ch == null
            ? "text-gray-500 dark:text-gray-400"
            : isMatched
              ? "text-white"
              : "text-red-500";
        return ch === " " ? (
          <span key={index} className="inline-block w-8" />
        ) : (
          <span key={index} className={colorClass}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export default TextDisplay;
