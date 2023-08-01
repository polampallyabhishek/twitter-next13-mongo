import Header from "@/components/header";
import Layout from "@/components/layout";
import PostFeed from "@/components/posts/post-feed";
import PostForm from "@/components/posts/post-form";

export default function Home() {
  return (
    <Layout>
      <Header label="Home" showBackArrow />
      <PostForm placeholder="What's happening today?" />
      <PostFeed />
    </Layout>
  );
}
