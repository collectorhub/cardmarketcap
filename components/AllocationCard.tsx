import React from 'react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Info, MoreHorizontal, ChevronRight } from 'lucide-react';

interface AllocationItem {
  name: string;
  value: number;
  color: string;
}

interface AllocationCardProps {
  data?: AllocationItem[];
  title?: string;
  centerLabel?: string;
  centerValue?: number | string;
  footerLabel?: string;
  onFooterClick?: () => void;
}

/**
 * @param {Array} data - [{ name: string, value: number, color: string }]
 * @param {string} title - Card heading (e.g., "Portfolio Allocation")
 * @param {string} centerLabel - Subtext in donut center (e.g., "Total Cards")
 * @param {number|string} centerValue - Main number in donut center
 * @param {string} footerLabel - Text for the bottom action button
 * @param {Function} onFooterClick - Callback for footer button
 */
const AllocationCard = ({
  data = [],
  title = "Portfolio Allocation",
  centerLabel = "Total",
  centerValue = 0,
  footerLabel = "View Full Breakdown",
  onFooterClick = () => {},
}: AllocationCardProps) => {
  return (
    <div className="border-0 bg-transparent py-1 shadow-none md:rounded-[24px] md:border md:border-slate-100 md:bg-white md:p-8 md:shadow-[0_8px_30px_rgb(0,0,0,0.02)] md:dark:border-slate-800 md:dark:bg-slate-900">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between md:mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 md:font-bold">{title}</h3>
          <Info size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
        </div>
        <MoreHorizontal size={18} className="hidden cursor-pointer text-slate-300 transition-colors hover:text-slate-600 md:block" />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex min-w-0 flex-col items-center gap-2 md:flex-row md:gap-4">
        
        {/* LEFT SIDE: The Chart */}
        <div className="relative h-44 w-full min-w-0 md:h-52 md:w-1/2 md:shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RePie>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                cornerRadius={6}
                dataKey="value"
                stroke="none"
                isAnimationActive={true}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="hover:opacity-80 transition-opacity outline-none"
                  />
                ))}
              </Pie>
            </RePie>
          </ResponsiveContainer>
          
          {/* Center Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white md:text-3xl md:font-black">
              {centerValue}
            </span>
            <span className="mt-[-2px] text-[9px] font-medium uppercase tracking-widest text-slate-400 md:font-bold">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Allocation List */}
<div className="w-full min-w-0 flex-1 space-y-0 border-t border-slate-100 pt-2.5 dark:border-slate-800 md:w-1/2 md:space-y-1 md:border-t-0 md:pt-0">
  {data.map((item) => (
    <div 
      key={item.name} 
      className="group flex items-center justify-between px-1 py-1.5 transition-colors md:rounded-xl md:p-2 md:hover:bg-slate-50 md:dark:hover:bg-slate-950"
    >
      <div className="flex min-w-0 items-center gap-2 md:gap-3">
        <div 
          className="w-2.5 h-2.5 rounded-full shadow-sm" 
          style={{ backgroundColor: item.color }} 
        />
        <span className="truncate text-[11px] font-medium text-slate-600 transition-colors group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200 md:text-[12px] md:font-bold">
          {item.name}
        </span>
      </div>
      <span className="whitespace-nowrap text-[11px] font-medium tabular-nums text-slate-900 dark:text-white md:text-[12px] md:font-black">
        {/* Use parseFloat and toFixed to handle the long decimals from your API */}
        {Number(item.value).toFixed(1)}%
      </span>
    </div>
  ))}
</div>
      </div>

      {/* FOOTER BUTTON - hidden for now, spacer keeps card height consistent */}
      <div className="invisible hidden w-full items-center justify-center gap-2 rounded-xl border border-transparent py-3.5 text-[11px] font-black uppercase tracking-widest md:mt-6 md:flex">
        {footerLabel}
        <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default AllocationCard;
