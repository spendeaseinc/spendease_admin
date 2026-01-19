import {
  type LucideIcon,
  User,
  Users,
  WalletCards,
  BookCheck,
  Bell,
  CircleDollarSign,
  LayoutGrid,
  PauseCircle,
  Settings,
  ChartLine,
} from "lucide-react";

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
        url: "/dashboard/customers",
        icon: User,
      },
      {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: WalletCards,
      },
      {
        title: "Metrics",
        url: "/dashboard/metrics",
        icon: ChartLine,
      },
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Audit",
        url: "/dashboard/audit-logs",
        icon: BookCheck,
      },
      {
        title: "Partner Balance",
        url: "/dashboard/partner-balance",
        icon: CircleDollarSign,
      },
      // {
      //   title: "Waitlist",
      //   url: "/dashboard/waitlist",
      //   icon: PauseCircle,
      // },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];
