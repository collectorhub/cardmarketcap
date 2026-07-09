import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import EbayShopClient from "@/components/shop/EbayShopClient";
import { fetchEbayShopListings } from "@/lib/queries/ebay";

export default async function ShopPage() {
  const initialListings = await fetchEbayShopListings({
    section: "graded",
    sort: "best_match",
    limit: 24,
    offset: 0,
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#020617] transition-colors duration-300">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 pt-24 lg:pt-12 pb-16">
        <EbayShopClient
          initialSection="graded"
          initialListings={initialListings}
        />
      </main>

    </div>
  );
}