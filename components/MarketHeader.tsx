import { Activity } from "lucide-react"

interface StatProps {
  label: string;
  value: string;
  color?: string;
}

const StatItem = ({ label, value, color = "text-white" }: StatProps) => (
  <div className="px-6 border-r border-slate-800 last:border-none">
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight mb-1">{label}</p>
    <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
)

export function MarketHeader() {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 pb-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-[0.3em]">
          <Activity className="h-3 w-3 animate-pulse" />
          Market Protocol v2.1
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.8]">
          Card<span className="text-emerald-500 italic">Market</span>Cap
        </h1>
      </div>

      <div className="flex items-center bg-slate-900/40 border border-slate-800/50 p-5 rounded-3xl backdrop-blur-xl shadow-2xl">
        <StatItem label="Total Graded" value="85.40K" />
        <StatItem label="PSA 10 Pop" value="5.43K" />
        <StatItem label="30d Volume" value="$1,845,232" color="text-emerald-400" />
      </div>
    </div>
  )
}