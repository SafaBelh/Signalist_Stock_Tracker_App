import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import UserDropDown from "./UserDropDown";

const Header = ({user} : {user:User}) => {
  return (
    <header className="sticky top-0 header">
      <div className="container header-wrapper">
        <Link href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="Signalist Logo"
            className="h-8 w-auto cursor-pointer"
            width={25}
            height={25}
          />
        </Link>
        <nav className="hidden sm:block">
            <NavItems />
        </nav>

        <UserDropDown user={user} />



      </div>
    </header>
  );
};

export default Header;
