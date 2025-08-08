"use client";

import { Suspense } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "./site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Modals from "./modals";
import Notifications from "./notifications";
import { useStateStore } from "@/hooks/use-state-store";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const state = useStateStore();
  return (
    <>
      <SidebarProvider
        open={state.notifSidebarState}
        onOpenChange={state.setNotifSidebarState}
        defaultOpen={false}
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 84)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        keyboardShortcut={{
          key: "b",
          ctrlOrMetaKey: true,
          altKey: true,
        }}
      >
        <SidebarInset>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset>
              <SiteHeader />
              {children}
              <Suspense>
                <Modals />
              </Suspense>
            </SidebarInset>
          </SidebarProvider>
        </SidebarInset>
        <Notifications />
      </SidebarProvider>
    </>
  );
};

export default SidebarLayout;
