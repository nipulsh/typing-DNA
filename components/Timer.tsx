import {
  useState,
  useRef,
  useEffect,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import { motion } from "framer-motion";
import useStartStore from "@/store/StartStore";

export default function Timer() {
  const { state } = useStartStore();
  const [seconds, setSeconds] = useState(59);
  const [running, setRunning] = useState(false);
  const [timerHeight, setTimerHeight] = useState(160);
  const timerRef = useRef<HTMLDivElement | null>(null);

  const handleSecondsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSeconds(Number.isNaN(value) ? 0 : Math.max(0, value));
  };

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 0) {
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    setRunning(state);
  }, [state]);

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
      className="h-40 w-55 absolute top-15 left-10 bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 font-mono p-4"
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
