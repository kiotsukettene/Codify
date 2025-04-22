import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Calendar } from "lucide-react";
import UpdateDueDate from "@/components/professor-view/UpdateDueDate";
import { useActivityStore } from "@/store/activityStore";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import DeleteDialog from "../Dialog/DeleteDialog";

const ActivityOverview = ({
  activityId,
  dueDate: initialDueDate,
  points,
  instructions,
  fileName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dueDate, setDueDate] = useState(initialDueDate || "No due date");
  const { updateActivity, deleteActivity } = useActivityStore();
  const { courseSlug, lessonSlug, activitySlug } = useParams();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSaveDueDate = async ({ date, time }) => {
    if (!date) {
      toast.error("Please select a due date.");
      return;
    }

    const formattedDate = time
      ? new Date(`${format(date, "yyyy-MM-dd")}T${time}:00`)
      : new Date(date);

    setDueDate(new Date(formattedDate));

    if (!activityId) {
      toast.error("Error: Activity ID is missing.");
      return;
    }

    try {
      await updateActivity(activityId, { dueDate: formattedDate.toISOString() });
      toast.success("Due date updated successfully!");
    } catch (error) {
      toast.error("Error updating due date.");
      console.error(error);
    }
  };



  const handleDelete = () => {
    console.log("[ActivityOverview] Opening delete dialog for activity:", activityId);
    setIsDeleteDialogOpen(true);
  };




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 w-full mx-auto"
    >
      {/* Due Date & Points */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-gray-600 text-sm mb-8 gap-2">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Due date:{" "}
          {dueDate
            ? format(
                dueDate instanceof Date ? dueDate : new Date(dueDate),
                "MM/dd/yyyy 'at' h:mm a"
              )
            : "No due date"}
        </span>

        {/* Points and Menu */}
        <div className="flex items-center gap-2">
          <span>{points} Points</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="py-1">
              <DropdownMenuItem onClick={handleOpenModal}>
                Update Due Date
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}/activity/${activitySlug}/edit`)
                }
              >
                Edit Activity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                Delete Activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {fileName && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <h2 className="font-medium mb-4">Uploaded File:</h2>
          <div className="flex items-center p-2 bg-white border rounded-lg shadow-sm">
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <a
              href={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-blue-600 hover:underline truncate"
            >
              {decodeURIComponent(fileName.split("/").pop())}
            </a>
            <a
              href={fileName}
              download
              className="ml-auto text-gray-700 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v12m0 0l-3-3m3 3l3-3m-3 3V4m6 12a9 9 0 01-18 0H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-medium mb-4">Instructions:</h2>
        <ol className="list-decimal pl-5 space-y-4">
          {instructions.map((instruction, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {instruction}
            </motion.li>
          ))}
        </ol>
      </motion.div>

      <DeleteDialog
       isOpen={isDeleteDialogOpen}
        title="Delete Confirmation"
        description="Are you sure you want to delete this activity? This action cannot be undone."
        onConfirm={async () => {
        try {
         await deleteActivity(activityId);
          navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}`);
            } catch (error) {
          toast.error("Error deleting activity.");
          console.error(error);
            }
          setIsDeleteDialogOpen(false);
          }}
          onCancel={() => setIsDeleteDialogOpen(false)}
          />

      <UpdateDueDate
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDueDate}
        initialDate={dueDate}
      />
    </motion.div>

    
  );
};

export default ActivityOverview;