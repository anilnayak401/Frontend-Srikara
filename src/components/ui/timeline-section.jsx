import * as React from "react";
import { cn } from "@/lib/utils";
import { DIcons } from "dicons";

/**
 * @name Timeline Container
 */
export function TimelineContainer({ children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center gap-3 md:order-2">
      {children}
    </div>
  );
}

/**
 * @name Timeline Event
 */
export function TimelineEvent({
  label,
  message,
  icon,
  isLast = false,
}) {
  const Icon = DIcons[icon.name];
  return (
    <div className="group relative -m-2 flex gap-4 border border-transparent p-2">
      <div className="relative">
        <div
          className={cn(
            "rounded-full border bg-background p-2",
            icon.borderColor
          )}
        >
          {Icon ? <Icon className={cn("h-4 w-4", icon.textColor)} /> : <div className="h-4 w-4 bg-gray-200 rounded-full" />}
        </div>
        {!isLast ? (
          <div className="absolute inset-x-0 mx-auto h-full w-[2px] bg-muted mt-2" />
        ) : null}
      </div>
      <div className="mt-1 flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-white/90">{label}</p>
        </div>
        <p className="text-sm text-white/50 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

const timelineData = [
  {
    label: "Choose Your Design",
    message: "Browse and select a design that fits your needs, then access your personalized dashboard.",
    icon: {
      name: "Shapes",
      textColor: "text-orange-500",
      borderColor: "border-orange-500/40",
    },
  },
  {
    label: "Provide Your Brief",
    message: "Share your design preferences and requirements with us.",
    icon: {
      name: "Send",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/40",
    },
  },
  {
    label: "Receive Your Designs",
    message: "Get your initial designs within 48 hours.",
    icon: {
      name: "Check",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/40",
    },
  },
  {
    label: "Request Revisions",
    message: "We’re committed to perfection—request as many revisions as needed until you’re satisfied.",
    icon: {
      name: "Repeat",
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
  {
    label: "Get Final Files",
    message: "Once approved, we’ll deliver the final files to you.",
    icon: {
      name: "Download",
      textColor: "text-green-500",
      borderColor: "border-green-500/40",
    },
  },
];

export function Timeline() {
  return (
    <div className="w-full max-w-3xl">
      <TimelineContainer>
        {timelineData.map((event, i) => (
          <TimelineEvent
            key={event.message}
            isLast={i === timelineData.length - 1}
            {...event}
          />
        ))}
      </TimelineContainer>
    </div>
  );
}
