import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, ChevronRight, MessageSquare, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import lion from "../../../assets/picture/Avatar/lion.png";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/Components/ui/separator";
import AppSidebar from "@/components/professor-view/Sidebar";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useLessonStore } from "@/store/lessonStore";

// Extract `courseId` and `lessonId` from the URL

const comments = [
  {
    id: 1,
    author: "Jerez, Marianne Celest T.",
    message: "Thank you, ma'am!",
    avatar: lion,
  },
  {
    id: 2,
    author: "Loreto, Russell Kelvin Anthony B.",
    message: "Pwede po pa-extend ng deadline?",
    avatar: lion,
  },
  {
    id: 3,
    author: "Irheil Mae Antang",
    message: "This is very helpful!",
    avatar: lion,
  },
  {
    id: 4,
    author: "Catherine Bae",
    message: "I have a question about the else if statement.",
    avatar: lion,
  },
];

const topics = [
  {
    id: "1",
    title: "Conditionals in Java",
    content:
      "Used to make decisions in code based on whether a particular condition is true or false. The most common type of conditional statement is the if statement.",
    code: `int y = 3;
if (y > 5) {
    System.out.println("y is greater than 5");
} else if (y == 5) {
    System.out.println("y equals 5");
}`,
  },
  {
    id: "2",
    title: "Handling Multiple Conditions",
    content:
      "Java allows you to define alternate execution paths using else and else if statements. If the if condition evaluates to false, the else block will execute, or you can add an additional condition with else if.",
    code: `int y = 3;
if (y > 5) {
    System.out.println("y is greater than 5");
} else if (y == 5) {
    System.out.println("y equals 5");
} else {
    System.out.println("y is less than 5");
}`,
  },

  {
    id: "3",
    title: "Switch Statements",
    content:
      "Switch statements are used to execute different code blocks based on different conditions. It is often used as an alternative to long if-else chains.",
    code: `int y = 3;
if (y > 5) {
    System.out.println("y is greater than 5");
} else if (y == 5) {
    System.out.println("y equals 5");
} else {
    System.out.println("y is less than 5");
}`,
  },
];

