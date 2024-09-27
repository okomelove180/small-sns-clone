import { createServerActionClient, User } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function NewPost({ user }: { user: User }) {
  const addPost = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("posts").insert({ title, user_id: user?.id });

    revalidatePath("/"); // キャッシュをパージして再構築
  };

  return (
    <form action={addPost} className="border border-gray-800">
      <div className="flex py-8 px-4 items-center">
        <div>
          <Image
            src={user.user_metadata.avatar_url}
            alt="user icon"
            width={48}
            height={48}
            className="rounded-full"
          />
        </div>
        <input
          type="text"
          name="title"
          className="bg-inherit flex-1 text-2xl placeholder-slate-500 px-2 ml-2"
        />
        <button className="bg-slate-600 px-6 py-3 rounded-md ml-2">送信</button>
      </div>
    </form>
  );
}
