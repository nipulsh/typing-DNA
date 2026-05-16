import React, { useEffect } from "react";
import splitText from "@/utils/wordSplit";
import keystrokeStore from "@/store/keystrokeStore";
import textStore from "@/store/TextStore";
import useUpdateText from "@/hooks/useUpdateText";

const TextDisplay = () => {
  const { position, setPosition } = keystrokeStore();
  const { text, toggleState, getCharacter } = textStore();

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
  const words = splitText(paragraph);
  useUpdateText(words);

  // FIX: ensure object entries are typed as string values for ReactNode compatibility
  const textEntries = Object.entries(text) as unknown as [string, string][];

  return (
    <div className="p-4 h-[60vh] text-gray-500 dark:text-gray-400 text-center flex justify-center items-center flex-wrap text-4xl tracking-[10px] font-bold px-[20vw] capitalize">
      {textEntries.map(([key, char]) => {
        const index = Number(key);
        return char === " " ? (
          <span key={index} className="inline-block w-8" />
        ) : (
          <span
            key={index}
            // FIX: "white" → "text-white", "red-500" → "text-red-500"
            className={
              (getCharacter(index) as string | undefined) === "matched"
                ? "text-white"
                : "text-red-500"
            }
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default TextDisplay;
