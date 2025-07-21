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
import {PropsData} from "./calendar-toolbar";
export default function CalendarPage({
  isModalOpen,
  setIsModalOpen,
  isSelect,
  time,
  setTime,
}) {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [calendars, setCalendars] = useState([]);
  
  useEffect(() => {
    if(time){
      PropsData.onView("day");
      setDate(new Date(time));
    }
  }, [time])

  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    const storedCalendars = JSON.parse(localStorage.getItem("calendars"));
    setCalendars(storedCalendars || []);
    const activeItems = [];
    storedCalendars?.filter((calendar) => {
      calendar.items.some((item) => {
        if (item.active) {
          activeItems.push(item);
        }
      });
    });
    if (storedEvents && activeItems ) {
      const parsed = JSON.parse(storedEvents).map((event) => {
        const isActive = activeItems.some(
          (item) => item.id == event.calendarId
        );
        if (isActive) {
          return {
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
          };
        }
      });
      if (parsed == [null]) {
        setEvents([]);
      } else {
        setEvents(parsed);
      }
    }
  }, [isModalOpen, isSelect]);

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
      prev.map((evt) =>
        evt.id === event.id ? { ...evt, time: { start, end } } : evt
      )
    );
    localStorage.setItem("events", JSON.stringify(events));
  };

  const onEventDrop = ({ start, end, event }) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === event.id ? { ...evt, start, end } : evt))
    );
      localStorage.setItem("events", JSON.stringify(events));
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
              date={date}
              onSelectEvent={handleSelectEvent}
              // onDoubleClickEvent={handleSelectEvent}
              selectable
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              eventPropGetter={eventStyleGetter}
              components={{ toolbar: CalendarToolbar, header: CalendarHeader }}
              className="calendar bg-background text-foreground text-sm"
              style={{ height: "100%" }}
              resizable
              onEventDrop={onEventDrop}
              onEventResize={onEventResize}
              draggableAccessor={() => true}
              resizableAccessor={() => true}
            />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      <EventTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </div>
  );
}
