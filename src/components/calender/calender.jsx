"use client";

import { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays, subDays } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
const DnDCalendar = withDragAndDrop(Calendar);
import "./styles.css";
import { Card } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import PageTitle from "../page-title";
import { cn } from "@/lib/utils";
import { CalendarHeader } from "./calendar-header";
import { CalendarToolbar } from "./calendar-toolbar";
import { EventTaskModal } from "../EventTaskModal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarPage({ isModalOpen, setIsModalOpen }) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([
  ]);

  useEffect(() => {
    const stored = localStorage.getItem("events");
    if (stored) {
      const parsed = JSON.parse(stored).map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsed);
    }
  }, [isModalOpen]);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const eventStyleGetter = (event) => {
    const isCompleted = event.end < new Date();
    const customColor = event.colorData?.color;

    return {
      className: cn(
        "rbc-event border rounded-md px-2 py-1 overflow-hidden text-ellipsis whitespace-nowrap",
        !customColor &&
          !isCompleted &&
          "bg-red-100 border-red-200 text-red-800",
        isCompleted && "bg-green-100 border-green-200 text-green-800"
      ),
      style: customColor
        ? {
            backgroundColor: customColor,
            borderColor: customColor,
            color: "#fff",
          }
        : {},
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const onEventResize = ({ start, end, event }) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === event.id ? { ...evt, time: { start, end } } : evt))
    );
  };

  const onEventDrop = ({ start, end, event }) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === event.id ? { ...evt, start, end } : evt))
    );
  };


  return (
    <div>
      <Card className="text-sm">
        <ScrollArea>
          <div className="h-[calc(100svh-150px)]">
            <DnDCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              onView={setView}
              onNavigate={setDate}
              onSelectEvent={handleSelectEvent}
              selectable
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              eventPropGetter={eventStyleGetter}
              components={{ toolbar: CalendarToolbar, header: CalendarHeader }}
              popup
              className="calendar bg-background text-foreground text-sm"
              style={{ height: "100%" }}
              resizable
              onEventDrop={onEventDrop}
              onEventResize={onEventResize}
              draggableAccessor={() => true}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      <EventTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
}
