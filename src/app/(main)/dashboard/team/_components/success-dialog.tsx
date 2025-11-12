"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  type: "user-added" | "user-updated" | "user-removed";
}

export function SuccessDialog({ open, onClose, type }: SuccessDialogProps) {
  const content = {
    "user-added": {
      title: "User Added",
      description:
        "You have successfully added a new user on the platform. An invitation link was sent to the mail you provided.",
    },
    "user-updated": {
      title: "Updated",
      description: "You have successfully made an update on user's information",
    },
    "user-removed": {
      title: "User Removed",
      description: "You have successfully made removed a user from the team",
    },
  };

  const { title, description } = content[type] || content["user-added"];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Button className="w-full" onClick={onClose}>
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
