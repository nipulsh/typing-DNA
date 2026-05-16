import { useEffect, useMemo } from "react";
import splitText from "@/utils/wordSplit";
import keystrokeStore from "@/store/keystrokeStore";
import textStore from "@/store/TextStore";
import useUpdateText from "@/hooks/useUpdateText";
import wordMatch from "@/utils/wordMatch";

const TextDisplay = () => {
  const { position, setPosition } = keystrokeStore();
  const { text, toggleState, getCharacter } = textStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        const newPosition = position - 1;
        setPosition(newPosition);
        toggleState(newPosition, null);
      } else {
        const character = getCharacter(position)?.value ?? null;
        const ismathched = wordMatch(e.key, character ?? "");
        if (ismathched) {
          toggleState(position, true);
          setPosition(position + 1);
        } else {
          toggleState(position, false);
          setPosition(position + 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [position, setPosition, toggleState]);
  const paragraph =
    "Morning sunlight entered the quiet library while students prepared assignments, discussed creative ideas, and drank coffee peacefully Outside, gentle rain cooled the streets, creating a calm atmosphere throughout the city";
  const words = useMemo(() => splitText(paragraph), [paragraph]);
  useUpdateText(words);

  const textEntries = Object.entries(text) as [
    string,
    { value: string | null; position: number; matched: boolean | null },
  ][];

  return (
    <div className="p-4 h-[60vh] text-gray-500 dark:text-gray-400 text-center flex justify-center items-center flex-wrap text-4xl tracking-[10px] font-bold px-[20vw] capitalize">
      {textEntries.map(([key, cell]) => {
        const index = Number(key);
        const ch = cell.value;
        const isMatched = cell.matched;
        const colorClass =
          isMatched == null
            ? "text-gray-500 dark:text-gray-400"
            : isMatched
              ? "text-green-500 dark:text-gray-300"
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
