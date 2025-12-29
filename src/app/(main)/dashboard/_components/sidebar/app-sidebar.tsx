"use client";

import Image from "next/image";
import Link from "next/link";

import { Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const themeMode = usePreferencesStore((s) => s.themeMode);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-4.5">
              <Link href="/dashboard/default">
                {themeMode === "dark" ? (
                  <Image alt="SpendEase Logo" src="/logo/logo-white.png" width={14} height={14} />
                ) : (
                  <Image alt="SpendEase Logo" src="/logo/logo-black.png" width={14} height={14} />
                )}
                <span className="text-base font-semibold">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
