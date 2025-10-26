"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Watchlist } from "@/database/models/watchlist.model";

interface UserRecord {
  _id?: unknown;
  id?: string;
  email?: string;
}

// Get all watchlist symbols by email
export async function getWatchlistSymbolsByEmail(
  email: string
): Promise<string[]> {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose?.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db.collection<UserRecord>("user").findOne({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error("getWatchlistSymbolsByEmail error:", err);
    return [];
  }
}

// Add symbol to watchlist
export async function addToWatchlist(
  email: string,
  symbol: string,
  company: string
) {
  if (!email) throw new Error("User email required");

  const mongoose = await connectToDatabase();
  const db = mongoose?.connection.db;

  const user = await db?.collection<UserRecord>("user").findOne({ email });
  if (!user) throw new Error("User not found");

  const userId = (user.id as string) || String(user._id || "");
  if (!userId) throw new Error("User ID not found");

  try {
    const item = new Watchlist({
      userId,
      symbol: symbol.toUpperCase(),
      company,
    });
    await item.save();
    return item;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err.code === 11000) {
      // duplicate key
      console.warn(`Symbol ${symbol} already in watchlist for user ${email}`);
      return null;
    }
    throw err;
  }
}

// Remove symbol from watchlist
export async function removeFromWatchlist(email: string, symbol: string) {
  if (!email) throw new Error("User email required");

  const mongoose = await connectToDatabase();
  const db = mongoose?.connection.db;

  const user = await db?.collection<UserRecord>("user").findOne({ email });
  if (!user) throw new Error("User not found");

  const userId = (user.id as string) || String(user._id || "");
  if (!userId) throw new Error("User ID not found");

  const result = await Watchlist.deleteOne({
    userId,
    symbol: symbol.toUpperCase(),
  });
  return result.deletedCount > 0;
}
