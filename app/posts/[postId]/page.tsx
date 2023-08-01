"use client";
import Header from "@/components/header";
import Layout from "@/components/layout";
import Loader from "@/components/loader";
import CommentFeed from "@/components/posts/comment-feed";
import PostForm from "@/components/posts/post-form";
import PostItem from "@/components/posts/post-item";
import usePost from "@/hooks/use-post";
import { useParams } from "next/navigation";
import React from "react";

const PostView = () => {
  const { postId } = useParams();
  const { data: fetchedPost, isLoading } = usePost(postId as string);

  return (
    <Layout>
      {isLoading || !fetchedPost ? (
        <Loader />
      ) : (
        <>
          <Header label={fetchedPost?.name} showBackArrow />
          <PostItem data={fetchedPost} />
          <PostForm
            placeholder="Tweet your reply"
            isComment
            postId={postId as string}
          />
          <CommentFeed comments={fetchedPost?.comments} />
        </>
      )}
    </Layout>
  );
};

export default PostView;
