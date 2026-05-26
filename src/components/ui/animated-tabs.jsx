import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} Tab
 * @property {string} id
 * @property {string} label
 * @property {React.ReactNode} content
 */

/**
 * @typedef {Object} AnimatedTabsProps
 * @property {Tab[]} [tabs]
 * @property {string} [defaultTab]
 * @property {string} [className]
 */

/**
 * @param {AnimatedTabsProps} props
 */
const AnimatedTabs = ({
  tabs = [],
  defaultTab,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  if (!tabs?.length) return null;

  return (
    <div className={cn("w-full flex flex-col gap-y-4", className)}>
      <div className="flex gap-2 flex-wrap bg-[#1A1A1A]/5 backdrop-blur-sm p-1.5 rounded-2xl border border-black/5 self-start">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative px-6 py-2.5 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors duration-500",
              activeTab === tab.id ? "text-white" : "text-black/40 hover:text-black/60"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-bg"
                className="absolute inset-0 bg-[#1A1A1A] shadow-xl rounded-xl"
                transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="relative min-h-[400px]">
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{
                  opacity: 0,
                  scale: 0.98,
                  y: 10,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, y: -10, filter: "blur(10px)" }}
                transition={{
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="w-full"
              >
                {tab.content}
              </motion.div>
            )
        )}
      </div>
    </div>
  );
};

export { AnimatedTabs };
