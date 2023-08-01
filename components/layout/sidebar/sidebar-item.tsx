"use client";
import useLoginModal from "@/hooks/use-login-modal";
import useSession from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { IconType } from "react-icons";

interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  auth?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
  auth,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const loginModal = useLoginModal();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }

    if (auth && !session?.authenticated) {
      loginModal.onOpen();
      return;
    }

    if (href) {
      router.push(href);
    }
  }, [router, href, onClick, session, auth, loginModal]);

  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div className="relative rounded-full h-14 w-14 flex items-center justify-center p-4 hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer lg:hidden">
        <Icon size={28} color="white" />
      </div>
      <div className="relative hidden lg:flex items-row p-4 gap-4 rounded-full hover:bg-slate-300 hover:bg-opacity-10 cursor-pointer">
        <Icon size={24} color="white" />
        <p className="hidden lg:block text-white text xl">{label}</p>
      </div>
    </div>
  );
};

export default SidebarItem;
