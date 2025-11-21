import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchTeams, fetchRoles } from "@/app/actions/teams";

import { TeamsClient } from "./_components/teams-client";

export const metadata: Metadata = {
  title: "Teams - SpendEase Admin Dashboard",
  description: "Manage and view all team members on the SpendEase Admin Dashboard",
};

export default async function TeamsPage() {
  const [result, rolesResult] = await Promise.all([fetchTeams({ page: 1, pageSize: 10 }), fetchRoles()]);

  if ("success" in result) {
    if (result.unauthorized) {
      redirect("/auth/login");
    }
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage and view all team members</p>
        </div>
        <div className="text-center text-red-500">{result.message}</div>
      </div>
    );
  }

  if ("success" in rolesResult) {
    return (
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Manage and view all team members</p>
        </div>
        <div className="text-center text-red-500">Error loading roles: {rolesResult.message}</div>
      </div>
    );
  }

  const teams = result;
  const roles = rolesResult.data;

  return (
    <div className="container mx-auto">
      <div className="mb-4 md:mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">Manage and view all team members</p>
      </div>
      <TeamsClient
        initialData={teams.data.data}
        initialPagination={{
          totalItems: teams.data.paging.total_items,
          currentPage: teams.data.paging.current,
          pageSize: teams.data.paging.page_size,
        }}
        roles={roles}
      />
    </div>
  );
}
