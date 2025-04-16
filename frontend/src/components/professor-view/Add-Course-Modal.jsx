import React, { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseStore } from "@/store/courseStore";
import { useprofAuthStore } from "@/store/profAuthStore";
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
  const { professors, fetchProfessors, isLoading, error } = useprofAuthStore();

  // Fetch professors and prepopulate form if editing
  useEffect(() => {
    fetchProfessors();
    if (isEditMode && courseData) {
      console.log("courseData received in CourseModal:", courseData); // Debug
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
    }
  }, [fetchProfessors, isEditMode, courseData]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    const classNameRegex = /^[a-zA-Z0-9\s\-()]+$/;
    if (!formValues.className.trim()) {
      newErrors.className = "Class name is required.";
      valid = false;
    } else if (!classNameRegex.test(formValues.className)) {
      newErrors.className = "Invalid class name format.";
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    const newErrors = { ...errors };
    switch (name) {
      case "className": {
        const classNameRegex = /^[a-zA-Z0-9\s\-()]+$/;
        if (!value.trim()) {
          newErrors.className = "Class name is required.";
        } else if (!classNameRegex.test(value)) {
          newErrors.className = "Invalid class name format.";
        } else {
          newErrors.className = "";
        }
        break;
      }
      case "program": {
        if (!value.trim()) {
          newErrors.program = "Program is required.";
        } else {
          newErrors.program = "";
        }
        break;
      }
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSelectChange = (name) => (value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: !value
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`
        : "",
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

      console.log("Submitting updatedCourseData:", updatedCourseData);
      try {
        if (isEditMode) {
          const courseId = courseData?._id; // Use the original courseData's _id
          if (!courseId) {
            throw new Error("Course ID is undefined in edit mode");
          }
          console.log("Calling updateCourse with ID:", courseId);
          await updateCourse(courseId, updatedCourseData);
        } else {
          await createCourse(updatedCourseData);
        }
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
        onClose();
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} course:`,
          error
        );
      }
    }
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
            <Input
              name="className"
              placeholder="Class name"
              value={formValues.className}
              onChange={handleChange}
              className="w-full"
            />
            {errors.className && (
              <p className="text-red-500 text-sm">{errors.className}</p>
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
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BSCS">
                  Bachelor of Science in Computer Science (BSCS)
                </SelectItem>
                <SelectItem value="BSIT">
                  Bachelor of Science in Information Technology (BSIT)
                </SelectItem>
                <SelectItem value="BSEMC">
                  Bachelor of Science in Entertainment and Multimedia Computing
                  (BSEMC)
                </SelectItem>
                <SelectItem value="BSIS">
                  Bachelor of Science in Information System (BSIS)
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.program && (
              <p className="text-red-500 text-sm">{errors.program}</p>
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
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.year && (
              <p className="text-red-500 text-sm">{errors.year}</p>
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
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                {["A", "B", "C"].map((section) => (
                  <SelectItem key={section} value={section}>
                    {section}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.section && (
              <p className="text-red-500 text-sm">{errors.section}</p>
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
              disabled={isLoading || error}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a professor" />
              </SelectTrigger>
              <SelectContent>
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
            {error && (
              <p className="text-red-500 text-sm">
                Failed to load professors: {error}
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
              name
              W="day"
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
            onChange={handleChange}
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
            disabled={!isFormComplete || isLoading}
          >
            {isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CourseModal;
