import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const [initialValues, setInitialValues] = useState(formValues);
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

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    fetchProfessors();
    const types = ["ClassName", "Program", "Year", "Section"];
    const fetchAllFields = async () => {
      for (const type of types) {
        console.log(`[CourseModal] Initiating fetch for type: ${type}`);
        try {
          await fetchCourseFieldsByType(type);
          console.log(`[CourseModal] Fetch completed for type: ${type}`);
        } catch (error) {
          console.error(`[CourseModal] Error fetching type ${type}:`, error);
        }
      }
    };
    fetchAllFields();

    if (isEditMode && courseData) {
      console.log("[CourseModal] courseData received:", courseData);
      const newFormValues = {
        className: courseData.className || "",
        description: courseData.description || "",
        program: courseData.program || "",
        year: courseData.year || "",
        section: courseData.section || "",
        professor: courseData.professorId || "",
        programmingLanguage: courseData.language || "",
        day: courseData.schedule?.day || "",
        time: courseData.schedule?.time || "",
      };
      setFormValues(newFormValues);
      setInitialValues(newFormValues);
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
    } else {
      const emptyFormValues = {
        className: "",
        description: "",
        program: "",
        year: "",
        section: "",
        professor: "",
        programmingLanguage: "",
        day: "",
        time: "",
      };
      setFormValues(emptyFormValues);
      setInitialValues(emptyFormValues);
    }
  }, [fetchProfessors, fetchCourseFieldsByType, isEditMode, courseData]);

  useEffect(() => {
    console.log("[CourseModal] Raw courseFields state:", courseFields);
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
    console.log("[CourseModal] Filtered fields:", {
      classNames: classNames.map((f) => ({
        _id: f._id,
        name: f.name,
        type: f.type,
        status: f.status,
      })),
      programs: programs.map((f) => ({
        _id: f._id,
        name: f.name,
        type: f.type,
        status: f.status,
      })),
      years: years.map((f) => ({
        _id: f._id,
        name: f.name,
        type: f.type,
        status: f.status,
      })),
      sections: sections.map((f) => ({
        _id: f._id,
        name: f.name,
        type: f.type,
        status: f.status,
      })),
    });
  }, [courseFields]);

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

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    if (fieldName === "className") {
      newErrors.className = value.trim() ? "" : "Class name is required.";
    } else if (fieldName === "program") {
      newErrors.program = value.trim() ? "" : "Program is required.";
    } else if (fieldName === "year") {
      newErrors.year = value ? "" : "Year is required.";
    } else if (fieldName === "section") {
      newErrors.section = value ? "" : "Section is required.";
    } else if (fieldName === "professor") {
      newErrors.professor = value ? "" : "Professor is required.";
    } else if (fieldName === "programmingLanguage") {
      newErrors.programmingLanguage = value ? "" : "Programming language is required.";
    } else if (fieldName === "day") {
      newErrors.day = value ? "" : "Day is required.";
    } else if (fieldName === "time") {
      newErrors.time = value ? "" : "Time is required.";
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    let valid = true;

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

    newErrors.description = "";
    setErrors(newErrors);
    return valid;
  };

  const handleSelectChange = (name) => (value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, description: value }));
    validateField("description", value);
  };

  const hasChanges = () => {
    return (
      formValues.className !== initialValues.className ||
      formValues.description !== initialValues.description ||
      formValues.program !== initialValues.program ||
      formValues.year !== initialValues.year ||
      formValues.section !== initialValues.section ||
      formValues.professor !== initialValues.professor ||
      formValues.programmingLanguage !== initialValues.programmingLanguage ||
      formValues.day !== initialValues.day ||
      formValues.time !== initialValues.time
    );
  };

  const isFormValid = () => {
    const isValid =
      formValues.className.trim() !== "" &&
      formValues.program.trim() !== "" &&
      formValues.year !== "" &&
      formValues.section !== "" &&
      formValues.professor !== "" &&
      formValues.programmingLanguage !== "" &&
      formValues.day !== "" &&
      formValues.time !== "" &&
      Object.values(errors).every((error) => error === "");

    return isEditMode ? isValid && hasChanges() : isValid;
  };

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

      console.log("[CourseModal] Submitting updatedCourseData:", updatedCourseData);
      try {
        if (isEditMode) {
          const courseId = courseData?._id;
          if (!courseId) {
            throw new Error("Course ID is undefined in edit mode");
          }
          console.log("[CourseModal] Calling updateCourse with ID:", courseId);
          await updateCourse(courseId, updatedCourseData);
        } else {
          await createCourse(updatedCourseData);
        }
        onClose();
      } catch (error) {
        console.error(
          `[CourseModal] Error ${isEditMode ? "updating" : "creating"} course:`,
          error
        );
        setErrors((prev) => ({
          ...prev,
          general: `Failed to ${isEditMode ? "update" : "create"} course. Please try again.`,
        }));
      }
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
      animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
      exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
      transition={shouldReduceMotion ? {} : { duration: 0.3, ease: "easeOut" }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-[320px] sm:max-w-[800px] max-h-[80vh] overflow-y-auto"
      >
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
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="className"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Class name
              </label>
              <Select
                name="className"
                value={formValues.className}
                onValueChange={handleSelectChange("className")}
                disabled={fieldsLoading || fieldsError}
                onOpenChange={(open) => {
                  if (open) {
                    console.log(
                      "[CourseModal] ClassName Select options:",
                      classNames.map((f) => ({ _id: f._id, name: f.name }))
                    );
                  }
                }}
              >
                <SelectTrigger
                  id="className"
                  className={errors.className ? "border-red-500" : ""}
                  aria-describedby={errors.className ? "className-error" : undefined}
                >
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
                <p id="className-error" className="text-red-500 text-sm">
                  {errors.className}
                </p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">Failed to load class names: {fieldsError}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="program"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Program
              </label>
              <Select
                name="program"
                value={formValues.program}
                onValueChange={handleSelectChange("program")}
                disabled={fieldsLoading || fieldsError}
                onOpenChange={(open) => {
                  if (open) {
                    console.log(
                      "[CourseModal] Program Select options:",
                      programs.map((f) => ({ _id: f._id, name: f.name }))
                    );
                  }
                }}
              >
                <SelectTrigger
                  id="program"
                  className={errors.program ? "border-red-500" : ""}
                  aria-describedby={errors.program ? "program-error" : undefined}
                >
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
                <p id="program-error" className="text-red-500 text-sm">
                  {errors.program}
                </p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">Failed to load programs: {fieldsError}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="year"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Year
              </label>
              <Select
                name="year"
                value={formValues.year}
                onValueChange={handleSelectChange("year")}
                disabled={fieldsLoading || fieldsError}
                onOpenChange={(open) => {
                  if (open) {
                    console.log(
                      "[CourseModal] Year Select options:",
                      years.map((f) => ({ _id: f._id, name: f.name }))
                    );
                  }
                }}
              >
                <SelectTrigger
                  id="year"
                  className={errors.year ? "border-red-500" : ""}
                  aria-describedby={errors.year ? "year-error" : undefined}
                >
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
                <p id="year-error" className="text-red-500 text-sm">{errors.year}</p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">Failed to load years: {fieldsError}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="section"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Section
              </label>
              <Select
                name="section"
                value={formValues.section}
                onValueChange={handleSelectChange("section")}
                disabled={fieldsLoading || fieldsError}
                onOpenChange={(open) => {
                  if (open) {
                    console.log(
                      "[CourseModal] Section Select options:",
                      sections.map((f) => ({ _id: f._id, name: f.name }))
                    );
                  }
                }}
              >
                <SelectTrigger
                  id="section"
                  className={errors.section ? "border-red-500" : ""}
                  aria-describedby={errors.section ? "section-error" : undefined}
                >
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
                <p id="section-error" className="text-red-500 text-sm">{errors.section}</p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">Failed to load sections: {fieldsError}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="professor"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Professor
              </label>
              <Select
                name="professor"
                value={formValues.professor}
                onValueChange={handleSelectChange("professor")}
                disabled={profLoading || profError}
              >
                <SelectTrigger
                  id="professor"
                  className={errors.professor ? "border-red-500" : ""}
                  aria-describedby={errors.professor ? "professor-error" : undefined}
                >
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
                <p id="professor-error" className="text-red-500 text-sm">{errors.professor}</p>
              )}
              {profError && (
                <p className="text-red-500 text-sm">Failed to load professors: {profError}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="programmingLanguage"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Programming Language
              </label>
              <Select
                name="programmingLanguage"
                value={formValues.programmingLanguage}
                onValueChange={handleSelectChange("programmingLanguage")}
              >
                <SelectTrigger
                  id="programmingLanguage"
                  className={errors.programmingLanguage ? "border-red-500" : ""}
                  aria-describedby={
                    errors.programmingLanguage ? "programmingLanguage-error" : undefined
                  }
                >
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
                <p id="programmingLanguage-error" className="text-red-500 text-sm">
                  {errors.programmingLanguage}
                </p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="day"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Day
              </label>
              <Select
                name="day"
                value={formValues.day}
                onValueChange={handleSelectChange("day")}
              >
                <SelectTrigger
                  id="day"
                  className={errors.day ? "border-red-500" : ""}
                  aria-describedby={errors.day ? "day-error" : undefined}
                >
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
              {errors.day && (
                <p id="day-error" className="text-red-500 text-sm">{errors.day}</p>
              )}
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="space-y-2"
            >
              <label
                htmlFor="time"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Time
              </label>
              <TimeField
                value={formValues.time}
                onChange={handleSelectChange("time")}
                id="time"
                className={errors.time ? "border-red-500" : ""}
                aria-describedby={errors.time ? "time-error" : undefined}
              />
              {errors.time && (
                <p id="time-error" className="text-red-500 text-sm">{errors.time}</p>
              )}
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="space-y-2"
          >
            <label
              htmlFor="description"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter course description..."
              value={formValues.description}
              onChange={handleDescriptionChange}
              className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="5"
              aria-describedby={errors.description ? "description-error" : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-red-500 text-sm">
                {errors.description}
              </p>
            )}
          </motion.div>

          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="flex justify-end gap-3"
          >
            <DialogTrigger asChild>
              <Button type="button" variant="outline" className="bg-purple-50">
                Cancel
              </Button>
            </DialogTrigger>
            <motion.div
              whileHover={
                shouldReduceMotion
                  ? {}
                  : { y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }
              }
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={shouldReduceMotion ? {} : { duration: 0.2, ease: "easeOut" }}
            >
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:pointer-events-none text-sm sm:text-base"
                disabled={profLoading || fieldsLoading || !isFormValid()}
              >
                {isEditMode ? "Update" : "Save"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </DialogContent>
    </motion.div>
  );
};

export default CourseModal;