"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface WatchlistTableProps {
  watchlist: {
    userId: string;
    symbol: string;
    company: string;
    priceFormatted: string;
    changeFormatted: string;
    marketCap: string;
    peRatio: string;
    addedAt?: Date;
  }[];
}
import { Star } from "lucide-react";

export default function WatchlistTable({ watchlist }: WatchlistTableProps) {
  if (!watchlist || watchlist.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-6">
        You have no stocks in your watchlist yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-[#2a2a2a]">
      <Table className="w-full border-collapse border border-[#2a2a2a] text-left align-middle">
        <TableHeader className="bg-[#222328] text-gray-300 text-xs text-left">
          <TableRow className="border-b border-[#2a2a2a] hover:bg-transparent">
            <TableHead className="w-[50px] px-4 py-3 border border-[#2a2a2a]"></TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Company
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Symbol
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Price
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Change
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Market Cap
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              P/E Ratio
            </TableHead>
            <TableHead className="px-4 py-3 border border-[#2a2a2a]">
              Alert
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="bg-[#141414] divide-y divide-[#2a2a2a] text-left text-[14px]">
          {watchlist.map((item) => (
            <TableRow
              key={item.symbol}
              className="hover:bg-[#1a1a1a] transition-colors"
            >
              <TableCell className="px-3 border border-[#2a2a2a]">
                <div className="p-2 rounded-full bg-[#313232] hover:bg-[#3d3d3d] transition-colors flex items-center justify-center">
                  <Star size={13} fill={"#facc15"} stroke={"#facc15"} />
                </div>
              </TableCell>

              <TableCell className="px-4 py-1 font-medium text-gray-100 border border-[#2a2a2a]">
                {item.company}
              </TableCell>

              <TableCell className="px-4 py-1 text-gray-300 border border-[#2a2a2a]">
                {item.symbol}
              </TableCell>

              <TableCell className="px-4 py-1 text-gray-200 border border-[#2a2a2a]">
                ${item.priceFormatted}
              </TableCell>

              <TableCell
                className={`px-4 py-1 font-semibold border border-[#2a2a2a] ${
                  item.changeFormatted.startsWith("-")
                    ? "text-red-500"
                    : item.changeFormatted !== "-"
                      ? "text-green-400"
                      : "text-gray-400"
                }`}
              >
                {item.changeFormatted}
              </TableCell>

              <TableCell className="px-4 py-1 text-gray-300 border border-[#2a2a2a]">
                {item.marketCap}
              </TableCell>

              <TableCell className="px-4 py-1 text-gray-300 border border-[#2a2a2a]">
                {item.peRatio}
              </TableCell>

              <TableCell className="px-4 py-1 border border-[#2a2a2a]">
                <button className="bg-[#facc15b0] hover:bg-[#facc1557] text-white px-2 py-1 rounded-[5px] text-[13px] transition-colors cursor-pointer">
                  Add Alert
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
