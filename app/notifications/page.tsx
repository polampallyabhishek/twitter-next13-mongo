"use client";
import Header from "@/components/header";
import Layout from "@/components/layout";
import NotificationsFeed from "@/components/notifications-feed";
import useSession from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Notifications = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [session, router]);

  return (
    <Layout>
      <Header showBackArrow label="Notifications" />
      <NotificationsFeed />
    </Layout>
  );
};

export default Notifications;
