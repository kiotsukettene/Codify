import { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import StudentLessonContent from "@/components/student-view/student-lesson-content";
import totalXpImg from "@/assets/picture/courses/totalXp.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CongratulationsModal from "@/components/student-view/congrats-modal";
import { useLessonStore } from "@/store/lessonStore";
import XPChallengeCard from "@/components/student-view/XPChallengeCard";
import { useCourseStore } from "@/store/courseStore";
function StudentModulePage() {
  const navigate = useNavigate();
  const { lessonId } = useParams();
  const { fetchLessonById, lesson, isLoading, error } = useLessonStore();
  const [showModal, setShowModal] = useState(false);
  const topicRefs = useRef({});
  const [activeTopicId, setActiveTopicId] = useState(1);
  // Debug the fetched lesson data
  console.log("Fetched Lesson:", lesson);
  console.log("Lesson ID:", lessonId);
  // Dynamically generate topics from fetched lesson sections
  const topics = lesson?.sections.map((section, index) => ({
    id: index + 1,
    title: section.subTitle || `Section ${index + 1}`, // Fallback title
    content: section.description || "No content available", // Fallback content
    icon: CheckCircle,
  })) || [];
  useEffect(() => {
    if (lessonId) fetchLessonById(lessonId);
  }, [lessonId, fetchLessonById]);
  const scrollToTopic = useCallback((topicId) => {
    topicRefs.current[topicId]?.scrollIntoView({ behavior: "smooth" });
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let highestIntersection = -1;
        let targetId = activeTopicId;
        entries.forEach((entry) => {
          console.log("Intersecting entry:", {
            id: entry.target.getAttribute("data-topic-id"),
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio,
            boundingClientRect: entry.boundingClientRect,
            rootBounds: entry.rootBounds,
          });
          if (entry.isIntersecting && entry.intersectionRatio > highestIntersection) {
            highestIntersection = entry.intersectionRatio;
            targetId = Number.parseInt(entry.target.getAttribute("data-topic-id"));
          }
        });
        if (highestIntersection > 0) {
          setActiveTopicId(targetId);
        }
        // Fallback: Check if we're at the bottom and set the last topic
        const lastTopicId = topics.length;
        const lastRef = topicRefs.current[lastTopicId];
        if (lastRef && window.innerHeight + window.scrollY >= lastRef.getBoundingClientRect().bottom) {
          setActiveTopicId(lastTopicId);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    console.log("Observing topics:", topicRefs.current);
    topics.forEach((topic) => {
      if (topicRefs.current[topic.id]) observer.observe(topicRefs.current[topic.id]);
    });
    return () => observer.disconnect();
  }, [lesson, topics]);
  const handleComplete = () => setShowModal(true);
  const handleNavigate = () => {
    setShowModal(false);
    navigate(`/student/lesson-list/${lesson.courseId}`)
  };
  if (isLoading) return <p>Loading lesson...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="flex lg:flex-row mt-5 flex-col">
      <div className="w-full lg:w-3/4">
        <Card className="shadow-none border-none bg-white p-6">
          <CardTitle className="bg-pink-50 p-5 rounded-lg">
            Module 1: {lesson?.title || "Introduction to Networking"}
          </CardTitle>
          <div className="mt-5 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {topics.map((topic) => (
              <div
                key={topic.id}
                ref={(el) => (topicRefs.current[topic.id] = el)}
                data-topic-id={topic.id}
                className="mb-8"
              >
                <StudentLessonContent title={topic.title} content={topic.content} />
                {topic.id !== topics.length && (
                  <hr className="my-8 border-t-2 border-gray-100" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 flex lg:justify-end items-center mx-auto justify-center">
            <Button onClick={handleComplete} className="bg-primary text-white hover:bg-purple-700 px-6 py-2 rounded-md">
              🚀 Complete Module
            </Button>
            <CongratulationsModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onNavigate={handleNavigate}
            />
          </div>
        </Card>
      </div>
      <div className="w-full lg:w-1/4 px-5">
        {/*=========================== XP========================== Card */}
        <Card
          className="relative flex items-center justify-between mx-auto mb-5 p-4 mt-2 md:p-6 border-none shadow-none h-16 md:h-20 rounded-3xl ] md:max-w-[250px] lg:max-w-full lg:h-24"
          style={{
            background: "linear-gradient(90deg, rgb(243, 232, 255) 0%, rgb(224, 242, 254) 100%)",
          }}
        >
          <div className="z-10">
            <CardTitle className="text-xs md:text-sm lg:text-lg text-[#8268AE] font-medium ">Total XP Earned</CardTitle>
            <h2 className="text-lg md:text-2xl lg:text-3xl text-[#7548C1] font-bold">40 XP</h2>
          </div>
          <div className="hidden md:block absolute right-0 bottom-0 w-20 md:w-24 lg:w-28">
            <img
              src={totalXpImg}
              className="w-full h-auto object-cover"
              alt="Astronaut XP Icon"
            />
          </div>
        </Card>
        <Accordion
          type="single"
          collapsible
          defaultValue="topics"
          className="w-full bg-white rounded-lg shadow-none border-none p-4 sticky top-4"
        >
          <AccordionItem value="topics">
            <AccordionTrigger className="flex justify-between items-center p-4 hover:bg-gray-50">
              <div className="flex flex-col items-start">
                <h2 className="text-xl font-semibold text-gray-900">Topics Covered</h2>
                <span className="text-sm font-normal text-left mt-1 text-gray-400">
                  🔥 Complete lessons to unlock new knowledge.
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => scrollToTopic(topic.id)}
                    className={`relative flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-all duration-300 rounded-lg 
                    ${
                      activeTopicId === topic.id
                        ? "bg-purple-50 border-l-4 border-purple-500"
                        : "bg-white border-l-4 border-gray-200"
                    }`}
                  >
                    <div className="pl-4">
                      <h3 className="font-medium text-gray-900">{topic.id}: {topic.title}</h3>
                    </div>
                    <BadgeCheck className="h-5 w-5 text-gray-500" />
                  </motion.div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-5">
          <XPChallengeCard />
        </div>
      </div>
    </div>
  );
}
export default StudentModulePage;