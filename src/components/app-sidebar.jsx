"use client";
import React, {useState} from "react";
import { Plus } from "lucide-react";

import { Calendars } from "@/components/calendars";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Calendar02 from "./calendar-02";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const [time, setTime] = useState(new Date());

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        {/* <NavUser user={data.user} /> */}
      </SidebarHeader>
      <SidebarContent className="flex flex-col items-center">
        <Calendar02
          mode="single"
          selected={time}
          onSelect={(selected) => {
            if (selected) setTime(selected);
          }}
          disabled={(d) => d < new Date("1900-01-01")}
          captionLayout="dropdown"
        />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
