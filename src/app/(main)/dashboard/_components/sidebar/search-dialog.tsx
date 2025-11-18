"use client";
import * as React from "react";

import { User, Users, WalletCards, BookCheck, Bell, CircleDollarSign, LayoutDashboard, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const searchItems = [
  { group: "Dashboards", icon: LayoutDashboard, label: "Default" },
  { group: "Dashboards", icon: User, label: "Customers", disabled: true },
  { group: "Dashboards", icon: WalletCards, label: "Transactions", disabled: true },
  { group: "Dashboards", icon: Users, label: "Team", disabled: true },
  { group: "Dashboards", icon: BookCheck, label: "Audit", disabled: true },
  { group: "Dashboards", icon: CircleDollarSign, label: "Partner Balance", disabled: true },
  { group: "Dashboards", icon: Bell, label: "Notifications", disabled: true },
  { group: "Authentication", label: "Login" },
  { group: "Authentication", label: "Forgot Password" },
];

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="link"
        className="text-muted-foreground px-0! font-normal hover:no-underline"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        Search
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search dashboards, users, and more…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {[...new Set(searchItems.map((item) => item.group))].map((group, i) => (
            <React.Fragment key={group}>
              {i !== 0 && <CommandSeparator />}
              <CommandGroup heading={group} key={group}>
                {searchItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <CommandItem className="py-1.5!" key={item.label} onSelect={() => setOpen(false)}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
