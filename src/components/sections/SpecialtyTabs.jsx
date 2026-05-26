import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bone, Brain, Heart, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StarButton } from '@/components/ui/star-button';

const specialties = [
  { id: 'ortho', label: 'ORTHOPEDICS', icon: Bone },
  { id: 'neuro', label: 'NEUROLOGY', icon: Brain },
  { id: 'cardio', label: 'CARDIOLOGY', icon: Heart },
  { id: 'spine', label: 'SPINE CARE', icon: Zap },
  { id: 'critical', label: 'CRITICAL CARE', icon: Activity },
];

export function SpecialtyTabs() {
  const [active, setActive] = useState('ortho');

  return (
    <div className="w-full flex justify-center py-12 bg-white/50 backdrop-blur-sm overflow-x-auto no-scrollbar px-8">
      <div className="flex items-center gap-4">
        {specialties.map((spec) => {
          const isActive = active === spec.id;
          const Icon = spec.icon;

          if (isActive) {
            return (
              <StarButton
                key={spec.id}
                lightColor="#E8B4C8" // Light pink shine
                backgroundColor="#2D3A4A" // Dark background
                className="!h-16 !px-10 !rounded-full bg-[#1A2330] text-white shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <Icon className="text-[#8B1A4A]" size={20} />
                  <span className="text-sm font-bold tracking-[0.1em] text-white">
                    {spec.label}
                  </span>
                </div>
              </StarButton>
            );
          }

          return (
            <button
              key={spec.id}
              onClick={() => setActive(spec.id)}
              className={cn(
                "h-16 px-10 rounded-full border border-black/5 bg-white flex items-center gap-4 transition-all duration-500 hover:border-[#8B1A4A]/20 hover:shadow-lg group",
              )}
            >
              <Icon className="text-black/20 group-hover:text-[#8B1A4A]/50 transition-colors" size={20} />
              <span className="text-sm font-bold tracking-[0.1em] text-black/30 group-hover:text-black/60 transition-colors">
                {spec.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
