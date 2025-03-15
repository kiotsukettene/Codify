import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfToday } from "date-fns";

const UpdateDueDate = ({ isOpen, onClose, onSave, initialDate }) => {
  const today = startOfToday(); // Corrected to use a proper Date object

  const [date, setDate] = useState(initialDate ? new Date(initialDate) : today);
  const [time, setTime] = useState("");

  const [initialState, setInitialState] = useState({ date: initialDate ? new Date(initialDate) : today, time: "" });

  useEffect(() => {
    setDate(initialDate ? new Date(initialDate) : today);
    setTime("");
    setInitialState({ date: initialDate ? new Date(initialDate) : today, time: "" });
  }, [initialDate, isOpen]);

  const handleSave = () => {
    onSave({ date, time });
    onClose();
  };

  const isUnchanged =
    format(date, "yyyy-MM-dd") === format(initialState.date, "yyyy-MM-dd") &&
    time === initialState.time;

  return (
<Dialog open={isOpen}>
<DialogContent modal>
<DialogHeader>
          <DialogTitle className="text-purple-600 text-lg gap-2">
            Update Due Date
          </DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {/* Date Input with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                disabled={(selectedDate) => isBefore(selectedDate, today)}
              />
            </PopoverContent>
          </Popover>

          {/* Time Input */}
          <div className="mt-4">
            <label className="block text-base font-medium mb-2">Time:</label>
            <input
              type="time"
              className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-purple-400 focus-visible:outline-none"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUnchanged} className="disabled:bg-slate-600">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDueDate;
