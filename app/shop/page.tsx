import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import EbayShopClient from "@/components/shop/EbayShopClient";
import { fetchEbayShopListings } from "@/lib/queries/ebay";

export default async function ShopPage() {
  const initialListings =
    await fetchEbayShopListings({
      section: "graded",
      sort: "best_match",
      limit: 24,
      offset: 0,
    });

  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 pb-16 pt-20 md:px-8 lg:pt-12">
        <EbayShopClient
          initialSection="graded"
          initialListings={
            initialListings
          }
        />
      </main>
    </div>
  );
}