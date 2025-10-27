import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropDown from "./UserDropDown";
import { searchStocks } from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
  const initialStocks = await searchStocks();

  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <div className="flex flex-row gap-[5px] items-align cursor-pointer">
            <div className="flex flex-row items-center justify-center">
              {/* <Image
                src="/assets/icons/mainLogo.png"
                alt="AuraLyst Logo"
                width={38}
                height={32}
              /> */}
            </div>
            <div className="logo-text">
              <span className="logo-text-span-2">Aura</span>
              <span className="logo-text-span-1">Lyst</span>
            </div>
          </div>
        </Link>
        <nav className="hidden sm:block">
          <NavItems initialStocks={initialStocks} />
        </nav>

        <UserDropDown user={user} initialStocks={initialStocks} />
      </div>
    </header>
  );
};

export default Header;
