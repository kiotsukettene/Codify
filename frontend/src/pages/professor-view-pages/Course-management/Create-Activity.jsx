import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Users,
  Copy,
  Upload,
  FileIcon,
  X,
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
import { useNavigate } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import AppSidebar from "@/components/professor-view/Sidebar";
import confetti from "canvas-confetti";
import { useActivityStore } from "@/store/activityStore"; // Import Zustand store
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

const CreateActivity = () => {
  const [title, setTitle] = React.useState("");
  const [subtitle, setSubtitle] = React.useState("");
  const [instructions, setInstruction] = React.useState("");
  const [textFormat, setTextFormat] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activityProgress, setActivityProgress] = useState(0);
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { createActivity } = useActivityStore();
  const { lessonId } = useParams();
  console.log("lessonId from useParams():", lessonId);

  const handleSubmit = async () => {
    if (!lessonId || lessonId.length !== 24) {
      console.error("Invalid or missing lessonId:", lessonId);
      toast.error("Error: Invalid Lesson ID");
      return;
    }

    const newActivity = {
      lessonId,
      title,
      subtitle,
      instructions,
      dueDate: null,
      points: 100,
    };

    console.log("Submitting Activity:", newActivity); // Debugging line

    await createActivity(newActivity);
    navigate("/professor/course/lesson-overview");
  };

  const handleFormat = (value) => {
    setTextFormat((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  React.useEffect(() => {
    let progress = 0;
    if (title) progress += 33.33;
    if (subtitle) progress += 33.33;
    if (instructions) progress += 33.34;

    setActivityProgress(Math.round(progress));

    if (Math.round(progress) === 100 && !hasShownConfetti) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasShownConfetti(true);
    }
  }, [title, subtitle, instructions, hasShownConfetti]);

  useEffect(() => {
    const hasContent =
      title.trim() !== "" ||
      subtitle.trim() !== "" ||
      instructions.trim() !== "" ||
      files.length > 0;
    setIsFormValid(hasContent);
  }, [title, subtitle, instructions, files]);

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
      // Replace with your actual API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      toast.success("Files uploaded successfully");
      // You can handle the response data here (e.g., save file URLs)
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
            <div className="col-span-9">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        navigate("/professor/course/lesson-overview")
                      }
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        Activity Creation Progress
                      </span>
                      <span className="text-sm font-medium">
                        {activityProgress}%
                      </span>
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
                      className="text-2xl font-semibold border-none bg-purple-100 placeholder:text-gray-400 h-16 px-6"
                    />

                    <Input
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Type sub-title"
                      className="border-none bg-purple-50 placeholder:text-gray-400 px-6"
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
                        value={instructions}
                        onChange={(e) => setInstruction(e.target.value)}
                        placeholder="Instruction"
                        className="min-h-[300px] border border-gray-300 placeholder:text-gray-400 resize-none"
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
            </div>

            {/* Right Content - Upload Files */}
            <div className="col-span-3">
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                      onClick={handleUploadFiles}
                      disabled={isUploading || !isFormValid}
                    >
                      {isUploading ? "Uploading..." : "Assign"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={handleSubmit}>
                      <span>Assign</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <span>Schedule</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Save draft</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

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
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreateActivity;
