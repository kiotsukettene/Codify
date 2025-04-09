import React, { useState } from "react";
import { Plus } from "lucide-react";
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

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7; // Start from 7 AM
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, "0")}:00`,
    label: `${hour12}:00 ${ampm}`,
  };
});
import { useCourseStore } from "@/store/courseStore";
import TimeField  from "@/components/professor-view/Time-field";

const CourseModal = ({ onClose }) => {
  const [formValues, setFormValues] = useState({
    className: "",
    program: "",
    section: "",
    programmingLanguage: "",
    day: "",
    time: "",
  });

  const [errors, setErrors] = useState({
    className: "",
    program: "",
    section: "",
    programmingLanguage: "",
    day: "",
    time: "",
  });

  // Get createCourse function from the store
const createCourse = useCourseStore((state) => state.createCourse);

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Class name validation - only letters, numbers, spaces and basic punctuation
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

    // Program validation
    if (!formValues.program.trim()) {
      newErrors.program = "Program is required.";
      valid = false;
    } else {
      newErrors.program = "";
    }

    // Section validation - alphanumeric
    const sectionRegex = /^[a-zA-Z0-9\-]+$/;
    if (!formValues.section.trim()) {
      newErrors.section = "Section is required.";
      valid = false;
    } else if (!sectionRegex.test(formValues.section)) {
      newErrors.section = "Invalid section format.";
      valid = false;
    } else {
      newErrors.section = "";
    }

    // Programming Language validation
    if (!formValues.programmingLanguage) {
      newErrors.programmingLanguage = "Programming language is required.";
      valid = false;
    } else {
      newErrors.programmingLanguage = "";
    }

    // Day validation
    if (!formValues.day) {
      newErrors.day = "Day is required.";
      valid = false;
    } else {
      newErrors.day = "";
    }

    // Time validation
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

    // Validate the changed field
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
      case "section": {
        const sectionRegex = /^[a-zA-Z0-9\-]+$/;
        if (!value.trim()) {
          newErrors.section = "Section is required.";
        } else if (!sectionRegex.test(value)) {
          newErrors.section = "Invalid section format.";
        } else {
          newErrors.section = "";
        }
        break;
      }
      default:
        break;
    }
    setErrors(newErrors);
  };

  // Add handlers for select components
  const handleProgrammingLanguageChange = (value) => {
    setFormValues((prev) => ({ ...prev, programmingLanguage: value }));
    setErrors((prev) => ({
      ...prev,
      programmingLanguage: !value ? "Programming language is required." : "",
    }));
  };

  const handleDayChange = (value) => {
    setFormValues((prev) => ({ ...prev, day: value }));
    setErrors((prev) => ({
      ...prev,
      day: !value ? "Day is required." : "",
    }));
  };

  const handleTimeChange = (value) => {
    setFormValues((prev) => ({ ...prev, time: value }));
    setErrors((prev) => ({
      ...prev,
      time: !value ? "Time is required." : "",
    }));
  };

  const isFormComplete = Object.values(formValues).every(
    (value) => value.trim() !== ""
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const courseData = {
        className: formValues.className,
        description: formValues.description,
        program: formValues.program,
        section: formValues.section,
        language: formValues.programmingLanguage,
        schedule: {
          day: formValues.day,
          time: formValues.time,
        },
      };

      try {
        await createCourse(courseData);
        setFormValues({
          className: "",
          program: "",
          section: "",
          programmingLanguage: "",
          day: "",
          time: "",
        });
        onClose(); // Close the modal
      } catch (error) {
        console.error("Error creating course:", error);
      }
    }
  };

  const handleProgramChange = (value) => {
    setFormValues((prev) => ({ ...prev, program: value }));
    setErrors((prev) => ({
      ...prev,
      program: !value ? "Program is required." : "",
    }));
  };

  return (
    <DialogContent className="max-w-[320px] sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Plus className="h-5 w-5 text-purple-500" />
          Create Course
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Class name <span className="text-red-500">*</span>
          </label>
          <Input
            name="className"
            placeholder="class name"
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
            Course Description
          </label>
          <Input
            name="description"
            placeholder="course description"
            value={formValues.description}
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Program
          </label>
          <Select
            name="program"
            value={formValues.program}
            onValueChange={handleProgramChange}
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
                (BSEMC){" "}
              </SelectItem>
              <SelectItem value="BSIS">
                Bachelor of Science in Information System (BSIS){" "}
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.program && (
            <p className="text-red-500 text-sm">{errors.program}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Section
          </label>
          <Input
            name="section"
            placeholder="section"
            value={formValues.section}
            onChange={handleChange}
            className="w-full"
          />
          {errors.section && (
            <p className="text-red-500 text-sm">{errors.section}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm sm:text-base font-medium text-gray-700">
            Programming Language
          </label>
          <Select
            name="programmingLanguage"
            onValueChange={handleProgrammingLanguageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
          {errors.programmingLanguage && (
            <p className="text-red-500 text-sm">{errors.programmingLanguage}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Day
            </label>
            <Select name="day" onValueChange={handleDayChange}>
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

          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700">
              Time
            </label>
            <TimeField value={formValues.time} onChange={handleTimeChange} />

            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time}</p>
            )}
          </div>
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
            disabled={!isFormComplete}
          >
            Save
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default CourseModal;
