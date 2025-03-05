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
import toast from "react-hot-toast";

const priorities = [
  { label: "Low Priority", value: "low", color: "#60a5fa" },  // Blue
  { label: "Medium Priority", value: "medium", color: "#fdba74" },  // Orange
  { label: "High Priority", value: "high", color: "#f87171" },  // Dark Red
];

export function CreateEventModal({ open, onOpenChange, addEvent }) {
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState("00:00");
  const [backgroundColor, setBackgroundColor] = React.useState("#4f46e5")
  const [endTime, setEndTime] = React.useState("00:00");
  const [priority, setPriority] = React.useState("low");


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
        toast.error("Please enter a title for the event.");
        return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title,
      start: `${format(date, "yyyy-MM-dd")}T${startTime}:00`,
      end: `${format(date, "yyyy-MM-dd")}T${endTime}:00`,
      backgroundColor: priorities.find((p) => p.value === priority)?.color || "#64748b", // Default Gray
      borderColor: priorities.find((p) => p.value === priority)?.color || "#64748b",
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

          <div className="space-y-2 flex flex-col">
            <label className="text-sm font-medium mr-5 bg-blue-50 px-3 py-1 rounded-md">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {format(date, "EEEE, dd MMMM")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className=" p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-row gap-4">
            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            <span className="items-center flex justify-center">-</span>
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
