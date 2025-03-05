import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import header from "@/assets/picture/courses/course-header.png";
import { Separator } from "@/components/ui/separator";
import { BookOpenCheck, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/student-view/SearchForm";
import { Input } from "@/components/ui/input";
import card1 from "../../../assets/picture/courses/card1.png";
import StudentCourseCard from "@/components/student-view/student-course-card";
import { useNavigate } from "react-router-dom";
import JoinCourseModal from "@/components/student-view/join-course-modal";
import useStudentCourseStore from "@/store/studentCourseStore";
import { useStudentStore } from "@/store/studentStore";

function StudentCourseListPage() {
  const navigate = useNavigate();
  const [joinCourse, setJoinCourse] = useState(false);
  const { enrolledCourses, fetchEnrolledCourses, isLoading} = useStudentCourseStore();
  const { student } = useStudentStore();


  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses])


  return (
    <div className="mx-6 w-full">
      <Card className="h-[272px] w-full bg-[#ededff]  shadow-none border-none flex justify-between relative overflow-hidden rounded-xl">
        {/* Left Content */}
        <div className="z-10 p-8">
          <CardHeader className="text-header text-3xl font-semibold">
            Hi, {student.firstName} Ready to Learn?
            <span className="text-base font-normal mt-1">
              Continue your learning journey. Let’s go!
            </span>
          </CardHeader>

          <CardContent className="flex gap-4 mt-4 text-header font-medium">
            <BookOpenCheck />
            <h4>{enrolledCourses.length} Courses</h4>
            <Separator orientation="vertical" />
            <Users />
            <h4>Multiple Professors</h4>
          </CardContent>
          <CardFooter>
            <Button onClick={() => setJoinCourse(true)}>Join Course 🚀</Button>
          </CardFooter>

          {/* ==============================================
            ============MODAL FOR JOIN COURSE CODE ===========
            ==================================================*/}
          <JoinCourseModal isOpen={joinCourse} onClose={() => setJoinCourse(false)} />
        </div>

        <div className="relative w-[50%] h-full ml-auto">
          <img
            src={header}
            alt=""
            className="absolute top-0 right-0 w-auto h-full object-cover"
          />
        </div>
      </Card>

      <div className="flex px-8 text-center justify-between items-center">
        <h1 className="text-header font-semibold text-4xl">My Courses</h1>
        <SearchForm />
      </div>

      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
          {enrolledCourses.map((course) => (
            <StudentCourseCard
              key={course._id}
              lessons={course.lessons?.length || 0} // Adjust if lessons are fetched separately
              image={course.image || "https://via.placeholder.com/150"}
              title={course.className}
              professor={`${course.professorId?.firstName} ${course.professorId?.lastName}`}
              tags={[course.program, course.language]}
              onClick={() => navigate(`/student/lesson-list/${course._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentCourseListPage;
