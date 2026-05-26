import React from 'react';

export const ImageAutoSlider = ({ items = [], speed = 30, renderItem }) => {
  // Duplicate for seamless infinite loop
  const duplicated = [...items, ...items];

  return (
    <>
      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .auto-slider-track {
          animation: scroll-left ${speed}s linear infinite;
        }
        .auto-slider-track:hover {
          animation-play-state: paused;
        }
        .auto-slider-mask {
          mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
      `}</style>

      <div className="auto-slider-mask w-full overflow-hidden">
        <div className="auto-slider-track flex gap-6 w-max">
          {duplicated.map((item, i) => (
            <div key={i} className="flex-shrink-0">
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
