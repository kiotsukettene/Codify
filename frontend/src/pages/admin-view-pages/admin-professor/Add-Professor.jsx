import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useToggleVisibility from '@/hooks/use-toggle-visibility';
import { Eye, EyeOff } from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

function AddProfessor({ onClose}) {
  const [isVisible, toggleVisibility] = useToggleVisibility();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    onClose()

  };

  return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Professor Account</DialogTitle>
          <DialogDescription>
            Manage and view the list of professors, their assigned courses, and details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className='space-y-4'>
          <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
            <Button type="submit">Save Professor</Button>
          </div>
        </form>
      </DialogContent>
  );
}


export default AddProfessor;
