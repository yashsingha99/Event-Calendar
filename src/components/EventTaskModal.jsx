import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { useState } from "react"
import { CalendarIcon, MapPin, Users, Video } from "lucide-react"

 

export function EventTaskModal({ isOpen, onClose, date }) {
  const [activeTab, setActiveTab] = useState("event")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add title and time</DialogTitle>
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

        <Input placeholder="Add title" className="mb-2" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <CalendarIcon className="h-4 w-4" />
          {date?.toDateString() || "Select a date"}
        </div>

        {activeTab === "event" && (
          <>
            <Input placeholder="Add guests" className="mb-2" />
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4" />
              <Button variant="link" className="p-0 text-sm">Add Google Meet</Button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              <Input placeholder="Add location" />
            </div>
            <Textarea placeholder="Add description" className="mb-2" />
          </>
        )}

        {activeTab === "task" && (
          <>
            <Textarea placeholder="Add description" className="mb-2" />
            <select className="w-full border rounded-md p-2 text-sm">
              <option>My Tasks</option>
              <option>Work</option>
              <option>Personal</option>
            </select>
          </>
        )}

        <Button className="w-full mt-4">Save</Button>
      </DialogContent>
    </Dialog>
  )
}
