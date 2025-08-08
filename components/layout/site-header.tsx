import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useStateStore } from "@/hooks/use-state-store";
import { PanelRight } from "lucide-react";

function useBreadcrumbItems() {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");

    const navItem = navItems.find((item) => item.url === path);

    const title =
      navItem?.title ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    return {
      path,
      title,
      isLast: index === pathSegments.length - 1,
    };
  });

  if (pathSegments.length > 0) {
    const rootNavItem = navItems.find((item) => item.url === "/");
    breadcrumbItems.unshift({
      path: "/",
      title: rootNavItem?.title || "Home",
      isLast: false,
    });
  }

  return breadcrumbItems;
}

export function SiteHeader() {
  const pathname = usePathname();
  const breadcrumbItems = useBreadcrumbItems();

  if (pathname === "/") {
    const rootNavItem = navItems.find((item) => item.url === "/");
    return (
      <header className="bg-background sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <AppSidebarTrigger />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">
            {rootNavItem?.title || "Home"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle className="-mr-1" />
          </div>
        </div>
      </header>
    );
  }

  const renderBreadcrumbs = () => {
    if (breadcrumbItems.length === 0) {
      return (
        <BreadcrumbItem>
          <BreadcrumbPage className="text-base font-medium">
            404 Not Found
          </BreadcrumbPage>
        </BreadcrumbItem>
      );
    }

    if (breadcrumbItems.length <= 3) {
      return breadcrumbItems.map((item) => (
        <div key={item.path} className="flex items-center">
          <BreadcrumbItem>
            {item.isLast ? (
              <BreadcrumbPage className="text-base font-medium">
                {item.title}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href={item.path}
                className="hover:text-foreground/80 text-sm font-normal"
              >
                {item.title}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {!item.isLast && <BreadcrumbSeparator />}
        </div>
      ));
    }

    const firstItem = breadcrumbItems[0];
    const lastTwoItems = breadcrumbItems.slice(-2);
    const hiddenItems = breadcrumbItems.slice(1, -2);

    if (!firstItem) return null;

    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={firstItem.path}
            className="hover:text-foreground/80 text-sm font-normal"
          >
            {firstItem.title}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {hiddenItems.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {hiddenItems.map((item) => (
                    <DropdownMenuItem key={item.path}>
                      <a href={item.path} className="w-full">
                        {item.title}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {lastTwoItems.map((item) => (
          <div key={item.path} className="flex items-center">
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage className="text-base font-medium">
                  {item.title}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.path}
                  className="hover:text-foreground/80 text-sm font-normal"
                >
                  {item.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!item.isLast && <BreadcrumbSeparator />}
          </div>
        ))}
      </>
    );
  };

  return (
    <header className="bg-background sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <AppSidebarTrigger />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />

        <Breadcrumb>
          <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <ModeToggle className="-mr-1" />
          <NotifSidebarTrigger />
        </div>
      </div>
    </header>
  );
}

const AppSidebarTrigger = () => {
  return <SidebarTrigger className="-ml-1 cursor-pointer" />;
};

const NotifSidebarTrigger = () => {
  const { notifSidebarState, setNotifSidebarState } = useStateStore();
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() => setNotifSidebarState(!notifSidebarState)}
    >
      <PanelRight />
      <span className="sr-only">Toggle Notification Sidebar</span>
    </Button>
  );
};
