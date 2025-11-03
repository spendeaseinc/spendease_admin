import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Customer } from "@/lib/types";

interface CustomerHeaderProps {
  customer: Customer;
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            {customer.profileImage && (
              <AvatarImage src={customer.profileImage || "/placeholder.svg"} alt={customer.name} />
            )}
            <AvatarFallback className="bg-orange-500/10 text-lg font-semibold text-orange-500">
              {customer.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{customer.name}</h1>
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-700 hover:bg-orange-500/20">
                {customer.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{customer.email}</p>
          </div>
        </div>
        {customer.kycLevel && (
          <div className="text-right">
            <p className="text-muted-foreground text-sm">KYC level</p>
            <p className="text-lg font-semibold">{customer.kycLevel}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
