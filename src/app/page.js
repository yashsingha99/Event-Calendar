"use client"

import { AppSidebar } from "@/components/app-sidebar"
import CalendarPage from "@/components/calender/calender"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState } from "react"

export default function Page() {
   const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <SidebarProvider>
      <AppSidebar />
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

          <Button onClick={() => setIsModalOpen(true)} className="cursor-pointer" variant="outline">New Event</Button>

        </header>
        {/* <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="bg-muted/50 aspect-square rounded-xl" />
            ))}
          </div>
        </div> */}
        <CalendarPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />

      </SidebarInset>
    </SidebarProvider>
  )
}
