"use client";
import React, { useEffect, useState } from "react";
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
import { NewCalendarModal } from "./new-calendar-model";
const dummyData = [
  {
    name: "My Calendar",
    items: [
      {
        id: "1",
        name: "Personal",
        active: true,
      },
      {
        id: "2",
        name: "Work",
        active: false,
      },
      {
        id: "3",
        name: "Friends",
        active: false,
      },
    ],
  },
];
export function AppSidebar({ setIsSelect }) {
  const [time, setTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    const calendars = localStorage.getItem("calendars");
    setData(JSON.parse(calendars) || dummyData);
  }, []);

  return (
    <Sidebar>
      {/* <SidebarHeader className="border-sidebar-border h-16 border-b"> */}
      {/* <NavUser user={data.user} /> */}
      {/* </SidebarHeader> */}
      <SidebarContent className="flex mt-4 flex-col items-center">
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
        <Calendars
          calendars={data}
          setCalendars={setData}
          setIsSelect={setIsSelect}
        />
      </SidebarContent>
      <SidebarFooter className="flex justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <NewCalendarModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              onOpen={() => setIsOpen(true)}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
