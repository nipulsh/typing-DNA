import { useState, useRef, useEffect, type CSSProperties } from "react";
import { motion } from "framer-motion";
import useStartStore from "@/store/StartStore";
import typingSessionStore from "@/store/typingSessionStore";

export default function Timer() {
  const { state, timer } = useStartStore();
  const [seconds, setSeconds] = useState(timer);
  const [running, setRunning] = useState(false);
  const [timerHeight, setTimerHeight] = useState(160);
  const timerRef = useRef<HTMLDivElement | null>(null);
  const prevStateRef = useRef(state);
  const completionSentRef = useRef(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          setRunning(false);
          return 0;
        }
        const next = prev - 1;
        if (next === 0) {
          setRunning(false);
          if (!completionSentRef.current) {
            completionSentRef.current = true;
            const payload = typingSessionStore.getState().getSessionForPersist();
            typingSessionStore.getState().clearAfterPersist();
            useStartStore.getState().setState(false);
            void (async () => {
              if (!payload) return;
              try {
                await fetch("/api/keystroke", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    sessionId: payload.sessionId,
                    completed: true,
                    events: payload.events,
                  }),
                });
              } catch {
                /* ignore */
              }
            })();
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    setRunning(state);
  }, [state]);

  useEffect(() => {
    const wasStarted = prevStateRef.current;
    prevStateRef.current = state;
    if (state && !wasStarted) {
      completionSentRef.current = false;
      setSeconds(timer);
    }
    if (!state && wasStarted) {
      setSeconds(timer);
    }
  }, [state, timer]);

  useEffect(() => {
    if (!state) {
      setSeconds(timer);
    }
  }, [timer, state]);

  useEffect(() => {
    if (!timerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setTimerHeight(entry.contentRect.height);
      }
    });

    observer.observe(timerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={timerRef}
      style={
        {
          "--timer-height": `${timerHeight}px`,
        } as CSSProperties
      }
      className="h-auto w-auto absolute top-25 left-20 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 font-mono p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        className="flex items-center justify-center"
      >
        <span className="font-mono text-4xl leading-none text-white">
          {seconds}
        </span>
      </motion.div>
    </div>
  );
}
