import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateEventModal = ({
  open,
  onOpenChange,
  addEvent,
  editEvent,
  deleteEvent,
  eventToEdit,
  isAddingEvent,
  isEditingEvent,
  isDeletingEvent,
}) => {
  const priorities = [
    { label: "High Priority", value: "high", color: "#f87171" },
    { label: "Medium Priority", value: "medium", color: "#fdba74" },
    { label: "Low Priority", value: "low", color: "#60a5fa" },
  ];

  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    backgroundColor: priorities[2].color,
  });

  useEffect(() => {
    if (eventToEdit) {
      const startDateTime = new Date(eventToEdit.start);
      const endDateTime = new Date(eventToEdit.end);
      const startDate = startDateTime.toISOString().split("T")[0];
      const startTime = startDateTime.toISOString().split("T")[1].slice(0, 5);
      const endDate = endDateTime.toISOString().split("T")[0];
      const endTime = endDateTime.toISOString().split("T")[1].slice(0, 5);

      setFormData({
        title: eventToEdit.title,
        start: `${startDate}T${startTime}`,
        end: `${endDate}T${endTime}`,
        backgroundColor: eventToEdit.backgroundColor,
      });
    } else {
      setFormData({
        title: "",
        start: "",
        end: "",
        backgroundColor: priorities[2].color,
      });
    }
  }, [eventToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      id: eventToEdit ? eventToEdit.id : undefined,
      title: formData.title,
      start: formData.start,
      end: formData.end,
      backgroundColor: formData.backgroundColor,
    };

    if (eventToEdit) {
      editEvent(eventData);
    } else {
      addEvent(eventData);
    }
  };

  const handleDelete = () => {
    if (eventToEdit) {
      deleteEvent(eventToEdit.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{eventToEdit ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start">Start Date & Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={formData.start}
                onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end">End Date & Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={formData.end}
                onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.backgroundColor}
                onValueChange={(value) =>
                  setFormData({ ...formData, backgroundColor: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.color}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              className='mt-2'
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {eventToEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isAddingEvent || isEditingEvent || isDeletingEvent}
              >
                {isDeletingEvent ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button
              className='my-3'
              type="submit"
              disabled={isAddingEvent || isEditingEvent || isDeletingEvent}
            >
              {isAddingEvent || isEditingEvent
                ? eventToEdit
                  ? "Updating..."
                  : "Creating..."
                : eventToEdit
                ? "Update Event"
                : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventModal;