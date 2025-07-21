"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { ColorPicker } from "./color-picker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export function EventTaskModal({ isOpen, onClose, event }) {
  const [activeTab, setActiveTab] = useState("event");
  const [data, setData] = useState([]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    guests: "",
    time: null,
    type: "event",
    calendarId: "",
    calendarName: "Select Calendar",
    colorData: { name: "color picker", color: "#3174AD" },
  });

  useEffect(() => {
    // if (typeof window !== "undefined") {
      const localCalendars = localStorage.getItem("calendars");
      setData(localCalendars ? JSON.parse(localCalendars) : []);
    // }
  }, [isOpen]);

  useEffect(() => {
    if (event) {
      setFormData({
        id: event.id || "",
        title: event.title || "",
        description: event.description || "",
        guests: event.guests || "",
        time: event.start || null,
        type: event.type || "event",
        colorData: event.colorData || { name: "color picker", color: "#3174AD" },
        calendarId: event.calendar?.id || "",
        calendarName: event.calendar?.name || "Select Calendar",
      });

      const start = new Date(event.start);
      const end = new Date(event.end);

      setStartTime(start.toTimeString().slice(0, 5));
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [event]);

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      description: "",
      guests: "",
      time: null,
      type: "event",
      calendarId: "",
      calendarName: "Select Calendar",
      colorData: { name: "color picker", color: "#3174AD" },
    });
    setStartTime("09:00");
    setEndTime("10:00");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!formData.time) {
      toast.error("Date is required.");
      return;
    }

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startDate = new Date(formData.time);
    startDate.setHours(startH, startM, 0);

    const endDate = new Date(formData.time);
    endDate.setHours(endH, endM, 0);

    const newEvent = {
      ...formData,
      id: event?.id || uuidv4(),
      start: startDate,
      end: endDate,
      allDay: false,
      calendar: {
        id: formData.calendarId,
        name: formData.calendarName,
      },
    };

    const storedEvents = localStorage.getItem("events");
    const existingEvents = storedEvents ? JSON.parse(storedEvents) : [];

    if (event?.id) {
      const updated = existingEvents.filter((e) => e.id !== event.id);
      localStorage.setItem("events", JSON.stringify([...updated, newEvent]));
      toast.success("Event updated.");
    } else {
      localStorage.setItem("events", JSON.stringify([...existingEvents, newEvent]));
      toast.success("Event added.");
    }

    handleClose();
  };

  const handleDelete = () => {
    const storedEvents = localStorage.getItem("events");
    const existingEvents = storedEvents ? JSON.parse(storedEvents) : [];

    const updated = existingEvents.filter((e) => e.id !== event.id);
    localStorage.setItem("events", JSON.stringify(updated));

    toast.success("Event deleted.");
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit" : "Add"} {activeTab === "event" ? "Event" : "Task"}</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "event" ? "default" : "outline"}
              onClick={() => setActiveTab("event")}
            >
              Event
            </Button>
            <Button
              variant={activeTab === "task" ? "default" : "outline"}
              onClick={() => setActiveTab("task")}
            >
              Task
            </Button>
          </div>

          <ColorPicker
            value={formData.colorData}
            onChange={(color) =>
              setFormData((prev) => ({ ...prev, colorData: color }))
            }
          />
        </div>

        <Input
          placeholder="Add title"
          className="mb-2"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal mb-2"
            >
              {formData.time
                ? format(formData.time, "MMMM dd, yyyy")
                : "Pick a date"}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.time}
              onSelect={(date) => {
                if (date) {
                  setFormData((prev) => ({ ...prev, time: date }));
                }
              }}
              captionLayout="dropdown"
              disabled={(date) => date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>

        <div className="flex gap-2 mb-2">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-1/2"
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-1/2"
          />
        </div>

        <Select
          value={formData.calendarId}
          onValueChange={(id) => {
            const found = data?.flatMap((c) => c.items).find((i) => i.id === id);
            setFormData((prev) => ({
              ...prev,
              calendarId: id,
              calendarName: found?.name || "Select Calendar",
            }));
          }}
        >
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select calendar" />
          </SelectTrigger>
          <SelectContent>
            {data?.map((group) =>
              group.items.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {activeTab === "event" && (
          <>
            <Input
              placeholder="Add guests"
              className="mt-2"
              value={formData.guests}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, guests: e.target.value }))
              }
            />
            <Textarea
              placeholder="Add description"
              className="mt-2"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </>
        )}

        {activeTab === "task" && (
          <>
            <Textarea
              placeholder="Add task details"
              className="mt-2"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
            <select
              className="w-full border rounded-md p-2 text-sm mt-2"
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="My Tasks">My Tasks</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </>
        )}

        <div className="mt-4">
          {event?.id && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="w-full mb-2 border border-black bg-gray-100 hover:bg-gray-200"
            >
              Delete
            </Button>
          )}
          <Button onClick={handleSave} className="w-full">
            {event?.id ? "Save Changes" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
