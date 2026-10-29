'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function AboutHeroMetrics() {
  const containerRef = useRef<HTMLDivElement>(null);

  const metrics = [
    { label: 'Students Reached', target: 350, suffix: '+', subtitle: 'Across HETC & MCKV workshops', color: 'text-[#075945]', border: 'hover:border-[#075945]/40' },
    { label: 'Ecosystem Events', target: 24, suffix: '+', subtitle: 'Hackathons & dev bootcamps', color: 'text-[#d97706]', border: 'hover:border-[#d97706]/40' },
    { label: 'Open Source', target: 100, suffix: '%', subtitle: 'Public good education', color: 'text-[#111]', border: 'hover:border-[#075945]/40' },
    { label: 'Core Builders', target: 5, suffix: '', subtitle: 'Strategy, tech & operations', color: 'text-[#d97706]', border: 'hover:border-[#d97706]/40' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;
    const counters = containerRef.current.querySelectorAll('.metric-counter');

    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.2,
        onUpdate: () => {
          el.textContent = `${Math.floor(obj.val)}${suffix}`;
        },
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="mt-14 pt-8 border-t border-gray-200 grid grid-cols-2 lg:grid-cols-4 gap-5">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm transition-all duration-300 ${m.border} hover:-translate-y-1`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#666]">{m.label}</span>
          <p
            data-target={m.target}
            data-suffix={m.suffix}
            className={`metric-counter font-sans text-3xl sm:text-4xl font-black tracking-tight ${m.color} mt-2`}
          >
            0{m.suffix}
          </p>
          <p className="text-[11px] text-[#666] mt-1">{m.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
