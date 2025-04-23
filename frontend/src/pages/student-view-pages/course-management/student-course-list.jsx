import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import header from "@/assets/picture/courses/course-header.png";
import { Separator } from "@/components/ui/separator";
import { BookOpenCheck, ChevronRight, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchForm from "@/components/student-view/SearchForm";
import { Input } from "@/components/ui/input";
import card1 from "@/assets/picture/courses/card1.png";
import StudentCourseCard from "@/components/student-view/student-course-card";
import { useNavigate } from "react-router-dom";
import JoinCourseModal from "@/components/student-view/join-course-modal";
import useStudentCourseStore from "@/store/studentCourseStore";
import { useStudentStore } from "@/store/studentStore";

function StudentCourseListPage() {
  const navigate = useNavigate();
  const [joinCourse, setJoinCourse] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { enrolledCourses, fetchEnrolledCourses, isLoading } =
    useStudentCourseStore();
  const { student } = useStudentStore();

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const filteredCourses = enrolledCourses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.className.toLowerCase().includes(searchLower) ||
      course.program.toLowerCase().includes(searchLower) ||
      course.language.toLowerCase().includes(searchLower) ||
      (course.professorId &&
        `${course.professorId.firstName} ${course.professorId.lastName}`
          .toLowerCase()
          .includes(searchLower))
    );
  });

  console.log("Enrolled Courses:", enrolledCourses); // Debugging line
  return (
    <div className="mx-6 w-full py-4">
      <Card className="h-auto w-full bg-[#ededff]  shadow-none border-none flex lg:justify-between relative overflow-hidden rounded-xl">
        {/* Left Content */}
        <div className="z-10 p-8">
          <CardHeader className="text-header text-4xl font-semibold text-center md:text-left">
            Hi, {student.firstName} Ready to Learn?
            <span className="text-base font-normal mt-1 ">
              Continue your learning journey. Let's go!
            </span>
          </CardHeader>

          <CardContent className="flex flex-col items-left gap-4 mt-4 text-header font-medium md:flex-row ">
            <div className="flex flex-row gap-4">
              <BookOpenCheck />
              <h4>{enrolledCourses.length} Courses</h4>
            </div>
            <Separator orientation="vertical" />
            <div className="flex flex-row gap-4">
              <Users />
              <h4>Multiple Professors</h4>
            </div>
          </CardContent>
          <CardFooter className="items-center justify-center mt-4 md:items-start md:justify-start">
            <Button onClick={() => setJoinCourse(true)}>Join Course <ChevronRight/></Button>
          </CardFooter>

          {/* ==============================================
            ============MODAL FOR JOIN COURSE CODE ===========
            ==================================================*/}
          <JoinCourseModal
            isOpen={joinCourse}
            onClose={() => setJoinCourse(false)}
          />
        </div>

        <div className=" w-auto h-full ml-auto opacity-10 lg:opacity-100 md:opacity-100">
          <img
            src={header}
            alt=""
            className="absolute top-0 right-0 w-auto h-full object-cover"
          />
        </div>
      </Card>

      <div className="flex flex-col px-8 text-center justify-between items-center mt-5 md:flex-row">
        <h1 className="text-header font-semibold text-4xl">My Courses</h1>
        <SearchForm onSearch={handleSearch} />
      </div>

      {isLoading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 my-4">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full text-center py-8 items-center justify-center"> 
              <p className="text-gray-500 text-xl">
                {searchQuery ? "No courses found matching your search" : "No courses available"}
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <StudentCourseCard
                key={course._id}
                lessons={course.lessonCount || 0}
                image={course.image || "https://via.placeholder.com/150"}
                title={course.className}
                professor={
                  course.professorId
                    ? `${course.professorId.firstName} ${course.professorId.lastName}`
                    : "Unknown Professor"
                }
                schedule={
                  course.schedule
                    ? `${
                        course.schedule.day
                          ? course.schedule.day.charAt(0).toUpperCase() +
                            course.schedule.day.slice(1)
                          : "N/A"
                      } | ${course.schedule.time || "N/A"}`
                    : "Schedule Unavailable"
                }
                tags={[course.program, course.language].filter(Boolean)}
                onClick={() => navigate(`/student/lesson-list/${course._id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default StudentCourseListPage;
