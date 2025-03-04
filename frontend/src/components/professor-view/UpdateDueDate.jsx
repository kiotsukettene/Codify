import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UpdateDueDate = ({ isOpen, onClose, onSave, initialDate }) => {
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");

  const handleSave = () => {
    onSave({ date, time });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Due Date</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {/* Date Input */}
          <div>
            <label className="block text-lg font-medium mb-2">Due:</label>
            <input
              type="date"
              className="w-full p-4 rounded-sm"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-lg font-medium mb-2">Time:</label>
            <input
              type="time"
              className="w-full p-4 rounded-sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDueDate;
