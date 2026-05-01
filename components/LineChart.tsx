"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DataPoint {
  x: number;
  y: number;
  label: string;
}

interface LineChartProps {
  data: DataPoint[];
  yAxisLabels: string[];
  height?: string;
  className?: string;
  color?: string;
  showPoints?: boolean;
}

export const LineChart = ({
  data,
  yAxisLabels,
  height = "h-full",
  className,
  color = "#10b981",
  showPoints = true,
}: LineChartProps) => {
  if (!data || data.length === 0) return null;

  // We use a 800x150 coordinate system. 
  // The 'M' and 'L' commands build the string based on props.
  const pathData = data.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const lastPoint = data[data.length - 1];
  
  // To keep the fill contained, we ensure it closes at the exact bottom-right of our coordinate system
  const fillData = `${pathData} V150 H${data[0].x} Z`;

  return (
    <div className={cn("flex gap-4 w-full overflow-hidden", height, className)}>
      {/* Y-AXIS */}
      <div className="flex flex-col justify-between py-1 text-[10px] font-bold text-slate-400 text-right w-10 shrink-0 select-none">
        {yAxisLabels.map((label, idx) => (
          <span key={idx}>{label}</span>
        ))}
      </div>

      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 relative mx-2"> {/* Added horizontal margin buffer */}
  <svg 
    viewBox="0 0 800 150" 
    className="w-full h-full overflow-visible" // Crucial: overflow-visible
    preserveAspectRatio="none"
  >
            <defs>
              <linearGradient id="lineChartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.path 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              d={fillData} 
              fill="url(#lineChartGrad)" 
            />

            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={pathData} 
              fill="none" 
              stroke={color} 
              strokeWidth="3" 
              strokeDasharray="1 10"
              strokeLinecap="round"
            />

            {showPoints && (
  <g>
    {/* 1. The Animated Ripple (Fades out as it grows) */}
    <motion.circle 
      initial={{ scale: 0.8, opacity: 0.5 }}
      animate={{ scale: 2.2, opacity: 0 }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
      cx={lastPoint.x} 
      cy={lastPoint.y} 
      r="8" 
      fill={color}
    />
    
    {/* 2. The Main Glow (Static soft circle) */}
    <circle 
      cx={lastPoint.x} 
      cy={lastPoint.y} 
      r="4" 
      fill={color} 
      className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
    />
    
    {/* 3. The White Core (This is the "secret sauce" for the sharp look) */}
    <circle 
      cx={lastPoint.x} 
      cy={lastPoint.y} 
      r="1.5" 
      fill="white" 
    />
  </g>
)}
          </svg>
        </div>
        
        {/* X-AXIS */}
        <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          {data.map((p, i) => (
            <span key={i} className={cn(i % 2 !== 0 && "hidden sm:inline")}>
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};