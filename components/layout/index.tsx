"use client";

import { Suspense } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "./site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Modals from "./modals";

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
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
  );
};

export default SidebarLayout;
