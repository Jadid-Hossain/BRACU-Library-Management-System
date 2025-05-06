"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

const Header = ({ session }: { session: Session }) => {
  const pathname = usePathname();
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <ul className="flex flex-row items-center gap-8">
        {/*<li>*/}
        {/*  <form*/}
        {/*    action={async () => {*/}
        {/*      "use server";*/}

        {/*      await signOut();*/}
        {/*    }}*/}
        {/*    className="mb-10"*/}
        {/*  >*/}
        {/*    <Button>Logout</Button>*/}
        {/*  </form>*/}
        {/*</li>*/}
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

        <li>
          <Link href="/my-profile">
            <Avatar>
              <AvatarFallback className="bg-amber-100">
                {getInitials(session?.user?.name || "IN")}
              </AvatarFallback>
            </Avatar>
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
