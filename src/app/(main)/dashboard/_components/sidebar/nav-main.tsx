"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { type NavGroup } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const isItemActive = (itemUrl: string) => {
    if (itemUrl === "/dashboard/default") {
      return pathname === "/dashboard/default";
    }
    return pathname.startsWith(itemUrl);
  };

  // Flatten all groups into a single list of items
  const allItems = items.flatMap((group) => group.items);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {allItems.map((item) => {
          const isActive = isItemActive(item.url);
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={isActive}
                className={cn(
                  "transition-all duration-200 ease-in-out",
                  isActive && "bg-spendease/10 data-[active=true]:bg-spendease/10!",
                )}
              >
                <Link
                  href={item.url}
                  className="flex w-full items-center gap-2.5"
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "transition-all duration-200 ease-in-out",
                        isActive && "text-primary",
                        isActive && isCollapsed && "scale-115",
                      )}
                    />
                  )}
                  <span className={cn(isActive && "text-primary font-medium")}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
