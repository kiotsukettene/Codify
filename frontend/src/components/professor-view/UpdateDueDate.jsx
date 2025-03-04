import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// const UpdateDueDate = ({ isOpen, onClose, onSave, initialDate }) => {
//   const [date, setDate] = useState(initialDate || "");
//   const [time, setTime] = useState("");

//   // Convert time input into military (24-hour) format
//   const formatTime = (inputTime) => {
//     if (!inputTime) return "";

//     // Ensure input is in HH:MM format
//     let [hours, minutes] = inputTime.split(":");
//     hours = parseInt(hours, 10);

//     // Automatically adjust AM/PM and enforce 24-hour time format
//     let period = "AM";
//     if (hours >= 12) {
//       period = "PM";
//       if (hours > 12) hours -= 12; // Convert to 12-hour format
//     } else if (hours === 0) {
//       hours = 12; // Midnight edge case
//     }

//     return `${hours}:${minutes} ${period}`;
//   };

//   const handleTimeChange = (e) => {
//     const inputValue = e.target.value;
//     setTime(inputValue);
//   };

//   const handleSave = () => {
//     const formattedTime = time ? formatTime(time) : "";
//     onSave({ date, time: formattedTime });
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-bold">
//             Update Due Date
//           </DialogTitle>
//         </DialogHeader>
//         <div className="p-4">
//           {/* Date Input */}
//           <div className="mb-4">
//             <label className="block text-lg font-medium mb-2">Due:</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Calendar className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="date"
//                 className="w-full pl-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Pick a date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Time Input */}
//           <div className="mb-4">
//             <label className="block text-lg font-medium mb-2">Time:</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <Clock className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="time"
//                 className="w-full pl-10 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                 placeholder="Set time (optional)"
//                 value={time}
//                 onChange={handleTimeChange}
//               />
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-2 mt-6">
//             <Button variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave}>Save</Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default UpdateDueDate;

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
              className="w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-lg font-medium mb-2">Time:</label>
            <input
              type="time"
              className="w-full"
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
