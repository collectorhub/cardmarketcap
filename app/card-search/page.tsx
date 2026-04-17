import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CardSearch from "@/components/search/CardSearch";

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 selection:bg-brand/30">
      <Navbar />
      
      {/* Subtle background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-[#00BA88]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative max-w-[1600px] mx-auto md:px-10 pb-20">
        <CardSearch />
      </main>
    </div>
  );
}