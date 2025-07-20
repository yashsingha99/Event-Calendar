"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { CalendarIcon, MapPin, Video } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

export function EventTaskModal({ isOpen, onClose, selectedEvent }) {
  console.log(selectedEvent);
  
  const [activeTab, setActiveTab] = useState("event");
  const [formData, setFormData] = useState({
    title: selectedEvent?.title || "",
    description: selectedEvent?.description || "",
    guests: selectedEvent?.guests || "",
    location: selectedEvent?.location || "",
    time: selectedEvent?.start || null,
    type: "event",
  });

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.time) return;

    const startDate = new Date(formData.time);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

    const event = {
      ...formData,
      start: startDate,
      end: endDate,
      allDay: false,
    };

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("events");
      const prevEvents = existing ? JSON.parse(existing) : [];
      localStorage.setItem("events", JSON.stringify([...prevEvents, event]));
    }

    handleClose();
  };

  const handleClose = () => {
    onClose();
    setFormData({
      title: "",
      description: "",
      guests: "",
      location: "",
      time: date || null,
      type: "event",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Add {activeTab === "event" ? "Event" : "Task"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-2">
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

        <Input
          placeholder="Add title"
          className="mb-2"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                {formData.time ? format(formData.time, "MMMM dd, yyyy") : "Pick a date"}
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
                    time: selected, // ✅ store as Date object, not formatted string
                  });
                }}
                disabled={(d) => d < new Date("1900-01-01")}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
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

        <Button onClick={handleSave} className="w-full mt-4">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
