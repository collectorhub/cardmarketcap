import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-slate-950">
      {/* Navbar now sits at the very top, spanning 100% width */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar starts below the Navbar */}
        <Sidebar />
        
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950 p-4 md:p-8">
          <div className="mx-auto min-h-screen max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}