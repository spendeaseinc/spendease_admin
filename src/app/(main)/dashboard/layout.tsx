/* eslint-disable prettier/prettier */
import { ReactNode } from "react";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { getSession } from "@/app/actions/auth";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await getSession();

  const user = session?.user
    ? {
        name: `${session.user.first_name} ${session.user.last_name}`,
        email: session.user.email,
        avatar: undefined,
      }
    : null;

  return (
    <div className="flex-1 w-full h-screen flex flex-col">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar user={user} />
        <SidebarInset>
          <header
            // data-navbar-style={navbarStyle}
            className="bg-background/95 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur-sm"
          >
            <div className="flex w-full items-center justify-between px-4 lg:px-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <SidebarTrigger className="-ml-1 md:hidden" />
                <SearchDialog />
              </div>
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                {/*
                <Button variant="ghost" size="icon">
                  <Bell />
                </Button>
                */}
                <AccountSwitcher user={user} />
              </div>
            </div>
          </header>
          <div className="h-full p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
