import React, { useState, useEffect } from "react";
import Card from "@/components/professor-view/Course-Card";
import { Plus, BookX} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CourseModal from "@/components/professor-view/Add-Course-Modal";
import { useCourseStore } from "@/store/courseStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


const Courses = () => {
  const navigate = useNavigate();
  const { courses, fetchCoursesByProfessor, isLoading } = useCourseStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    console.log("Fetching professor courses on mount...");
    fetchCoursesByProfessor();
  }, []);

  // Filter courses by selected languages
  const filteredCourses =
    selectedLanguage.length > 0
      ? courses.filter(
          (course) => selectedLanguage.includes(course.language) // ✅ Check directly without `.some()`
        )
      : courses;

  // Paginate filtered courses
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleLanguage = (language) => {
    setSelectedLanguage((prev) =>
      prev.includes(language) ? prev.filter((item) => item !== language) : [...prev, language]
    );
  };

  const languageColors = {
    Javascript: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Python: { bg: "bg-blue-100", text: "text-blue-700" },
    "C++": { bg: "bg-green-100", text: "text-green-700" },
    Java: { bg: "bg-indigo-100", text: "text-indigo-700" },
  };

  const handleCourseClick = (course) => {
    navigate(`/professor/course/${course.slug}`, { state: { course } });
  };

  return (
    <div className="w-full p-2 sm:p-6">
    <motion.div 
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6, ease: "easeOut" }}
     className="pb-10">
      <div className="w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
          Courses
        </h1>
        </div>

        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {["Javascript", "Python", "C++", "Java"].map((tag, index) => (
              <Button
                key={tag}
                className={`${
                  selectedLanguage.includes(tag)
                    ? `${languageColors[tag]?.bg} ${languageColors[tag]?.text} border border-purple-700`
                    : `${languageColors[tag]?.bg} ${languageColors[tag]?.text} hover:text-white`
                } px-2 sm:px-3 py-1 text-xs whitespace-nowrap rounded-full`}
                onClick={() => toggleLanguage(tag)}
              >
                {tag}
              </Button>
            )
          )}
        </div>
      </div>
    </motion.div>
    {/* Card Courses */}

    {isLoading ? (
  <div className="flex items-center justify-center w-full min-h-[50vh]">
    <p className="text-gray-500 text-base text-center">
      Loading courses...
    </p>
  </div>
) : currentCourses.length > 0 ? (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={`grid gap-8 sm:gap-12 transition-all duration-300 ${
      isSidebarOpen
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
    }`}
  >
    {currentCourses.map((course, index) => (
      <div
        key={index}
        onClick={() => handleCourseClick(course)}
        className="cursor-pointer transition duration-200  items-center justify-center mx-auto align-middle"
      >
        <Card
          key={course._id}
          courseId={course._id}
          lessonCount={course.lessonCount || 0}
          languages={course.language}
          title={course.className}
          courseCode={course.courseCode}
          section={course.section}
          students={course.studentCount}
        />
      </div>
    ))}
  </motion.div>
) : (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center h-[calc(90vh-260px)] w-full"
  >
    <BookX size={60} className="text-gray-400 mb-2" />
    <p className="text-gray-500 text-lg font-medium">No courses found.</p>
  </motion.div>
)}

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>

              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 3 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
    </div>
  );
};

export default Courses;