import { Badge } from "../ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { formatTime } from "@/lib/utils"

export function SessionDialog({ session, isOpen, onClose }) {
  if (!session) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Study Session Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Status</p>
            <Badge variant={session.completed ? "default" : "destructive"}>
              {session.completed ? "Completed" : "Incomplete"}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm capitalize text-muted-foreground">
              {session.type}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Duration</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(session.duration)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Start Time</p>
            <p className="text-sm text-muted-foreground">
              {new Date(session.startTime).toLocaleString()}
            </p>
          </div>
          {session.endTime && (
            <div>
              <p className="text-sm font-medium">End Time</p>
              <p className="text-sm text-muted-foreground">
                {new Date(session.endTime).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
