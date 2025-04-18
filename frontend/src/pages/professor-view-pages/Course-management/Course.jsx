import React, { useState, useEffect, useMemo } from "react";
import Card from "@/components/professor-view/Course-Card";
import { BookX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useCourseStore } from "@/store/courseStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Courses = () => {
  const navigate = useNavigate();
  const { courses, fetchCoursesByProfessor, isLoading } = useCourseStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]); // New state for dynamic languages
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCoursesByProfessor();
  }, []);

  // Compute available languages whenever courses change
  useEffect(() => {
    const languages = [
      ...new Set(courses.map((course) => course.language)),
    ].sort();
    setAvailableLanguages(languages);
  }, [courses]);

  // Filter courses by selected languages
  const filteredCourses =
    selectedLanguage.length > 0
      ? courses.filter((course) => selectedLanguage.includes(course.language))
      : courses;

  // Compute total pages efficiently
  const totalPages = useMemo(
    () => Math.ceil(filteredCourses.length / itemsPerPage),
    [filteredCourses]
  );

  // Reset currentPage if it exceeds totalPages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Paginate filtered courses
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleLanguage = (language) => {
    setSelectedLanguage((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((item) => item !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const languageColors = {
    javascript: { bg: "bg-yellow-100", text: "text-yellow-700" },
    python: { bg: "bg-blue-100", text: "text-blue-700" },
    "C++": { bg: "bg-green-100", text: "text-green-700" },
    java: { bg: "bg-orange-100", text: "text-orange-700" },
  };

  // Navigate to course details page
  const handleCourseClick = (course) => {
    navigate(`/professor/course/${course.slug}`, { state: { course } });
  };

  return (
    <div className="w-full p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="pb-10"
      >
        <div className="w-full flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
            Courses
          </h1>
        </div>

        {/* Filter Tags */}
        <div className="flex items-center justify-between w-full flex-wrap gap-2">
          <div className="flex flex-wrap gap-2">
            {availableLanguages.map((language, index) => (
              <Button
                key={index}
                className={`${
                  selectedLanguage.includes(language)
                    ? `${languageColors[language]?.bg || "bg-gray-100"} ${
                        languageColors[language]?.text || "text-gray-700"
                      } border border-purple-700`
                    : `${languageColors[language]?.bg || "bg-gray-100"} ${
                        languageColors[language]?.text || "text-gray-700"
                      } hover:text-white`
                } px-2 sm:px-3 py-1 text-xs whitespace-nowrap rounded-full`}
                onClick={() => toggleLanguage(language)}
              >
                {language}
              </Button>
            ))}
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
              className="cursor-pointer transition duration-200 items-center justify-center mx-auto align-middle"
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
                year={course.year}
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
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Courses;
