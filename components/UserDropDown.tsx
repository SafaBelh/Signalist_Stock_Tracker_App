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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray cursor-pointer w-fit bg-transparent hover:!bg-[#141414]"
        >
          <Avatar className="h-7 w-7 rounded-md border border-gray-600">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="rounded-md"
            />
            <AvatarFallback className="bg-yellow-500 text-gray-400 text-sm font-bold rounded-md">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>

          <div className="hidden md:flex flex-col items-start">
            <span className="text-base font-medium text-gray-400">
              {user.name}
            </span>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="text-gray-400 bg-[#141414] border border-gray-700 mr-3 mt-5">
        <DropdownMenuLabel className="bg-[#141414]">
          <div className="flex relative items-center gap-3 py-2">
            <Avatar className="h-7 w-7 rounded-md border border-gray-600">
              <AvatarImage
                src="https://github.com/shadcn.png"
                className="rounded-md"
              />
              <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold rounded-md">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-400">
                {user.name}
              </span>
              <span className="text-sm text-gray-500">{user.email}</span>
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

        <nav className="bg-[#141414]">
          <NavItems initialStocks={initialStocks} />
        </nav>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropDown;
