"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TeamMember } from "@/lib/types";

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { firstName: string; lastName: string; email: string; role: string; status: string }) => void;
  member: TeamMember | null;
}

export function EditUserDialog({ open, onClose, onSubmit, member }: EditUserDialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (member) {
      const [first, ...rest] = member.name.split(" ");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFirstName(first || "");
      setLastName(rest.join(" ") || "");
      setEmail(member.email);
      setRole(member.role);
      setStatus(member.status);
    }
  }, [member]);

  const handleSubmit = () => {
    onSubmit({ firstName, lastName, email, role, status });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Team member information</DialogTitle>
          <DialogDescription>Update Team member details to continue</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Enter name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Enter name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Select role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full" id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Viewer">Viewer</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Analyst">Analyst</SelectItem>
                <SelectItem value="Product Manager">Product Manager</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Select Team status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full" id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
