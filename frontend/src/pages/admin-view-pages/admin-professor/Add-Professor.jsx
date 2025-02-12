import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

function AddProfessor({ onClose, fetchProfessors }) {
  const { institution } = useAuthStore();
  const { AddProfessor, isLoading, error } = useprofAuthStore();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institutionId: institution?._id || "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
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

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!formData.institutionId) {
      toast.error("Institution ID is missing!");
      return;
    }

    try {
      await AddProfessor(formData);

      // ✅ Refresh the professor list after adding
      if (fetchProfessors) {
        await fetchProfessors();
      }

      toast.success("Professor added successfully");

      // ✅ Close the modal
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error saving professor:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      institutionId: institution?._id || "",
    });
    onClose();
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full  mt-4 bg-white rounded-lg">
      <h1 className="text-xl font-semibold text-neutral-900">
        Create New Professor Account
      </h1>
      <h4 className="pt-1 text-sm font-normal text-gray-500">
        Manage and view the list of professors.
      </h4>
      <div className="flex-1 flex flex-col w-full h-full p-4 overflow-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              vvalue={formData.email}
              onChange={handleChange}
            />{" "}
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Professor</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProfessor;
