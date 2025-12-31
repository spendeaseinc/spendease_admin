/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Settings } from "lucide-react";

import Logo from "@/components/logo";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
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

function VersionDisplay() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  if (!process.env.NEXT_PUBLIC_APP_VERSION || !isExpanded) {
    return null;
  }

  return (
    <div className="px-2 py-1.5 text-xs text-muted-foreground text-left">
      {process.env.NEXT_PUBLIC_APP_VERSION}
    </div>
  )
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const themeMode = usePreferencesStore((s) => s.themeMode);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex mx-2">
          <Logo height={15} width={15} />
        </div>
        {/* <span className="text-base font-semibold">{APP_CONFIG.name}</span> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} showDropdown={false} />
      </SidebarFooter>
    </Sidebar>
  );
}
