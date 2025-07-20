"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useEffect, useState } from "react";
import { CalendarIcon, MapPin, Video } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { ColorPicker } from "./color-picker";

export function EventTaskModal({ isOpen, onClose, event }) {
  const [activeTab, setActiveTab] = useState("event");
  const [startTimeString, setStartTimeString] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [endTimeString, setEndTimeString] = useState(() => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return (now.toTimeString() + "01:00:00").slice(0, 5);
  });

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    guests: "",
    location: "",
    time: null,
    type: "event",
    colorData:{ name: "color picker" , color:"#3174AD"},
  });

  const handleClose = () => {
    onClose();
    setFormData({
      id: "",
      title: "",
      description: "",
      guests: "",
      location: "",
      time: null,
      type: "event",
      colorData:{ name: "color picker", color:"#3174AD"},
    });
  };

  useEffect(() => { 
    if (!isOpen) {
      handleClose();
    }
  }, [isOpen]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        guests: event.guests || "",
        location: event.location || "",
        time: event.start || null,
        type: event.type || "event",
        colorData: event.color || {name: "color picker", color: "#3174AD"},

      });
    }
  }, [event]);

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.time) return;

    const [startHours, startMinutes, startSeconds] = startTimeString
      .split(":")
      .map(Number);
    const startDate = new Date(formData.time);
    startDate.setHours(startHours);
    startDate.setMinutes(startMinutes);
    startDate.setSeconds(startSeconds || 0);
    const [endHours, endMinutes, endSeconds] = endTimeString
      .split(":")
      .map(Number);
    const endDate = new Date(startDate.getTime());
    endDate.setHours(endHours);
    endDate.setMinutes(endMinutes);
    endDate.setSeconds(endSeconds || 0);

    const eventData = {
      ...formData,
      id: event?.id || uuidv4(),
      start: startDate,
      end: endDate,
      allDay: false,
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("events");
      const prevEvents = existing ? JSON.parse(existing) : [];
      if (event?.id) {
        const filterEvents = prevEvents.filter((p) => p.id !== event.id);
        localStorage.setItem(
          "events",
          JSON.stringify([...filterEvents, eventData])
        );
      } else {
        localStorage.setItem(
          "events",
          JSON.stringify([...prevEvents, eventData])
        );
      }
    }

    handleClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("events");
      const prevEvents = existing ? JSON.parse(existing) : [];
      const filterEvents = prevEvents.filter((p) => p.id !== event.id);
      localStorage.setItem("events", JSON.stringify(filterEvents));
    }
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Add {activeTab === "event" ? "Event" : "Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-2 mb-2">
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
            onChange={(color) => setFormData({ ...formData, colorData: color })}
          />
        </div>

        <Input
          placeholder="Add title"
          className="mb-2"
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
          }}
        />

        <div className="flexitems-center gap-2 text-sm text-muted-foreground mb-2">
          <Popover className="">
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className=" w-full justify-start text-left font-normal"
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
                onSelect={(selected) => {
                  if (selected)
                    setFormData({
                      ...formData,
                      time: selected,
                    });
                }}
                disabled={(d) => d < new Date("1900-01-01")}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex w-full justify-between">
          <Input
            type="start time"
            id="time-picker"
            step="1"
            value={startTimeString}
            onChange={(e) => {
              setStartTimeString(e.target.value);
              const [h, m] = e.target.value.split(":").map(Number);
              const end = new Date();
              end.setHours(h + 1, m);
              setEndTimeString(end.toTimeString().slice(0, 5));
            }}
            className="bg-background w-[45%] appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />

          <Input
            type="end time"
            id="time-picker"
            step="1"
            value={endTimeString}
            onChange={(e) => setEndTimeString(e.target.value)}
            className="bg-background w-[45%] appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>

        {activeTab === "event" && (
          <>
            <Input
              placeholder="Add guests"
              className="mb-2"
              value={formData.guests}
              onChange={(e) =>
                setFormData({ ...formData, guests: e.target.value })
              }
            />
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4" />
              <Button variant="link" className="p-0 text-sm">
                Add Google Meet
              </Button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              <Input
                placeholder="Add location"
                className="flex-1"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <Textarea
              placeholder="Add description"
              className="mb-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </>
        )}

        {activeTab === "task" && (
          <>
            <Textarea
              placeholder="Add description"
              className="mb-2"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="My Tasks">My Tasks</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </select>
          </>
        )}
         
        <div>
          {event?.id && (
            <Button
              onClick={handleDelete}
              variant={event?.id ? "outline" : "default"}
              className={`w-full mt-4 ${
                event?.id && "border hover:bg-gray-300 border-black bg-gray-200"
              }`}
            >
              Delete
            </Button>
          )}
          <Button onClick={handleSave} className="w-full mt-4">
            {event?.id ? "Save changes" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
