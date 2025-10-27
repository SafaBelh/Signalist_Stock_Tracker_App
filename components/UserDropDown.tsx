"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";
import { signOut } from "@/lib/actions/auth.actions";

// Update the User type to include optional avatar
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string | null; // Add this line
}

const UserDropDown = ({
  user,
  initialStocks,
}: {
  user: User;
  initialStocks: StockWithWatchlistStatus[];
}) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  // Get first 2 letters of user's name (or first letter if only one word)
  const getInitials = (name: string) => {
    const names = name.trim().split(" ");
    let initials = "";

    if (names.length === 1) {
      const singleName = names[0];
      initials = singleName.substring(0, 2);
      // If name is only one character, duplicate it
      if (singleName.length === 1) {
        initials = singleName + singleName;
      }
    } else {
      // Take first character from first two names
      initials = names[0].charAt(0) + names[1].charAt(0);
    }

    return initials.toUpperCase();
  };

  const userInitials = getInitials(user.name);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray cursor-pointer w-fit bg-transparent hover:!bg-[#141414]"
        >
          <Avatar className="h-7 w-7 rounded-[5px] border border-gray-600 p-[1px]">
            {user.avatar ? (
              <AvatarImage
                src={user.avatar}
                alt={`${user.name}'s avatar`}
                className="rounded-[5px]"
              />
            ) : null}
            <AvatarFallback className="bg-yellow-500 text-gray-400 rounded-[4px] text-sm font-[600]">
              {userInitials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-gray-400 text-lg font-[600]">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-gray-400 bg-[#141414] border border-gray-700 mr-3 mt-5">
        <DropdownMenuLabel className="bg-[#141414]">
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-10 w-10 rounded-md border border-gray-600">
              {/* Only show AvatarImage if user has an avatar */}
              {user.avatar ? (
                <AvatarImage
                  src={user.avatar}
                  alt={`${user.name}'s avatar`}
                  className="rounded-md"
                />
              ) : null}
              <AvatarFallback className="bg-yellow-500 text-gray-900 rounded-md text-md font-[600]">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base text-gray-400 text-md font-[600]">
                {user.name}
              </span>
              <span className="text-md font-[600] text-gray-500">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-600" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-gray-100 text-md font-medium focus:bg-[#1a1a1a] focus:text-yellow-500 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 hidden sm:block" />
          Logout
        </DropdownMenuItem>

        <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />

        <nav className="bg-[#141414] hidden xs:block">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
