"use client";

import { AppSidebar } from "@/components/app-sidebar";
import CalendarPage from "@/components/calender/calender";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const calendars = JSON.parse(localStorage.getItem("calendars"));
      if (!calendars) {
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
        localStorage.setItem("calendars", JSON.stringify(dummyData));
      }
    } else {
      toast.error("localstorage not found")
    }
  }, []);
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <AppSidebar setIsSelect={setIsSelect} time={time} setTime={setTime} />
        <SidebarInset>
          <header className="bg-background justify-between sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>October 2024</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="cursor-pointer"
              variant="outline"
            >
              New Event
            </Button>
          </header>
          <CalendarPage
            time={time}
            setTime={setTime}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            isSelect={isSelect}
          />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
