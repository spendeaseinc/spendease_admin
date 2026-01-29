"use client";

import { useState } from "react";

import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { declineVerification } from "@/app/actions/verifications";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { VerificationRequest, VerificationDeclineReason } from "@/lib/types/verification";

interface DeclineSheetProps {
  request: VerificationRequest;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DECLINE_REASONS: { value: VerificationDeclineReason; label: string; description: string }[] = [
  {
    value: "document_unreadable",
    label: "Document Unreadable",
    description: "The uploaded document is blurry, cut off, or too dark to read.",
  },
  {
    value: "document_expired",
    label: "Document Expired",
    description: "The document is older than the allowed period (usually 3 months).",
  },
  {
    value: "address_mismatch",
    label: "Address Mismatch",
    description: "The address on the document does not match the user's profile address.",
  },
  {
    value: "name_mismatch",
    label: "Name Mismatch",
    description: "The name on the document does not match the user's profile name.",
  },
  {
    value: "document_altered",
    label: "Document Altered",
    description: "The document appears to be digitally modified or forged.",
  },
];

export function DeclineSheet({ request, isOpen, onClose, onSuccess }: DeclineSheetProps) {
  const [reason, setReason] = useState<VerificationDeclineReason | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Please select a valid reason for declining");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await declineVerification(request.id, reason, notes);

      if ("success" in result && result.success) {
        // Success response
        toast.success("Verification declined successfully");
        onSuccess();
        // Reset state
        setReason("");
        setNotes("");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error((result as any).message ?? "Failed to decline verification");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="flex w-[400px] flex-col sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="text-red-700">Decline Verification</SheetTitle>
          <SheetDescription>
            You are about to decline the verification for{" "}
            <strong>
              {request.user?.first_name} {request.user?.last_name}
            </strong>
            . Please select a reason below. This will be shared with the user.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="space-y-6">
            <RadioGroup value={reason} onValueChange={(val) => setReason(val as VerificationDeclineReason)}>
              <div className="space-y-3">
                {DECLINE_REASONS.map((item) => (
                  <div
                    key={item.value}
                    className={`hover:bg-muted/50 flex cursor-pointer items-start space-y-0 space-x-3 rounded-md border p-4 transition-colors ${reason === item.value ? "border-red-600 bg-red-50 hover:bg-red-50" : ""} `}
                  >
                    <RadioGroupItem value={item.value} id={item.value} className="mt-1" />
                    <Label htmlFor={item.value} className="w-full cursor-pointer font-normal">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-muted-foreground mt-1 text-xs">{item.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Internal)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional context for other admins..."
                className="min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="flex gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>Declining this request will send an automated email to the customer with the selected reason.</p>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <div className="flex w-full justify-between gap-3 sm:justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmit}
              disabled={!reason || isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Decline
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
