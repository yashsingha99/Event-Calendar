"use client"

import { useState } from "react"
import {
  Calendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./styles.css"

import { Card } from "../ui/card"
import { ScrollArea, ScrollBar } from "../ui/scroll-area"
import PageTitle from "../page-title"
import { cn } from "@/lib/utils"

import { CalendarHeader } from "./calendar-header"
import { CalendarToolbar } from "./calendar-toolbar"
import { EventTaskModal } from "../EventTaskModal"

const locales = { "en-US": enUS }
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales })

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "React Project",
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      type: "task",
      description: "Work on calendar modal",
      resource: {
        completed: false,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    },
  ])

  const eventStyleGetter = (event) => {
    const isCompleted = event.resource?.completed
    return {
      className: cn(
        "rbc-event border rounded-md px-2 py-1",
        isCompleted
          ? "bg-green-100 border-green-200 text-green-800"
          : "bg-red-100 border-red-200 text-red-800"
      ),
    }
  }

  return (
    <div>
      <Card className="w-[calc(100svw-50px)] p-4 md:w-full">
        <ScrollArea>
          <div className="h-[calc(100svh-150px)]">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              date={date}
              // onDoubleClickEvent={(event) => {
              //   setSelectedDate(event.start)
              //   setIsModalOpen(true)
              // }} 
              onSelecting={({ start, end }) => {
                setSelectedDate(start)
                setIsModalOpen(true)
                return false // Prevent default selection behavior
              }}
              onKeyPressEvent={(event) => {
                setSelectedDate(event.start)
                setIsModalOpen(true)
              }}
              onNavigate={setDate}
              onSelectEvent={(event) => {
                setSelectedDate(event.start)
                setIsModalOpen(true)
              }}
              // onSelectSlot={(slotInfo) => {
              //   setSelectedDate(slotInfo.start)
              //   setIsModalOpen(true)
              // }}
              selectable
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              eventPropGetter={eventStyleGetter}
              components={{
                toolbar: CalendarToolbar,
                header: CalendarHeader,
              }}
              popup
              className="calendar bg-background text-foreground"
              style={{ height: "100%" }}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      <EventTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
      />
    </div>
  )
}
