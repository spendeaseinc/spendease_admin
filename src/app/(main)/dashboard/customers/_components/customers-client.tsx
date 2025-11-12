"use client";

import { useEffect, useState } from "react";

import { AlertCircle, Loader2, UserCheck, Users, UserX } from "lucide-react";

import { getUsers } from "@/app/actions/users";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/lib/types";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export function CustomersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true);
        const result = await getUsers(1);

        if (result.success) {
          setUsers(result.users);
          setError(null);
        } else {
          setError(result.message);
          setUsers([]);
        }
      } catch (err) {
        setError(`Failed to fetch users: ${err}`);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold">Customers</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Loading customers info...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <div className="rounded-full bg-orange-500/10 p-2">
                    <Users className="size-4 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length.toLocaleString()}</div>
                  <p className="text-xs text-green-600">+20.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                  <div className="rounded-full bg-blue-500/10 p-2">
                    <UserCheck className="size-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
                  <p className="text-xs text-green-600">+180.1% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                  <div className="rounded-full bg-gray-500/10 p-2">
                    <UserX className="size-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {users.filter((u) => u.status === "locked" || u.status === "inactive").length}
                  </div>
                  <p className="text-xs text-green-600">+19% from last month</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent>
                <DataTable columns={columns} data={users} />
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </div>
  );
}
