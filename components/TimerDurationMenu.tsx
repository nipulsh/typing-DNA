"use client";

import { useEffect, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useStartStore from "@/store/StartStore";
import { cn } from "@/lib/utils";

const PRESETS = [15, 30, 45, 60] as const;

function clampDuration(value: number) {
  if (!Number.isFinite(value)) return 60;
  return Math.min(3600, Math.max(1, Math.round(value)));
}

export default function TimerDurationMenu() {
  const { timer, setTimer, state } = useStartStore();
  const [open, setOpen] = useState(false);
  const [customDraft, setCustomDraft] = useState(() => String(timer));

  useEffect(() => {
    if (open) setCustomDraft(String(timer));
  }, [open, timer]);

  const applyPreset = (seconds: number) => {
    setTimer(seconds);
    setOpen(false);
  };

  const applyCustom = () => {
    const parsed = parseInt(customDraft, 10);
    setTimer(clampDuration(parsed));
    setOpen(false);
  };

  const isPreset = (PRESETS as readonly number[]).includes(timer);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={state}
          className="gap-1.5 font-mono tabular-nums"
          aria-label="Choose test timer length"
        >
          {timer}s
          <ChevronDownIcon className="size-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-40">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Timer (seconds)
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {PRESETS.map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => applyPreset(s)}
            className="justify-between gap-2 font-mono tabular-nums"
          >
            {s}s
            {timer === s ? (
              <CheckIcon className="size-4 shrink-0 opacity-80" />
            ) : (
              <span className="size-4 shrink-0" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            className="gap-2 font-mono data-open:bg-accent"
            inset={false}
          >
            Custom…
            {!isPreset ? (
              <CheckIcon className="ml-auto size-4 shrink-0 opacity-80" />
            ) : null}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-44 p-2">
            <label className="mb-1.5 block text-xs text-muted-foreground">
              Seconds (1–3600)
            </label>
            <input
              type="number"
              min={1}
              max={3600}
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              className={cn(
                "h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-sm tabular-nums",
                "outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
              )}
            />
            <Button
              type="button"
              size="sm"
              className="mt-2 w-full"
              onClick={applyCustom}
            >
              Apply
            </Button>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
