'use client';
import React, { useMemo, useState, useEffect } from "react";
import { addToWatchlist, removeFromWatchlist, getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  userEmail: string; 
  isInWatchlist?: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  userEmail,
  isInWatchlist = false,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);
  const [loading, setLoading] = useState(false);

  // Fetch initial state from watchlist
  useEffect(() => {
    if (!userEmail) return;
    (async () => {
      try {
        const symbols = await getWatchlistSymbolsByEmail(userEmail);
        setAdded(symbols.includes(symbol.toUpperCase()));
      } catch (err) {
        console.error("Failed to fetch watchlist:", err);
      }
    })();
  }, [userEmail, symbol]);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async () => {
    if (!userEmail) return alert("Please log in first");
    setLoading(true);

    try {
      if (added) {
        await removeFromWatchlist(userEmail, symbol.toUpperCase());
        setAdded(false);
      } else {
        await addToWatchlist(userEmail, symbol.toUpperCase(), company);
        setAdded(true);
      }
      onWatchlistChange?.(symbol, !added);
    } catch (err) {
      console.error("Watchlist toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn text-gray-400 not-first:${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
        disabled={loading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#8b5cf6" : "none"}
          stroke="#8b5cf6"
          strokeWidth="1.5"
          className="watchlist-star"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn text-gray-400 ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
      disabled={loading}
    >
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
        </svg>
      ) : null}
      <span>{loading ? "Processing..." : label}</span>
    </button>
  );
};

export default WatchlistButton;
