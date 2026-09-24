import type { PostMeta } from "@/lib/content";
import { PostCard } from "./post-card";

export function PostGrid({ posts, className = "" }: { posts: PostMeta[]; className?: string }) {
  return (
    <div className={`grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
