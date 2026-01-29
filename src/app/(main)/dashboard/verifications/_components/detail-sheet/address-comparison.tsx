import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { VerificationRequest } from "@/lib/types/verification";

import { getScoreColor } from "./verification-review-badges";

interface AddressComparisonProps {
  request: VerificationRequest;
}

export function AddressComparison({ request }: AddressComparisonProps) {
  return (
    <div className="grid h-full grid-cols-2 gap-6">
      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="text-sm font-medium">Declared Address</CardTitle>
          <CardDescription>Address provided by user on profile</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {/* In real app, pull this from user.address_collection or similar */}
          <div className="space-y-4">
            <div className="bg-muted/20 rounded-lg border p-4">
              <p className="text-foreground text-lg font-medium">
                {/* Mock data for now as it's not in the base User type yet */}
                123 Main Street, Apt 4B
              </p>
              <p className="text-muted-foreground">Lagos, 100001</p>
              <p className="text-muted-foreground">Nigeria</p>
            </div>
            <div className="text-muted-foreground text-sm">
              <p>Source: User Profile</p>
              <p>Last Update: {format(new Date(), "MMM d, yyyy")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border shadow-sm">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="text-sm font-medium">Extracted Address</CardTitle>
          <CardDescription>Address extracted from document</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
              {request.extracted_address ? (
                <p className="text-foreground text-lg leading-relaxed font-medium">{request.extracted_address}</p>
              ) : (
                <p className="text-muted-foreground italic">No address text extracted</p>
              )}
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Match Confidence</span>
                <span className="text-sm font-bold">{request.address_match_score}%</span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className={`h-full ${getScoreColor(request.address_match_score ?? 0)}`}
                  style={{ width: `${request.address_match_score ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
