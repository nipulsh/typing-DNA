"use client"

import { div, div as MotionDiv } from "framer-motion/m";

export default function Cursor() {
  return (
    <MotionDiv initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }} className="w-1 h-full bg-gray-500 dark:bg-[#FFB700]" />
  )
}