"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface TimeAgoCellProps {
  date: string | number | Date;
}

export const TimeAgoCell: React.FC<TimeAgoCellProps> = ({ date }) => {
  if (!date) {
    return null;
  }

  const dateObj = new Date(date);
  const relativeTime = formatDistanceToNow(dateObj, { addSuffix: true });
  const fullDateTime = dateObj.toLocaleString();

  return (
    <Tooltip>
      <TooltipTrigger>{relativeTime}</TooltipTrigger>
      <TooltipContent>{fullDateTime}</TooltipContent>
    </Tooltip>
  );
};
