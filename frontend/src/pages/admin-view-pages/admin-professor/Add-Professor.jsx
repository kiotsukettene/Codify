import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToggleVisibility from "@/hooks/use-toggle-visibility";
import { Eye, EyeOff } from "lucide-react";
import { useprofAuthStore } from "@/store/profAuthStore";

import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

function AddProfessor() {
  const navigate = useNavigate();
  const { institution } = useAuthStore();
  const { AddProfessor, isLoading, error } = useprofAuthStore();
  const [isVisible, toggleVisibility] = useToggleVisibility();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    institutionId: institution?._id || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Professor Data:", formData); // ✅ Debugging log

    if (!formData.institutionId) {
      toast.error("Institution ID is missing!");
      return;
    }

    try {
      await AddProfessor(formData);
      navigate("/admin/professors");
    } catch (error) {
      console.error("Error saving professor:", error); // ✅ Debugging log
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      institutionId: institution?._id || "",
    });
  };

  return (
    <div className="flex flex-1 flex-col w-full h-full p-6 mt-4 bg-white rounded-lg">
      <h1 className="text-3xl font-semibold text-neutral-900">
        Create New Student Account
      </h1>
      <h4 className="pt-3 font-normal">
        Manage and view the list of students, their assigned courses, and
        details.
      </h4>

      <div className="flex-1 flex flex-col w-full h-full p-4 overflow-auto">
        <main className="flex-1 w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
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
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <Button type="submit">Save Professor</Button>
            </div>
          </form>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </main>
      </div>
    </div>
  );
}

export default AddProfessor;
