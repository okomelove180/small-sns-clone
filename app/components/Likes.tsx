"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Likes({
  post,
  addOptimisticPost,
}: {
  post: PostWithAuthor;
  addOptimisticPost: (newPost: PostWithAuthor) => void;
}) {
  // isPending is deleted
  const [, startTransition] = useTransition();
  const router = useRouter();

  const handleClick = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (post.user_has_liked_post) {
      addOptimisticPost({
        ...post,
        likes: post.likes - 1,
        user_has_liked_post: !post.user_has_liked_post,
      });
      await supabase
        .from("likes")
        .delete()
        .match({ user_id: user?.id, post_id: post.id });
    } else {
      addOptimisticPost({
        ...post,
        likes: post.likes + 1,
        user_has_liked_post: !post.user_has_liked_post,
      });
      await supabase
        .from("likes")
        .insert({ user_id: user?.id, post_id: post.id });
    }
    router.refresh();
  };

  return (
    <button
      onClick={() => startTransition(() => handleClick())}
      className="flex items-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={`duration-200 ${
          post.user_has_liked_post ? "fill-red-600 stroke-red-600" : "fill-none"
        }`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span
        className={`duration-200 ml-2 text-sm ${
          post.user_has_liked_post ? "text-red-600" : "text-gray-400"
        }`}
      >
        {post.likes}いいね
      </span>
    </button>
  );
}
