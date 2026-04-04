import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#F8FAFC] dark:bg-slate-950">
        <Navbar />
        <main className="w-full mx-auto min-h-screen p-4 md:p-8 max-w-[1600px]">
          {children}
        </main>
      </div>
    </div>
  );
}