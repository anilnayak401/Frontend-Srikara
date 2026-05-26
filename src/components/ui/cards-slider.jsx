import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 3D perspective card slider — center card is full size,
 * adjacent cards are scaled + rotated inward for depth.
 */
export function CardsSlider({ items = [], renderCard }) {
  const [active, setActive] = useState(0);
  const total = items.length;

  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);

  // Compute visible indices: 2 left, center, 2 right
  const getVisible = () => {
    const indices = [];
    for (let offset = -2; offset <= 2; offset++) {
      indices.push((active + offset + total) % total);
    }
    return indices; // [far-left, left, center, right, far-right]
  };

  const visible = getVisible();

  const cardStyles = [
    // far-left
    { x: '-200%', scale: 0.65, rotateY: 35, opacity: 0.35, zIndex: 1 },
    // left
    { x: '-105%', scale: 0.8,  rotateY: 20, opacity: 0.7,  zIndex: 2 },
    // center
    { x: '0%',    scale: 1,    rotateY: 0,  opacity: 1,    zIndex: 5 },
    // right
    { x: '105%',  scale: 0.8,  rotateY: -20, opacity: 0.7, zIndex: 2 },
    // far-right
    { x: '200%',  scale: 0.65, rotateY: -35, opacity: 0.35, zIndex: 1 },
  ];

  return (
    <div className="relative w-full select-none">
      {/* Slider stage */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: '520px', perspective: '1200px' }}
      >
        {visible.map((itemIdx, pos) => {
          const style = cardStyles[pos];
          const isCenter = pos === 2;
          return (
            <motion.div
              key={itemIdx}
              animate={{
                x: style.x,
                scale: style.scale,
                rotateY: style.rotateY,
                opacity: style.opacity,
                zIndex: style.zIndex,
              }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              onClick={() => !isCenter && setActive(itemIdx)}
              className="absolute"
              style={{
                transformStyle: 'preserve-3d',
                cursor: isCenter ? 'default' : 'pointer',
                width: '300px',
              }}
            >
              {renderCard(items[itemIdx], isCenter)}
            </motion.div>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          className="w-11 h-11 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1A202C] hover:bg-[#8B1A4A] hover:text-white hover:border-[#8B1A4A] transition-all shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all ${
                i === active ? 'w-6 h-2 bg-[#8B1A4A]' : 'w-2 h-2 bg-[#E2E8F0]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="w-11 h-11 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1A202C] hover:bg-[#8B1A4A] hover:text-white hover:border-[#8B1A4A] transition-all shadow-sm"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