const Topic = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTopic, setActiveTopic] = useState(topics[0].id);
  const { courseId, lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    fetchLessonById,
    lesson: fetchedLesson,
    isLoading,
    error,
  } = useLessonStore();
  const [lesson, setLesson] = useState(location.state?.lesson || null);
  console.log("🔍 Debug: useParams() ->", { courseId, lessonId });
  console.log("🔍 Debug: location.state ->", location.state);
  console.log("🔍 Debug: Lesson from store ->", fetchedLesson);
  console.log("🔍 Debug: isLoading ->", isLoading, " | error ->", error);

  useEffect(() => {
    if (location.state?.lesson) {
      console.log("✅ Using lesson from navigation state.");
      setLesson(location.state.lesson);
    } else {
      console.log("📡 Fetching lesson from API...");
      fetchLessonById(lessonId);
    }
  }, [lessonId, fetchLessonById, location.state]);

  useEffect(() => {
    if (fetchedLesson && fetchedLesson._id) {
      console.log("✅ Lesson fetched successfully from API:", fetchedLesson);
      setLesson(fetchedLesson);
    }
  }, [fetchedLesson]);

  if (isLoading || !lesson) {
    return (
      <p className="text-center text-gray-500">⏳ Loading lesson details...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">❌ Error: {error}</p>;
  }

  ////
  const handleScroll = () => {
    let currentSection = topics[0].id;

    topics.forEach((topic) => {
      const section = document.getElementById(topic.id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 3) {
          currentSection = topic.id;
        }
      }
    });
    setActiveTopic(currentSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveTopic(sectionId);
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

          <div className="container mx-auto p-6 grid grid-cols-12 gap-6">
            {/* Main Content */}
            <motion.div
              className="col-span-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-3xl font-bold mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {lesson.title}
              </motion.h1>

              {/* Loop Through Sections */}
              {lesson.sections?.map((section, index) => (
                <section key={index} id={`section-${index}`} className="mb-8">
                  <motion.h2
                    className="text-lg font-medium mb-2"
                    whileHover={{ x: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {section.subTitle}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-gray-700 dark:text-gray-300 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {section.description}
                  </motion.p>

                  {/* ✅ Code Snippets */}
                  {section.codeSnippets?.length > 0 &&
                    section.codeSnippets.map((snippet, idx) => (
                      <motion.div
                        key={idx}
                        className="relative bg-[#1e1e1e] rounded-lg mb-6 overflow-hidden"
                        whileHover={{
                          scale: 1.01,
                          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="absolute right-2 top-2 flex gap-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 ml-2"
                              onClick={() =>
                                navigator.clipboard.writeText(snippet)
                              }
                            >
                              <Copy className="h-4 w-4 text-white" />
                            </Button>
                          </motion.div>
                        </motion.div>
                        <pre className="p-4 pt-8 font-mono text-xs text-purple-200">
                          <code>{snippet}</code>
                        </pre>
                      </motion.div>
                    ))}

                  {/* ✅ Notes Section */}
                  {section.notes?.length > 0 && (
                    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <h3 className="font-semibold mb-2">Notes:</h3>
                      <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                        {section.notes.map((note, noteIdx) => (
                          <li key={noteIdx}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              ))}
            </motion.div>

            <motion.div
              className="col-span-4 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Activity Card with enhanced animations */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
                onClick={() =>
                  navigate(
                    `/professor/course/${courseId}/lesson/${lessonId}/create-activity`
                  )
                }
                className="cursor-pointer"
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <motion.div
                      className="flex items-center justify-between mb-6"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Activity className="h-5 w-5 text-purple-600" />
                        </motion.div>
                        <span className="font-semibold text-sm">Activity</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring" }}
                      >
                        <Card className="p-4 bg-purple-100/50 dark:bg-purple-900/20 border-0">
                          <div className="text-3xl font-bold mb-1">0</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            Turned in
                          </div>
                        </Card>
                      </motion.div>
                      <motion.div
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring" }}
                      >
                        <Card className="p-4 bg-purple-600 text-white border-0">
                          <div className="text-3xl font-bold mb-1">0</div>
                          <div className="text-xs opacity-90">Assigned</div>
                        </Card>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* On this page section */}
              <div className="sticky top-4 space-y-4">
                <motion.h2
                  className="text-base font-semibold"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  On this page
                </motion.h2>

                <nav className="space-y-2">
                  {topics.map((topic) => (
                    <motion.a
                      key={topic.id}
                      onClick={() => scrollToSection(topic.id)}
                      className="flex items-center group cursor-pointer"
                      whileHover={{ x: 5, color: "#9333EA" }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <motion.span
                        className={`inline-block w-1.5 h-1.5 ${
                          activeTopic === topic.id
                            ? "bg-purple-600"
                            : "border border-gray-400"
                        } transform rotate-45 mr-3`}
                        animate={{
                          y: activeTopic === topic.id ? [0, 4, 0] : 0,
                          rotate: activeTopic === topic.id ? [45, 225, 45] : 45,
                          scale: activeTopic === topic.id ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span
                        className={`text-xs transition-colors duration-200 ${
                          activeTopic === topic.id
                            ? "text-purple-600"
                            : "group-hover:text-purple-600"
                        }`}
                      >
                        {topic.title}
                      </span>
                    </motion.a>
                  ))}
                </nav>
              </div>

              {/* Enhanced Comments section */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-purple-600">
                        <MessageSquare className="h-5 w-5" />
                        <h3 className="font-semibold">Class comments</h3>
                      </div>
                      <Button
                        variant="ghost"
                        className="text-purple-600 hover:text-purple-700 p-0 h-auto text-sm"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        4 Comments →
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {comments.slice(0, 2).map((comment) => (
                        <div
                          key={comment.id}
                          className="flex items-start gap-3"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.avatar} />
                            <AvatarFallback>{comment.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">
                              {comment.author}
                            </div>
                            <p className="text-xs text-gray-600">
                              {comment.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Comments Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Class Comments</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-3 pb-4 border-b last:border-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.avatar} />
                        <AvatarFallback>{comment.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {comment.author}
                        </div>
                        <p className="text-xs text-gray-600">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Topic;
