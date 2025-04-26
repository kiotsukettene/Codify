
import React, { useState, useEffect } from "react";
import CourseCard from "@/components/admin-view/Course-Card";
import DeleteDialog from "@/components/Dialog/DeleteDialog";
import { Plus } from "lucide-react";
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

const CoursesAdmin = () => {
  const { courses, fetchCoursesByInstitution, isLoading, deleteCourse } =
    useCourseStore();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedLanguage, setSelectedLanguage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track edit mode
  const [editCourseData, setEditCourseData] = useState(null); // Store course data for editing
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for DeleteDialog
  const [courseIdToDelete, setCourseIdToDelete] = useState(null); // Track course to delete

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCoursesByInstitution();
  }, [fetchCoursesByInstitution]);

  console.log("Courses:", courses); // Log the courses to check if they are fetched correctly

  // Filter courses by selected languages
  const filteredCourses =
    selectedLanguage.length > 0
      ? courses.filter((course) => selectedLanguage.includes(course.language))
      : courses;

  // Paginate filtered courses
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const currentCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for dropdown menu
  const handleEdit = (courseId) => {
    const courseToEdit = courses.find((course) => course._id === courseId);
    if (courseToEdit) {
      console.log("courseToEdit in handleEdit:", courseToEdit); // Debug
      setEditCourseData(courseToEdit);
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCourse = (courseId) => {
    setCourseIdToDelete(courseId); // Set the course ID to delete
    setIsDeleteDialogOpen(true); // Open the DeleteDialog
  };

  const confirmDelete = async () => {
    if (courseIdToDelete) {
      await deleteCourse(courseIdToDelete); // Call deleteCourse from store
      setIsDeleteDialogOpen(false); // Close the dialog
      setCourseIdToDelete(null); // Clear the course ID
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false); // Close the dialog
    setCourseIdToDelete(null); // Clear the course ID
  };

  const toggleLanguage = (language) => {
    setSelectedLanguage((prevSelectedLanguages) => {
      if (prevSelectedLanguages.includes(language)) {
        return prevSelectedLanguages.filter((item) => item !== language);
      } else {
        return [...prevSelectedLanguages, language];
      }
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false); // Reset edit mode
    setEditCourseData(null); // Clear edit data
    fetchCoursesByProfessor(); // Refresh the course list
  };

  const languageColors = {
    Javascript: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Python: { bg: "bg-blue-100", text: "text-blue-700" },
    "C++": { bg: "bg-green-100", text: "text-green-700" },
    Java: { bg: "bg-indigo-100", text: "text-indigo-700" },
  };

  return (
    <div className="w-full p-6 sm:p-8 overflow-auto overflow-x-hidden">
      <div className="pb-10">
        <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 5, y: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="w-full flex items-center justify-between mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-purple-700">
            Courses
          </h1>
          <div className="flex">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsEditMode(false); // Ensure create mode
                    setEditCourseData(null); // Clear edit data
                    setIsModalOpen(true);
                  }}
                  className="bg-purple-700 hover:bg-purple-800 p-5 rounded-md sm:hidden"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsEditMode(false); // Ensure create mode
                    setEditCourseData(null); // Clear edit data
                    setIsModalOpen(true);
                  }}
                  className="hidden sm:flex items-center bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <CourseModal
                onClose={handleModalClose}
                isEditMode={isEditMode}
                courseData={editCourseData}
              />
            </Dialog>
          </div>
        </motion.div>
      </div>
      {/* Card Courses */}
      <div
        className={`grid place-items-center sm:place-items-start gap-20 transition-all duration-300 ${
          isSidebarOpen
            ? "sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full min-h-[50vh]">
            <p className="text-gray-500 text-base text-center">
              Loading courses...
            </p>
          </div>
        ) : currentCourses.length > 0 ? (
          currentCourses.map((course, index) => (
            <div key={index} className="cursor-pointer transition duration-200">
              <CourseCard
                key={course._id}
                courseId={course._id}
                lessonCount={course.lessonCount || 0}
                languages={
                  Array.isArray(course.language)
                    ? course.language
                    : [course.language]
                }
                title={course.className}
                courseCode={course.courseCode}
                section={course.section}
                program={course.program}
                year={course.year}
                onEdit={() => handleEdit(course._id)}
                onDelete={() => handleDeleteCourse(course._id)} // Trigger DeleteDialog
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-full min-h-[50vh]">
            <p className="text-gray-500 text-base text-center">
              No courses found.
            </p>
          </div>
        )}
      </div>
      {/* Delete Dialog */}
      <DeleteDialog
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        isOpen={isDeleteDialogOpen}
      />
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default CoursesAdmin;
