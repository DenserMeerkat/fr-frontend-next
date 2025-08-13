"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeftIcon,
  BanknoteArrowDownIcon,
  BanknoteArrowUpIcon,
  BellIcon,
  NewspaperIcon,
  WalletIcon,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStateStore } from "@/hooks/use-state-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "../ui/scroll-area";

const mockNotifications = [
  {
    id: 1,
    title: "GOOGL Alert",
    message: "GOOGL has reached your target price of $145.50.",
    timestamp: "2 minutes ago",
    read: false,
    type: "alert",
  },
  {
    id: 2,
    title: "Tech News",
    message:
      "New report on semiconductor supply chain impacting major tech stocks.",
    timestamp: "1 hour ago",
    read: false,
    type: "news",
  },
  {
    id: 3,
    title: "C Order",
    message: "Your buy order for 5 shares of C has been successfully filled.",
    timestamp: "3 hours ago",
    read: true,
    type: "order",
  },
  {
    id: 4,
    title: "AAPL Dividend",
    message: "A dividend of $0.24 per share has been paid to your account.",
    timestamp: "Yesterday",
    read: true,
    type: "dividend",
  },
  {
    id: 5,
    title: "Portfolio Update",
    message:
      "Your portfolio has seen a 2.5% increase in value over the last 24 hours.",
    timestamp: "8 hours ago",
    read: false,
    type: "portfolio",
  },
  {
    id: 6,
    title: "Withdrawal Complete",
    message: "A withdrawal of $500 from your trading account is complete.",
    timestamp: "1 day ago",
    read: true,
    type: "withdrawal",
  },
  {
    id: 7,
    title: "High Volatility",
    message:
      "Market volatility is high today, particularly in the energy sector.",
    timestamp: "2 days ago",
    read: false,
    type: "alert",
  },
  {
    id: 8,
    title: "Account Login",
    message: "A new login was detected from an unrecognized device.",
    timestamp: "2 days ago",
    read: true,
    type: "security",
  },
  {
    id: 9,
    title: "Deposit Confirmed",
    message:
      "A deposit of $1,000 to your account has been successfully processed.",
    timestamp: "3 days ago",
    read: false,
    type: "deposit",
  },
  {
    id: 10,
    title: "AMZN Watchlist",
    message: "AMZN has moved down 5% since the market opened this morning.",
    timestamp: "3 days ago",
    read: true,
    type: "alert",
  },
  {
    id: 11,
    title: "New Feature",
    message:
      "A new back-testing tool is now available to analyze your trading strategies.",
    timestamp: "4 days ago",
    read: false,
    type: "news",
  },
];

const getNotificationIcon = (type: string) => {
  const iconClasses = "size-4";
  switch (type) {
    case "alert":
      return <BellIcon className={cn(iconClasses, "text-primary")} />;
    case "news":
      return <NewspaperIcon className={cn(iconClasses, "text-blue-500")} />;
    case "order":
      return (
        <ArrowRightLeftIcon className={cn(iconClasses, "text-positive")} />
      );
    case "deposit":
      return (
        <BanknoteArrowUpIcon className={cn(iconClasses, "text-positive")} />
      );
    case "withdrawal":
      return (
        <BanknoteArrowDownIcon className={cn(iconClasses, "text-negative")} />
      );
    case "dividend":
      return <WalletIcon className={cn(iconClasses, "text-purple-500")} />;
    default:
      return <BellIcon className={cn(iconClasses, "text-primary")} />;
  }
};

const NotificationsHeader = () => {
  const { setNotifSidebarState } = useStateStore();
  return (
    <div className="flex justify-between items-center gap-2 md:p-2">
      <div className="relative">
        <Badge
          className="absolute -top-3 -right-3 px-1 text-[0.5rem] font-mono tabular-nums"
          variant="destructive"
        >
          {mockNotifications.length ?? 0}
        </Badge>
        <BellIcon className="size-4" />
      </div>
      <h4 className="font-semibold">Notifications</h4>
      <Button
        variant="outline"
        size="icon"
        className="cursor-pointer size-7"
        onClick={() => setNotifSidebarState(false)}
      >
        <XIcon />
        <span className="sr-only">Close Notification Sidebar</span>
      </Button>
    </div>
  );
};

const NotificationsContent = () => (
  <SidebarMenu className="pr-2">
    <NotificationList />
  </SidebarMenu>
);

const NotificationList = () => {
  return (
    <>
      {mockNotifications.map((notification) => (
        <SidebarMenuItem key={notification.id} className="list-none">
          <Card
            className={cn(
              "transition-colors cursor-pointer items-start gap-2 rounded-lg border border-border/60 py-3 min-w-0 my-1",
              notification.read && "bg-muted"
            )}
          >
            <CardHeader className="w-full px-3">
              <CardTitle className="flex gap-2 tracking-wide">
                {getNotificationIcon(notification.type)}
                {notification.title}
              </CardTitle>
              <CardDescription hidden>notification</CardDescription>
            </CardHeader>
            <CardContent className="px-3">
              <p className="text-xs">{notification.message}</p>
            </CardContent>
            <CardFooter className="w-full">
              <p className="text-[0.65rem] ml-auto">{notification.timestamp}</p>
            </CardFooter>
          </Card>
        </SidebarMenuItem>
      ))}
    </>
  );
};

const NotificationsFooter = () => (
  <Button variant="outline" className="w-full">
    Clear all
  </Button>
);

const Notifications = () => {
  const { notifSidebarState, setNotifSidebarState } = useStateStore();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Sidebar variant="inset" collapsible="offcanvas" side="right">
        <SidebarHeader>
          <NotificationsHeader />
        </SidebarHeader>
        <SidebarContent>
          <ScrollArea className="max-h-[calc(100dvh-8rem)] px-1 pr-2">
            <NotificationsContent />
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter>
          <NotificationsFooter />
        </SidebarFooter>
      </Sidebar>
    );
  }

  return (
    <Drawer
      open={notifSidebarState}
      onOpenChange={setNotifSidebarState}
      direction="right"
    >
      <DrawerContent>
        <DrawerHeader className="border-b">
          <DrawerTitle hidden>Notification</DrawerTitle>
          <NotificationsHeader />
        </DrawerHeader>
        <ScrollArea className="max-h-[calc(100dvh-8rem)] px-1 pr-2 bg-muted">
          <NotificationList />
        </ScrollArea>
        <DrawerFooter className="border-t">
          <NotificationsFooter />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Notifications;
