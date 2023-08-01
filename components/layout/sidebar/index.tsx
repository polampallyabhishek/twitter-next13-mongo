"use client";
import React, { useMemo } from "react";
import { BsHouseFill, BsBellFill } from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import SidebarLogo from "./sidebar-logo";
import SidebarItem from "./sidebar-item";
import SidebarTweetButton from "./sidebar-tweet-button";
import useSession from "@/hooks/use-session";
import { signOut } from "next-auth/react";

const Sidebar = () => {
  const { data: session } = useSession();

  const items = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        icon: BsHouseFill,
      },
      {
        label: "Notifications",
        href: "/notifications",
        icon: BsBellFill,
        auth: true,
      },
      {
        label: "Profile",
        href: session?.authenticated ? `/user/${session.user.id}` : "",
        icon: FaUser,
        auth: true,
      },
    ],
    [session]
  );

  return (
    <div className="col-span-1 h-full pr-4 md:pr-6">
      <div className="flex flex-col items-end">
        <div className="space-y-2 lg:w-[230px]">
          <SidebarLogo />
          {items.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
          {session?.authenticated && (
            <SidebarItem
              onClick={() => signOut()}
              icon={BiLogOut}
              label="Logout"
            />
          )}
          <SidebarTweetButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
