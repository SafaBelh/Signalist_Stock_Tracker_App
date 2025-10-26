import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";
import WatchlistTable from "@/components/WatchlistTable";
import { getWatchlistData } from "@/lib/actions/finnhub.actions";




const WatchlistPage = async () => {
  // 1️⃣ Get current session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const userId = session.user.id;

  // 2️⃣ Fetch watchlist symbols from DB
  await connectToDatabase();
  const items = await Watchlist.find({ userId }).sort({ addedAt: -1 }).lean();
  const symbols = items.map((item) => item.symbol);

  // 3️⃣ Fetch live data from Finnhub
  const enrichedData = await getWatchlistData(symbols);

  // 4️⃣ Merge DB info with live data
  const finalWatchlist = items.map((item) => {
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
      <div className="flex flex-row lg:flex-row min-h-screen gap-7 p-4">
        <section className="flex flex-col w-full lg:w-2/3 gap-7">
          <div className="flex flex-row justify-between items-center">
            <h3 className="font-semibold text-2xl text-gray-100">
              My Watchlist
            </h3>
            <button className="bg-[#facc15b0] hover:bg-[#facc1557] text-white rounded-[5px] text-[15px] transition-colors cursor-pointer h-[30px] flex items-center justify-center px-3 font-semibold">
              Add Stock
            </button>
          </div>

          <WatchlistTable watchlist={finalWatchlist} />
        </section>
        <section className="flex flex-col w-full lg:w-1/3 gap-7">test</section>
      </div>
      <div className="">ALERTS SECTION GOES HERE</div>
    </div>
  );
};

export default WatchlistPage;
