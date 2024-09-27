"use client";

import React from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useCallback } from "react";

const GithubButton = () => {
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase.auth]);

  return (
    <button onClick={handleSignIn} className="hover:bg-gray-800 p-8 rounded-md">
      <Image
        src={"/github-mark-white.png"}
        alt="github logo"
        width={100}
        height={100}
      />
    </button>
  );
};

export default GithubButton;
