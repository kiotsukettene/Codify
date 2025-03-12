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
  Sparkles,
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import AppSidebar from "@/components/professor-view/Sidebar";
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

const CreateLesson = () => {
  const { createLesson } = useLessonStore(); // Get function from store
  const { courses, fetchCoursesByProfessor } = useCourseStore(); // Get courses from store
  const { courseSlug } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    hasCode: false,
    hasNote: false,
  });

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
    if (title) completedSteps++;
    if (subtitle) completedSteps++;
    if (sections.some((s) => s.type === "description" && s.content))
      completedSteps++;

    setProgress((completedSteps / 5) * 100);

    // Update achievements
    setAchievements({
      hasTitle: !!title,
      hasSubtitle: !!subtitle,
      hasDescription: sections.some(
        (s) => s.type === "description" && s.content
      ),
    });
  };

  //submit
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("submit");
  //   if (!courseId || !title) {
  //     toast.error("Course ID and Title are required!");
  //     return;
  //   }

  //   const lessonData = {
  //     courseId,
  //     title,
  //     sections: sections.map((section) => ({
  //       subTitle: section.subTitle || "Untitled Section", // ✅ Ensures a subTitle for all sections
  //       description: section.type === "description" ? section.content : "",
  //       codeSnippets: section.type === "code" ? [section.content] : [],
  //       notes: section.type === "note" ? [section.content] : [],
  //     })),
  //   };
  //   console.log("Saving lesson:", JSON.stringify(lessonData, null, 2));

  //   try {
  //     await createLesson(lessonData);
  //     toast.success("Lesson created successfully!");
  //     navigate(`/professor/course/${courseId}`); // Redirect to lessons page
  //   } catch (error) {
  //     console.error("Error creating lesson:", error);
  //     toast.error("Error creating lesson!");
  //   }
  // };
  useEffect(() => {
    if (courses.length === 0) {
      fetchCoursesByProfessor(); // or whatever fetch function you have
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

      // If no subheader is provided and we have not created a section yet,
      // do nothing (or handle however you prefer).
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
    console.log("Courses array in store:", courses);

    // Convert courseSlug to courseId
    const courseId = getCourseIdFromSlug(courseSlug);
    if (!courseId) {
      toast.error("No course found for that slug!");
      return;
    }
    if (!title) {
      toast.error("Title is required!");
      return;
    }

    // Group sections based on subheader
    const groupedSections = groupSections(sections);

    // Build your lesson payload (adjust the field names as per your Lesson schema)
    const lessonData = {
      courseId,
      title,
      subTitle: subtitle, // optional, if you have a subtitle for the lesson
      sections: groupedSections,
    };

    console.log("Saving lesson:", JSON.stringify(lessonData, null, 2));

    try {
      await createLesson(lessonData);
      toast.success("Lesson created successfully!");
      navigate(`/professor/course/${courseSlug}/lesson/${createLesson.slug}`); // Redirect to the lessons page for the course
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast.error("Error creating lesson!");
    }
  };

  const deleteSection = (id) => {
    setSections((prev) => prev.filter((section) => section.id !== id));
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

          <div className="container w-full p-4">
            <Card className="border-0 shadow-none">
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
                        className="ml-4"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="space-y-4 flex-1">
                    <Input
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                        updateProgress();
                      }}
                      placeholder="Title"
                      className="text-balance font-semibold border-purple-100 px-4 focus-visible:ring-0 bg-purple-100"
                    />
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

                {sections.map((section, index) => (
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

                          <Input
                            value={section.subheader || ""}
                            onChange={(e) =>
                              updateSection(section.id, {
                                subheader: e.target.value,
                              })
                            }
                            placeholder="Type sub-header"
                            className="text-balance border-purple-100 px-4 focus-visible:ring-0 font-semibold mb-2"
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
                ))}

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

                {progress === 100 && (
                  <div className="fixed top-4 right-4 animate-bounce">
                    <Sparkles className="h-8 w-8 text-yellow-500" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreateLesson;
