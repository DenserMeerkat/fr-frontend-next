"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function ModeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "group/toggle extend-touch-target size-8 cursor-pointer",
              className
            )}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 3l0 18" />
              <path d="M12 9l4.65 -4.65" />
              <path d="M12 14.3l7.37 -7.37" />
              <path d="M12 19.6l8.85 -8.85" />
            </svg>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle theme</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
