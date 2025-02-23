"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const priorities = [
  { label: "Low Priority", value: "low", color: "#10b981" },
  { label: "Medium Priority", value: "medium", color: "#f59e0b" },
  { label: "High Priority", value: "high", color: "#ef4444" },
];

export function CreateEventModal({ open, onOpenChange, addEvent }) {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState("13:00");
  const [endTime, setEndTime] = React.useState("16:00");
  const [priority, setPriority] = React.useState("low");


  const handleSubmit = (e) => {
    e.preventDefault();

    const newEvent = {
      id: Date.now().toString(), // Unique ID
      title,
      start: `${format(date, "yyyy-MM-dd")}T${startTime}:00`,
      end: `${format(date, "yyyy-MM-dd")}T${endTime}:00`,
      backgroundColor: priorities.find((p) => p.value === priority).color,
      borderColor: priorities.find((p) => p.value === priority).color,
      textColor: "#ffffff",
    };

    addEvent(newEvent); // Send event to the main calendar
    onOpenChange(false); // Close modal
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium bg-purple-100 mt-4 rounded-md py-2 px-3">🛰️ Schedule Event </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium bg-blue-50 px-3 py-1 rounded-md">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Engineering Class" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium mr-5 bg-blue-50 px-3 py-1 rounded-md">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(date, "EEEE, dd MMMM")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
          </div>

          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Button type="submit" className="w-full bg-primary">
           Add Event 
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
