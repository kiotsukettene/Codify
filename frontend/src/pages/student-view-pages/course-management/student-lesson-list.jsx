import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Flower, Video, Blend, Star, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import useStudentCourseStore from "@/store/studentCourseStore";
import { useStudentStore } from "@/store/studentStore";

function StudentLessonListPage() {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { lessons, fetchLessonsForCourse, isLoading, error } = useStudentCourseStore();
  const { student } = useStudentStore(); // For professor info if needed
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (courseId) fetchLessonsForCourse(courseId);
  }, [courseId, fetchLessonsForCourse]);

  const handleAdventureClick = () => {
    setShowGuide(true);
    setTimeout(() => setShowGuide(false), 5000);
  };

  return (
    <div className="flex flex-col mx-6">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="w-full lg:w-2/3 p-4 rounded-lg h-screen overflow-hidden">
          <Card className="bg-[#F5F5FF] shadow-none border-none rounded-sm py-4 px-6">
            <CardHeader className="text-header text-4xl font-semibold">
              <Flower size={60} color="#1E87F0" />
              <CardTitle className="text-4xl text-neutral-900">Course Lessons</CardTitle>
              <CardDescription className="font-normal mt-2 text-base text-justify">
                Explore the lessons for this course.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex w-full mx-auto gap-3 mt-4">
              <Button onClick={handleAdventureClick}>Start Your Learning Adventure 📚</Button>
              <Button variant="outline" className="border-primary text-primary"><Video /> Arena</Button>
              <Button variant="outline" className="border-primary text-primary"><Blend /></Button>
            </CardFooter>
          </Card>

          <div className="mt-5">
            <Card className="shadow-none border-none">
              <CardHeader className="flex">
                <div className="flex">
                  <Avatar><AvatarFallback /></Avatar>
                  <div className="flex flex-col space-y-2 ml-3">
                    <Label>{student?.firstName} {student?.lastName}</Label> {/* Adjust if professor info is fetched */}
                    <Label className="font-light">{courseId.slice(-6)}</Label>
                  </div>
                  <div className="flex ml-auto items-center text-center justify-center gap-2">
                    <Badge variant="outline" className="font-medium gap-2 bg-gray-100 text-gray-700 py-1">
                      <Star size={16} /> {lessons.length} Lessons
                    </Badge>
                    <Badge variant="outline" className="font-medium gap-2 bg-gray-100 text-gray-700 py-1">
                      <GraduationCap size={16} /> {/* Add student count if available */} Students
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-neutral-900 mt-4">Course Description</CardTitle>
                <CardDescription className="text-md text-justify font-light mt-6 leading-relaxed">
                  Networking is the study of how computers, devices, and systems connect and communicate with each other.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full lg:w-1/3 p-4">
          <div className="bg-blue-200 text-neutral-900 py-3 px-4 font-medium rounded-lg mb-6 text-center">
            Explore Your Cosmic Lessons
          </div>

          {isLoading ? (
            <p>Loading lessons...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <motion.div>
              {lessons.map((lesson, index) => (
                <motion.div key={lesson._id} className="relative" whileHover={{ scale: 1.02 }}>
                  <Card className="bg-white shadow-none border-sm rounded-lg mb-5 overflow-hidden">
                    {index === 0 && (
                      <div className="absolute top-3 right-3 bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full">
                        Recommended First Lesson
                      </div>
                    )}
                    <CardHeader className="flex gap-3">
                      <motion.span className="text-5xl text-blue-600" whileHover={{ scale: 1.1, rotate: 5 }}>
                        <Flower />
                      </motion.span>
                      <div className="flex flex-col">
                        <CardTitle className="text-lg font-semibold">{lesson.title}</CardTitle>
                        <CardDescription className="text-sm font-light">{lesson.subTitle}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between">
                      <Badge className="text-sm font-medium bg-[#ffdc9b] text-orange-500">
                        {lesson._id.slice(-6)}
                      </Badge>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => navigate(`/student/module/${lesson._id}`)}
                          variant="secondary"
                          className="border-primary bg-purple-200 text-purple-800 hover:bg-purple-100"
                        >
                          Start
                        </Button>
                      </motion.div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentLessonListPage;