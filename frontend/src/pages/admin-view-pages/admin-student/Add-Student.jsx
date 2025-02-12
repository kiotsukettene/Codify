import { useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { useStudentStore } from "@/store/studentStore"
import { useAuthStore } from "@/store/authStore"
import toast from "react-hot-toast"
import useToggleVisibility from "@/hooks/use-toggle-visibility"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"


function AddStudent({ onClose }) {
  const { institution } = useAuthStore()
  const { addStudent, isLoading, error } = useStudentStore()
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
    });
    onClose()

  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    if (!validateForm()) return;
    if (!formData.institutionId) {
      toast.error("Institution ID is missing!")
    }
    await addStudent(formData)
    navigate("/admin/students")
    toast.success("Student added successfully")
  }

  return (
    <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Create New Student Account</DialogTitle>
      <DialogDescription>
        Add New student
      </DialogDescription>
    </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    type="text"
                    value={formData.studentId}
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.studentId ? "border-red-500" : ""}`}
                placeholder="2022-0001-N"
              />
                          {errors.studentId && <p className="text-red-500 text-sm">{errors.studentId}</p>}
            </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.firstName ? "border-red-500" : ""}`}
                placeholder="John"
              />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                  id="lastName"
                  name="lastName" 
                  type="text"
                  value={formData.lastName} 
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.lastName ? "border-red-500" : ""}`}
              
              />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>

                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course / Program</Label>
                  <Input
                    id="course"
                    name="course"
                    type="text"
                    value={formData.course}
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.course ? "border-red-500" : ""}`}
              />
              {errors.course && <p className="text-red-500 text-sm">{errors.course}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
              <Input id="year" name="year" type="text" value={formData.year} onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.year ? "border-red-500" : ""}`}
              />
              {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    name="section"
                    type="text"
                    value={formData.section}
                onChange={handleChange}
                className={`bg-[#FDFDFD] placeholder:text-gray-400 placeholder:text-sm ${errors.section ? "border-red-500" : ""}`}
              />
              {errors.section && <p className="text-red-500 text-sm">{errors.section}</p>}
                </div>
                  {/* Button Group */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="secondary" onClick={handleCancel} className="min-w-[100px] ">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading  ? "Adding..." :"Add Student"}
              </Button>
            </div>
              </div>
            </div>

          
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </DialogContent>
  )
}

export default AddStudent
