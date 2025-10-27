"use client";
import Link from "next/link";
import { Trash2, Edit, Bell, BellOff } from "lucide-react";

interface AlertWithData {
  _id: string;
  symbol: string;
  company: string;
  alertType: "upper" | "lower";
  targetPrice: string;
  currentPrice: number;
  priceFormatted: string;
  changeFormatted: string;
  isTriggered: boolean;
  createdAt: Date;
}

interface AlertsSectionProps {
  alerts: AlertWithData[];
  userEmail: string;
}

export const AlertsSection = ({ alerts }: AlertsSectionProps) => {
  if (alerts.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700 tradingview-widget-container">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mt-3">
            <Bell className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-400 mb-4">No alerts set up yet</p>
          </div>
         
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 tradingview-widget-container flex flex-col gap-2 max-h-[600px]">
      {alerts.map((alert) => (
        <AlertCard key={alert._id} alert={alert} />
      ))}
    </div>
  );
};

const AlertCard = ({ alert }: { alert: AlertWithData & { logo?: string } }) => {
  const isPositive =
    !alert.changeFormatted.startsWith("-") && alert.changeFormatted !== "-";

  const changePercent = alert.changeFormatted.includes("(")
    ? alert.changeFormatted.match(/\(([^)]+)\)/)?.[1]
    : alert.changeFormatted
        .match(/[+-]?\d+\.?\d*%/)
        ?.find((match) => match.includes("%"));

  return (
    <div className="bg-[#1E1E1E] rounded-lg p-2 border border-[#2A2A2A] flex flex-col gap-1">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#2A2A2A] rounded-lg flex items-center justify-center border border-[#3A3A3A] overflow-hidden">
            {alert.logo ? (
              <img
                src={alert.logo}
                alt={alert.symbol}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            {!alert.logo && (
              <span className="text-sm font-bold text-gray-300">
                {alert.symbol}
              </span>
            )}
          </div>

          <div>
            <h4 className="font-medium text-gray-100 text-sm">
              {alert.company}
            </h4>
            <div className="font-semibold text-gray-100 text-lg">
              ${alert.priceFormatted}
            </div>
          </div>
        </div>

        <div className="text-right mr-1">
          <div className="font-semibold text-gray-100 text-lg mb-1">
            {alert.symbol}
          </div>
          <div
            className={`text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {changePercent || alert.changeFormatted}
          </div>
        </div>
      </div>

      <div className="bg-[#2A2A2A] rounded-md px-2 py-2 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          <div className="text-xs text-gray-300 font-medium">Alert</div>
          <div className="text-sm text-gray-100 font-semibold">
            Price {alert.alertType === "upper" ? ">" : "<"} ${alert.targetPrice}
          </div>
        </div>


        <div className="flex flex-col items-start gap-1.5">
          {/* <div className="flex gap-2">
            <button className="text-gray-400 hover:text-blue-400 transition-colors">
              <Edit size={13} />
            </button>
            <button className="text-gray-400 hover:text-red-400 transition-colors">
              <Trash2 size={13} />
            </button>
          </div> */}
          <div
            className={`flex items-center gap-1 text-xs px-2 py-[3px] rounded ${
              alert.isTriggered
                ? "text-red-500 bg-red-500/20 "
                : "text-green-500 bg-green-500/20"
            }`}
          >
            <div className="flex items-center justify-center">
              {alert.isTriggered ? <BellOff size={12} /> : <Bell size={12} />}
            </div>
            <div className="flex items-center justify-center mt-[-1.5px]">
              {alert.isTriggered ? "Triggered" : "Active"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
