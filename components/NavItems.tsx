// components/NavItems.tsx
"use client";

import { NAV_ITEMS } from "@/lib/constants";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SearchCommand from "./SearchCommand";
import { useEffect, useState } from "react";

const NavItems = ({initialStocks} : {initialStocks:StockWithWatchlistStatus[]}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [autoOpenSearch, setAutoOpenSearch] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Auto-open search when ?search=true is in URL
  useEffect(() => {
    const shouldOpenSearch = searchParams.get('search') === 'true';
    setAutoOpenSearch(shouldOpenSearch);
  }, [searchParams]);

  const handleSearchOpenChange = (open: boolean) => {
    if (!open && searchParams.get('search') === 'true') {
      // If search is closing and we have ?search=true, remove it from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('search');
      window.history.replaceState({}, '', newUrl.toString());
    }
    setAutoOpenSearch(open);
  };

  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-[600] text-lg">
      {NAV_ITEMS.map(({ href, label }) => {
        if (href == "/search")
          return (
            <li key="search-trigger">
              <SearchCommand
                renderAs="text"
                label="Search"
                initialStocks={initialStocks}
                open={autoOpenSearch}
                onOpenChange={handleSearchOpenChange}
              />
            </li>
          );

        return (
          <li key={href}>
            <Link
              href={href}
              className={`hover:text-yellow-500 transition-colors font-[600] ${
                isActive(href) ? "text-gray-100" : ""
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;