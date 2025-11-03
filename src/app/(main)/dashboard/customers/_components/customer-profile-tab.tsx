import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Customer } from "@/lib/types";

interface CustomerProfileTabProps {
  customer: Customer;
}

// eslint-disable-next-line complexity
export function CustomerProfileTab({ customer }: CustomerProfileTabProps) {
  return (
    <div className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Customer Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">First name</p>
              <p className="font-medium">{customer.firstName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Last name</p>
              <p className="font-medium">{customer.lastName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Other name</p>
              <p className="font-medium">{customer.otherName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Gender</p>
              <p className="font-medium">{customer.gender ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Phone number</p>
              <p className="font-medium">{customer.phoneNumber ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email Address</p>
              <p className="font-medium">{customer.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Date of birth</p>
              <p className="font-medium">{customer.dateOfBirth ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Marital status</p>
              <p className="font-medium">{customer.maritalStatus ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Place of birth</p>
              <p className="font-medium">{customer.placeOfBirth ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">L.G.A of Origin</p>
              <p className="font-medium">{customer.lgaOfOrigin ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">State of Origin</p>
              <p className="font-medium">{customer.stateOfOrigin ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Nationality</p>
              <p className="font-medium">{customer.nationality ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Religion</p>
              <p className="font-medium">{customer.religion ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Mother&apos;s maiden na,e</p>
              <p className="font-medium">{customer.mothersMaidenName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">BVN</p>
              <p className="font-medium">{customer.bvn ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Address Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">House/Plot number</p>
              <p className="font-medium">{customer.housePlotNumber ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Street name</p>
              <p className="font-medium">{customer.streetName ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Landmark</p>
              <p className="font-medium">{customer.landmark ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">LGA</p>
              <p className="font-medium">{customer.lga ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Means of Identification */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Means of Identification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground text-sm">ID type</p>
              <p className="font-medium">{customer.idType ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">ID number</p>
              <p className="font-medium">{customer.idNumber ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Date issued</p>
              <p className="font-medium">{customer.dateIssued ?? "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Expiry dat</p>
              <p className="font-medium">{customer.expiryDate ?? "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
