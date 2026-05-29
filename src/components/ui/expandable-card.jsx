import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpandableCard({
  title,
  src,
  description,
  children,
  className,
  classNameExpanded,
  ...props
}) {
  const [active, setActive] = React.useState(false);

  // Lock body scroll when open
  React.useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [active]);

  // Close on Escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setActive(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Portal modal — lives directly on document.body, immune to parent transforms
  const modal = (
    <AnimatePresence>
      {active && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
            }}
          />

          {/* Centering shell — no animation so fixed stays fixed */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem", pointerEvents: "none",
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 28 }}
              transition={{ duration: 0.26, ease: [0.32, 0.72, 0, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ pointerEvents: "auto" }}
              className={cn(
                "relative w-full max-w-[820px] max-h-[85vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden",
                classNameExpanded
              )}
            >
              {/* Hero image */}
              <div className="relative h-36 sm:h-72 flex-shrink-0">
                <img
                  src={src}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1000";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-6 sm:pb-10 pt-1">
                <div className="flex justify-between items-start pt-4 sm:pt-6 mb-3">
                  <div>
                    <h3 className="font-headline font-black text-[#1A202C] text-xl sm:text-3xl tracking-tight uppercase">
                      {title}
                    </h3>
                    <p className="text-[#8B1A4A] text-[10px] sm:text-sm font-bold uppercase tracking-[0.3em] mt-1 sm:mt-2">
                      {description}
                    </p>
                  </div>
                  <button
                    onClick={() => setActive(false)}
                    className="flex-shrink-0 ml-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center hover:bg-[#8B1A4A] hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {createPortal(modal, document.body)}

      {/* Card tile */}
      <div
        onClick={() => setActive(true)}
        className={cn(
          "group relative flex flex-col cursor-pointer bg-white/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-[#8B1A4A]/5 hover:border-[#8B1A4A]/20 transition-all duration-700 shadow-sm hover:shadow-2xl h-full",
          className
        )}
      >
        <div className="relative h-52 w-full bg-[#8B1A4A]/5 overflow-hidden">
          <img
            src={src}
            loading="eager"
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2000";
            }}
          />
          <div className="absolute top-4 left-6 text-5xl font-serif italic text-white/20 group-hover:text-white/40 transition-colors duration-1000 pointer-events-none select-none z-10">
            {props.itemNumber || "01"}
          </div>
          <div className="absolute top-4 right-4 z-20">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              {React.cloneElement(props.icon, { size: 24 })}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFF9FA] via-transparent to-transparent opacity-60" />
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-[#1A1A1A] text-lg font-bold tracking-tight mb-2 group-hover:text-[#8B1A4A] transition-colors duration-500 uppercase leading-none">
            {title}
          </h3>
          <div className="w-8 h-[1px] bg-[#8B1A4A] mb-3 group-hover:w-full transition-all duration-1000 opacity-30" />
          <p className="text-[#4A4A4A] text-[12px] leading-relaxed font-light mb-6 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
            {description}
          </p>
          <div className="mt-auto flex items-center gap-2 text-[#8B1A4A] text-[8px] font-black uppercase tracking-[0.4em]">
            <span>View Journey</span>
            <div className="w-3 h-[1px] bg-[#8B1A4A]/40 group-hover:w-6 transition-all duration-500" />
          </div>
        </div>
      </div>
    </>
  );
}
