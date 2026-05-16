"use client";

interface Props {
  index: number;
}

export default function Cursor({ index }: Props) {
  return (
    <div className="cursor-blink w-1 h-10 bg-[#FFB700] absolute -left-1" />
  );
}
