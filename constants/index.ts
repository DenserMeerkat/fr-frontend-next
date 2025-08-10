import { RefetchIntervals } from "@/types";
import {
  AppWindowIcon,
  BookOpenIcon,
  ServerIcon,
  BriefcaseBusinessIcon,
  ListTodoIcon,
  PanelsTopLeftIcon,
  Settings2,
} from "lucide-react";
import { IconCash } from "@tabler/icons-react";

export const app = {
  name: "Four Real",
  shortName: "4 Real",
  description: "4 Real stock trading app",
};

export const user = {
  fullName: "Torvalds Unix",
  firstName: "Torvalds",
  lastName: "Unix",
  initials: "Tux",
  email: "torvalds.unix@linux.com",
};

export const repos = [
  {
    name: "Frontend",
    url: "https://bitbucket.org/densermeerkat/fr-frontend-next/src",
    icon: AppWindowIcon,
  },
  {
    name: "Backend",
    url: "https://bitbucket.org/densermeerkat/fr-backend/src",
    icon: ServerIcon,
  },
  {
    name: "Documentation",
    url: "https://bitbucket.org/densermeerkat/fr-doc/src",
    icon: BookOpenIcon,
  },
];

export const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: PanelsTopLeftIcon,
    isActive: true,
    items: [],
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ListTodoIcon,
    items: [],
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: BriefcaseBusinessIcon,
    items: [],
  },
  {
    title: "Balance",
    url: "?modal=balance",
    icon: IconCash,
    items: [],
  },
  {
    title: "Settings",
    url: "?modal=settings",
    icon: Settings2,
    items: [],
  },
];

export const DEFAULT_REFETCH_INTERVAL = RefetchIntervals.FIVE_MINUTES;
