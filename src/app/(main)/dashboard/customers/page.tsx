import { Metadata } from "next";

import { CustomersClient } from "./_components/customers-client";

export const metadata: Metadata = {
  title: "Customers - SpendEase Admin",
  description:
    "Customers Page - SpendEase Admin: Your reliable ally in cross-border payments, helping individuals, small businesses, and partners navigate international transactions to reach their financial aspirations.",
};

export default function Home() {
  return <CustomersClient />;
}
