// app/watchlist/page.tsx
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import WatchlistTable from "@/components/WatchlistTable";
import { AlertsSection } from "@/components/AlertsSection";
import { getWatchlistData } from "@/lib/actions/finnhub.actions";
import { getAlertsWithCurrentData } from "@/lib/actions/alert.actions";
import { Alerts } from "@/database/models/alert.model";
import SearchCommand from "@/components/SearchCommand";

import Link from "next/link";

const WatchlistPage = async () => {
  // 1️⃣ Get current session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const userId = session.user.id;
  const userEmail = session.user.email!;

  // 2️⃣ Fetch watchlist symbols and alerts from DB
  await connectToDatabase();

  const [watchlistItems, alertsWithData] = await Promise.all([
    Watchlist.find({ userId }).sort({ addedAt: -1 }).lean(),
    getAlertsWithCurrentData(userEmail),
  ]);

  const symbols = watchlistItems.map((item) => item.symbol);

  // 3️⃣ Fetch live data from Finnhub for watchlist
  const enrichedData = await getWatchlistData(symbols);

  // 4️⃣ Merge DB info with live data for watchlist
  const finalWatchlist = watchlistItems.map((item) => {
    const data = enrichedData.find((x) => x.symbol === item.symbol);
    return {
      userId: item.userId,
      symbol: item.symbol,
      company: data?.company || item.company,
      priceFormatted: data?.priceFormatted || "-",
      changeFormatted: data?.changeFormatted || "-",
      marketCap: data?.marketCap || "-",
      peRatio: data?.peRatio || "-",
      addedAt: item.addedAt,
    };
  });

  return (
    <div className="flex flex-col min-h-screen gap-7 p-4">
      <div
        className="flex flex-col lg:flex-row gap-10"
        // style={{ minHeight: "min(600px, 80vh)" }}
      >
        {/* Watchlist Section */}
        <section className="flex flex-col w-full lg:w-2/3 gap-7 h-full">
          <div className="flex flex-row justify-between items-center flex-shrink-0">
            <h3 className="font-semibold text-2xl text-gray-100">
              My Watchlist
            </h3>
            <Link href="/?search=true">
              <button className="bg-[#a27ff1] hover:bg-[#a17ff156] text-white rounded-[5px] text-[15px] transition-colors cursor-pointer h-[30px] flex items-center justify-center px-3 font-[600]">
                Add Stock
              </button>
            </Link>
          </div>

          {/* Table Container that fills remaining space */}
          <div className="flex-1 h-full">
            <WatchlistTable watchlist={finalWatchlist} />
          </div>
        </section>

        {/* Alerts Section */}
        <section className="flex flex-col w-full lg:w-1/3 gap-7 h-full">
          <div className="flex flex-row justify-between items-center flex-shrink-0">
            <h3 className="font-semibold text-2xl text-gray-100 flex flex-start">
              Alerts
            </h3>
            <button className="bg-[#a27ff1] hover:bg-[#a17ff156] text-white rounded-[5px] text-[15px] transition-colors cursor-pointer h-[30px] flex items-center justify-center px-3 font-[600]">
              Create Alert
            </button>
          </div>

          {/* Alerts Container that fills remaining space */}
          <div className="flex-1 h-full">
            <AlertsSection alerts={alertsWithData} userEmail={userEmail} />
          </div>
        </section>
      </div>

      <div>NEWS GOES HERE</div>
    </div>
  );
};

export default WatchlistPage;
