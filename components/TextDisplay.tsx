import { useEffect, useMemo, useRef } from "react";
import splitText from "@/utils/wordSplit";
import keystrokeStore from "@/store/keystrokeStore";
import textStore from "@/store/TextStore";
import typingSessionStore from "@/store/typingSessionStore";
import useUpdateText from "@/hooks/useUpdateText";
import wordMatch from "@/utils/wordMatch";
import Cursor from "./Cursor";
import StartStore from "@/store/StartStore";
import textTabStore from "@/store/textTabStore";
import textPassageStore from "@/store/textPassageStore";
import adaptiveData from "@/data/adaptive.json";
import codingData from "@/data/coding.json";
import normalData from "@/data/normal.json";
import symbolsData from "@/data/symbols.json";
import { getPassagesFromJson, type TabTextJson } from "@/utils/getTabPassages";

const TAB_TEXT: Record<"Normal" | "Coding" | "Symbols" | "Adaptive", TabTextJson> =
  {
    Normal: normalData as TabTextJson,
    Coding: codingData as TabTextJson,
    Symbols: symbolsData as TabTextJson,
    Adaptive: adaptiveData as TabTextJson,
  };

const TextDisplay = () => {
  const { state: start } = StartStore();
  const activeTab = textTabStore((s) => s.activeTab);
  const refreshNonce = textPassageStore((s) => s.refreshNonce);
  const { position, setPosition } = keystrokeStore();
  const { text, toggleState, getCharacter } = textStore();
  const prevStartRef = useRef(start);

  const paragraph = useMemo(() => {
    if (activeTab === "Zen") return "";
    const passages = getPassagesFromJson(TAB_TEXT[activeTab]);
    const n = passages.length;
    const idx = n > 0 ? refreshNonce % n : 0;
    return passages[idx] ?? "";
  }, [activeTab, refreshNonce]);

  const words = useMemo(() => splitText(paragraph), [paragraph, refreshNonce]);
  useUpdateText(words);

  useEffect(() => {
    if (activeTab === "Zen") return;
    keystrokeStore.setState({ position: 0, value: "" });
    textStore.getState().resetProgress();
  }, [activeTab]);

  useEffect(() => {
    const wasStarted = prevStartRef.current;
    prevStartRef.current = start;

    if (start && !wasStarted) {
      typingSessionStore.getState().beginSession();
    }
    if (!start && wasStarted) {
      keystrokeStore.setState({ position: 0, value: "" });
      textStore.getState().resetProgress();
    }
  }, [start]);

  useEffect(() => {
    const appendKeystroke = (payload: {
      key: string;
      expectedChar: string | null;
      matched: boolean | null;
      position: number;
    }) => {
      if (!typingSessionStore.getState().sessionId) return;
      typingSessionStore.getState().appendEvent({
        at: Date.now(),
        ...payload,
      });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (textTabStore.getState().activeTab === "Zen") return;
      if (!start) return;
      if (e.key === "Backspace") {
        const newPosition = position - 1 < 0 ? 0 : position - 1;
        appendKeystroke({
          key: "Backspace",
          expectedChar: null,
          matched: null,
          position: newPosition,
        });
        setPosition(newPosition);
        toggleState(newPosition, null);
      } else if (e.key === "Enter" && !e.ctrlKey) {
        const character = getCharacter(position)?.value ?? null;
        if (character !== "\n") return;
        appendKeystroke({
          key: "Enter",
          expectedChar: character,
          matched: true,
          position,
        });
        toggleState(position, true);
        setPosition(position + 1);
      } else if (e.key.length > 1) {
        // Ignore keys that are not single characters
        return;
      } else {
        const character = getCharacter(position)?.value ?? null;
        const ismathched = wordMatch(e.key, character ?? "");
        appendKeystroke({
          key: e.key,
          expectedChar: character,
          matched: ismathched,
          position,
        });
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
  }, [position, setPosition, toggleState, getCharacter, start]);

  if (activeTab === "Zen") {
    return (
      <div className="mt-4 flex justify-center px-6 md:px-[10vw]">
        <textarea
          className="border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring min-h-[60vh] w-full max-w-5xl resize-y rounded-xl border bg-white p-6 text-lg shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:bg-[#1a1a1a]"
          placeholder="Write freely — no prompts, no scoring."
          spellCheck={false}
          aria-label="Zen writing area"
        />
      </div>
    );
  }

  const displayClass =
    activeTab === "Coding"
      ? "font-mono text-2xl tracking-normal md:text-3xl"
      : "text-4xl tracking-[10px]";

  const textEntries = Object.entries(text) as [
    string,
    { value: string | null; position: number; matched: boolean | null },
  ][];

  return (
    <div
      className={`p-4 h-[60vh] text-gray-500 dark:text-gray-400 text-center flex justify-center items-center flex-wrap font-bold px-[20vw] ${displayClass}`}
    >
      {textEntries.map(([key, cell]) => {
        const index = Number(key);
        const ch = cell.value;
        const isMatched = cell.matched;
        const showCursor = index === position;
        const colorClass =
          isMatched == null
            ? "text-gray-500 dark:text-gray-400"
            : isMatched
              ? "text-green-500 dark:text-gray-300"
              : "text-red-500";
        return ch === " " ? (
          <span
            key={index}
            className="block w-8 relative items-top justify-start "
          >
            <div className="top-[-18] relative">
              {showCursor && <Cursor index={index} />}
            </div>
          </span>
        ) : ch === "\n" ? (
          <span key={index} className="w-full basis-full" aria-hidden />
        ) : (
          <span
            key={index}
            className={`${colorClass} inline-flex items-center relative whitespace-pre`}
          >
            {showCursor && <Cursor index={index} />}
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export default TextDisplay;
