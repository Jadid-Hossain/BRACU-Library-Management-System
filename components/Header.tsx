"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { logout } from "@/lib/actions/auth";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  const isProfilePage = pathname === "/my-profile";

  return (
    <header className="my-10 flex items-center justify-between">
      <ul className="flex items-center gap-8">
        {pathname !== "/library" && (
          <li>
            <Link
              href="/library"
              className={cn(
                "text-base cursor-pointer capitalize",
                pathname === "/library" ? "text-light-200" : "text-light-100",
              )}
            >
              Library
            </Link>
          </li>
        )}
      </ul>

      <ul className="flex items-center gap-8">
        {pathname !== "/search" && (
          <li>
            <Link
              href="/search"
              className={cn(
                "text-base cursor-pointer capitalize",
                pathname === "/search" ? "text-light-200" : "text-light-100",
              )}
            >
              Search
            </Link>
          </li>
        )}

        <li className="flex items-center gap-4">
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>

          {isProfilePage && (
            <form action={logout}>
              <Button size="sm" className="text-sm">
                Logout
              </Button>
            </form>
          )}
        </li>
      </ul>
    </header>
  );
};

export default Header;
