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
    <div className="bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          <Info size={14} className="text-slate-300 dark:text-slate-600 cursor-help" />
        </div>
        <MoreHorizontal size={18} className="text-slate-300 cursor-pointer hover:text-slate-600 transition-colors" />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        
        {/* LEFT SIDE: The Chart */}
        <div className="h-52 w-full md:w-1/2 relative">
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
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {centerValue}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-[-2px]">
              {centerLabel}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE: Allocation List */}
<div className="w-full md:w-1/2 space-y-1">
  {data.map((item) => (
    <div 
      key={item.name} 
      className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-2.5 h-2.5 rounded-full shadow-sm" 
          style={{ backgroundColor: item.color }} 
        />
        <span className="text-[12px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
          {item.name}
        </span>
      </div>
      <span className="text-[12px] font-black text-slate-900 dark:text-white">
        {/* Use parseFloat and toFixed to handle the long decimals from your API */}
        {Number(item.value).toFixed(1)}%
      </span>
    </div>
  ))}
</div>
      </div>

      {/* FOOTER BUTTON - hidden for now, spacer keeps card height consistent */}
      <div className="w-full mt-6 py-3.5 invisible flex items-center justify-center gap-2 rounded-xl border border-transparent text-[11px] font-black uppercase tracking-widest">
        {footerLabel}
        <ChevronRight size={14} />
      </div>
    </div>
  );
};

export default AllocationCard;