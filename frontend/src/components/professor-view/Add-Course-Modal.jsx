import React, { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseStore } from "@/store/courseStore";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useCourseFieldStore } from "@/store/courseFieldStore";
import TimeField from "@/components/professor-view/Time-field";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CourseModal = ({ onClose, isEditMode = false, courseData = null }) => {
  const [formValues, setFormValues] = useState({
    className: "",
    description: "",
    program: "",
    year: "",
    section: "",
    professor: "",
    programmingLanguage: "",
    day: "",
    time: "",
  });

  const [errors, setErrors] = useState({
    className: "",
    description: "",
    program: "",
    year: "",
    section: "",
    professor: "",
    programmingLanguage: "",
    day: "",
    time: "",
  });

  // Get data and methods from stores
  const { createCourse, updateCourse } = useCourseStore();
  const {
    professors,
    fetchProfessors,
    isLoading: profLoading,
    error: profError,
  } = useprofAuthStore();
  const {
    courseFields,
    fetchCourseFieldsByType,
    isLoading: fieldsLoading,
    error: fieldsError,
  } = useCourseFieldStore();

  // Reset form when modal opens in create mode
  useEffect(() => {
    if (!isEditMode) {
      resetForm();
    }
  }, [isEditMode]);

  // Fetch professors and course fields
  useEffect(() => {
    fetchProfessors();
    const types = ["ClassName", "Program", "Year", "Section"];
    const fetchAllFields = async () => {
      for (const type of types) {
        try {
          await fetchCourseFieldsByType(type);
        } catch (error) {
          console.error(`[CourseModal] Error fetching type ${type}:`, error);
        }
      }
    };
    fetchAllFields();
  }, [fetchProfessors, fetchCourseFieldsByType]);

  // Populate form for edit mode
  useEffect(() => {
    if (isEditMode && courseData) {
      setFormValues({
        className: courseData.className || "",
        description: courseData.description || "",
        program: courseData.program || "",
        year: courseData.year || "",
        section: courseData.section || "",
        professor: courseData.professorId || "",
        programmingLanguage: courseData.language || "",
        day: courseData.schedule?.day || "",
        time: courseData.schedule?.time || "",
      });
      setErrors({
        className: "",
        description: "",
        program: "",
        year: "",
        section: "",
        professor: "",
        programmingLanguage: "",
        day: "",
        time: "",
      });
    }
  }, [isEditMode, courseData]);

  // Filter course fields by type and status
  const classNames = courseFields.filter(
    (field) => field.type === "ClassName" && field.status === "Active"
  );
  const programs = courseFields.filter(
    (field) => field.type === "Program" && field.status === "Active"
  );
  const years = courseFields.filter(
    (field) => field.type === "Year" && field.status === "Active"
  );
  const sections = courseFields.filter(
    (field) => field.type === "Section" && field.status === "Active"
  );

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (!formValues.className.trim()) {
      newErrors.className = "Class name is required.";
      valid = false;
    } else {
      newErrors.className = "";
    }

    if (!formValues.program.trim()) {
      newErrors.program = "Program is required.";
      valid = false;
    } else {
      newErrors.program = "";
    }

    if (!formValues.year) {
      newErrors.year = "Year is required.";
      valid = false;
    } else {
      newErrors.year = "";
    }

    if (!formValues.section) {
      newErrors.section = "Section is required.";
      valid = false;
    } else {
      newErrors.section = "";
    }

    if (!formValues.professor) {
      newErrors.professor = "Professor is required.";
      valid = false;
    } else {
      newErrors.professor = "";
    }

    if (!formValues.programmingLanguage) {
      newErrors.programmingLanguage = "Programming language is required.";
      valid = false;
    } else {
      newErrors.programmingLanguage = "";
    }

    if (!formValues.day) {
      newErrors.day = "Day is required.";
      valid = false;
    } else {
      newErrors.day = "";
    }

    if (!formValues.time) {
      newErrors.time = "Time is required.";
      valid = false;
    } else {
      newErrors.time = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSelectChange = (name) => (value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: !value
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`
        : "",
      // Clear className error when relevant fields change
      className:
        name === "className" ||
        name === "program" ||
        name === "year" ||
        name === "section"
          ? ""
          : prev.className,
    }));
  };

  const isFormComplete = Object.values(formValues).every(
    (value) => value.trim() !== ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const updatedCourseData = {
        className: formValues.className,
        description: formValues.description,
        program: formValues.program,
        year: formValues.year,
        section: formValues.section,
        professorId: formValues.professor,
        language: formValues.programmingLanguage,
        schedule: {
          day: formValues.day,
          time: formValues.time,
        },
      };

      try {
        if (isEditMode) {
          const courseId = courseData?._id;
          if (!courseId) {
            throw new Error("Course ID is undefined in edit mode");
          }
          await updateCourse(courseId, updatedCourseData);
        } else {
          await createCourse(updatedCourseData);
        }
        resetForm();
        onClose();
      } catch (error) {
        console.error(
          `[CourseModal] Error ${isEditMode ? "updating" : "creating"} course:`,
          error
        );
        if (
          error.message.includes(
            "A course with this exact combination of Class Name, Program, Year, and Section already exists!"
          )
        ) {
          setErrors((prev) => ({
            ...prev,
            className:
              "A course with this combination of Class Name, Program, Year, and Section already exists.",
          }));
          resetForm();
        } else {
          setErrors((prev) => ({
            ...prev,
            className: error.message || "Error creating course",
          }));
        }
      }
    }
  };

  const resetForm = () => {
    setFormValues({
      className: "",
      description: "",
      program: "",
      year: "",
      section: "",
      professor: "",
      programmingLanguage: "",
      day: "",
      time: "",
    });
    setErrors({
      className: "",
      description: "",
      program: "",
      year: "",
      section: "",
      professor: "",
      programmingLanguage: "",
      day: "",
      time: "",
    });
  };

  return (
    <DialogContent className="max-w-[320px] sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
          {isEditMode ? (
            <>
              <Pencil className="h-5 w-5 text-purple-500" />
              Edit Course
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 text-purple-500" />
              Create Course
            </>
          )}
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Class name <span className="text-red-500">*</span>
            </label>
            <Select
              name="className"
              value={formValues.className}
              onValueChange={handleSelectChange("className")}
              disabled={fieldsLoading || fieldsError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a class name" />
              </SelectTrigger>
              <SelectContent>
                {fieldsLoading && (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
                {!fieldsLoading && classNames.length === 0 && (
                  <SelectItem disabled value="no-data">
                    No class names available
                  </SelectItem>
                )}
                {classNames.map((field) => (
                  <SelectItem key={field._id} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.className && (
              <p className="text-red-500 text-sm">{errors.className}</p>
            )}
            {fieldsError && (
              <p className="text-red-500 text-sm">
                Failed to load class names: {fieldsError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Program
            </label>
            <Select
              name="program"
              value={formValues.program}
              onValueChange={handleSelectChange("program")}
              disabled={fieldsLoading || fieldsError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a program" />
              </SelectTrigger>
              <SelectContent>
                {fieldsLoading && (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
                {!fieldsLoading && programs.length === 0 && (
                  <SelectItem disabled value="no-data">
                    No programs available
                  </SelectItem>
                )}
                {programs.map((field) => (
                  <SelectItem key={field._id} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.program && (
              <p className="text-red-500 text-sm">{errors.program}</p>
            )}
            {fieldsError && (
              <p className="text-red-500 text-sm">
                Failed to load programs: {fieldsError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Year
            </label>
            <Select
              name="year"
              value={formValues.year}
              onValueChange={handleSelectChange("year")}
              disabled={fieldsLoading || fieldsError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {fieldsLoading && (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
                {!fieldsLoading && years.length === 0 && (
                  <SelectItem disabled value="no-data">
                    No years available
                  </SelectItem>
                )}
                {years.map((field) => (
                  <SelectItem key={field._id} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.year && (
              <p className="text-red-500 text-sm">{errors.year}</p>
            )}
            {fieldsError && (
              <p className="text-red-500 text-sm">
                Failed to load years: {fieldsError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Section
            </label>
            <Select
              name="section"
              value={formValues.section}
              onValueChange={handleSelectChange("section")}
              disabled={fieldsLoading || fieldsError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {fieldsLoading && (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
                {!fieldsLoading && sections.length === 0 && (
                  <SelectItem disabled value="no-data">
                    No sections available
                  </SelectItem>
                )}
                {sections.map((field) => (
                  <SelectItem key={field._id} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.section && (
              <p className="text-red-500 text-sm">{errors.section}</p>
            )}
            {fieldsError && (
              <p className="text-red-500 text-sm">
                Failed to load sections: {fieldsError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Professor
            </label>
            <Select
              name="professor"
              value={formValues.professor}
              onValueChange={handleSelectChange("professor")}
              disabled={profLoading || profError}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a professor" />
              </SelectTrigger>
              <SelectContent>
                {profLoading && (
                  <SelectItem disabled value="loading">
                    Loading...
                  </SelectItem>
                )}
                {!profLoading && professors.length === 0 && (
                  <SelectItem disabled value="no-data">
                    No professors available
                  </SelectItem>
                )}
                {professors.map((prof) => (
                  <SelectItem key={prof._id} value={prof._id}>
                    {prof.firstName} {prof.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.professor && (
              <p className="text-red-500 text-sm">{errors.professor}</p>
            )}
            {profError && (
              <p className="text-red-500 text-sm">
                Failed to load professors: {profError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Programming Language
            </label>
            <Select
              name="programmingLanguage"
              value={formValues.programmingLanguage}
              onValueChange={handleSelectChange("programmingLanguage")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>
            {errors.programmingLanguage && (
              <p className="text-red-500 text-sm">
                {errors.programmingLanguage}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Day
            </label>
            <Select
              name="day"
              value={formValues.day}
              onValueChange={handleSelectChange("day")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day} value={day.toLowerCase()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.day && <p className="text-red-500 text-sm">{errors.day}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Time
            </label>
            <TimeField
              value={formValues.time}
              onChange={handleSelectChange("time")}
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Course Description
          </label>
          <textarea
            name="description"
            placeholder="Enter course description..."
            value={formValues.description}
            onChange={(e) => {
              setFormValues((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
            className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="5"
          />
        </div>

        <div className="flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="bg-purple-50">
              Cancel
            </Button>
          </DialogTrigger>

          <Button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:pointer-events-none text-sm sm:text-base"
            disabled={
              !isFormComplete ||
              profLoading ||
              fieldsLoading ||
              !!errors.className
            }
          >
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CourseModal;
