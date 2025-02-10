import { useState} from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useStudentStore } from "@/store/studentStore"
import { useAuthStore } from "@/store/authStore"
import toast from "react-hot-toast"
import useToggleVisibility from "@/hooks/use-toggle-visibility"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"


function AddStudent({ onClose }) {
  const { institution } = useAuthStore()
  const { addStudent, isLoading, error } = useStudentStore()
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                  id="lastName"
                  name="lastName" 
                  type="text"
                  value={formData.lastName} 
                  onChange={handleChange} />
                </div>

                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input id="year" name="year" type="text" required value={formData.year} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    name="section"
                    type="text"
                    value={formData.section}
                    onChange={handleChange}
                  />
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

