import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useprofAuthStore } from "@/store/profAuthStore";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function AddProfessor({ onClose }) {
  const { institution } = useAuthStore();
  const { AddProfessor, isLoading, error } = useprofAuthStore();
  const navigate = useNavigate();
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

  const isFormValid = () => {
    const requiredFields = ["firstName", "lastName", "email"];
    const isComplete = requiredFields.every((field) => formData[field].trim() !== "");
    const hasNoErrors = Object.values(errors).every((error) => error === "");
    return isComplete && hasNoErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };
    const nameRegex = /^[a-zA-Z\s-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    switch (fieldName) {
      case "firstName":
        if (!value.trim()) {
          newErrors.firstName = "First name is required.";
        } else if (!nameRegex.test(value)) {
          newErrors.firstName = "Invalid name format.";
        } else {
          newErrors.firstName = "";
        }
        break;

      case "lastName":
        if (!value.trim()) {
          newErrors.lastName = "Last name is required.";
        } else if (!nameRegex.test(value)) {
          newErrors.lastName = "Invalid name format.";
        } else {
          newErrors.lastName = "";
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Invalid email format.";
        } else {
          newErrors.email = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
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
      onClose();
      navigate("/admin/professors");
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
    <DialogContent
      onPointerDownOutside={(e) => {
        e.preventDefault();
      }}
      className="max-w-lg"
    >
      <DialogHeader>
        <DialogTitle>Create New Professor Account</DialogTitle>
        <DialogDescription>Manage and view the list of professors.</DialogDescription>
      </DialogHeader>
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
              value={formData.email} // Fixed typo: was "vvalue"
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className={!isFormValid() ? "opacity-50 cursor-not-allowed bg-gray-400" : ""}
            >
              {isLoading ? "Saving..." : "Save Professor"}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}

export default AddProfessor;