"use client";

import { ChevronsUpDownIcon, ChevronsUpIcon, Code2Icon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { app, repos } from "@/constants";
import BitbucketIcon from "@/components/icons/bitbucket";
import Link from "next/link";

export function AppLogo() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <div className="bg-sidebar-primary dark:text-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <ChevronsUpIcon className="size-6" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-base font-bold select-none">
                  {app.name}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground flex w-full items-center text-xs">
              <BitbucketIcon className="mr-2 size-2.5" />
              Bitbucket
            </DropdownMenuLabel>
            {repos.map((repo) => (
              <Link key={repo.name} href={repo.url} target={"_blank"}>
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <repo.icon className="size-3.5 shrink-0" />
                  </div>
                  {repo.name}
                  <DropdownMenuShortcut>
                    <Code2Icon />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </Link>
            ))}
            <DropdownMenuSeparator />
            <p className="text-muted-foreground gap-2 px-1.5 py-1 text-center text-xs">
              Link to <span className="text-primary">{app.name}</span> app
              repositories
            </p>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
