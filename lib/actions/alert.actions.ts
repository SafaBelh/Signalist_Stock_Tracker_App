"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Alerts } from "@/database/models/alert.model";
import { inngest } from "@/lib/inngest/client";

interface UserRecord {
  _id?: unknown;
  id?: string;
  email?: string;
}

export async function createAlert(alertData: {
  email: string;
  symbol: string;
  company: string;
  alertType: "upper" | "lower";
  targetPrice: string;
  currentPrice?: string;
}) {
  if (!alertData.email) throw new Error("User email required");

  const mongoose = await connectToDatabase();
  const db = mongoose?.connection.db;
  if (!db) throw new Error("MongoDB connection not found");

  const user = await db
    .collection<UserRecord>("user")
    .findOne({ email: alertData.email });
  if (!user) throw new Error("User not found");

  const userId = (user.id as string) || String(user._id || "");
  if (!userId) throw new Error("User ID not found");

  // Save alert to DB
  const newAlert = await Alerts.create({
    ...alertData,
    userId,
    createdAt: new Date(),
  });

  // Trigger Inngest function
  await inngest.send({
    name: "app/alert.created",
    data: {
      email: alertData.email,
      symbol: alertData.symbol,
      company: alertData.company,
      targetPrice: alertData.targetPrice,
      alertType: alertData.alertType,
      currentPrice: alertData.currentPrice || "N/A",
    },
  });

  return newAlert;
}

// Get all alerts by email
export async function getAlertsByEmail(email: string) {
  if (!email) return [];
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose?.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db.collection<UserRecord>("user").findOne({ email });
    if (!user) return [];

    const userId = (user.id as string) || String(user._id || "");
    if (!userId) return [];

    const alerts = await Alerts.find({ userId }).sort({ createdAt: -1 }).lean();
    return alerts;
  } catch (err) {
    console.error("getAlertsByEmail error:", err);
    return [];
  }
}

// Remove alert
export async function removeAlert(
  email: string,
  symbol: string,
  alertType: "upper" | "lower"
) {
  if (!email) throw new Error("User email required");

  const mongoose = await connectToDatabase();
  const db = mongoose?.connection.db;

  const user = await db?.collection<UserRecord>("user").findOne({ email });
  if (!user) throw new Error("User not found");

  const userId = (user.id as string) || String(user._id || "");
  if (!userId) throw new Error("User ID not found");

  const result = await Alerts.deleteOne({
    userId,
    symbol: symbol.toUpperCase(),
    alertType,
  });
  return result.deletedCount > 0;
}

// Get alerts with current prices AND logos
export async function getAlertsWithCurrentData(email: string) {
  const alerts = await getAlertsByEmail(email);
  const symbols = alerts.map((alert) => alert.symbol);

  if (symbols.length === 0) return [];

  // Fetch current prices for all alert symbols
  const { getWatchlistData } = await import("@/lib/actions/finnhub.actions");
  const currentData = await getWatchlistData(symbols);

  // Fetch logos for all alert symbols
  const alertsWithLogos = await Promise.all(
    alerts.map(async (alert) => {
      const data = currentData.find((x) => x.symbol === alert.symbol);
      const currentPrice = data?.priceFormatted
        ? parseFloat(data.priceFormatted)
        : 0;
      const isTriggered =
        alert.alertType === "upper"
          ? currentPrice >= parseFloat(alert.targetPrice)
          : currentPrice <= parseFloat(alert.targetPrice);

      // Fetch logo from Finnhub profile endpoint
      let logo = null;
      try {
        const FINNHUB_TOKEN = process.env.FINNHUB_API_KEY ?? process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? "";
        const profileRes = await fetch(
          `https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(alert.symbol)}&token=${FINNHUB_TOKEN}`
        );
        const profile = await profileRes.json();
        logo = profile?.logo || null;
      } catch (err) {
        console.error("Error fetching logo for", alert.symbol, err);
        logo = null;
      }

      return {
        ...alert,
        currentPrice,
        priceFormatted: data?.priceFormatted || "-",
        changeFormatted: data?.changeFormatted || "-",
        isTriggered,
        logo, // Add the logo URL
        _id: alert._id?.toString(),
      };
    })
  );

  return alertsWithLogos;
}
