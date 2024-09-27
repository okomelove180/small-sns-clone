"use client";

import {
  createClientComponentClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

type AuthButtonClientProps = {
  user: User | null;
};

const AuthButtonClient: React.FC<AuthButtonClientProps> = ({ user }) => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase.auth]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.refresh();
  }, [supabase.auth, router]);

  return (
    <>
      {user ? (
        <button onClick={handleSignOut} className="text-xs text-gray-400">
          サインアウト
        </button>
      ) : (
        <button onClick={handleSignIn} className="text-xs text-gray-400">
          サインイン
        </button>
      )}
    </>
  );
};

export default AuthButtonClient;
