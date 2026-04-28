import Navbar from "@/components/Navbar";
import PortfolioHeader from "@/components/portfolio/PortfolioHeader";
import Sidebar from "@/components/Sidebar";

async function getPortfolioData() {
  return {
    user: {
      name: "Dave",
    },
    stats: {
      totalValue: 48725.60,
      growth7D: 12.48,
      totalCards: 126,
      totalSets: 18,
    }
  };
}

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortfolioData(); 

  return (
    // Updated background to match SetsPage exactly
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <Navbar /> 

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Width set to 1600px to match the database view */}
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-10">
        <PortfolioHeader data={data} />
        
        <main className="py-4">
          {children}
        </main>
      </div>
    </div>
  );
}