import type { Metadata } from "next";

import { getSession } from "@/app/actions/auth";

import { SettingsClient } from "./_component/settings-client";

export const metadata: Metadata = {
  title: "Settings - SpendEase Admin Dashboard",
  description: "Settings page on the SpendEase Admin Dashboard",
};

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-500">Authentication required</div>
      </div>
    );
  }

  return <SettingsClient user={session.user} />;
}
