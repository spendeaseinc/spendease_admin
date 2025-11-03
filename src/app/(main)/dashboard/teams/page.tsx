"use client";

import { useState, useMemo, useEffect } from "react";

import { Download, Filter, Plus, SlidersHorizontal } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { teamMembers as initialTeamMembers } from "@/lib/dummy-data";
import type { TeamMember, ModalType } from "@/lib/types";

import { AddUserDialog } from "./_components/add-user-dialog";
import { DeleteUserDialog } from "./_components/delete-user-dialog";
import { EditUserDialog } from "./_components/edit-user-dialog";
import { SuccessDialog } from "./_components/success-dialog";
import { teamColumns } from "./_components/team-columns";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || member.role === roleFilter;
      const matchesStatus = statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchQuery, roleFilter, statusFilter, teamMembers]);

  const table = useDataTableInstance({
    data: filteredMembers,
    columns: teamColumns({
      onEdit: (member) => {
        setSelectedMember(member);
        setModalType("edit-user");
      },
      onDelete: (member) => {
        setSelectedMember(member);
        setModalType("delete-user");
      },
    }),
    enableRowSelection: true,
    defaultPageSize: 10,
  });

  useEffect(() => {
    table.setPageIndex(0);
  }, [searchQuery, roleFilter, statusFilter, table]);

  const handleExport = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const membersToExport = selectedRows.length > 0 ? selectedRows.map((row) => row.original) : filteredMembers;

    const csvContent = [
      ["Name", "Email", "Phone Number", "Role", "Status", "Created At"],
      ...membersToExport.map((member) => [
        member.name,
        member.email,
        member.phoneNumber ?? "",
        member.role,
        member.status,
        member.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddUser = (data: { firstName: string; lastName: string; email: string; role: string }) => {
    const newMember: TeamMember = {
      id: String(teamMembers.length + 1),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phoneNumber: "",
      role: data.role as TeamMember["role"],
      status: "Pending",
      createdAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
    };
    setTeamMembers([...teamMembers, newMember]);
    setModalType("user-added");
  };

  const handleEditUser = (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
  }) => {
    if (!selectedMember) return;
    const updatedMembers = teamMembers.map((member) =>
      member.id === selectedMember.id
        ? {
            ...member,
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            role: data.role as TeamMember["role"],
            status: data.status as TeamMember["status"],
            initials: `${data.firstName[0]}${data.lastName[0]}`.toUpperCase(),
          }
        : member,
    );
    setTeamMembers(updatedMembers);
    setModalType("user-updated");
  };

  const handleDeleteUser = () => {
    if (!selectedMember) return;
    setTeamMembers(teamMembers.filter((member) => member.id !== selectedMember.id));
    setModalType("user-removed");
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedMember(null);
  };

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Teams</h1>
            <div className="flex items-center gap-3">
              <Button onClick={() => setModalType("add-user")} variant="outline" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                Add User
              </Button>
              <Button onClick={handleExport} variant="default" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Filter transactions..."
                className="max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Role {roleFilter !== "all" && `(${roleFilter})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>All Roles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("Viewer")}>Viewer</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("Admin")}>Admin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("Analyst")}>Analyst</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("Product Manager")}>Product Manager</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("Super Admin")}>Super Admin</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Status {statusFilter !== "all" && `(${statusFilter})`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>Inactive</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="gap-2 bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <DataTable table={table} columns={teamColumns({ onEdit: () => {}, onDelete: () => {} })} />
        </div>

        <div className="bg-card border-t px-6 py-4">
          <DataTablePagination table={table} />
        </div>
      </div>

      <AddUserDialog open={modalType === "add-user"} onClose={closeModal} onSubmit={handleAddUser} />
      <EditUserDialog
        open={modalType === "edit-user"}
        onClose={closeModal}
        onSubmit={handleEditUser}
        member={selectedMember}
      />
      <DeleteUserDialog
        open={modalType === "delete-user"}
        onClose={closeModal}
        onConfirm={handleDeleteUser}
        member={selectedMember}
      />
      <SuccessDialog
        open={modalType === "user-added" || modalType === "user-updated" || modalType === "user-removed"}
        onClose={closeModal}
        type={modalType as "user-added" | "user-updated" | "user-removed"}
      />
    </>
  );
}
