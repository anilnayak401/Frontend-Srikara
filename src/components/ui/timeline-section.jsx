import * as React from "react";
import { cn } from "@/lib/utils";
import { CalendarCheck, Stethoscope, ClipboardList, HeartPulse, Home } from "lucide-react";

const LucideIcons = {
  CalendarCheck,
  Stethoscope,
  ClipboardList,
  HeartPulse,
  Home,
};

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
  const Icon = LucideIcons[icon.name];
  return (
    <div className="group relative -m-2 flex gap-4 border border-transparent p-2">
      <div className="relative">
        <div
          className={cn(
            "rounded-full border bg-white p-2 shadow-sm",
            icon.borderColor
          )}
        >
          {Icon ? <Icon className={cn("h-4 w-4", icon.textColor)} /> : <div className="h-4 w-4 bg-gray-200 rounded-full" />}
        </div>
        {!isLast ? (
          <div className="absolute inset-x-0 mx-auto h-full w-[2px] bg-[#8B1A4A]/10 mt-2" />
        ) : null}
      </div>
      <div className="mt-1 flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-[#1A202C]">{label}</p>
        </div>
        <p className="text-sm text-[#4A4A4A] leading-relaxed">{message}</p>
      </div>
    </div>
  );
}

const timelineData = [
  {
    label: "Book Your Appointment",
    message: "Reach us by phone, WhatsApp or the website and get a confirmed slot with the right specialist.",
    icon: {
      name: "CalendarCheck",
      textColor: "text-[#8B1A4A]",
      borderColor: "border-[#8B1A4A]/40",
    },
  },
  {
    label: "Consultation & Diagnosis",
    message: "A detailed evaluation with advanced imaging and diagnostics for a complete clinical picture.",
    icon: {
      name: "Stethoscope",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/40",
    },
  },
  {
    label: "Personalised Treatment Plan",
    message: "Your specialist walks you through the options, expected outcomes and transparent costs.",
    icon: {
      name: "ClipboardList",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/40",
    },
  },
  {
    label: "Advanced Treatment",
    message: "Robotic-assisted surgery and evidence-based protocols inside NABH-standard operating theatres.",
    icon: {
      name: "HeartPulse",
      textColor: "text-rose-500",
      borderColor: "border-rose-500/40",
    },
  },
  {
    label: "Recovery & Follow-up",
    message: "Structured rehabilitation and scheduled reviews until you are back to the life you love.",
    icon: {
      name: "Home",
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
