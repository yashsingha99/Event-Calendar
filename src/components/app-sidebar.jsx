"use client";
import React, { useEffect, useState } from "react";
import { Moon, Plus, Sun } from "lucide-react";

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
import { useThemeStore } from "../lib/theme-context";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
export function AppSidebar({ setIsSelect, time, setTime }) {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
      const calendars = localStorage.getItem("calendars");
      setData(JSON.parse(calendars) || dummyData);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-16 border-b  px-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center font-bold text-xl">
            <span className="text-blue-600">Calen</span>
            <span className="dark:text-white text-black">dar</span>
          </div>
          <Button
            onClick={() => {
              if (theme === "dark") setTheme("light");
              else setTheme("dark");
            }}
            variant="outline"
            size="icon"
          >
            {theme === "dark" ? (
              <Sun
                Moon
                color="#ffffff"
                className="absolute h-[1.2rem] w-[1.2rem]  scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              />
            ) : (
              <Moon
                color="#000000"
                className="h-[1.2rem] w-[1.2rem]  scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              />
            )}
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex mt-4 flex-col items-center">
        <Calendar
          mode="single"
          defaultMonth={time || new Date()}
          numberOfMonths={1}
          selected={time || new Date()}
          onSelect={setTime}
          className="rounded-lg border shadow-sm "
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
