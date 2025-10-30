import { type LucideIcon, User, Users, WalletCards, BookCheck, Bell, CircleDollarSign, LayoutGrid } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "General",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/default",
        icon: LayoutGrid,
      },
      {
        title: "Customers",
        url: "/dashboard/coming-soon",
        icon: User,
      },
      {
        title: "Transactions",
        url: "/dashboard/coming-soon",
        icon: WalletCards,
      },
      {
        title: "Teams",
        url: "/dashboard/coming-soon",
        icon: Users,
      },
      {
        title: "Audit",
        url: "/dashboard/coming-soon",
        icon: BookCheck,
      },
      {
        title: "Partner Balance",
        url: "/dashboard/coming-soon",
        icon: CircleDollarSign,
      },
      {
        title: "Notifications",
        url: "/dashboard/coming-soon",
        icon: Bell,
      },
    ],
  },
];
