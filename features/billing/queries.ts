import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getOwnedBusinessForCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data, error } = await supabase
    .from("business_members")
    .select("businesses(id,name,slug),role")
    .eq("profile_id", user.id)
    .in("role", ["owner", "admin"])
    .limit(1)
    .single()
    .returns<{
      role: "owner" | "admin";
      businesses: { id: string; name: string; slug: string } | null;
    }>();

  if (error || !(data as any)?.businesses) {
    throw new Error("Only business owners and admins can manage subscriptions.");
  }

  return {
    ...(data as any)?.businesses,
    ownerEmail: user.email,
  };
}

