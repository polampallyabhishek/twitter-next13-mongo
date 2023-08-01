"use client";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import PostFeed from "@/components/posts/post-feed";
import UserBio from "@/components/users/user-bio";
import UserHero from "@/components/users/user-hero";
import useUser from "@/hooks/use-user";
import { useParams } from "next/navigation";
import React from "react";

const UserView = () => {
  const { userId } = useParams();
  const { data: fetchedUser, isLoading } = useUser(userId as string);

  return (
    <Layout>
      {isLoading || !fetchedUser ? (
        <Loader />
      ) : (
        <>
          <Header label={fetchedUser?.name} showBackArrow />
          <UserHero userId={userId as string} />
          <UserBio userId={userId as string} />
          <PostFeed userId={userId as string} />
        </>
      )}
    </Layout>
  );
};

export default UserView;
