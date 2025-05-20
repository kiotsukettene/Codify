import  { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useStudentStore } from "@/store/studentStore"
import { useAuthStore } from "@/store/authStore"
import { useCourseFieldStore } from "@/store/courseFieldStore"
import toast from "react-hot-toast"
import useToggleVisibility from "@/hooks/use-toggle-visibility"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"


function AddStudent({ onClose }) {
  const { institution } = useAuthStore()
  const { addStudent, isLoading, error } = useStudentStore()
  const {
    courseFields,
    fetchCourseFieldsByType,
    isLoading: fieldsLoading,
    error: fieldsError,
  } = useCourseFieldStore();
  const navigate = useNavigate()
  const [isVisible, toggleVisibility] = useToggleVisibility();
  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    course: "",
    year: "",
    section: "",
    password: "",
    institutionId: institution?._id || ""
  })

  const [errors, setErrors] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    email: "",
    course: "",
    year: "",
    section: "",
  });

  // Fetch course fields for Program, Year, and Section
  useEffect(() => {
    const types = ["Program", "Year", "Section"];
    const fetchAllFields = async () => {
      for (const type of types) {
        try {
          await fetchCourseFieldsByType(type);
        } catch (error) {
          console.error(`Error fetching type ${type}:`, error);
        }
      }
    };
    fetchAllFields();
  }, [fetchCourseFieldsByType]);

  // Filter course fields by type and status
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

    // Name regex: Only letters, spaces, and hyphens are allowed
    const nameRegex = /^[a-zA-Z\s-]+$/;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      valid = false;
    } else if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "Invalid name format.";
      valid = false;
    } else {
      newErrors.firstName = "";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      valid = false;
    } else if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Invalid name format.";
      valid = false;
    } else {
      newErrors.lastName = "";
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required.";
      valid = false;
    } else {
      newErrors.studentId = "";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Course validation
    if (!formData.course.trim()) {
      newErrors.course = "Course is required.";
      valid = false;
    } else {
      newErrors.course = "";
    }

    // Year validation regex
    const yearRegex = /^[1-9][0-9]*$/;
    if (!formData.year.trim()) {
      newErrors.year = "Year is required.";
      valid = false;
    } else if (!yearRegex.test(formData.year)) {
      newErrors.year = "Invalid year format.";
      valid = false;
    } else {
      newErrors.year = "";
    }

    // Section validation
    if (!formData.section.trim()) {
      newErrors.section = "Section is required.";
      valid = false;
    } else {
      newErrors.section = "";
    }

    setErrors(newErrors);
    return valid;
};

  const isFormValid = () => {
    const requiredFields = [
      'studentId',
      'firstName',
      'lastName',
      'email',
      'course',
      'year',
      'section'
    ];
    
    const isComplete = requiredFields.every(field => formData[field].trim() !== '');
    
    // Check if there are no validation errors
    const hasNoErrors = Object.values(errors).every(error => error === '');
    
    return isComplete && hasNoErrors;
  };

  const handleCancel = () => {
    setFormData({
      studentId: "",
      firstName: "",
      lastName: "",
      email: "",
      course: "",
      year: "",
      section: "",
      password: "",
      institutionId: institution?._id || "",
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    
    // Validate the field that just changed
    validateField(name, value);
  }

  const handleSelectChange = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: !value
        ? `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`
        : "",
    }));
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[a-zA-Z\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const yearRegex = /^[1-9][0-9]*$/;

    switch (fieldName) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(value)) {
          newErrors.firstName = "Invalid name format.";
        } else {
          newErrors.firstName = "";
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(value)) {
          newErrors.lastName = "Invalid name format.";
        } else {
          newErrors.lastName = "";
        }
        break;

      case 'studentId':
        if (!value.trim()) {
          newErrors.studentId = "Student ID is required.";
        } else {
          newErrors.studentId = "";
        }
        break;

      case 'email':
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email format.";
        } else {
          newErrors.email = "";
        }
        break;

      case 'course':
        if (!value.trim()) {
          newErrors.course = "Course is required.";
        } else {
          newErrors.course = "";
        }
        break;

      case 'year':
        if (!value.trim()) {
          newErrors.year = "Year is required.";
        } else if (!yearRegex.test(value)) {
          newErrors.year = "Invalid year format.";
        } else {
          newErrors.year = "";
        }
        break;

      case 'section':
        if (!value.trim()) {
          newErrors.section = "Section is required.";
        } else {
          newErrors.section = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!validateForm()) return;
    if (!formData.institutionId) {
      toast.error("Institution ID is missing!")
      return;
    }
    
    try {
      await addStudent(formData)
      navigate("/admin/students")
      onClose()
    } catch (error) {
      console.error("Error saving student:", error)
    }
  }

  return (
    <DialogContent 
      onPointerDownOutside={(e) => {
        e.preventDefault();
      }}
      className="max-w-2xl "
    >
    <DialogHeader>
      <DialogTitle>Create New Student Account</DialogTitle>
      <DialogDescription>
        Add New student
      </DialogDescription>
    </DialogHeader>

          <form onSubmit={handleSubmit}>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  value={formData.studentId}
                  placeholder="2022-0001-N"
                  onChange={handleChange}
                  className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-xs ${errors.studentId ? "border-red-500" : ""}`}
              />
                  <div className="h-1">
                     {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId}</p>}
                  </div>
              </div>

              <div className="space-y-2 pt-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  placeholder="e.g. Juan"
                  onChange={handleChange}
                  className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-xs ${errors.firstName ? "border-red-500" : ""}`}
                  />
                 <div className="h-1">
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                  id="lastName"
                  name="lastName" 
                  type="text"
                  value={formData.lastName} 
                  placeholder="e.g. Dela Cruz"
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-xs ${errors.lastName ? "border-red-500" : ""}`}
              
              />
              <div className="h-1">
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
                </div>

                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    placeholder="...@gmail.com"
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-xs ${errors.email ? "border-red-500" : ""}`}
              />
                             <div className="h-1">
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
                </div>
              </div>

              

             {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Program</Label>
              <Select
                name="course"
                value={formData.course}
                onValueChange={handleSelectChange("course")}
                disabled={fieldsLoading || fieldsError}
              >
                <SelectTrigger
                  className={`bg-[#FDFDFD] ${
                    errors.course ? "border-red-500" : ""
                  }`}
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
             
              {errors.course && (
                <p className="text-red-500 text-sm">{errors.course}</p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">
                  Failed to load programs: {fieldsError}
                </p>
              )}
            </div>


                <div className="space-y-2 pt-5">
                  <Label htmlFor="year">Year</Label>
                  <Select
                name="year"
                value={formData.year}
                onValueChange={handleSelectChange("year")}
                disabled={fieldsLoading || fieldsError}
              >
                <SelectTrigger
                  className={`bg-[#FDFDFD] ${
                    errors.year ? "border-red-500" : ""
                  }`}
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

                <div className="h-1">
                {errors.year && (
                <p className="text-red-500 text-sm">{errors.year}</p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">
                  Failed to load years: {fieldsError}
                </p>
              )}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="section">Section</Label>
                  <Select
                name="section"
                value={formData.section}
                onValueChange={handleSelectChange("section")}
                disabled={fieldsLoading || fieldsError}
              >
                <SelectTrigger
                  className={`bg-[#FDFDFD] ${
                    errors.section ? "border-red-500" : ""
                  }`}
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

                 <div className="h-1">
              {errors.section && (
                <p className="text-red-500 text-sm">{errors.section}</p>
              )}
              {fieldsError && (
                <p className="text-red-500 text-sm">
                  Failed to load sections: {fieldsError}
                </p>
              )}
              </div>
                </div>



                  {/* Button Group */}
            <div className="flex justify-end space-x-4 pt-12">
              <Button type="button" variant="secondary" onClick={handleCancel} className="min-w-[100px] ">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || !isFormValid()}
                className={!isFormValid() ? "opacity-50 cursor-not-allowed bg-gray-400" : ""}
                >
                {isLoading ? "Adding..." : "Add Student"}
              </Button>
            </div>
              </div>
            </div>

          </form>
          <div className="h-1">
          </div>



        </DialogContent>
  )
}

export default AddStudent