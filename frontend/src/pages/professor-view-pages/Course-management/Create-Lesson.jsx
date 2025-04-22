import React, { useState, useEffect } from "react";
import {
  Bold,
  Code2,
  FileText,
  MessageSquare,
  Plus,
  Trophy,
  Star,
  Target,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

//by me
import { useLessonStore } from "@/store/lessonStore"; // Import lesson store
import { useParams, useNavigate } from "react-router-dom"; // For getting courseId & navigation
import toast from "react-hot-toast"; // For notifications
import { useCourseStore } from "@/store/courseStore"; // Import course store
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator"


const CreateLesson = () => {
  const { createLesson } = useLessonStore(); // Get function from store
  const { courses, fetchCoursesByProfessor } = useCourseStore(); // Get courses from store
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sections, setSections] = useState([
    { id: "1", type: "description", content: "", formatting: [] },
  ]);
  const [progress, setProgress] = useState(0);
  const [achievements, setAchievements] = useState({
    hasTitle: false,
    hasSubtitle: false,
    hasDescription: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Added submitted state
  
  

  const addSection = (type) => {
    setSections((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9), // Generates a random ID
        type,
        content: "",
        formatting: [],
        subheader: type === "description" ? "" : undefined,
      },
    ]);
  };

  const updateSection = (id, updates) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const toggleFormatting = (sectionId, format) => {
    setSections((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            formatting: section.formatting.includes(format)
              ? section.formatting.filter((f) => f !== format)
              : [...section.formatting, format],
          };
        }
        return section;
      })
    );
  };

  // Update progress whenever content changes
  const updateProgress = () => {
    let completedSteps = 0;
    const hasTitle = !!title.trim();
    const hasSubtitle = !!subtitle.trim();
    const hasDescription = sections.some(
      (s) => s.type === "description" && s.content.trim()
    );
  
    if (hasTitle) completedSteps++;
    if (hasSubtitle) completedSteps++;
    if (hasDescription) completedSteps++;
  
    const progressValue = (completedSteps / 3) * 100;
    setProgress(progressValue);
  
    setAchievements({
      hasTitle,
      hasSubtitle,
      hasDescription,
    });
  
    // Set form validity
    setIsFormValid(hasTitle && hasSubtitle && hasDescription);
  };
  

  useEffect(() => {
    if (courses.length === 0) {
      fetchCoursesByProfessor(); 
    }
  }, [courses, fetchCoursesByProfessor]);
  const getCourseIdFromSlug = (slug) => {
    if (!courses || courses.length === 0) return null;
    console.log("Courses array in store:", courses);

    const matchedCourse = courses.find((c) => c.slug === slug);
    return matchedCourse ? matchedCourse._id : null;
  };

  function groupSections(sections = []) {
    const groupedSections = [];
    let currentSection = null;

    sections.forEach((item) => {
      // If there's a new subheader, start a new section.
      if (item.subheader) {
        currentSection = {
          subTitle: item.subheader,
          description: "",
          codeSnippets: [],
          notes: [],
        };
        groupedSections.push(currentSection);
      }
      if (!currentSection) {
        return;
      }

      // Add content to the current (last) section.
      switch (item.type) {
        case "description":
          currentSection.description = item.content;
          break;
        case "code":
          currentSection.codeSnippets.push(item.content);
          break;
        case "note":
          currentSection.notes.push(item.content);
          break;
        default:
          break;
      }
    });

    return groupedSections;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitted) return; // Prevent double submission
    setSubmitted(true); // Set submitted flag
    setIsUploading(true); // Indicate upload start

    const courseId = getCourseIdFromSlug(courseSlug);
    if (!courseId) {
      toast.error("No course found for that slug!");
      setIsUploading(false); // Reset upload state
      setSubmitted(false); // Reset submitted flag
      return;
    }
    if (!title) {
      toast.error("Title is required!");
      setIsUploading(false); // Reset upload state
      setSubmitted(false); // Reset submitted flag
      return;
    }

    // Group sections based on subheader
    const groupedSections = groupSections(sections);

    const lessonData = {
      courseId,
      title,
      subTitle: subtitle,
      sections: groupedSections,
    };

    console.log("Saving lesson:", JSON.stringify(lessonData, null, 2));

    try {
      await createLesson(lessonData);
      // toast.success("Lesson created successfully!"); // REMOVED - Assuming store handles this
      navigate(`/professor/course/${courseSlug}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Error creating lesson: " + (error.message || "Please try again.")); // Show more specific error
      setIsUploading(false); // Reset upload state on error
      setSubmitted(false); // Reset submitted flag on error
    }
    // Removed setIsUploading(false) from here as navigation occurs on success
  };

  const deleteSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
  };

  return (
          <div className="w-full">
            <div className="flex items-center">
              <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
            <h1 className="font-bold text-2xl text-purple-600">
              Create Topic
            </h1>
                    </div>


              <CardContent className="space-y-6">
                <div className="space-y-4 mb-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Trophy
                        className={`h-5 w-5 ${
                          progress === 100 ? "text-yellow-500" : "text-gray-400"
                        }`}
                      />
                      <Progress
                        value={progress}
                        className="w-full sm:w-[200px]"
                      />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      {Object.entries(achievements).map(([key, achieved]) => (
                        <Tooltip key={key}>
                          <TooltipTrigger>
                            <Badge
                              variant={achieved ? "default" : "outline"}
                              className="cursor-help"
                            >
                              {key === "hasTitle" && (
                                <Star
                                  className={`h-4 w-4 ${
                                    achieved ? "text-white" : ""
                                  }`}
                                />
                              )}
                              {key === "hasSubtitle" && (
                                <Target
                                  className={`h-4 w-4 ${
                                    achieved ? "text-white" : ""
                                  }`}
                                />
                              )}
                              {key === "hasDescription" && (
                                <FileText
                                  className={`h-4 w-4 ${
                                    achieved ? "text-white" : ""
                                  }`}
                                />
                              )}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            {key.replace("has", "")}{" "}
                            {achieved ? "Completed! 🎉" : "Incomplete"}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      <Button
                        variant="secondary"
                        className="ml-4a bg-purple-600 text-white hover:bg-purple-700"
                        onClick={handleSubmit}
                        disabled={isUploading || !isFormValid || submitted} // Disable while uploading or if already submitted
                      >
                        {isUploading ? "Saving..." : "Save"} {/* Show loading text */}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                
                  <div className="space-y-4 w-full">
                  <label className="block text-sm sm:text-base font-medium text-gray-700">
                       Title
                  </label>
                    <Input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        updateProgress();
                      }}
                      placeholder="Type title"
                      className="border-purple-100 px-4 focus-visible:ring-0 bg-purple-100 placeholder:text-sm"
                    />
                     <label className="block text-sm sm:text-base font-medium text-gray-700">
                      Description
                  </label>
                    <Textarea
                      value={subtitle}
                      onChange={(e) => {
                        setSubtitle(e.target.value);
                        updateProgress();
                      }}
                      placeholder="Type Title Description"
                      className="min-h-36 border-purple-100 resize-none focus-visible:ring-0"
                    />
                    
                  </div>


                </div>

                <Separator className="bg-gray-300" />

                <AnimatePresence>
                {sections.map((section, index) => (
                      <motion.div
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="space-y-2 relative"
                    >

                  <div key={section.id} className="space-y-2 relative">
                    
                    <div className="relative">
                      {section.type === "description" && (
                        <>
                          <ToggleGroup
                            type="multiple"
                            className="justify-start"
                            value={section.formatting}
                            onValueChange={(value) => {
                              console.log("New formatting:", value); // Debugging
                              updateSection(section.id, { formatting: value });
                            }}
                          >
                            <ToggleGroupItem
                              value="bold"
                              aria-label="Toggle bold"
                            >
                              <Bold className="h-4 w-4" />
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

                          <label className="block text-sm sm:text-base font-medium text-gray-700 p-2">
                      Sub-topic
                  </label>
                          <Input
                            value={section.subheader || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                subheader: e.target.value,
                              })
                            }
                            placeholder="Type sub-header"
                            className="text-balance border-purple-100 px-4 focus-visible:ring-0 mb-2"
                          />
                          <Textarea
                            placeholder="Description"
                            value={section.content}
                            onChange={(e) => {
                              updateSection(section.id, {
                                content: e.target.value,
                              });
                              updateProgress();
                            }}
                            className="min-h-[200px] border-purple-100 resize-none focus-visible:ring-0"
                            style={{
                              fontWeight: section.formatting?.includes("bold")
                                ? "bold"
                                : "normal",
                              fontStyle: section.formatting?.includes("italic")
                                ? "italic"
                                : "normal",
                              textDecoration: section.formatting?.includes(
                                "underline"
                              )
                                ? "underline"
                                : "none",
                            }}
                          />
                          <Button
                            onClick={() => deleteSection(section.id)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 rounded-s hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {section.type === "code" && (
                        <div className="relative">
                          <Textarea
                            placeholder="Type code..."
                            value={section.content}
                            onChange={(e) => {
                              updateSection(section.id, {
                                content: e.target.value,
                              });
                            }}
                            className="min-h-[100px]  border-purple-100 px-4 focus-visible:ring-0 bg-purple-50 font-mono text-sm pl-8 resize-none"
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
                      )}

                      {section.type === "note" && (
                        <div className="relative">
                          <Textarea
                            placeholder="Type a note here"
                            value={section.content}
                            onChange={(e) => {
                              updateSection(section.id, {
                                content: e.target.value,
                              });
                            }}
                            className="min-h-[100px] border-purple-100 focus-visible:ring-0"
                          />
                          <Button
                            onClick={() => deleteSection(section.id)}
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 rounded-s hover:bg-gray-100"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  </motion.div>

                ))}
                </AnimatePresence>

                {/* Separate add button section that's always visible */}
                <div className="mt-4 flex justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-sm bg-purple-600 text-white hover:bg-purple-700 w-40 sm:px-16"
                      >
                        <Plus className="h-4 w-4" /> Add Details
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => addSection("code")}>
                        <Code2 className="mr-2 h-4 w-4" />
                        Code snippets
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => addSection("description")}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Lesson
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addSection("note")}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

               
              </CardContent>
          </div>
  );
};

export default CreateLesson;
