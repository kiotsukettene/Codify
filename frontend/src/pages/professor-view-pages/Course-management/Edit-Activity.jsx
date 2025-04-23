import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  FileIcon,
  X,
  CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { isBefore, startOfToday, parse, format, isToday } from "date-fns";
import { toast } from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import TimeField from "@/components/professor-view/Time-field";
import { Calendar } from "@/components/ui/calendar";
import { useActivityStore } from "@/store/activityStore";

const EditActivity = () => {
  const { courseSlug, lessonSlug, activitySlug } = useParams();
  const { activity, fetchActivityBySlug, updateActivity, isLoading, error } = useActivityStore();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [textFormat, setTextFormat] = useState([]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Check if time input should be disabled
  const isTimeInputDisabled = () => {
    if (!date || !isToday(date)) return false;
    const now = currentTime;
    return now.getHours() >= 23 && now.getMinutes() >= 59;
  };

  // Validate if the selected time is in the future
  const isTimeValid = () => {
    if (!time || !date) return false;
    if (!isToday(date)) return true; // Any time is valid for future dates
    const selectedDateTime = parse(time, "HH:mm", date);
    return selectedDateTime > currentTime;
  };

  // Fetch activity on mount
  useEffect(() => {
    if (activitySlug) {
      fetchActivityBySlug(activitySlug).catch((error) => {
        console.error("Error fetching activity:", error);
        toast.error("Failed to load activity. Please try again.");
      });
    }
  }, [activitySlug, fetchActivityBySlug]);

  // Populate form with activity data
  useEffect(() => {
    if (activity) {
      setTitle(activity.title || "");
      setSubtitle(activity.subTitle || "");
      setInstruction(activity.instructions || "");
      if (activity.dueDate) {
        const dueDate = new Date(activity.dueDate);
        setDate(dueDate);
        setTime(format(dueDate, "HH:mm"));
      }
      setFiles(activity.file ? [{ name: activity.file, existing: true }] : []);
    }
  }, [activity]);

  // Form validation
  useEffect(() => {
    const hasContent =
      title.trim() !== "" ||
      subtitle.trim() !== "" ||
      instruction.trim() !== "" ||
      files.length > 0;
    const hasValidTime = isTimeValid();
    setIsFormValid(hasContent && hasValidTime);
  }, [title, subtitle, instruction, files, time, date, currentTime]);

  const dueDateTime =
    date && time
      ? new Date(`${format(date, "yyyy-MM-dd")}T${
          /^\d{2}:\d{2}$/.test(time) ? time : "23:59"
        }:00`).toISOString()
      : null;

  const handleSubmit = async () => {
    if (!activity?._id) {
      toast.error("No activity to update");
      return;
    }

    if (!isTimeValid()) {
      toast.error("Selected time is in the past. Please choose a future time.");
      return;
    }

    const updatedActivity = {
      title,
      subTitle: subtitle,
      instructions: instruction,
      dueDate: dueDateTime ? new Date(dueDateTime).toISOString() : null,
      points: activity.points || 100,
    };

    try {
      await updateActivity(activity._id, updatedActivity, files);
      navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}/activity/${activitySlug}`);
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Error updating activity. Check console logs.");
    }
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const invalidFiles = selectedFiles.filter((file) => file.size > MAX_FILE_SIZE);

    if (invalidFiles.length > 0) {
      toast.error("Some files exceed the 10MB limit");
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  if (isLoading) return <p>Loading activity...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!activity) return <p>No activity found</p>;

  return (
    <div className="w-full p-4 grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}/activity/${activitySlug}`)
                    }
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <h1 className="font-bold text-2xl text-purple-600">EDIT ACTIVITY</h1>
                </div>
              </div>
            </div>

            {/* Title and Instruction */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="lg:text-balance border-purple-100 px-4 focus-visible:ring-0"
              />
              <label className="block text-xs sm:text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Activity Description"
                className="text-balance border-purple-100 px-4 focus-visible:ring-0"
              />
              <div className="space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  Instruction
                </label>
                <ToggleGroup
                  type="multiple"
                  className="justify-start"
                  value={textFormat}
                  onValueChange={setTextFormat}
                >
                  <ToggleGroupItem value="bold" aria-label="Toggle bold">
                    <span className="font-bold">B</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="italic" aria-label="Toggle italic">
                    <span className="italic">I</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="underline" aria-label="Toggle underline">
                    <span className="underline">U</span>
                  </ToggleGroupItem>
                </ToggleGroup>
                <Textarea
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Instruction"
                  className="min-h-[300px] border border-purple-100 px-4 focus-visible:ring-0 placeholder:text-gray-400 resize-none"
                  style={{
                    fontWeight: textFormat.includes("bold") ? "bold" : "normal",
                    fontStyle: textFormat.includes("italic") ? "italic" : "normal",
                    textDecoration: textFormat.includes("underline") ? "underline" : "none",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Content - Upload Files and Due Date */}
      <div className="col-span-12 lg:col-span-3">
        <div className="hidden lg:flex items-center justify-end lg:justify-between lg:ml-40">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            onClick={handleSubmit}
            disabled={isUploading || !isFormValid}
          >
            {isUploading ? "Uploading..." : "Save Changes"}
          </Button>
        </div>

        {/* Due Date */}
        <Card className="w-full lg:w-[300px] p-4 mt-6">
          <p className="font-medium mb-4 flex">
            Due:
            {(date || time) && (
              <div className="text-sm text-muted-foreground mt-1 ml-2">
                {date && format(date, "PPP")}
                {time && ` at ${format(parse(time, "HH:mm", new Date()), "hh:mm a")}`}
              </div>
            )}
          </p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && !time && "text-muted-foreground"
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
                disabled={(date) => isBefore(date, startOfToday())}
              />
            </PopoverContent>
          </Popover>
          <div className="mt-4">
            <TimeField
              value={time}
              onChange={setTime}
              minTime={currentTime}
              isToday={date && isToday(date)}
              disabled={isTimeInputDisabled()}
            />
          </div>
        </Card>

        {/* Upload Files */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
          <label
            className={`border-2 border-dashed rounded-lg w-full h-40 flex flex-col items-center justify-center cursor-pointer transition
              ${files.length === 0 ? "border-gray-300 hover:border-purple-600" : "border-purple-600"}`}
          >
            <Upload
              className={`h-10 w-10 ${files.length === 0 ? "text-gray-500" : "text-purple-600"}`}
            />
            <span
              className={`text-sm ${files.length === 0 ? "text-gray-500" : "text-purple-600"}`}
            >
              + Add New File
            </span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
          </label>

          {/* Display uploaded files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600 truncate">
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {files.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              {files.length} file(s) selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditActivity;