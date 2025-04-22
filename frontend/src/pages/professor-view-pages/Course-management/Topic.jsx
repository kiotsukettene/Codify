import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, ChevronRight, MessageSquare, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import lion from "@/assets/picture/Avatar/Lion.png";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useLessonStore } from "@/store/lessonStore";
import { useActivityStore } from "@/store/activityStore";

const initialComments = [
  { id: 1, author: "Jerez, Marianne Celest T.", message: "Thank you, ma'am!", avatar: lion },
  { id: 2, author: "Loreto, Russell Kelvin Anthony B.", message: "Pwede po pa-extend ng deadline?", avatar: lion },
  { id: 3, author: "Irheil Mae Antang", message: "This is very helpful!", avatar: lion },
  { id: 4, author: "Catherine Bae", message: "I have a question about the else if statement.", avatar: lion },
];

const Topic = () => {
  const [comments, setComments] = useState(initialComments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);
  const [sections, setSections] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { courseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { lesson, fetchLessonBySlug, isLoading, error } = useLessonStore();
  const { fetchActivitiesByLesson, activities } = useActivityStore(); // Fixed here

  useEffect(() => {
    if (lessonSlug) {
      fetchLessonBySlug(lessonSlug);
    }
  }, [lessonSlug, fetchLessonBySlug]);

  useEffect(() => {
    if (lesson?._id) {
      fetchActivitiesByLesson(lesson._id);
    }
  }, [lesson, fetchActivitiesByLesson]);

  useEffect(() => {
    if (lesson?.sections) {
      setSections(lesson.sections.map((section) => ({ ...section, id: section._id })));
    }
  }, [lesson]);

  useEffect(() => {
    if (lesson?.sections?.length > 0 && !activeSection) {
      setActiveSection(lesson.sections[0].id);
    }
  }, [lesson, activeSection]);

  const handleScroll = () => {
    let currentSection = sections[0]?.id;
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 3) {
          currentSection = section.id;
        }
      }
    });
    setActiveTopic(currentSection);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveTopic(sectionId);
    }
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">⏳ Loading lesson details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">❌ Error: {error}</p>;
  }

  if (!lesson) {
    return <p className="text-center text-gray-500">No lesson found</p>;
  }

  const handleNavigateToActivity = async () => {
    const lessonId = lesson._id;
    await fetchActivitiesByLesson(lessonId);
    if (activities.length > 0) {
      navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}/activity/${activities[0].slug}`);
    } else {
      navigate(`/professor/course/${courseSlug}/lesson/${lessonSlug}/create-activity`);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
  
    const newCommentObj = {
      id: comments.length + 1,
      author: "Professor Name", // You should get this from your auth context
      message: newComment,
      avatar: lion, // You might want to use professor's avatar
      isProfessor: true,
    };
  
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  return (
      <div className="container mx-auto grid grid-cols-12 gap-6 ">
        <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
        className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex items-center gap-x-4 ">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/professor/course/${courseSlug}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{lesson.title}</h1>
          </div>
          <p className="text-base text-gray-700 dark:text-gray-300">{lesson.subTitle}</p>
          {sections.map((section, index) => (
            <section key={index} id={section.id || section._id} className="mb-8">
              <h2 className="text-lg font-medium mb-2">{section.subTitle}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{section.description}</p>
              {section.codeSnippets?.length > 0 && (
                <div className="relative bg-[#1e1e1e] rounded-lg mb-6 overflow-hidden">
                  <pre className="p-4 pt-8 font-mono text-xs text-purple-200">
                    <code>{section.codeSnippets.join("\n")}</code>
                  </pre>
                </div>
              )}
              {section.notes?.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Notes:</h3>
                  <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-300">
                    {section.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </motion.div>
  
        <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="transition-shadow duration-300">
            <CardContent className="p-6">
              <motion.div
                className="flex items-center justify-between mb-6"
                whileHover={{ y: -2 }}
                onClick={handleNavigateToActivity}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Activity className="h-5 w-5 text-purple-600" />
                  </motion.div>
                  <span className="font-semibold text-sm">Create Activity</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Card className="p-4 bg-purple-100/50 dark:bg-purple-900/20 border-0">
                    <div className="text-3xl font-bold mb-1">0</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Turned in</div>
                  </Card>
                </div>
                <div>
                  <Card className="p-4 bg-purple-600 text-white border-0">
                    <div className="text-3xl font-bold mb-1">0</div>
                    <div className="text-xs opacity-90">Assigned</div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
  
          <div className="hidden lg:block sticky top-4 space-y-4">
            <h2 className="text-base font-semibold">On this page</h2>
            <nav className="space-y-2">
              {sections.map((section) => {
                const isActive = activeTopic === section.id;
                return (
                  <motion.a
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="flex items-center group cursor-pointer"
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.span
                      className={`inline-block w-1.5 h-1.5 transform rotate-45 mr-3 ${isActive ? "bg-purple-600" : "border border-gray-400"}`}
                      animate={{
                        y: isActive ? [0, 4, 0] : 0,
                        rotate: isActive ? [45, 225, 45] : 45,
                        scale: isActive ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <span
                      className={`text-xs transition-colors duration-200 ${isActive ? "text-purple-600" : "group-hover:text-purple-600"}`}
                    >
                      {section.subTitle}
                    </span>
                  </motion.a>
                );
              })}
            </nav>
          </div>
  
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
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
                    {comments.length} Comments →
                </Button>
              </div>
              <div className="space-y-4">
                {comments.slice(-2).map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar} />
                      <AvatarFallback>{comment.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{comment.author}</div>
                      <p className="text-xs text-gray-600">{comment.message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t pt-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  placeholder="Type your reply..."
                />
                <Button type="submit" size="sm">
                  Send
                </Button>
              </form>
            </div>
            </CardContent>
          </Card>
        </motion.div>
  
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Class Comments</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
  {comments.map((comment) => (
    <div key={comment.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
      <Avatar className="h-8 w-8">
        <AvatarImage src={comment.avatar} />
        <AvatarFallback>{comment.initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-gray-900">{comment.author}</div>
          {comment.isProfessor && (
            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded">
              Professor
            </span>
          )}
        </div>
        <p className="text-xs text-gray-600">{comment.message}</p>
      </div>
    </div>
  ))}
</div>



            <div className="mt-4 border-t pt-4">
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md text-sm"
                  placeholder="Type your reply..."
                />
                <Button type="submit" size="sm">
                  Send
                </Button>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  };
  

export default Topic;