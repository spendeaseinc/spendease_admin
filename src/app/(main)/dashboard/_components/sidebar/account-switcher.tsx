"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { BadgeCheck, LogOut } from "lucide-react";
import { toast } from "sonner";

import { signOut } from "@/app/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";

interface AccountSwitcherProps {
  readonly user: {
    readonly name: string;
    readonly email: string;
    readonly avatar?: string;
    readonly role?: string;
  } | null;
}

export function AccountSwitcher({ user }: AccountSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSignOut() {
    startTransition(async () => {
      const result = await signOut();

      if (result.success) {
        toast.success(result.message);

        router.push("/auth/login");
      } else {
        toast.error(result.message);
      }
    });
  }

  const displayUser = user;

  if (!displayUser) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-9 rounded-full">
          <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
          <AvatarImage className="rounded-full">{getInitials(displayUser.name)}</AvatarImage>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 space-y-1 rounded-lg" side="bottom" align="end" sideOffset={4}>
        <DropdownMenuItem key={displayUser.email} className={"bg-accent/50 border-l-primary border-l-2 p-0"}>
          <div className="flex w-full items-center justify-between gap-2 px-1 py-1.5">
            <Avatar className="size-9 rounded-full">
              <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-full">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{displayUser.name}</span>
              <span className="truncate text-xs capitalize">{displayUser.role}</span>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Account
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut} disabled={isPending}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
