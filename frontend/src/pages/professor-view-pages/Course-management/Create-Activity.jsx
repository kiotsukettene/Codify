import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Upload,
  FileIcon,
  X,
  CalendarIcon,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import AppSidebar from "@/components/professor-view/Sidebar";
import confetti from "canvas-confetti";
import { toast } from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { TimeField } from "../../../components/professor-view/Time-Field";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useActivityStore } from "@/store/activityStore";
import { useParams } from "react-router-dom";

const CreateActivity = () => {
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [instruction, setInstruction] = React.useState("");
  const [textFormat, setTextFormat] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activityProgress, setActivityProgress] = useState(0);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [sections, setSections] = useState([]);
  const { createActivity } = useActivityStore();
  const { lessonId, courseId } = useParams();

  console.log(useParams());

  const dueDateTime =
    date && time
      ? `${format(date, "yyyy-MM-dd")}T${format(
          new Date(`1970-01-01 ${time}`),
          "HH:mm"
        )}:00Z`
      : new Date().toISOString();

  // const handleSubmit = async () => {
  //   if (!lessonId || lessonId.length !== 24) {
  //     console.error("Invalid lessonId:", lessonId);
  //     return;
  //   }
  //   console.log("Lesson ID before submission:", lessonId);

  //   const newActivity = {
  //     lessonId,
  //     title,
  //     subTitle: subtitle,
  //     instructions: instruction,
  //     dueDate: dueDateTime,
  //     points: 100,
  //   };

  //   try {
  //     console.log("Sending activity data:", newActivity); // ✅ Debugging
  //     const createdActivity = await createActivity(newActivity);
  //     console.log("Created Activity Response:", createdActivity); // ✅ Debugging

  //     if (createdActivity && createdActivity._id) {
  //       navigate(
  //         `/professor/course/${courseId}/lesson/${lessonId}/activity/${createdActivity._id}`
  //       );
  //     } else {
  //       console.error(
  //         "Activity creation failed or _id is missing",
  //         createdActivity
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error creating activity:", error);
  //   }
  // };

  const handleSubmit = async () => {
    console.log("Lesson ID before submission:", lessonId);
    console.log("Due Date before submission:", dueDateTime);

    if (!lessonId || lessonId.length !== 24) {
      console.error("Invalid lessonId:", lessonId);
      toast.error("Invalid lessonId");
      return;
    }

    const newActivity = {
      lessonId,
      title,
      subTitle: subtitle,
      instructions: instruction,
      dueDate: dueDateTime,
      points: 100,
    };

    try {
      console.log("Sending activity data:", newActivity); // ✅ Debugging

      const createdActivity = await createActivity(newActivity);
      console.log("Created Activity Response:", createdActivity); // ✅ Debugging

      if (createdActivity && createdActivity._id) {
        toast.success("Activity created successfully! 🎉");

        navigate(
          `/professor/course/${courseId}/lesson/${lessonId}/activity/${createdActivity._id}`
        );
      } else {
        console.error(
          "Activity creation failed or _id is missing",
          createdActivity
        );
        toast.error("Failed to create activity. Check server logs.");
      }
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error("Error creating activity. Check console logs.");
    }
  };

  React.useEffect(() => {
    let progress = 0;
    if (title) progress += 33.33;
    if (subtitle) progress += 33.33;
    if (instruction) progress += 33.34;

    setActivityProgress(Math.round(progress));

    if (Math.round(progress) === 100 && !hasShownConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasShownConfetti(true);
    }
  }, [title, subtitle, instruction, hasShownConfetti]);

  useEffect(() => {
    const hasContent =
      title.trim() !== "" ||
      subtitle.trim() !== "" ||
      instruction.trim() !== "" ||
      files.length > 0;
    setIsFormValid(hasContent);
  }, [title, subtitle, instruction, files]);

  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      content: "",
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (id, updatedFields) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, ...updatedFields } : section
      )
    );
  };

  const deleteSection = (id) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Validate file size (10MB limit per file)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

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

  const handleUploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const data = await response.json();
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload files");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1">
        <SidebarInset className="flex-1 !p-0">
          <header className="flex h-16 items-center px-4">
            <SidebarTrigger
              className="-ml-1"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Separator orientation="vertical" className="mx-2 h-4" />
          </header>

          <div className="container mx-auto w-full p-6 grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-9">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                          >
                            <ArrowLeft className="h-5 w-5" />
                          </Button>
                        </div>
                        <h1 className="font-bold text-2xl text-purple-600">
                          {" "}
                          CREATE ACTIVITY{" "}
                        </h1>
                        <div className="block lg:hidden">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                                onClick={() => {
                                  console.log("Button clicked"); // ✅ This should log when clicked
                                  handleSubmit();
                                }}
                                disabled={isUploading || !isFormValid}
                              >
                                {isUploading ? "Uploading..." : "Assign"}
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem>
                                <span>Assign</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${activityProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* TITLE AND INSTRUCTION */}
                  <div className="space-y-4">
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Title"
                      className="lg:text-balance font-semibold border-purple-100 px-4 focus-visible:ring-0 "
                    />
                    <Input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Activity Description"
                      className="text-balance border-purple-100 px-4 focus-visible:ring-0"
                    />

                    <div className="space-y-2">
                      <ToggleGroup
                        type="multiple"
                        className="justify-start"
                        value={textFormat}
                        onValueChange={setTextFormat}
                      >
                        <ToggleGroupItem value="bold" aria-label="Toggle bold">
                          <span className="font-bold">B</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="italic"
                          aria-label="Toggle italic"
                        >
                          <span className="italic">I</span>
                        </ToggleGroupItem>
                        <ToggleGroupItem
                          value="underline"
                          aria-label="Toggle underline"
                        >
                          <span className="underline">U</span>
                        </ToggleGroupItem>
                      </ToggleGroup>

                      <Textarea
                        value={instruction}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="Instruction"
                        className="min-h-[300px] border border-purple-100 px-4 focus-visible:ring-0 placeholder:text-gray-400 resize-none"
                        style={{
                          fontWeight: textFormat.includes("bold")
                            ? "bold"
                            : "normal",
                          fontStyle: textFormat.includes("italic")
                            ? "italic"
                            : "normal",
                          textDecoration: textFormat.includes("underline")
                            ? "underline"
                            : "none",
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {sections.map((section) =>
                section.type === "code" ? (
                  <div key={section.id} className="relative mt-6">
                    <Textarea
                      placeholder="Type code..."
                      value={section.content}
                      onChange={(e) => {
                        updateSection(section.id, { content: e.target.value });
                      }}
                      className="min-h-[100px] border-purple-100 px-4 focus-visible:ring-0 bg-purple-50 font-mono text-sm pl-8 resize-none"
                    />
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-500" />
                    <Button
                      onClick={() => deleteSection(section.id)}
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 rounded-s hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null
              )}
            </div>

            {/* Right Content - Upload Files and Due date */}
            <div className="col-span-12 lg:col-span-3">
              <div className="hidden lg:flex items-center justify-end lg:justify-between lg:ml-48">
                <Button
                  className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                  onClick={() => {
                    handleSubmit();
                  }}
                  disabled={isUploading || !isFormValid}
                >
                  {isUploading ? "Uploading..." : "Assign"}
                </Button>
              </div>

              {/* Due Date */}

              <Card className="w-full lg:w-[300px] p-4 mt-6">
                <p className="font-medium mb-4 flex">
                  Due :
                  {(date || time) && (
                    <div className=" text-sm text-muted-foreground mt-1 ml-2">
                      {date && format(date, "PPP")}
                      {time && ` at ${time}`}
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
                    />
                  </PopoverContent>
                </Popover>

                <div className="mt-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !time && "text-muted-foreground"
                        )}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {time || "Set time (optional)"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-3">
                      <TimeField value={time} onChange={setTime} />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Upload Files */}
              </Card>
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
                <label
                  className={`border-2 border-dashed rounded-lg w-full h-40 flex flex-col items-center justify-center cursor-pointer transition
              ${
                files.length === 0
                  ? "border-gray-300 hover:border-purple-600"
                  : "border-purple-600"
              }`}
                >
                  <Upload
                    className={`h-10 w-10 ${
                      files.length === 0 ? "text-gray-500" : "text-purple-600"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      files.length === 0 ? "text-gray-500" : "text-purple-600"
                    }`}
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
              <Button
                onClick={() => addSection("code")}
                className="mt-8 font-normal"
              >
                <Plus className="mr-2 h-4 w-4" />
                Code snippets
              </Button>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreateActivity;
